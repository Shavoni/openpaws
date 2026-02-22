'use client'

import { FileText, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ContentPage() {
  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-lg border border-warm-200 bg-warm-50 px-3 py-1.5 text-sm text-warm-500 sm:w-72">
          <Search className="h-4 w-4 text-warm-400" />
          <input
            type="text"
            placeholder="Search posts..."
            className="w-full bg-transparent outline-none placeholder:text-warm-400"
          />
        </div>
        <Button asChild>
          <Link href="/content/create">
            <Plus className="h-4 w-4" />
            Create Post
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-warm-200 bg-warm-50 p-1 overflow-x-auto">
        {['All', 'Drafts', 'Scheduled', 'Published', 'Failed'].map((tab, i) => (
          <button
            key={tab}
            className={`whitespace-nowrap rounded-md px-4 py-2 text-[13px] font-medium transition-colors ${
              i === 0
                ? 'bg-white text-warm-800 shadow-sm'
                : 'text-warm-500 hover:text-warm-700 hover:bg-warm-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
          <FileText className="h-10 w-10 text-orange-400" />
        </div>
        <h2 className="text-xl font-bold font-display text-warm-800">
          No posts yet
        </h2>
        <p className="mt-2 max-w-sm text-sm text-warm-500">
          Create your first post and let your brand roar.
          Use AI to generate on-brand content in seconds.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/content/create">
            <Plus className="h-4 w-4" />
            Create First Post
          </Link>
        </Button>
      </div>
    </div>
  )
}
