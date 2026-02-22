'use client'

import { BarChart3 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Date range selector */}
      <div className="flex items-center gap-2">
        {['7d', '30d', '90d'].map((range, i) => (
          <button
            key={range}
            className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
              i === 0
                ? 'bg-orange-50 text-orange-700'
                : 'text-warm-500 hover:bg-warm-100 hover:text-warm-700'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Posts', value: '0' },
          { label: 'Engagements', value: '0' },
          { label: 'Avg Rate', value: '0%' },
          { label: 'AI Cost', value: '$0.00' },
        ].map((stat) => (
          <Card key={stat.label} className="p-5 animate-fade-in-up">
            <p className="text-[13px] font-medium uppercase tracking-wide text-warm-500">{stat.label}</p>
            <p className="mt-1 text-[32px] font-extrabold font-display leading-none text-warm-800">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Charts placeholder — empty state */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2 p-5">
          <h3 className="text-[15px] font-semibold text-warm-800 mb-4">Engagement Over Time</h3>
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-warm-200 bg-warm-50/50">
            <p className="text-sm text-warm-400">Chart will appear once you have published posts</p>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="text-[15px] font-semibold text-warm-800 mb-4">Posts by Platform</h3>
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-warm-200 bg-warm-50/50">
            <p className="text-sm text-warm-400">No data yet</p>
          </div>
        </Card>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in-up">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
          <BarChart3 className="h-10 w-10 text-orange-400" />
        </div>
        <h2 className="text-xl font-bold font-display text-warm-800">
          Analytics will appear here
        </h2>
        <p className="mt-2 max-w-sm text-sm text-warm-500">
          Once you&apos;ve published your first post, you&apos;ll see engagement metrics, trends, and AI cost tracking.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/content/create">Create a Post</Link>
        </Button>
      </div>
    </div>
  )
}
