-- OpenPaws Initial Schema
-- Run this in Supabase SQL Editor or via Supabase CLI migrations

-- Enable UUID generation (gen_random_uuid from pgcrypto)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ORGANIZATIONS (top-level tenant — agency or business)
-- ============================================================
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  custom_domain TEXT,
  logo_url TEXT,
  branding JSONB DEFAULT '{}',
  plan TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'agency', 'enterprise')),
  plan_limits JSONB DEFAULT '{
    "max_workspaces": 1,
    "max_social_accounts": 1,
    "max_posts_per_month": 50,
    "ai_generations_per_month": 100
  }',
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROFILES (user accounts — linked to Supabase Auth)
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- WORKSPACES (client accounts within an org)
-- ============================================================
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SOCIAL ACCOUNTS (connected platforms per workspace)
-- ============================================================
CREATE TABLE social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'linkedin', 'twitter', 'tiktok', 'youtube', 'facebook')),
  platform_account_id TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_username TEXT,
  avatar_url TEXT,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  scopes TEXT[],
  platform_metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, platform, platform_account_id)
);

-- ============================================================
-- BRAND SETTINGS (brand voice, guidelines per workspace)
-- ============================================================
CREATE TABLE brand_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID UNIQUE NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  brand_name TEXT,
  brand_voice TEXT,
  brand_tone TEXT,
  brand_guidelines TEXT,
  target_audience TEXT,
  topics_include TEXT[],
  topics_exclude TEXT[],
  hashtag_sets JSONB DEFAULT '{}',
  example_posts JSONB DEFAULT '[]',
  competitor_accounts TEXT[],
  website_url TEXT,
  crawled_knowledge JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- POSTS (content items — drafts, scheduled, published)
-- ============================================================
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  social_account_id UUID REFERENCES social_accounts(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  media_urls TEXT[] DEFAULT '{}',
  media_type TEXT CHECK (media_type IN ('image', 'video', 'carousel', 'text_only')),
  platform TEXT,
  platform_specific JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'scheduled', 'publishing', 'published', 'failed')),
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  platform_post_id TEXT,
  platform_post_url TEXT,
  failure_reason TEXT,
  source_type TEXT NOT NULL DEFAULT 'manual' CHECK (source_type IN ('ai_generated', 'ai_repurposed', 'manual', 'template')),
  ai_model_used TEXT,
  ai_prompt_used TEXT,
  ai_generation_cost DECIMAL(10,6),
  source_post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  metrics JSONB DEFAULT '{}',
  viral_score DECIMAL(5,2),
  engagement_rate DECIMAL(5,4),
  created_by UUID REFERENCES profiles(id),
  approved_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TEMPLATES (reusable content templates)
-- ============================================================
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  platform TEXT,
  content TEXT NOT NULL,
  variables JSONB DEFAULT '{}',
  category TEXT CHECK (category IN ('carousel', 'video', 'single', 'story', 'reel', 'thread')),
  tags TEXT[],
  is_global BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CONTENT CALENDAR (scheduling metadata)
-- ============================================================
CREATE TABLE content_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'America/Los_Angeles',
  recurrence TEXT,
  is_auto_scheduled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AI GENERATION LOG (track all AI usage for cost/audit)
-- ============================================================
CREATE TABLE ai_generation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  model TEXT NOT NULL,
  provider TEXT NOT NULL,
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  total_tokens INTEGER,
  cost_usd DECIMAL(10,6),
  task_type TEXT NOT NULL,
  input_summary TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_profiles_org ON profiles(organization_id);
