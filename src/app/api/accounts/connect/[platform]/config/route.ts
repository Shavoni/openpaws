import { NextResponse } from 'next/server'
import type { SocialPlatform } from '@/types'
import { isPlatformConfigured, getPlatformConfig } from '@/lib/social/oauth-config'

const VALID_PLATFORMS: SocialPlatform[] = ['instagram', 'facebook', 'twitter', 'linkedin', 'youtube', 'tiktok']

export async function GET(
  _request: Request,
  { params }: { params: { platform: string } }
) {
  const platform = params.platform as SocialPlatform

  if (!VALID_PLATFORMS.includes(platform)) {
    return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
  }

  const configured = isPlatformConfigured(platform)
  const config = getPlatformConfig(platform)

  return NextResponse.json({
    configured,
    platform: config.displayName,
    // Only expose setup info when not configured (no secrets)
    ...(!configured && {
      envVars: [config.clientIdEnv, config.clientSecretEnv],
      developerPortalUrl: config.developerPortalUrl,
      setupInstructions: config.setupInstructions,
    }),
  })
}
