// Organization (Agency/Business)
export interface Organization {
  id: string
  name: string
  slug: string
  custom_domain?: string
  logo_url?: string
  branding?: {
    logo?: string
    colors?: {
      primary?: string
      secondary?: string
    }
  }
  plan: 'starter' | 'pro' | 'agency' | 'enterprise'
  plan_limits?: {
    max_workspaces: number
    max_social_accounts: number
    max_posts_per_month: number
    ai_generations_per_month: number
  }
  stripe_customer_id?: string
  created_at: string
  updated_at: string
}

// Profile (User Account — linked to Supabase Auth)
export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  organization_id?: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

// Workspace (Client Account)
export interface Workspace {
  id: string
  organization_id: string
  name: string
  description?: string
  settings: Record<string, unknown>
  is_active: boolean
  created_at: string
  updated_at: string
}

// Social Account (Connected Platform)
export type SocialPlatform = 'instagram' | 'linkedin' | 'twitter' | 'tiktok' | 'youtube' | 'facebook'

export interface SocialAccount {
  id: string
  workspace_id: string
  platform: SocialPlatform
  platform_account_id: string
  account_name: string
  account_username?: string
  avatar_url?: string
  access_token?: string
  refresh_token?: string
  token_expires_at?: string
  scopes?: string[]
  platform_metadata?: Record<string, unknown>
  is_active: boolean
  created_at: string
  updated_at: string
}

// Post
export type PostStatus = 'draft' | 'pending_approval' | 'approved' | 'scheduled' | 'publishing' | 'published' | 'failed'
export type PostSourceType = 'ai_generated' | 'ai_repurposed' | 'manual' | 'template'
export type MediaType = 'image' | 'video' | 'carousel' | 'text_only'

export interface Post {
  id: string
  workspace_id: string
  social_account_id?: string
  content: string
  media_urls?: string[]
  media_type?: MediaType
  platform?: string
  platform_specific?: Record<string, unknown>
  status: PostStatus
  scheduled_at?: string
  published_at?: string
  platform_post_id?: string
  platform_post_url?: string
  failure_reason?: string
  source_type: PostSourceType
  ai_model_used?: string
  ai_prompt_used?: string
  ai_generation_cost?: number
  source_post_id?: string
  metrics?: {
    likes?: number
    comments?: number
    shares?: number
    views?: number
    saves?: number
    clicks?: number
  }
  viral_score?: number
  engagement_rate?: number
  created_by?: string
  approved_by?: string
  created_at: string
  updated_at: string
}

// Template
export interface Template {
  id: string
  organization_id?: string
  workspace_id?: string
  name: string
  description?: string
  platform?: string
  content: string
  variables?: Record<string, string>
  category?: 'carousel' | 'video' | 'single' | 'story' | 'reel' | 'thread'
  tags?: string[]
  is_global: boolean
  usage_count: number
  created_by?: string
  created_at: string
  updated_at: string
}

// Brand Settings
export interface BrandSettings {
  id: string
  workspace_id: string
  brand_name?: string
  brand_voice?: string
  brand_tone?: string
  brand_guidelines?: string
  target_audience?: string
  topics_include?: string[]
  topics_exclude?: string[]
  hashtag_sets?: Record<string, string[]>
  example_posts?: Array<{ content: string; platform: string; engagement?: number }>
  competitor_accounts?: string[]
  website_url?: string
  crawled_knowledge?: Record<string, unknown>
  created_at: string
  updated_at: string
}

// Content Calendar
export interface ContentCalendar {
  id: string
  workspace_id: string
  post_id?: string
  scheduled_date: string
  scheduled_time: string
  timezone: string
  recurrence?: string
  is_auto_scheduled: boolean
  created_at: string
}

// AI Generation Log
export interface AIGenerationLog {
  id: string
  workspace_id: string
  post_id?: string
  model: string
  provider: string
  prompt_tokens?: number
  completion_tokens?: number
  total_tokens?: number
  cost_usd?: number
  task_type: 'content_generation' | 'repurpose' | 'analysis' | 'brand_extraction'
  input_summary?: string
  duration_ms?: number
  created_at: string
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