CREATE INDEX idx_workspaces_org ON workspaces(organization_id);
CREATE INDEX idx_social_accounts_workspace ON social_accounts(workspace_id);
CREATE INDEX idx_posts_workspace ON posts(workspace_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_scheduled ON posts(scheduled_at) WHERE status = 'scheduled';
CREATE INDEX idx_posts_social_account ON posts(social_account_id);
CREATE INDEX idx_templates_org ON templates(organization_id);
CREATE INDEX idx_content_calendar_workspace_date ON content_calendar(workspace_id, scheduled_date);
CREATE INDEX idx_ai_log_workspace ON ai_generation_log(workspace_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generation_log ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Organizations: members can read their org
CREATE POLICY "Org members can view org" ON organizations
  FOR SELECT USING (
    id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- Workspaces: org members can read workspaces
CREATE POLICY "Org members can view workspaces" ON workspaces
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "Org admins can manage workspaces" ON workspaces
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM profiles
      WHERE id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Posts: workspace members can manage posts
CREATE POLICY "Workspace members can view posts" ON posts
  FOR SELECT USING (
    workspace_id IN (
      SELECT w.id FROM workspaces w
      JOIN profiles p ON p.organization_id = w.organization_id
      WHERE p.id = auth.uid()
    )
  );
CREATE POLICY "Workspace members can create posts" ON posts
  FOR INSERT WITH CHECK (
    workspace_id IN (
      SELECT w.id FROM workspaces w
      JOIN profiles p ON p.organization_id = w.organization_id
      WHERE p.id = auth.uid() AND p.role IN ('owner', 'admin', 'member')
    )
  );
CREATE POLICY "Workspace members can update posts" ON posts
  FOR UPDATE USING (
    workspace_id IN (
      SELECT w.id FROM workspaces w
      JOIN profiles p ON p.organization_id = w.organization_id
      WHERE p.id = auth.uid() AND p.role IN ('owner', 'admin', 'member')
    )
  );

-- Social accounts: workspace scoped
CREATE POLICY "Workspace members can view accounts" ON social_accounts
  FOR SELECT USING (
    workspace_id IN (
      SELECT w.id FROM workspaces w
      JOIN profiles p ON p.organization_id = w.organization_id
      WHERE p.id = auth.uid()
    )
  );

-- Brand settings: workspace scoped
CREATE POLICY "Workspace members can view brand" ON brand_settings
  FOR SELECT USING (
    workspace_id IN (
      SELECT w.id FROM workspaces w
      JOIN profiles p ON p.organization_id = w.organization_id
      WHERE p.id = auth.uid()
    )
  );
CREATE POLICY "Admins can manage brand" ON brand_settings
  FOR ALL USING (
    workspace_id IN (
      SELECT w.id FROM workspaces w
      JOIN profiles p ON p.organization_id = w.organization_id
      WHERE p.id = auth.uid() AND p.role IN ('owner', 'admin')
    )
  );

-- Templates: org scoped
CREATE POLICY "Org members can view templates" ON templates
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    OR is_global = TRUE
  );

-- Content calendar: workspace scoped
CREATE POLICY "Workspace members can view calendar" ON content_calendar
  FOR SELECT USING (
    workspace_id IN (
      SELECT w.id FROM workspaces w
      JOIN profiles p ON p.organization_id = w.organization_id
      WHERE p.id = auth.uid()
    )
  );

-- AI generation log: workspace scoped
CREATE POLICY "Workspace members can view ai log" ON ai_generation_log
  FOR SELECT USING (
    workspace_id IN (
      SELECT w.id FROM workspaces w
      JOIN profiles p ON p.organization_id = w.organization_id
      WHERE p.id = auth.uid()
    )
  );

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_social_accounts_updated_at BEFORE UPDATE ON social_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_brand_settings_updated_at BEFORE UPDATE ON brand_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_org_id UUID;
BEGIN
  -- Create default organization for new user
  INSERT INTO organizations (name, slug)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)) || '''s Workspace',
    LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)), ' ', '-')) || '-' || SUBSTRING(NEW.id::TEXT, 1, 8)
  )
  RETURNING id INTO new_org_id;

  -- Create profile linked to org
  INSERT INTO profiles (id, email, full_name, organization_id, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    new_org_id,
    'owner'
  );

  -- Create default workspace
  INSERT INTO workspaces (organization_id, name)
  VALUES (new_org_id, 'My Brand');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
