// Organization (Agency/Business)
export interface Organization {
  id: string
  name: string
  slug: string
  custom_domain?: string
  branding?: {
    logo?: string
    colors?: {
      primary?: string
      secondary?: string
    }
  }
  plan: 'starter' | 'pro' | 'agency' | 'enterprise'
  created_at: string
}

// Workspace (Client Account)
export interface Workspace {
  id: string
  organization_id: string
  name: string
  settings: Record<string, unknown>
  created_at: string
}

// Social Account (Connected Platform)
export interface SocialAccount {
  id: string
  workspace_id: string
  platform: 'instagram' | 'linkedin' | 'twitter' | 'tiktok' | 'youtube'
  account_id: string
  account_name: string
  access_token?: string
  refresh_token?: string
  token_expires_at?: string
  settings: Record<string, unknown>
  created_at: string
}

// Post
export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed'
export type PostSourceType = 'ai_generated' | 'repurposed' | 'manual'

export interface Post {
  id: string
  workspace_id: string
  social_account_id: string
  content: string
  media_urls?: string[]
  status: PostStatus
  scheduled_at?: string
  published_at?: string
  platform_post_id?: string
  metrics?: {
    likes?: number
    comments?: number
    shares?: number
    views?: number
  }
  viral_score?: number
  source_type: PostSourceType
  source_post_id?: string
  created_at: string
  created_by: string
}

// Template
export interface Template {
  id: string
  organization_id?: string // null = global
  name: string
  platform: string
  content: string
  variables?: Record<string, string>
  category?: 'carousel' | 'video' | 'single'
  usage_count: number
  created_at: string
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
}

export interface Paginated  data: TResponse<T> {
[]
  total: number
  page: number
  pageSize: number
}
