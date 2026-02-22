'use client'

import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useState } from 'react'
import Link from 'next/link'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function SchedulePage() {
  const [currentDate] = useState(new Date())
  const month = currentDate.getMonth()
  const year = currentDate.getFullYear()

  // Generate calendar grid
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startOffset = (firstDay.getDay() + 6) % 7 // Monday start
  const totalDays = lastDay.getDate()

  const cells: (number | null)[] = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let i = 1; i <= totalDays; i++) cells.push(i)
  while (cells.length % 7 !== 0) cells.push(null)

  const today = new Date().getDate()
  const isCurrentMonth = new Date().getMonth() === month && new Date().getFullYear() === year

  return (
    <div className="space-y-6">
      {/* Calendar header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="rounded-lg p-2 text-warm-500 hover:bg-warm-100 hover:text-warm-700 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold font-display text-warm-800 min-w-[180px] text-center">
            {MONTHS[month]} {year}
          </h2>
          <button className="rounded-lg p-2 text-warm-500 hover:bg-warm-100 hover:text-warm-700 transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-warm-200 bg-warm-50 p-0.5">
            <button className="rounded-md px-3 py-1.5 text-[13px] font-medium bg-white text-warm-800 shadow-sm">
              Month
            </button>
            <button className="rounded-md px-3 py-1.5 text-[13px] font-medium text-warm-500 hover:text-warm-700">
              Week
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Calendar grid */}
        <Card className="flex-1 overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-warm-100">
            {DAYS.map(day => (
              <div key={day} className="px-2 py-2.5 text-center text-[12px] font-semibold uppercase tracking-wide text-warm-500">
                {day}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {cells.map((day, i) => (
              <div
                key={i}
                className={`min-h-[100px] border-b border-r border-warm-100 p-2 transition-colors ${
                  day ? 'hover:bg-orange-50/50 cursor-pointer' : 'bg-warm-50/50'
                } ${i % 7 === 6 ? 'border-r-0' : ''}`}
              >
                {day && (
                  <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-medium ${
                    isCurrentMonth && day === today
                      ? 'bg-orange-500 text-white'
                      : 'text-warm-700'
                  }`}>
                    {day}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Unscheduled drafts sidebar */}
        <div className="hidden xl:block w-60 space-y-3">
          <h3 className="text-[13px] font-semibold uppercase tracking-wide text-warm-500">
            Unscheduled Drafts
          </h3>
          <div className="space-y-2">
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-warm-200 py-8 text-center">
              <Calendar className="h-8 w-8 text-warm-300 mb-2" />
              <p className="text-[13px] text-warm-400">
                No drafts to schedule
              </p>
              <Button size="sm" variant="ghost" className="mt-2" asChild>
                <Link href="/content/create">
                  <Plus className="h-3.5 w-3.5" />
                  New Draft
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
