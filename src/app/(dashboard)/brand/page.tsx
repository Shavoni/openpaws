'use client'

import { Palette, Sparkles, Globe, Plus, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

const toneOptions = ['Confident', 'Warm', 'Educational', 'Playful', 'Professional', 'Witty', 'Bold', 'Empathetic']

export default function BrandPage() {
  const [selectedTones, setSelectedTones] = useState<string[]>([])
  const [topicsInclude, setTopicsInclude] = useState<string[]>([])
  const [topicsExclude, setTopicsExclude] = useState<string[]>([])
  const [newTopicInclude, setNewTopicInclude] = useState('')
  const [newTopicExclude, setNewTopicExclude] = useState('')

  function toggleTone(tone: string) {
    setSelectedTones(prev =>
      prev.includes(tone) ? prev.filter(t => t !== tone) : [...prev, tone]
    )
  }

  function addTopic(type: 'include' | 'exclude') {
    if (type === 'include' && newTopicInclude.trim()) {
      setTopicsInclude(prev => [...prev, newTopicInclude.trim()])
      setNewTopicInclude('')
    }
    if (type === 'exclude' && newTopicExclude.trim()) {
      setTopicsExclude(prev => [...prev, newTopicExclude.trim()])
      setNewTopicExclude('')
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Website analyzer */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="h-4 w-4 text-warm-500" />
          <h3 className="text-[15px] font-semibold text-warm-800">Website URL</h3>
        </div>
        <p className="text-[13px] text-warm-500 mb-3">
          Enter your website and we&apos;ll analyze it to auto-fill your brand settings.
        </p>
        <div className="flex gap-2">
          <Input placeholder="https://yourbrand.com" className="flex-1" />
          <Button variant="ai" size="default">
            <Sparkles className="h-4 w-4" />
            Analyze
          </Button>
        </div>
      </Card>

      {/* Brand Identity */}
      <Card className="p-5 space-y-5">
        <h3 className="text-lg font-semibold font-display text-warm-800 flex items-center gap-2">
          <Palette className="h-5 w-5 text-orange-500" />
          Brand Identity
        </h3>

        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-warm-700">Brand Name</label>
          <Input placeholder="Your brand or company name" />
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-warm-700">Brand Voice</label>
          <Textarea
            placeholder="Describe your brand's voice... e.g., Professional but approachable, witty without being sarcastic, educational and empowering"
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-medium text-warm-700">Tone</label>
          <div className="flex flex-wrap gap-2">
            {toneOptions.map(tone => (
              <button
                key={tone}
                onClick={() => toggleTone(tone)}
                className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all ${
                  selectedTones.includes(tone)
                    ? 'bg-orange-500 text-white'
                    : 'bg-warm-100 text-warm-600 hover:bg-warm-200'
                }`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-warm-700">Target Audience</label>
          <Textarea
            placeholder="Describe your target audience... e.g., Small business owners aged 25-45 who are active on social media but struggle with consistency"
            className="min-h-[80px]"
          />
        </div>
      </Card>

      {/* Content Rules */}
      <Card className="p-5 space-y-5">
        <h3 className="text-lg font-semibold font-display text-warm-800">Content Rules</h3>

        <div className="space-y-2">
          <label className="text-[13px] font-medium text-warm-700">Topics to Cover</label>
          <div className="flex gap-2">
            <Input
              value={newTopicInclude}
              onChange={(e) => setNewTopicInclude(e.target.value)}
              placeholder="Add a topic..."
              onKeyDown={(e) => e.key === 'Enter' && addTopic('include')}
            />
            <Button variant="outline" size="icon" onClick={() => addTopic('include')}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {topicsInclude.map(topic => (
              <Badge key={topic} variant="outline" className="gap-1 pr-1">
                {topic}
                <button
                  onClick={() => setTopicsInclude(prev => prev.filter(t => t !== topic))}
                  className="rounded-full p-0.5 hover:bg-warm-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-medium text-warm-700">Topics to Avoid</label>
          <div className="flex gap-2">
            <Input
              value={newTopicExclude}
              onChange={(e) => setNewTopicExclude(e.target.value)}
              placeholder="Add a topic to avoid..."
              onKeyDown={(e) => e.key === 'Enter' && addTopic('exclude')}
            />
            <Button variant="outline" size="icon" onClick={() => addTopic('exclude')}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {topicsExclude.map(topic => (
              <Badge key={topic} variant="destructive" className="gap-1 pr-1">
                {topic}
                <button
                  onClick={() => setTopicsExclude(prev => prev.filter(t => t !== topic))}
                  className="rounded-full p-0.5 hover:bg-red-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Example Posts */}
      <Card className="p-5 space-y-4">
        <div>
          <h3 className="text-lg font-semibold font-display text-warm-800">Example Posts</h3>
          <p className="text-[13px] text-warm-500 mt-1">
            Paste your best posts so AI learns your voice.
          </p>
        </div>
        <Textarea placeholder="Paste an example post here..." className="min-h-[80px]" />
        <Button variant="outline" size="sm">
          <Plus className="h-3.5 w-3.5" />
          Add Example Post
        </Button>
      </Card>

      {/* Save */}
      <div className="flex justify-end pt-2 pb-8">
        <Button size="lg">Save Brand Settings</Button>
      </div>
    </div>
  )
}
