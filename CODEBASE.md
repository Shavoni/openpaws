# OpenPaws — Complete Codebase Reference

> AI-powered social media management platform with autonomous agents.

**Tech Stack:** Next.js 14 · React 18 · TypeScript · Tailwind CSS · Zustand · Supabase · OpenAI · Anthropic · OpenClaw

---

## Directory Structure

```
openpaws/
├── public/
│   └── logo.png                          # Brand mascot (orange cat with paws)
├── src/
│   ├── app/
│   │   ├── (auth)/                       # Auth route group
│   │   │   ├── layout.tsx                # Auth layout (centered card, mascot backdrops)
│   │   │   ├── login/page.tsx            # Login (email/password + Google OAuth)
│   │   │   ├── signup/page.tsx           # Registration
│   │   │   └── auth/callback/route.ts    # Supabase auth callback
│   │   ├── (dashboard)/                  # Protected dashboard route group
│   │   │   ├── layout.tsx                # Dashboard shell (sidebar + header + paw trail)
│   │   │   ├── content/
│   │   │   │   ├── page.tsx              # Content library
│   │   │   │   └── create/page.tsx       # Post creation editor
│   │   │   ├── schedule/page.tsx         # Calendar scheduling view
│   │   │   ├── analytics/page.tsx        # Analytics dashboard
│   │   │   ├── accounts/page.tsx         # Connected social accounts
│   │   │   ├── brand/page.tsx            # Brand voice settings
│   │   │   └── settings/page.tsx         # Account settings
│   │   ├── api/
│   │   │   ├── auth/callback/route.ts    # Auth callback handler
│   │   │   ├── content/
│   │   │   │   ├── route.ts              # GET/POST — list/create posts
│   │   │   │   ├── generate/route.ts     # POST — AI content generation
│   │   │   │   └── [id]/route.ts         # GET/PUT/DELETE — single post
│   │   │   ├── brand/route.ts            # GET/PUT/POST — brand analysis & settings
│   │   │   ├── accounts/
│   │   │   │   ├── route.ts              # GET/POST — social accounts
│   │   │   │   └── connect/[platform]/
│   │   │   │       ├── route.ts          # GET/POST — initiate OAuth flow
│   │   │   │       ├── config/route.ts   # GET — check if platform is configured
│   │   │   │       └── callback/route.ts # GET — OAuth callback handler
│   │   │   ├── analytics/route.ts        # GET/POST — analytics data
│   │   │   ├── schedule/
│   │   │   │   ├── route.ts              # GET/POST — schedule posts
│   │   │   │   └── [id]/route.ts         # GET/PUT/DELETE — single scheduled post
│   │   │   └── webhooks/[platform]/route.ts # POST — incoming platform webhooks
│   │   ├── layout.tsx                    # Root layout (fonts, metadata)
│   │   ├── page.tsx                      # Landing page (hero, features, pricing, CTA)
│   │   └── globals.css                   # Global styles & Tailwind directives
│   ├── components/
│   │   ├── accounts/
│   │   │   ├── account-card.tsx          # Connected account display card
│   │   │   ├── connect-button.tsx        # OAuth connect button (paw spinner)
│   │   │   └── platform-setup-dialog.tsx # Dev setup instructions modal
│   │   ├── analytics/
│   │   │   ├── stats-card.tsx            # Metric display card
│   │   │   ├── engagement-chart.tsx      # Recharts visualization
│   │   │   └── top-posts.tsx             # Top performing posts list
│   │   ├── content/
│   │   │   ├── content-card.tsx          # Post preview card
│   │   │   ├── content-editor.tsx        # Post editor interface
│   │   │   ├── ai-generate-panel.tsx     # AI generation panel
│   │   │   └── platform-preview.tsx      # Platform-specific preview
│   │   ├── layout/
│   │   │   ├── sidebar.tsx               # Navigation sidebar (logo → landing, workspace switcher, nav)
│   │   │   ├── header.tsx                # Top header (search, create, notifications, user menu)
│   │   │   └── workspace-switcher.tsx    # Workspace selector
│   │   ├── schedule/
│   │   │   ├── calendar-view.tsx         # Calendar visualization
│   │   │   └── schedule-modal.tsx        # Schedule date/time/platform picker
│   │   ├── ui/
│   │   │   ├── avatar.tsx                # Radix avatar
│   │   │   ├── badge.tsx                 # Badge/tag component
│   │   │   ├── button.tsx                # Button with variants
│   │   │   ├── calendar.tsx              # Date picker calendar
│   │   │   ├── card.tsx                  # Card container
│   │   │   ├── dialog.tsx                # Radix dialog/modal
│   │   │   ├── dropdown-menu.tsx         # Radix dropdown menu
│   │   │   ├── input.tsx                 # Form input
│   │   │   ├── paw-icon.tsx              # Brand paw icons (PawIcon, PawIconFilled, PawSpinner, PawCheck)
│   │   │   ├── paw-trail.tsx             # Decorative paw prints (scattered, diagonal, trail, corner)
│   │   │   ├── select.tsx                # Radix select
│   │   │   ├── skeleton.tsx              # Loading skeleton
│   │   │   ├── tabs.tsx                  # Radix tabs
│   │   │   ├── textarea.tsx              # Form textarea
│   │   │   └── toast.tsx                 # Toast notifications
│   │   └── auth-provider.tsx             # Auth context (loads user/org/workspace on mount)
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── router.ts                # AI provider abstraction (OpenClaw → OpenAI → Anthropic fallback)
│   │   │   ├── brand-analyzer.ts         # Brand voice extraction from URL
│   │   │   ├── content-generator.ts      # Content generation, variations, repurposing, scoring
│   │   │   └── prompts/
│   │   │       ├── content.ts            # System prompts for content generation
│   │   │       ├── analysis.ts           # Analytics prompt generation
│   │   │       └── repurpose.ts          # Repurposing prompts (single & batch)
│   │   ├── db/
│   │   │   ├── organizations.ts          # getOrganization(), updateOrganization()
│   │   │   ├── workspaces.ts             # getWorkspaces(), getWorkspace(), createWorkspace()
│   │   │   ├── social-accounts.ts        # Stub (Phase 4)
│   │   │   ├── posts.ts                  # Stub (Phase 3)
│   │   │   ├── brand-settings.ts         # Stub (Phase 6)
│   │   │   └── templates.ts              # Stub
│   │   ├── social/
│   │   │   ├── oauth-config.ts           # OAuth URLs, scopes, config for all 6 platforms
│   │   │   ├── types.ts                  # Social client interface
│   │   │   ├── instagram.ts              # Instagram client (stub)
│   │   │   ├── linkedin.ts               # LinkedIn client (stub)
│   │   │   └── twitter.ts                # Twitter client (stub)
│   │   ├── supabase.ts                   # Browser Supabase client
│   │   ├── supabase-server.ts            # Server-side Supabase client
│   │   ├── supabase-middleware.ts         # Middleware helpers
│   │   ├── constants.ts                  # Platform limits, colors, status labels
│   │   └── utils.ts                      # cn() utility (clsx + tailwind-merge)
│   ├── stores/
│   │   ├── app-store.ts                  # User, org, workspace state (persisted)
│   │   ├── content-store.ts              # Posts, filters, loading state
│   │   ├── schedule-store.ts             # Scheduled posts CRUD (persisted)
│   │   ├── social-accounts-store.ts      # Connected accounts (persisted)
│   │   └── ui-store.ts                   # Sidebar collapse, active modal
│   ├── types/
│   │   └── index.ts                      # All TypeScript interfaces
│   └── middleware.ts                     # Next.js auth guard middleware
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql        # Database schema (9 tables with RLS)
├── .env.example                          # Environment variables template
├── next.config.js                        # Next.js config (image domains)
├── tailwind.config.ts                    # Custom theme, animations, colors
├── tsconfig.json                         # TypeScript config (strict, path aliases)
├── postcss.config.js                     # PostCSS config
├── package.json                          # Dependencies and scripts
├── PLATFORM_SETUP_GUIDE.docx             # OAuth setup guide for all 6 platforms
└── CODEBASE.md                           # This file
```

