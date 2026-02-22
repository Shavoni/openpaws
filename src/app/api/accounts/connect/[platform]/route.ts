import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import type { SocialPlatform } from '@/types'
import { getPlatformConfig, isPlatformConfigured } from '@/lib/social/oauth-config'

const VALID_PLATFORMS: SocialPlatform[] = ['instagram', 'facebook', 'twitter', 'linkedin', 'youtube', 'tiktok']

function generateState(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('')
}

function uint8ToBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function generateCodeVerifier(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return uint8ToBase64Url(array)
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return uint8ToBase64Url(new Uint8Array(digest))
}

export async function GET(
  _request: Request,
  { params }: { params: { platform: string } }
) {
  const platform = params.platform as SocialPlatform

  if (!VALID_PLATFORMS.includes(platform)) {
    return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
  }

  if (!isPlatformConfigured(platform)) {
    return NextResponse.json(
      { error: 'Platform not configured. Set OAuth credentials in .env' },
      { status: 400 }
    )
  }

  const config = getPlatformConfig(platform)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'
  const redirectUri = `${appUrl}/api/accounts/connect/${platform}/callback`
  const state = generateState()

  // Store CSRF state in cookie
  const cookieStore = cookies()
  cookieStore.set(`oauth_state_${platform}`, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
    path: '/',
  })

  // Build OAuth authorization URL
  const authParams = new URLSearchParams({
    response_type: 'code',
    [config.clientIdParam || 'client_id']: process.env[config.clientIdEnv]!,
    redirect_uri: redirectUri,
    scope: config.scopes.join(' '),
    state,
  })

  // Twitter requires PKCE
  if (config.requiresPkce) {
    const codeVerifier = generateCodeVerifier()
    const codeChallenge = await generateCodeChallenge(codeVerifier)

    cookieStore.set(`oauth_pkce_${platform}`, codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    })

    authParams.set('code_challenge', codeChallenge)
    authParams.set('code_challenge_method', 'S256')
  }

  // YouTube/Google needs access_type=offline for refresh tokens
  if (platform === 'youtube') {
    authParams.set('access_type', 'offline')
    authParams.set('prompt', 'consent')
  }

  const authorizationUrl = `${config.authUrl}?${authParams.toString()}`
  return NextResponse.redirect(authorizationUrl)
}
