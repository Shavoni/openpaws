'use client'

import { useState } from 'react'
import { Sparkles, Image, Hash, Instagram, Linkedin, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PLATFORM_CHAR_LIMITS } from '@/lib/constants'

const platforms = [
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-platform-instagram', limit: 2200 },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-platform-linkedin', limit: 3000 },
  { id: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-platform-twitter', limit: 280 },
]

export default function CreateContentPage() {
  const [content, setContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram'])
  const [previewPlatform, setPreviewPlatform] = useState('instagram')

  const currentLimit = PLATFORM_CHAR_LIMITS[previewPlatform] || 2200
  const charCount = content.length
  const isOverLimit = charCount > currentLimit

  function togglePlatform(id: string) {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Editor panel */}
      <div className="flex-1 space-y-4 lg:max-w-[55%]">
        {/* Platform selector */}
        <div className="flex gap-2">
          {platforms.map((p) => {
            const Icon = p.icon
            const selected = selectedPlatforms.includes(p.id)
            return (
              <button
                key={p.id}
                onClick={() => togglePlatform(p.id)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-medium transition-all ${
                  selected
                    ? 'border-orange-200 bg-orange-50 text-orange-700'
                    : 'border-warm-200 bg-white text-warm-500 hover:border-warm-300 hover:text-warm-700'
                }`}
              >
                <Icon className={`h-4 w-4 ${selected ? p.color : ''}`} />
                {p.label}
              </button>
            )
          })}
        </div>

        {/* Content textarea */}
        <div className="relative">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content here..."
            className="min-h-[200px] pr-20 text-sm"
          />
          <span
            className={`absolute bottom-3 right-3 text-[13px] font-medium ${
              isOverLimit ? 'text-red-500' : 'text-warm-400'
            }`}
          >
            {charCount}/{currentLimit}
          </span>
        </div>

        {/* Media upload */}
        <button className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-warm-200 bg-warm-50 px-4 py-8 text-sm font-medium text-warm-500 transition-colors hover:border-warm-300 hover:bg-warm-100 hover:text-warm-600">
          <Image className="h-5 w-5" />
          Add Media — drag & drop or click to browse
        </button>

        {/* Hashtag suggestions */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="h-4 w-4 text-warm-400" />
            <span className="text-[13px] font-medium text-warm-600">Suggested Hashtags</span>
          </div>
          <p className="text-[13px] text-warm-400 italic">
            Set up your Brand Voice to get AI-powered hashtag suggestions.
          </p>
        </Card>

        {/* AI Generate button */}
        <Button variant="ai" className="w-full">
          <Sparkles className="h-4 w-4" />
          Generate with AI
        </Button>
      </div>

      {/* Preview panel */}
      <div className="flex-1 lg:max-w-[45%]">
        {/* Preview platform tabs */}
        <div className="mb-4 flex gap-1 rounded-lg border border-warm-200 bg-warm-50 p-1">
          {platforms.filter(p => selectedPlatforms.includes(p.id)).map((p) => {
            const Icon = p.icon
            return (
              <button
                key={p.id}
                onClick={() => setPreviewPlatform(p.id)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  previewPlatform === p.id
                    ? 'bg-white text-warm-800 shadow-sm'
                    : 'text-warm-500 hover:text-warm-700'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${previewPlatform === p.id ? p.color : ''}`} />
                {p.label}
              </button>
            )
          })}
        </div>

        {/* Preview card */}
        <Card className="overflow-hidden">
          {/* Fake platform header */}
          <div className="flex items-center gap-3 border-b border-warm-100 p-4">
            <div className="h-10 w-10 rounded-full bg-warm-200" />
            <div>
              <p className="text-[13px] font-semibold text-warm-800">Your Brand</p>
              <p className="text-[11px] text-warm-400">@yourbrand</p>
            </div>
          </div>

          {/* Content preview */}
          <div className="p-4">
            {content ? (
              <p className="whitespace-pre-wrap text-sm text-warm-700">{content}</p>
            ) : (
              <p className="text-sm text-warm-400 italic">Your post will preview here as you type...</p>
            )}
          </div>

          {/* Fake engagement bar */}
          <div className="flex items-center gap-6 border-t border-warm-100 px-4 py-3 text-warm-400">
            <span className="text-[12px]">0 likes</span>
            <span className="text-[12px]">0 comments</span>
            <span className="text-[12px]">0 shares</span>
          </div>
        </Card>
      </div>

      {/* Bottom bar (sticky on mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 flex items-center gap-3 border-t border-warm-200 bg-white px-6 py-3 lg:hidden">
        <Button variant="outline" size="sm" className="flex-1">Save Draft</Button>
        <Button variant="outline" size="sm" className="flex-1">Schedule</Button>
        <Button size="sm" className="flex-1">Publish Now</Button>
      </div>
    </div>
  )
}