---

## TypeScript Types

**File:** `src/types/index.ts`

| Type | Description |
|------|-------------|
| `Organization` | Top-level tenant (agency/business) |
| `Profile` | User account linked to Supabase Auth |
| `Workspace` | Client account within an organization |
| `SocialAccount` | Connected social platform account |
| `SocialPlatform` | `'instagram' \| 'facebook' \| 'twitter' \| 'linkedin' \| 'youtube' \| 'tiktok'` |
| `Post` | Content item (draft → published lifecycle) |
| `PostStatus` | `'draft' \| 'pending_approval' \| 'approved' \| 'scheduled' \| 'publishing' \| 'published' \| 'failed'` |
| `PostSourceType` | `'ai_generated' \| 'ai_repurposed' \| 'manual' \| 'template'` |
| `MediaType` | `'image' \| 'video' \| 'carousel' \| 'text_only'` |
| `Template` | Reusable content templates with variables |
| `BrandSettings` | Brand voice, guidelines, target audience |
| `ContentCalendar` | Scheduling metadata |
| `AIGenerationLog` | AI usage tracking (provider, model, tokens, cost) |
| `ApiResponse<T>` | Standard API response wrapper |
| `PaginatedResponse<T>` | Paginated API response |

---

## Zustand Stores

### App Store (`app-store.ts`)
Persisted as `openpaws-storage`

