# OpenPaws 🐾

AI-powered social media management platform built with autonomous agents.

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **State:** Zustand
- **Database:** Supabase (PostgreSQL)
- **AI:** OpenAI GPT-4o, Anthropic Claude, DALL-E 3

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

3. Update `.env.local` with your Supabase credentials

4. Run development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── page.tsx     # Landing page
│   └── layout.tsx   # Root layout
├── components/       # React components
│   └── ui/          # Reusable UI components
├── lib/             # Utilities
│   ├── supabase.ts  # Supabase client
│   └── utils.ts    # Helper functions
├── stores/          # Zustand stores
└── types/           # TypeScript definitions
```

## Features

- ✅ Landing page with OpenPaws branding
- 🔄 Multi-tenant architecture (workspaces)
- 📅 Content scheduling
- 🤖 AI content generation (in progress)
- 📊 Analytics dashboard (in progress)
- 🔌 API & webhooks (in progress)

## License

MIT
