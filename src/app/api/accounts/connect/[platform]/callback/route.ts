import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import type { SocialPlatform } from '@/types'
import { getPlatformConfig, isPlatformConfigured } from '@/lib/social/oauth-config'

const VALID_PLATFORMS: SocialPlatform[] = ['instagram', 'facebook', 'twitter', 'linkedin', 'youtube', 'tiktok']

interface TokenResponse {
  access_token: string
  refresh_token?: string
  expires_in?: number
  token_type?: string
}

interface PlatformProfile {
  id: string
  name: string
  username: string
  avatar_url: string
}

async function exchangeCodeForTokens(
  platform: SocialPlatform,
  code: string,
  redirectUri: string,
  codeVerifier?: string
): Promise<TokenResponse> {
  const config = getPlatformConfig(platform)
  const clientId = process.env[config.clientIdEnv]!
  const clientSecret = process.env[config.clientSecretEnv]!

  const body: Record<string, string> = {
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
  }

  // Platform-specific token exchange variations
  if (platform === 'tiktok') {
    body.client_key = clientId
    body.client_secret = clientSecret
  } else {
    body.client_id = clientId
    body.client_secret = clientSecret
  }

  if (codeVerifier) {
    body.code_verifier = codeVerifier
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }

  // Twitter uses Basic auth for token exchange
  if (platform === 'twitter') {
    headers['Authorization'] = `Basic ${btoa(`${clientId}:${clientSecret}`)}`
    delete body.client_id
    delete body.client_secret
  }

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers,
    body: new URLSearchParams(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Token exchange failed: ${response.status} ${errorText}`)
  }

  const data = await response.json()

  // TikTok nests tokens differently
  if (platform === 'tiktok') {
    return {
      access_token: data.access_token || data.data?.access_token,
      refresh_token: data.refresh_token || data.data?.refresh_token,
      expires_in: data.expires_in || data.data?.expires_in,
    }
  }

  return data
}

async function fetchProfile(platform: SocialPlatform, accessToken: string): Promise<PlatformProfile> {
  switch (platform) {
    case 'instagram': {
      const res = await fetch(
        `https://graph.instagram.com/me?fields=id,username,name,profile_picture_url&access_token=${accessToken}`
      )
      const data = await res.json()
      return {
        id: data.id,
        name: data.name || data.username,
        username: data.username,
        avatar_url: data.profile_picture_url || '',
      }
    }

    case 'facebook': {
      const res = await fetch(
        `https://graph.facebook.com/me?fields=id,name,picture.type(large)&access_token=${accessToken}`
      )
      const data = await res.json()
      return {
        id: data.id,
        name: data.name,
        username: data.name,
        avatar_url: data.picture?.data?.url || '',
      }
    }

    case 'twitter': {
      const res = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url,name,username', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data = await res.json()
      return {
        id: data.data.id,
        name: data.data.name,
        username: data.data.username,
        avatar_url: data.data.profile_image_url || '',
      }
    }

    case 'linkedin': {
      const res = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data = await res.json()
      return {
        id: data.sub,
        name: data.name,
        username: data.name,
        avatar_url: data.picture || '',
      }
    }

    case 'youtube': {
      const res = await fetch(
        'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      const data = await res.json()
      const channel = data.items?.[0]
      return {
        id: channel?.id || '',
        name: channel?.snippet?.title || '',
        username: channel?.snippet?.customUrl || channel?.snippet?.title || '',
        avatar_url: channel?.snippet?.thumbnails?.default?.url || '',
      }
    }

    case 'tiktok': {
      const res = await fetch(
        'https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url,username',
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      const data = await res.json()
      const user = data.data?.user
      return {
        id: user?.open_id || '',
        name: user?.display_name || '',
        username: user?.username || user?.display_name || '',
        avatar_url: user?.avatar_url || '',
      }
    }
  }
}

export async function GET(
  request: Request,
  { params }: { params: { platform: string } }
) {
  const platform = params.platform as SocialPlatform

  if (!VALID_PLATFORMS.includes(platform) || !isPlatformConfigured(platform)) {
    return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
  }

  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const error = url.searchParams.get('error')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'

  // User denied access
  if (error) {
    return createCallbackResponse(appUrl, platform, null, `Authorization denied: ${error}`)
  }

  if (!code || !state) {
    return createCallbackResponse(appUrl, platform, null, 'Missing authorization code or state')
  }

  // Verify CSRF state
  const cookieStore = cookies()
  const storedState = cookieStore.get(`oauth_state_${platform}`)?.value
  if (!storedState || storedState !== state) {
    return createCallbackResponse(appUrl, platform, null, 'Invalid state parameter (CSRF check failed)')
  }

  // Clear state cookie
  cookieStore.delete(`oauth_state_${platform}`)

  try {
    const redirectUri = `${appUrl}/api/accounts/connect/${platform}/callback`

    // Get PKCE verifier if applicable
    let codeVerifier: string | undefined
    const config = getPlatformConfig(platform)
    if (config.requiresPkce) {
      codeVerifier = cookieStore.get(`oauth_pkce_${platform}`)?.value
      cookieStore.delete(`oauth_pkce_${platform}`)
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(platform, code, redirectUri, codeVerifier)

    // Fetch user profile
    const profile = await fetchProfile(platform, tokens.access_token)

    // Build account data to pass to the client
    const accountData = {
      id: `${platform}_${profile.id}`,
      platform,
      platform_account_id: profile.id,
      account_name: profile.name,
      account_username: profile.username,
      avatar_url: profile.avatar_url,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expires_at: tokens.expires_in
        ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
        : undefined,
      is_active: true,
    }

    // Store account data in a short-lived cookie for the client to pick up
    cookieStore.set(`oauth_account_${platform}`, JSON.stringify(accountData), {
      httpOnly: false, // Client-side JS needs to read this
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60, // 1 minute — just enough for the popup to read it
      path: '/',
    })

    return createCallbackResponse(appUrl, platform, accountData, null)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error during OAuth callback'
    console.error(`OAuth callback error for ${platform}:`, message)
    return createCallbackResponse(appUrl, platform, null, message)
  }
}

function createCallbackResponse(
  appUrl: string,
  platform: string,
  accountData: Record<string, unknown> | null,
  error: string | null
) {
  // Return an HTML page that sends a postMessage to the opener and closes itself
  const html = `<!DOCTYPE html>
<html>
<head><title>Connecting ${platform}...</title></head>
<body>
<script>
  (function() {
    var data = ${JSON.stringify({ platform, account: accountData, error })};
    if (window.opener) {
      window.opener.postMessage({ type: 'oauth_callback', ...data }, '${appUrl}');
      window.close();
    } else {
      // Fallback: redirect to accounts page
      window.location.href = '${appUrl}/accounts?connected=${platform}' + (data.error ? '&error=' + encodeURIComponent(data.error) : '');
    }
  })();
</script>
<p>Connecting your ${platform} account... This window should close automatically.</p>
</body>
</html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}