| State | Type |
|-------|------|
| `user` | `Profile \| null` |
| `organization` | `Organization \| null` |
| `currentWorkspace` | `Workspace \| null` |
| `workspaces` | `Workspace[]` |
| `isAuthenticated` | `boolean` |

Actions: `setUser()`, `setOrganization()`, `setWorkspace()`, `setWorkspaces()`, `logout()`

### Content Store (`content-store.ts`)

| State | Type |
|-------|------|
| `posts` | `Post[]` |
| `selectedPost` | `Post \| null` |
| `isLoading` | `boolean` |
| `filter` | `{ status?, platform?, sourceType? }` |

Actions: `setPosts()`, `setSelectedPost()`, `setLoading()`, `setFilter()`

### Schedule Store (`schedule-store.ts`)
Persisted as `openpaws-schedule`

| State | Type |
|-------|------|
| `posts` | `ScheduledPost[]` |

Actions: `addPost()`, `updatePost()`, `removePost()`, `getPostById()`, `getPostsByDate()`, `getPostsByMonth()`, `getPostsByStatus()`

### Social Accounts Store (`social-accounts-store.ts`)
Persisted as `openpaws-social-accounts`

| State | Type |
|-------|------|
| `accounts` | `SocialAccount[]` |

Actions: `addAccount()`, `removeAccount()`, `getByPlatform()`, `isConnected()`

### UI Store (`ui-store.ts`)

| State | Type |
|-------|------|
| `sidebarCollapsed` | `boolean` |
| `activeModal` | `string \| null` |

Actions: `toggleSidebar()`, `setSidebarCollapsed()`, `openModal()`, `closeModal()`

---

## API Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/auth/callback` | GET | Supabase auth callback handler |
| `/api/content` | GET, POST | List posts / create draft post |
| `/api/content/generate` | POST | AI content generation (variations, repurpose, scoring) |
| `/api/content/[id]` | GET, PUT, DELETE | Single post CRUD |
| `/api/brand` | GET, PUT, POST | Brand analysis, restyle, settings management |
| `/api/accounts` | GET, POST | List / create social accounts |
| `/api/accounts/connect/[platform]` | GET, POST | Initiate OAuth flow (popup-based) |
| `/api/accounts/connect/[platform]/config` | GET | Check if platform OAuth is configured |
| `/api/accounts/connect/[platform]/callback` | GET | OAuth callback (exchanges code for token) |
| `/api/analytics` | GET, POST | Analytics data retrieval |
| `/api/schedule` | GET, POST | List / create scheduled posts |
| `/api/schedule/[id]` | GET, PUT, DELETE | Single scheduled post CRUD |
| `/api/webhooks/[platform]` | POST | Incoming platform webhook events |

---

## AI System

### Provider Routing (`lib/ai/router.ts`)

**Fallback Chain:** OpenClaw → OpenAI → Anthropic

| Provider | Model | When Used |
|----------|-------|-----------|
| OpenClaw | `minimax` (routed) | Primary — local gateway at `localhost:18789` |
| OpenAI | `gpt-4o` | First fallback |
| Anthropic | `claude-sonnet-4-5` | Second fallback |

### Content Generator (`lib/ai/content-generator.ts`)

| Function | Purpose |
|----------|---------|
| `generateContent()` | Generate post from prompt + brand context |
| `generateVariations()` | Create variations of existing content |
| `repurposeContent()` | Adapt post for different platform |
| `analyzePerformance()` | Analyze post metrics with AI |
| `scorePost()` | Rate viral potential 1-10 |
| `analyzeBrandFromUrl()` | Extract brand voice from website |
| `restyleBrand()` | Regenerate voice for different tone |

### Brand Analyzer (`lib/ai/brand-analyzer.ts`)

Analyzes website URLs to extract brand identity. Validates tone against: confident, warm, educational, playful, professional, witty, bold, empathetic.

---

## OAuth Integration

### Supported Platforms

| Platform | Developer Portal | Env Vars |
|----------|-----------------|----------|
| Instagram | developers.facebook.com/apps | `INSTAGRAM_CLIENT_ID`, `INSTAGRAM_CLIENT_SECRET` |
| Facebook | developers.facebook.com/apps | `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET` |
| Twitter / X | developer.twitter.com | `TWITTER_CLIENT_ID`, `TWITTER_CLIENT_SECRET` |
| LinkedIn | linkedin.com/developers/apps | `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET` |
| YouTube | console.cloud.google.com | `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET` |
| TikTok | developers.tiktok.com/apps | `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET` |

