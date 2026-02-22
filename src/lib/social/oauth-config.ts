import type { SocialPlatform } from '@/types'

export interface OAuthPlatformConfig {
  platform: SocialPlatform
  displayName: string
  authUrl: string
  tokenUrl: string
  scopes: string[]
  clientIdEnv: string
  clientSecretEnv: string
  developerPortalUrl: string
  setupInstructions: string[]
  /** Twitter/X requires PKCE (Proof Key for Code Exchange) */
  requiresPkce?: boolean
  /** Some platforms use 'client_key' instead of 'client_id' */
  clientIdParam?: string
}

const configs: Record<SocialPlatform, OAuthPlatformConfig> = {
  instagram: {
    platform: 'instagram',
    displayName: 'Instagram',
    authUrl: 'https://api.instagram.com/oauth/authorize',
    tokenUrl: 'https://api.instagram.com/oauth/access_token',
    scopes: ['instagram_basic', 'instagram_content_publish', 'instagram_manage_insights', 'pages_show_list'],
    clientIdEnv: 'INSTAGRAM_CLIENT_ID',
    clientSecretEnv: 'INSTAGRAM_CLIENT_SECRET',
    developerPortalUrl: 'https://developers.facebook.com/apps',
    setupInstructions: [
      'Go to Meta for Developers and create a new app (type: Business)',
      'Add the "Instagram Graph API" product',
      'Under Instagram > Basic Display, add your OAuth redirect URI',
      'Copy the Instagram App ID and App Secret into your .env',
    ],
  },
  facebook: {
    platform: 'facebook',
    displayName: 'Facebook',
    authUrl: 'https://www.facebook.com/v19.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v19.0/oauth/access_token',
    scopes: ['pages_manage_posts', 'pages_read_engagement', 'pages_show_list', 'publish_video'],
    clientIdEnv: 'FACEBOOK_CLIENT_ID',
    clientSecretEnv: 'FACEBOOK_CLIENT_SECRET',
    developerPortalUrl: 'https://developers.facebook.com/apps',
    setupInstructions: [
      'Go to Meta for Developers and create a new app (type: Business)',
      'Add the "Facebook Login" product',
      'Under Facebook Login > Settings, add your OAuth redirect URI',
      'Copy the App ID and App Secret from Settings > Basic into your .env',
    ],
  },
  twitter: {
    platform: 'twitter',
    displayName: 'Twitter / X',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
    clientIdEnv: 'TWITTER_CLIENT_ID',
    clientSecretEnv: 'TWITTER_CLIENT_SECRET',
    developerPortalUrl: 'https://developer.twitter.com/en/portal/dashboard',
    requiresPkce: true,
    setupInstructions: [
      'Go to the Twitter Developer Portal and create a new project/app',
      'Under "User authentication settings", enable OAuth 2.0',
      'Set the type to "Web App" and add your OAuth redirect URI',
      'Copy the Client ID and Client Secret into your .env',
    ],
  },
  linkedin: {
    platform: 'linkedin',
    displayName: 'LinkedIn',
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    scopes: ['openid', 'profile', 'w_member_social'],
    clientIdEnv: 'LINKEDIN_CLIENT_ID',
    clientSecretEnv: 'LINKEDIN_CLIENT_SECRET',
    developerPortalUrl: 'https://www.linkedin.com/developers/apps',
    setupInstructions: [
      'Go to LinkedIn Developers and create a new app',
      'Under Auth tab, add your OAuth redirect URI to "Authorized redirect URLs"',
      'Request access to "Share on LinkedIn" and "Sign In with LinkedIn using OpenID Connect"',
      'Copy the Client ID and Client Secret into your .env',
    ],
  },
  youtube: {
    platform: 'youtube',
    displayName: 'YouTube',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube.readonly', 'https://www.googleapis.com/auth/userinfo.profile'],
    clientIdEnv: 'YOUTUBE_CLIENT_ID',
    clientSecretEnv: 'YOUTUBE_CLIENT_SECRET',
    developerPortalUrl: 'https://console.cloud.google.com/apis/credentials',
    setupInstructions: [
      'Go to Google Cloud Console and create/select a project',
      'Enable the "YouTube Data API v3" under APIs & Services > Library',
      'Create OAuth 2.0 credentials under APIs & Services > Credentials',
      'Add your OAuth redirect URI to "Authorized redirect URIs"',
      'Copy the Client ID and Client Secret into your .env',
    ],
  },
  tiktok: {
    platform: 'tiktok',
    displayName: 'TikTok',
    authUrl: 'https://www.tiktok.com/v2/auth/authorize/',
    tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
    scopes: ['user.info.basic', 'video.publish', 'video.list'],
    clientIdEnv: 'TIKTOK_CLIENT_KEY',
    clientSecretEnv: 'TIKTOK_CLIENT_SECRET',
    clientIdParam: 'client_key',
    developerPortalUrl: 'https://developers.tiktok.com/apps',
    setupInstructions: [
      'Go to TikTok for Developers and create a new app',
      'Under "Login Kit", add your OAuth redirect URI',
      'Request the scopes: user.info.basic, video.publish, video.list',
      'Copy the Client Key and Client Secret into your .env',
    ],
  },
}

export function getPlatformConfig(platform: SocialPlatform): OAuthPlatformConfig {
  return configs[platform]
}

export function isPlatformConfigured(platform: SocialPlatform): boolean {
  const config = configs[platform]
  const clientId = process.env[config.clientIdEnv]
  const clientSecret = process.env[config.clientSecretEnv]
  return !!(clientId && clientSecret)
}

export function getAllPlatforms(): SocialPlatform[] {
  return Object.keys(configs) as SocialPlatform[]
}
