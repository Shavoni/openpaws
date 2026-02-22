'use client'

import { useState } from 'react'
import {
  Clock, Sun, Sunset, Moon, Instagram, Linkedin, Twitter, Facebook, Youtube, Music, Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { useScheduleStore, type TimeOfDay } from '@/stores/schedule-store'
import { useSocialAccountsStore } from '@/stores/social-accounts-store'
import type { SocialPlatform } from '@/types'

const platformMeta: Record<SocialPlatform, {
  name: string
  icon: typeof Instagram
  color: string
  bgColor: string
}> = {
  instagram: { name: 'Instagram', icon: Instagram, color: '#E4405F', bgColor: 'bg-pink-50' },
  facebook: { name: 'Facebook', icon: Facebook, color: '#1877F2', bgColor: 'bg-blue-50' },
  twitter: { name: 'Twitter / X', icon: Twitter, color: '#1DA1F2', bgColor: 'bg-sky-50' },
  linkedin: { name: 'LinkedIn', icon: Linkedin, color: '#0A66C2', bgColor: 'bg-blue-50' },
  youtube: { name: 'YouTube', icon: Youtube, color: '#FF0000', bgColor: 'bg-red-50' },
  tiktok: { name: 'TikTok', icon: Music, color: '#000000', bgColor: 'bg-gray-50' },
}

const timePresets: { value: TimeOfDay; label: string; time: string; icon: typeof Sun }[] = [
  { value: 'morning', label: 'Morning', time: '09:00', icon: Sun },
  { value: 'afternoon', label: 'Afternoon', time: '13:00', icon: Clock },
  { value: 'evening', label: 'Evening', time: '18:00', icon: Sunset },
  { value: 'custom', label: 'Custom', time: '', icon: Moon },
]

interface ScheduleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate: Date | null
  editPostId?: string | null
}

export function ScheduleModal({ open, onOpenChange, selectedDate, editPostId }: ScheduleModalProps) {
  const addPost = useScheduleStore((s) => s.addPost)
  const updatePost = useScheduleStore((s) => s.updatePost)
  const getPostById = useScheduleStore((s) => s.getPostById)
  const connectedAccounts = useSocialAccountsStore((s) => s.accounts)

  const editPost = editPostId ? getPostById(editPostId) : null

  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(
    editPost?.platforms || []
  )
  const [content, setContent] = useState(editPost?.content || '')
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(editPost?.timeOfDay || 'morning')
  const [customTime, setCustomTime] = useState(() => {
    if (editPost?.timeOfDay === 'custom' && editPost.scheduledAt) {
      return editPost.scheduledAt.slice(11, 16) // Extract HH:MM
    }
    return '12:00'
  })

  const allPlatforms: SocialPlatform[] = ['instagram', 'facebook', 'twitter', 'linkedin', 'youtube', 'tiktok']

  const togglePlatform = (platform: SocialPlatform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    )
  }

  const getScheduledTime = (): string => {
    if (timeOfDay === 'custom') return customTime
    return timePresets.find((t) => t.value === timeOfDay)?.time || '09:00'
  }

  const handleSubmit = () => {
    if (!selectedDate || selectedPlatforms.length === 0 || !content.trim()) return

    const time = getScheduledTime()
    const year = selectedDate.getFullYear()
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
    const day = String(selectedDate.getDate()).padStart(2, '0')
    const scheduledAt = `${year}-${month}-${day}T${time}:00`

    if (editPost) {
      updatePost(editPost.id, {
        platforms: selectedPlatforms,
        content,
        scheduledAt,
        timeOfDay,
        status: 'scheduled',
      })
    } else {
      addPost({
        platforms: selectedPlatforms,
        content,
        scheduledAt,
        timeOfDay,
        status: 'scheduled',
      })
    }

    // Reset and close
    setSelectedPlatforms([])
    setContent('')
    setTimeOfDay('morning')
    setCustomTime('12:00')
    onOpenChange(false)
  }

  const dateLabel = selectedDate
    ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : ''

  const isValid = selectedPlatforms.length > 0 && content.trim().length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="font-display">
            {editPost ? 'Edit Scheduled Post' : 'Schedule a Post'}
          </DialogTitle>
          <DialogDescription>{dateLabel}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Platform Selector */}
          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-warm-700">Platforms</label>
            <div className="grid grid-cols-3 gap-2">
              {allPlatforms.map((platformId) => {
                const meta = platformMeta[platformId]
                const Icon = meta.icon
                const isSelected = selectedPlatforms.includes(platformId)
                const isConnected = connectedAccounts.some(
                  (a) => a.platform === platformId && a.is_active
                )

                return (
                  <button
                    key={platformId}
                    onClick={() => togglePlatform(platformId)}
                    className={`relative flex items-center gap-2 rounded-lg border-2 px-3 py-2.5 text-[13px] font-medium transition-all ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50 text-warm-800'
                        : 'border-warm-200 bg-white text-warm-500 hover:border-warm-300 hover:bg-warm-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" style={{ color: isSelected ? meta.color : undefined }} />
                    <span className="truncate">{meta.name}</span>
                    {isSelected && (
                      <Check className="absolute right-1.5 top-1.5 h-3 w-3 text-orange-500" />
                    )}
                    {!isConnected && (
                      <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-warm-300 border-2 border-white" title="Not connected" />
                    )}
                  </button>
                )
              })}
            </div>
            {selectedPlatforms.some(
              (p) => !connectedAccounts.some((a) => a.platform === p && a.is_active)
            ) && (
              <p className="text-[11px] text-amber-600">
                Some selected platforms are not connected yet. Connect them in Accounts to publish.
              </p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-warm-700">Content</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What do you want to post?"
              rows={4}
              className="resize-none"
            />
            <div className="flex justify-between">
              <span className="text-[11px] text-warm-400">
                {content.length} characters
              </span>
              {content.length > 280 && selectedPlatforms.includes('twitter') && (
                <span className="text-[11px] text-red-500">
                  Exceeds Twitter's 280 character limit
                </span>
              )}
            </div>
          </div>

          {/* Time of Day */}
          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-warm-700">Time of Day</label>
            <div className="grid grid-cols-4 gap-2">
              {timePresets.map((preset) => {
                const Icon = preset.icon
                const isSelected = timeOfDay === preset.value
                return (
                  <button
                    key={preset.value}
                    onClick={() => setTimeOfDay(preset.value)}
                    className={`flex flex-col items-center gap-1 rounded-lg border-2 px-2 py-3 text-[12px] font-medium transition-all ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50 text-warm-800'
                        : 'border-warm-200 bg-white text-warm-500 hover:border-warm-300'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isSelected ? 'text-orange-500' : ''}`} />
                    {preset.label}
                    {preset.time && (
                      <span className="text-[10px] text-warm-400">{preset.time}</span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Custom time input */}
            {timeOfDay === 'custom' && (
              <div className="flex items-center gap-2 mt-2">
                <Clock className="h-4 w-4 text-warm-400" />
                <Input
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="w-32"
                />
                <span className="text-[12px] text-warm-400">
                  Your local time
                </span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            {editPost ? 'Update Post' : 'Schedule Post'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
