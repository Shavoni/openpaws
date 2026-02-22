'use client'

import { Palette, Sparkles, Globe, Plus, X, Loader2, Check } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useState, useRef, useCallback } from 'react'

const toneOptions = ['Confident', 'Warm', 'Educational', 'Playful', 'Professional', 'Witty', 'Bold', 'Empathetic']

export default function BrandPage() {
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState<string | null>(null)
  const [analyzeSuccess, setAnalyzeSuccess] = useState(false)

  const [brandName, setBrandName] = useState('')
  const [brandVoice, setBrandVoice] = useState('')
  const [selectedTones, setSelectedTones] = useState<string[]>([])
  const [targetAudience, setTargetAudience] = useState('')
  const [topicsInclude, setTopicsInclude] = useState<string[]>([])
  const [topicsExclude, setTopicsExclude] = useState<string[]>([])
  const [newTopicInclude, setNewTopicInclude] = useState('')
  const [newTopicExclude, setNewTopicExclude] = useState('')
  const [examplePosts, setExamplePosts] = useState<string[]>([])
  const [newExamplePost, setNewExamplePost] = useState('')
  const [restyling, setRestyling] = useState(false)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)

  const restyleAbort = useRef<AbortController | null>(null)

  const handleRestyle = useCallback(async (tones: string[], name: string, audience: string, topics: string[]) => {
    if (!tones.length || !name) return

    // Cancel any in-flight restyle
    if (restyleAbort.current) restyleAbort.current.abort()
    const controller = new AbortController()
    restyleAbort.current = controller

    setRestyling(true)
    try {
      const response = await fetch('/api/brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'restyle',
          brandName: name,
          targetAudience: audience,
          topicsInclude: topics,
          tones: tones.map(t => t.toLowerCase()),
        }),
        signal: controller.signal,
      })

      const data = await response.json()
      if (!controller.signal.aborted) {
        if (data.brandVoice) setBrandVoice(data.brandVoice)
        if (data.examplePosts?.length) setExamplePosts(data.examplePosts)
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      console.error('[Restyle]', err)
    } finally {
      if (!controller.signal.aborted) setRestyling(false)
    }
  }, [])

  function toggleTone(tone: string) {
    setSelectedTones(prev => {
      const next = prev.includes(tone) ? prev.filter(t => t !== tone) : [...prev, tone]
      // Trigger live restyle if we have brand context
      if (hasAnalyzed && next.length > 0) {
        handleRestyle(next, brandName, targetAudience, topicsInclude)
      }
      return next
    })
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

  async function handleAnalyze() {
    if (!websiteUrl.trim()) return

    setAnalyzing(true)
    setAnalyzeError(null)
    setAnalyzeSuccess(false)

    try {
      const response = await fetch('/api/brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: websiteUrl.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed')
      }

      // Auto-fill the form with AI results
      if (data.brandName) setBrandName(data.brandName)
      if (data.brandVoice) {
        const voice = data.brandGuidelines
          ? data.brandVoice + '\n\n' + data.brandGuidelines
          : data.brandVoice
        setBrandVoice(voice)
      }
      if (data.brandTone) {
        const matchedTone = toneOptions.find(t => t.toLowerCase() === data.brandTone.toLowerCase())
        if (matchedTone) setSelectedTones([matchedTone])
      }
      if (data.targetAudience) setTargetAudience(data.targetAudience)
      if (data.topicsInclude?.length) setTopicsInclude(data.topicsInclude)
      if (data.topicsExclude?.length) setTopicsExclude(data.topicsExclude)
      if (data.examplePosts?.length) setExamplePosts(data.examplePosts)
      if (data.metadata?.model) {
        console.log('[Brand Analyze] Filled from', data.metadata.provider, data.metadata.model)
      }

      setHasAnalyzed(true)
      setAnalyzeSuccess(true)
      setTimeout(() => setAnalyzeSuccess(false), 3000)
    } catch (err) {
      setAnalyzeError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setAnalyzing(false)
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
          <Input
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://yourbrand.com"
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
          />
          <Button
            onClick={handleAnalyze}
            disabled={analyzing || !websiteUrl.trim()}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : analyzeSuccess ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Done
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Analyze
              </>
            )}
          </Button>
        </div>
        {analyzeError && (
          <p className="mt-2 text-[13px] text-red-500">{analyzeError}</p>
        )}
        {analyzeSuccess && (
          <p className="mt-2 text-[13px] text-green-600">Brand settings auto-filled from analysis.</p>
        )}
      </Card>

      {/* Brand Identity */}
      <Card className="p-5 space-y-5">
        <h3 className="text-lg font-semibold font-display text-warm-800 flex items-center gap-2">
          <Palette className="h-5 w-5 text-orange-500" />
          Brand Identity
        </h3>

        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-warm-700">Brand Name</label>
          <Input
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="Your brand or company name"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <label className="text-[13px] font-medium text-warm-700">Brand Voice</label>
            {restyling && <Loader2 className="h-3 w-3 animate-spin text-orange-500" />}
          </div>
          <Textarea
            value={brandVoice}
            onChange={(e) => setBrandVoice(e.target.value)}
            placeholder="Describe your brand's voice... e.g., Professional but approachable, witty without being sarcastic, educational and empowering"
            className={`min-h-[100px] transition-opacity ${restyling ? 'opacity-60' : ''}`}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-[13px] font-medium text-warm-700">Tone</label>
            {restyling && (
              <span className="flex items-center gap-1 text-[12px] text-orange-500">
                <Loader2 className="h-3 w-3 animate-spin" />
                Restyling...
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {toneOptions.map(tone => (
              <button
                key={tone}
                onClick={() => toggleTone(tone)}
                disabled={restyling}
                className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all ${
                  selectedTones.includes(tone)
                    ? 'bg-orange-500 text-white'
                    : 'bg-warm-100 text-warm-600 hover:bg-warm-200'
                } ${restyling ? 'opacity-60 cursor-wait' : ''}`}
              >
                {tone}
              </button>
            ))}
          </div>
          {hasAnalyzed && (
            <p className="text-[11px] text-warm-400">Click a tone to regenerate voice and example posts.</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-warm-700">Target Audience</label>
          <Textarea
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
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
      <Card className={`p-5 space-y-4 transition-opacity ${restyling ? 'opacity-60' : ''}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold font-display text-warm-800">Example Posts</h3>
            <p className="text-[13px] text-warm-500 mt-1">
              {restyling ? 'Generating posts in new tone...' : 'Paste your best posts so AI learns your voice.'}
            </p>
          </div>
          {restyling && <Loader2 className="h-4 w-4 animate-spin text-orange-500" />}
        </div>
        {examplePosts.map((post, i) => (
          <div key={i} className="relative group">
            <div className="rounded-lg border border-warm-200 bg-warm-50 p-3 text-[13px] text-warm-700 pr-8">
              {post}
            </div>
            <button
              onClick={() => setExamplePosts(prev => prev.filter((_, idx) => idx !== i))}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 rounded-full p-1 hover:bg-warm-200 transition-opacity"
            >
              <X className="h-3 w-3 text-warm-500" />
            </button>
          </div>
        ))}
        <Textarea
          value={newExamplePost}
          onChange={(e) => setNewExamplePost(e.target.value)}
          placeholder="Paste an example post here..."
          className="min-h-[80px]"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (newExamplePost.trim()) {
              setExamplePosts(prev => [...prev, newExamplePost.trim()])
              setNewExamplePost('')
            }
          }}
        >
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
