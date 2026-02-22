export const APP_NAME = 'OpenPaws'

export const PLATFORM_CHAR_LIMITS: Record<string, number> = {
  twitter: 280,
  linkedin: 3000,
  instagram: 2200,
  tiktok: 2200,
  youtube: 5000,
  facebook: 63206,
}

export const PLATFORM_COLORS: Record<string, string> = {
  instagram: '#E4405F',
  linkedin: '#0A66C2',
  twitter: '#000000',
  tiktok: '#000000',
  youtube: '#FF0000',
  facebook: '#1877F2',
}

export const POST_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  pending_approval: 'Pending Approval',
  approved: 'Approved',
  scheduled: 'Scheduled',
  publishing: 'Publishing',
  published: 'Published',
  failed: 'Failed',
}
