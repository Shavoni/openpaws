'use client'

import { useState } from 'react'
import { Sparkles, Loader2, Wand2, Copy, Check, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Platform, BrandSettings } from '@/types'

interface AIGeneratePanelProps {
  platform: Platform
  brand?: BrandSettings | null
  onInsert: (content: string) => void
}

const MOODS = ['Informative', 'Entertaining', 'Inspirational', 'Controversial', 'Storytelling', 'Educational']
const CONTENT_TYPES = ['Post', 'Thread', 'Announcement', 'Question', 'Behind-the-scenes', 'Tip/Hack']

export function AIGeneratePanel({ platform, brand, onInsert }: AIGeneratePanelProps) {
  const [prompt, setPrompt] = useState('')
  const [mood, setMood] = useState<string | null>(null)
  const [contentType, setContentType] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<{ provider: string; model: string; durationMs: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleGenerate() {
    if (!prompt.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          prompt: prompt.trim(),
          platform,
          brand: brand || null,
          contentType: contentType || undefined,
          mood: mood || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed')
      }

      setResult(data.content)
      setMetadata(data.metadata)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    if (!result) return
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleInsert() {
    if (result) onInsert(result)
  }

  return (
    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-orange-500" />
        <span className="text-sm font-semibold text-orange-700">AI Content Generator</span>
        {metadata && (
          <Badge variant="outline" className="ml-auto text-[10px] text-orange-500 border-orange-200">
            {metadata.provider} &middot; {metadata.durationMs}ms
          </Badge>
        )}
      </div>

      {/* Prompt input */}
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe what you want to post about..."
        className="mb-3 min-h-[80px] border-orange-200 bg-white text-sm placeholder:text-warm-400 focus:border-orange-300 focus:ring-orange-200"
      />

      {/* Mood selector */}
      <div className="mb-3">
        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-orange-600">Mood</p>
        <div className="flex flex-wrap gap-1.5">
          {MOODS.map((m) => (
            <button
              key={m}
              onClick={() => setMood(mood === m ? null : m)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                mood === m
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-warm-600 hover:bg-orange-100'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Content type selector */}
      <div className="mb-3">
        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-orange-600">Content Type</p>
        <div className="flex flex-wrap gap-1.5">
          {CONTENT_TYPES.map((ct) => (
            <button
              key={ct}
              onClick={() => setContentType(contentType === ct ? null : ct)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                contentType === ct
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-warm-600 hover:bg-orange-100'
              }`}
            >
              {ct}
            </button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <Button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        className="mb-3 w-full bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" />
            Generate Content
          </>
        )}
      </Button>

      {/* Error */}
      {error && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-[13px] text-red-600">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="rounded-lg border border-orange-200 bg-white p-3">
          <p className="mb-3 whitespace-pre-wrap text-sm text-warm-700">{result}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleCopy} className="text-[12px]">
              {copied ? <Check className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button size="sm" onClick={handleInsert} className="bg-orange-500 text-[12px] text-white hover:bg-orange-600">
              Use This Content
            </Button>
            <Button size="sm" variant="outline" onClick={handleGenerate} className="ml-auto text-[12px]">
              <RefreshCw className="mr-1 h-3 w-3" />
              Regenerate
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