### OAuth Flow
1. Frontend calls `/api/accounts/connect/[platform]/config` to check if configured
2. If not configured → shows `PlatformSetupDialog` with developer instructions
3. If configured → opens popup to `/api/accounts/connect/[platform]`
4. Server generates state cookie (CSRF), redirects to platform OAuth URL
5. User authorizes → platform redirects to callback URL
6. Callback exchanges code for tokens → posts message to opener window
7. Frontend `ConnectButton` listens for `oauth_callback` message → adds to Zustand store
8. Twitter uses PKCE (code_verifier/code_challenge), TikTok uses `client_key` parameter

**Redirect URI pattern:** `http://localhost:3002/api/accounts/connect/[platform]/callback`

---

## Database Schema

**File:** `supabase/migrations/001_initial_schema.sql`

### Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `organizations` | Multi-tenant root | id, name, slug, plan, stripe_customer_id, branding (JSONB) |
| `profiles` | Users (linked to auth.users) | id, email, organization_id, role (owner/admin/member/viewer) |
| `workspaces` | Client accounts in org | id, organization_id, name, settings (JSONB) |
| `social_accounts` | Connected platforms | id, workspace_id, platform, access_token, refresh_token, expires_at |
| `brand_settings` | Brand voice config | id, workspace_id, brand_name, brand_voice (JSONB), topics, example_posts |
| `posts` | Content items | id, workspace_id, content, platform, status, scheduled_at, published_at, metrics (JSONB), ai_model_used |
| `templates` | Reusable templates | id, organization_id, workspace_id, content, variables (JSONB), is_global |
| `content_calendar` | Schedule metadata | id, workspace_id, post_id, scheduled_date, scheduled_time |
| `ai_generation_log` | AI usage tracking | id, workspace_id, provider, model, prompt_tokens, completion_tokens, cost_usd |

### Security
- Row Level Security (RLS) enabled on all tables
- Policies scoped by organization membership and user role
- Auto-created profile + org + workspace on signup via trigger

---

## Brand Identity System

### Paw Icon Components (`components/ui/paw-icon.tsx`)

| Component | Usage |
|-----------|-------|
| `PawIcon` | Stroked outline paw — section headers, page title prefix |
| `PawIconFilled` | Solid fill paw — active nav indicator, calendar today marker, ambient texture |
| `PawSpinner` | Rotating filled paw — loading states (replaces generic spinners) |
| `PawCheck` | Paw with checkmark — success confirmations |

### Paw Trail Component (`components/ui/paw-trail.tsx`)

| Variant | Usage |
|---------|-------|
| `scattered` | Dashboard background, feature sections |
| `diagonal` | Auth layout background |
| `trail` | "How It Works" section |
| `corner` | Pricing section |

### Brand Integration Points

- **Sidebar:** Active nav paw indicator, ambient paw texture, logo links to landing
- **Header:** Paw prefix on page titles
- **Calendar:** Filled paw on today, tiny paw on days with posts, hover ghost paw, watermark behind arrows
- **Connect button:** PawSpinner replaces Loader2 during OAuth
- **Section headers:** PawIcon prefix on "Connected" and "Available to Connect"
- **Landing page:** Giant mascot backdrops (hero, CTA), animated paw-squeeze on logo
- **Auth layout:** Mascot backdrops, diagonal paw trail
- **Empty states:** Scattered PawPrint decorations

---

## Styling & Theme

### Tailwind Config (`tailwind.config.ts`)

