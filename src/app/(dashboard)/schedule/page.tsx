'use client'

import {
  Calendar, ChevronLeft, ChevronRight, Plus, Clock, Trash2, Edit3, PawPrint,
  Instagram, Linkedin, Twitter, Facebook, Youtube, Music,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PawIconFilled } from '@/components/ui/paw-icon'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useScheduleStore, type ScheduledPost } from '@/stores/schedule-store'
import { ScheduleModal } from '@/components/schedule/schedule-modal'
import type { SocialPlatform } from '@/types'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const platformIcons: Record<SocialPlatform, typeof Instagram> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  tiktok: Music,
}

const platformColors: Record<SocialPlatform, string> = {
  instagram: '#E4405F',
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  linkedin: '#0A66C2',
  youtube: '#FF0000',
  tiktok: '#000000',
}

export default function SchedulePage() {
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [editPostId, setEditPostId] = useState<string | null>(null)
  const [selectedDayPosts, setSelectedDayPosts] = useState<ScheduledPost[]>([])
  const [selectedDayLabel, setSelectedDayLabel] = useState('')

  const posts = useScheduleStore((s) => s.posts)
  const removePost = useScheduleStore((s) => s.removePost)
  const getPostsByDate = useScheduleStore((s) => s.getPostsByDate)

  // Month navigation
  const goToPrevMonth = () => {
    if (month === 0) {
      setMonth(11)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  const goToNextMonth = () => {
    if (month === 11) {
      setMonth(0)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  const goToToday = () => {
    const now = new Date()
    setMonth(now.getMonth())
    setYear(now.getFullYear())
  }

  // Calendar grid
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startOffset = (firstDay.getDay() + 6) % 7 // Monday start
  const totalDays = lastDay.getDate()

  const cells: (number | null)[] = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let i = 1; i <= totalDays; i++) cells.push(i)
  while (cells.length % 7 !== 0) cells.push(null)

  const todayDate = new Date().getDate()
  const todayMonth = new Date().getMonth()
  const todayYear = new Date().getFullYear()
  const isCurrentMonth = todayMonth === month && todayYear === year

  // Group posts by date for this month
  const postsByDay = useMemo(() => {
    const map: Record<number, ScheduledPost[]> = {}
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`
    posts
      .filter((p) => p.scheduledAt.startsWith(prefix))
      .forEach((p) => {
        const day = parseInt(p.scheduledAt.slice(8, 10), 10)
        if (!map[day]) map[day] = []
        map[day].push(p)
      })
    return map
  }, [posts, year, month])

  // Total scheduled this month
  const monthPostCount = useMemo(
    () => Object.values(postsByDay).reduce((acc, arr) => acc + arr.length, 0),
    [postsByDay]
  )

  // Click on a day
  const handleDayClick = (day: number) => {
    const date = new Date(year, month, day)
    setSelectedDate(date)
    setEditPostId(null)

    const dayPosts = postsByDay[day] || []
    setSelectedDayPosts(dayPosts)

    const label = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    setSelectedDayLabel(label)

    // If no posts, open modal directly
    if (dayPosts.length === 0) {
      setModalOpen(true)
    }
  }

  const handleNewPost = () => {
    if (!selectedDate) {
      // Default to today
      setSelectedDate(new Date())
    }
    setEditPostId(null)
    setModalOpen(true)
  }

  const handleEditPost = (postId: string) => {
    const post = posts.find((p) => p.id === postId)
    if (post) {
      const date = new Date(post.scheduledAt)
      setSelectedDate(date)
      setEditPostId(postId)
      setModalOpen(true)
    }
  }

  const handleDeletePost = (postId: string) => {
    removePost(postId)
    setSelectedDayPosts((prev) => prev.filter((p) => p.id !== postId))
  }

  const formatTime = (isoStr: string) => {
    const date = new Date(isoStr)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  return (
    <div className="space-y-6">
      {/* Calendar header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={goToPrevMonth}
            className="relative rounded-lg p-2 text-warm-500 hover:bg-warm-100 hover:text-warm-700 transition-colors"
          >
            <PawIconFilled size={18} className="absolute inset-0 m-auto text-orange-300" opacity={0.08} />
            <ChevronLeft className="relative h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold font-display text-warm-800 min-w-[180px] text-center">
            {MONTHS[month]} {year}
          </h2>
          <button
            onClick={goToNextMonth}
            className="relative rounded-lg p-2 text-warm-500 hover:bg-warm-100 hover:text-warm-700 transition-colors"
          >
            <PawIconFilled size={18} className="absolute inset-0 m-auto text-orange-300" opacity={0.08} />
            <ChevronRight className="relative h-5 w-5" />
          </button>
          <button
            onClick={goToToday}
            className="ml-2 rounded-lg px-3 py-1.5 text-[12px] font-medium text-warm-500 border border-warm-200 hover:bg-warm-100 hover:text-warm-700 transition-colors"
          >
            Today
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-warm-500">
            {monthPostCount} post{monthPostCount !== 1 ? 's' : ''} this month
          </span>
          <Button size="sm" onClick={handleNewPost}>
            <Plus className="h-4 w-4" />
            Schedule Post
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Calendar grid */}
        <Card className="flex-1 overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-warm-100">
            {DAYS.map((day) => (
              <div
                key={day}
                className="px-2 py-2.5 text-center text-[12px] font-semibold uppercase tracking-wide text-warm-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              const dayPosts = day ? postsByDay[day] || [] : []
              const isToday = isCurrentMonth && day === todayDate
              const isPast = day
                ? new Date(year, month, day) < new Date(todayYear, todayMonth, todayDate)
                : false
              const isSelected =
                day && selectedDate
                  ? selectedDate.getDate() === day &&
                    selectedDate.getMonth() === month &&
                    selectedDate.getFullYear() === year
                  : false

              return (
                <div
                  key={i}
                  onClick={() => day && handleDayClick(day)}
                  className={`group/day relative min-h-[100px] border-b border-r border-warm-100 p-2 transition-colors ${
                    day
                      ? 'hover:bg-orange-50/50 cursor-pointer'
                      : 'bg-warm-50/50'
                  } ${i % 7 === 6 ? 'border-r-0' : ''} ${
                    isSelected ? 'bg-orange-50 ring-2 ring-inset ring-orange-300' : ''
                  } ${isPast && !isToday ? 'opacity-60' : ''}`}
                >
                  {day && (
                    <>
                      {/* Hover ghost paw */}
                      <PawIconFilled
                        size={40}
                        className="absolute inset-0 m-auto text-orange-300 opacity-0 group-hover/day:opacity-[0.06] transition-opacity duration-200 pointer-events-none"
                      />

                      <div className="flex items-center gap-1">
                        {/* Today = filled paw behind number, otherwise plain */}
                        {isToday ? (
                          <span className="relative inline-flex h-7 w-7 items-center justify-center">
                            <PawIconFilled size={28} className="absolute text-orange-500" />
                            <span className="relative text-[13px] font-bold text-white">{day}</span>
                          </span>
                        ) : (
                          <span className="inline-flex h-7 w-7 items-center justify-center text-[13px] font-medium text-warm-700">
                            {day}
                          </span>
                        )}

                        {/* Small paw indicator if day has posts */}
                        {dayPosts.length > 0 && (
                          <PawIconFilled size={10} className="text-orange-400" opacity={0.7} />
                        )}
                      </div>

                      {/* Post indicators */}
                      {dayPosts.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {dayPosts.slice(0, 3).map((post) => (
                            <div
                              key={post.id}
                              className="flex items-center gap-1 rounded px-1.5 py-0.5 bg-orange-100/80 text-[10px] text-warm-700 truncate"
                              title={post.content}
                            >
                              <div className="flex -space-x-1 shrink-0">
                                {post.platforms.slice(0, 2).map((p) => {
                                  const Icon = platformIcons[p]
                                  return (
                                    <Icon
                                      key={p}
                                      className="h-2.5 w-2.5"
                                      style={{ color: platformColors[p] }}
                                    />
                                  )
                                })}
                              </div>
                              <span className="truncate">
                                {formatTime(post.scheduledAt)}
                              </span>
                            </div>
                          ))}
                          {dayPosts.length > 3 && (
                            <div className="text-[10px] text-warm-400 px-1.5">
                              +{dayPosts.length - 3} more
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </Card>

        {/* Day detail sidebar */}
        <div className="hidden xl:block w-72 space-y-3">
          {selectedDate ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-wide text-warm-500">
                  <PawIconFilled size={11} className="text-orange-400" opacity={0.6} />
                  {selectedDayLabel}
                </h3>
              </div>

              {selectedDayPosts.length === 0 ? (
                <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-warm-200 py-8 text-center overflow-hidden">
                  <PawPrint className="absolute top-3 right-4 h-5 w-5 text-orange-300 opacity-[0.15] rotate-[-20deg]" aria-hidden="true" />
                  <PawPrint className="absolute bottom-4 left-5 h-4 w-4 text-orange-300 opacity-[0.1] rotate-[25deg]" aria-hidden="true" />
                  <Calendar className="h-8 w-8 text-warm-300 mb-2" />
                  <p className="text-[13px] text-warm-400">
                    No posts scheduled
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2"
                    onClick={() => setModalOpen(true)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Post
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDayPosts
                    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
                    .map((post) => (
                      <Card key={post.id} className="p-4 space-y-3">
                        {/* Time & Status */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[13px] text-warm-600">
                            <Clock className="h-3.5 w-3.5" />
                            {formatTime(post.scheduledAt)}
                          </div>
                          <Badge
                            variant={post.status === 'scheduled' ? 'default' : post.status === 'published' ? 'success' : 'destructive'}
                            className="text-[10px]"
                          >
                            {post.status}
                          </Badge>
                        </div>

                        {/* Platforms */}
                        <div className="flex items-center gap-1.5">
                          {post.platforms.map((p) => {
                            const Icon = platformIcons[p]
                            return (
                              <div
                                key={p}
                                className="flex h-6 w-6 items-center justify-center rounded-md bg-warm-100"
                                title={p}
                              >
                                <Icon
                                  className="h-3.5 w-3.5"
                                  style={{ color: platformColors[p] }}
                                />
                              </div>
                            )
                          })}
                        </div>

                        {/* Content preview */}
                        <p className="text-[13px] text-warm-600 line-clamp-3 leading-relaxed">
                          {post.content}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-1 border-t border-warm-100">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-warm-400 hover:text-warm-700 h-7 text-[12px]"
                            onClick={() => handleEditPost(post.id)}
                          >
                            <Edit3 className="h-3 w-3" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-warm-400 hover:text-red-600 hover:bg-red-50 h-7 text-[12px]"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </Card>
                    ))}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setEditPostId(null)
                      setModalOpen(true)
                    }}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Another Post
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-warm-200 py-8 text-center overflow-hidden">
              <PawPrint className="absolute top-2 left-3 h-6 w-6 text-orange-300 opacity-[0.12] rotate-[30deg]" aria-hidden="true" />
              <PawPrint className="absolute bottom-3 right-4 h-5 w-5 text-orange-300 opacity-[0.1] rotate-[-15deg]" aria-hidden="true" />
              <PawPrint className="absolute top-10 right-6 h-4 w-4 text-orange-300 opacity-[0.08] rotate-[45deg]" aria-hidden="true" />
              <Calendar className="h-8 w-8 text-warm-300 mb-2" />
              <p className="text-[13px] text-warm-400">
                Click a day to view or schedule posts
              </p>
              <Button size="sm" variant="ghost" className="mt-2" asChild>
                <Link href="/content/create">
                  <Plus className="h-3.5 w-3.5" />
                  New Draft
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Modal */}
      <ScheduleModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open)
          if (!open && selectedDate) {
            // Refresh sidebar posts from store after modal closes
            const day = selectedDate.getDate()
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            setSelectedDayPosts(getPostsByDate(dateStr))
          }
        }}
        selectedDate={selectedDate}
        editPostId={editPostId}
      />
    </div>
  )
}
