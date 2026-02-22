'use client'

import { useAppStore } from '@/stores/app-store'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  FileText,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  Share2,
  PawPrint,
  Plus,
} from 'lucide-react'
import Link from 'next/link'

function StatsCard({
  label,
  value,
  trend,
  trendUp,
  icon: Icon,
  accentColor = 'orange',
}: {
  label: string
  value: string
  trend?: string
  trendUp?: boolean
  icon: React.ElementType
  accentColor?: string
}) {
  const accentClasses: Record<string, string> = {
    orange: 'bg-orange-50 text-orange-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-ai-50 text-ai-500',
  }

  return (
    <Card className="p-5 animate-fade-in-up">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium uppercase tracking-wide text-warm-500">
            {label}
          </p>
          <p className="mt-1 text-[32px] font-extrabold font-display leading-none text-warm-800">
            {value}
          </p>
          {trend && (
            <p className={`mt-1.5 text-[13px] font-medium ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
              {trendUp ? '+' : ''}{trend} vs last week
            </p>
          )}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accentClasses[accentColor]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in-up">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
        <PawPrint className="h-10 w-10 text-orange-400" />
      </div>
      <h2 className="text-xl font-bold font-display text-warm-800">
        Welcome to OpenPaws
      </h2>
      <p className="mt-2 max-w-sm text-sm text-warm-500">
        Let&apos;s get your social media running on autopilot.
        Start by connecting an account or creating your first post.
      </p>
      <div className="mt-6 flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/accounts">
            <Share2 className="h-4 w-4" />
            Connect Account
          </Link>
        </Button>
        <Button asChild>
          <Link href="/content/create">
            <Plus className="h-4 w-4" />
            Create First Post
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAppStore()
  const firstName = user?.full_name?.split(' ')[0] || 'there'

  // Check if user is new (no data yet) — for now, always show the onboarding state
  const isNewUser = true

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-lg font-semibold font-display text-warm-800">
          Good {getGreeting()}, {firstName}
        </h2>
        <p className="text-sm text-warm-500">
          Here&apos;s what&apos;s happening with your social presence.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Posts This Week"
          value="0"
          icon={FileText}
          accentColor="orange"
        />
        <StatsCard
          label="Total Engagement"
          value="0"
          icon={TrendingUp}
          accentColor="green"
        />
        <StatsCard
          label="Scheduled Posts"
          value="0"
          icon={Clock}
          accentColor="blue"
        />
        <StatsCard
          label="AI Generations"
          value="0"
          icon={Sparkles}
          accentColor="purple"
        />
      </div>

      {isNewUser ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Recent posts */}
          <div className="xl:col-span-2">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-semibold text-warm-800">Recent Posts</h3>
                <Link href="/content" className="text-[13px] font-medium text-orange-500 hover:text-orange-600 flex items-center gap-1">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <p className="text-sm text-warm-500">No posts yet. Create your first one!</p>
            </Card>
          </div>

          {/* Quick create */}
          <div>
            <Card className="p-5">
              <h3 className="text-[15px] font-semibold text-warm-800 mb-3">Quick Create</h3>
              <Textarea
                placeholder="What's on your mind? Draft a quick post..."
                className="min-h-[100px] mb-3"
              />
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Save Draft
                </Button>
                <Button size="sm" variant="ai" className="flex-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Generate
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}