**Custom Colors:**
- `warm-25` to `warm-900` — Brown-tinted neutral grays
- `ai-50` to `ai-700` — Purple (#8B5CF6) for AI features
- Platform colors: Instagram pink, LinkedIn blue, Twitter sky, etc.

**Custom Animations:**
| Animation | Effect |
|-----------|--------|
| `paw-squeeze` | Scale 1 → 1.15 → 1 (playful bounce) |
| `float` | Vertical translate bounce |
| `fade-in-up` | Opacity + translateY entrance |
| `slide-in-left/right` | Horizontal slide entrance |
| `ai-pulse` | AI glow pulsing |
| `scale-in` | Zoom entrance |

**Custom Shadows:** card, elevated, focus-orange, ai, ai-glow

**Fonts:**
- Display: `Plus_Jakarta_Sans` (600, 700, 800)
- Body: `Inter`

---

## Middleware

**File:** `src/middleware.ts`

**Protected paths:** `/content`, `/schedule`, `/analytics`, `/accounts`, `/brand`, `/settings`

**Behavior:**
- Checks Supabase auth session
- Unauthenticated → redirect to `/login?redirectTo=<path>`
- Authenticated on auth pages → redirect to `/content`
- Supabase not configured → skip auth (dev mode passthrough)

---

## Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3002

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Providers
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
OPENCLAW_API_KEY=
OPENCLAW_BASE_URL=http://127.0.0.1:18789

# Social Platform OAuth
INSTAGRAM_CLIENT_ID=
INSTAGRAM_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
TWITTER_CLIENT_ID=
TWITTER_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=
```

---

## Dependencies

### Core
| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 14.2.21 | React framework (App Router) |
| `react` | 18.3.1 | UI library |
| `typescript` | 5 | Type safety |

### AI
| Package | Version | Purpose |
|---------|---------|---------|
| `openai` | 6.22.0 | OpenAI API client (also used for OpenClaw) |
| `@anthropic-ai/sdk` | 0.78.0 | Anthropic Claude API client |

### Database
| Package | Version | Purpose |
|---------|---------|---------|
| `@supabase/supabase-js` | 2.47.10 | Supabase client |
| `@supabase/ssr` | 0.5.2 | Server-side rendering helpers |
| `@supabase/auth-helpers-nextjs` | 0.15.0 | Auth middleware helpers |

### State
| Package | Version | Purpose |
|---------|---------|---------|
| `zustand` | 5.0.2 | State management |

### UI
| Package | Version | Purpose |
|---------|---------|---------|
| `@radix-ui/*` | latest | Accessible UI primitives (avatar, dialog, dropdown, select, tabs, toast, tooltip) |
| `lucide-react` | 0.468.0 | Icon library |
| `recharts` | 3.7.0 | Charts and data visualization |
| `tailwindcss` | 3.4.1 | Utility-first CSS |
| `tailwind-merge` | 2.6.0 | Class conflict resolution |
| `clsx` | 2.1.1 | Conditional class names |

### Forms & Validation
| Package | Version | Purpose |
|---------|---------|---------|
| `react-hook-form` | 7.54.2 | Form state management |
| `@hookform/resolvers` | 3.9.1 | Schema validation integration |
| `zod` | 3.24.1 | Schema validation |

### Utilities
| Package | Version | Purpose |
|---------|---------|---------|
| `date-fns` | 4.1.0 | Date manipulation |
| `cron-parser` | 5.5.0 | Cron expression parsing |

---

## Scripts

```bash
npm run dev      # Start dev server (port 3002)
npm run build    # Production build
npm start        # Start production server
npm run lint     # ESLint
```

---

## Development Phases

| Phase | Status | Scope |
|-------|--------|-------|
| 1 | Complete | Landing page, auth UI, basic dashboard layout |
| 2 | In Progress | Content creation & editing, AI generation |
| 3 | Planned | Post CRUD with database |
| 4 | Planned | Social account OAuth connection |
| 5 | In Progress | Scheduling & calendar (client-side complete) |
| 6 | Planned | Brand settings, analytics |
| 7+ | Planned | Webhooks, autonomous agents, engagement automation |

---

## Pages

### Public
| Path | Description |
|------|-------------|
| `/` | Landing page — hero, features grid, how it works, pricing, testimonials, CTA |
| `/login` | Email/password + Google OAuth login |
| `/signup` | Registration page |

### Protected (requires auth)
| Path | Description |
|------|-------------|
| `/content` | Content library — list all posts with filters |
| `/content/create` | Post creation — editor + AI generation panel |
| `/schedule` | Calendar view — month navigation, day detail sidebar, schedule modal |
| `/analytics` | Dashboard — stats cards, engagement chart, top posts |
| `/accounts` | Connected accounts — connect/disconnect social platforms |
| `/brand` | Brand voice — settings, tone, guidelines |
| `/settings` | Account settings |

---

## Architecture Notes

- **Route Groups:** `(auth)` and `(dashboard)` group layouts without affecting URLs
- **Path Alias:** `@/*` maps to `./src/*` in tsconfig
- **Persistence:** Zustand stores use `persist` middleware → localStorage
- **Auth Guard:** Middleware checks Supabase session, redirects unauthenticated users
- **Dev Mode:** Supabase not configured → auth skipped, stores provide mock data
- **Image Optimization:** All images use Next.js `<Image>` for automatic WebP conversion and responsive sizing
- **AI Fallback:** OpenClaw (local) → OpenAI → Anthropic, with cost estimation per request
