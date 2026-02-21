# OpenPaws

AI-powered social media management platform with autonomous agents.

## Features

- **Autonomous Agents** - LangGraph pipelines that plan, generate, review, schedule, and publish content
- **Multi-Platform** - Twitter/X, LinkedIn, Instagram, TikTok from a single dashboard
- **Content Calendar** - AI-generated calendars with drag-and-drop scheduling
- **Human-in-the-Loop** - Review and approve AI content before publishing
- **Analytics** - Cross-platform engagement metrics and insights
- **Brand Voice** - Configure tone, style, and guidelines for consistent content
- **Multi-Tenant** - Team workspaces with role-based access control

## Architecture

```
Frontend (Next.js 15)  -->  Backend (FastAPI)  -->  Supabase (PG + Auth)
         |                        |                        |
         |                  LangGraph Agents  <------------+
         |                        |               (checkpoints)
         +-- Realtime ----> Celery Workers  -->  Redis (broker)
                                  |
                           Social APIs (X, LI, IG, TT)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.12, FastAPI, Pydantic v2 |
| Agents | LangGraph, LangChain, PostgresSaver |
| Database | Supabase (PostgreSQL 15 + RLS) |
| Auth | Supabase Auth (JWT) |
| Queue | Celery + Redis |
| Frontend | Next.js 15, React 19, TypeScript |
| UI | shadcn/ui, Tailwind CSS 4, Recharts |
| Testing | pytest, Vitest, Playwright |

## Quick Start

```bash
git clone https://github.com/Shavoni/openpaws.git
cd openpaws
cp .env.example .env
make dev
```

API: http://localhost:8000/docs | Frontend: http://localhost:3000

## License

Business Source License 1.1 - See [LICENSE](LICENSE).

Built by [DEF1LIVE LLC](https://def1live.com).
