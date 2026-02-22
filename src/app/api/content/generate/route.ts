import { NextRequest, NextResponse } from 'next/server'
import { generateContent, generateVariations, repurposeContent, scorePost } from '@/lib/ai/content-generator'
import type { BrandSettings, Platform } from '@/types'

interface GenerateRequest {
  action: 'generate' | 'variations' | 'repurpose' | 'score'
  prompt?: string
  content?: string
  platform: Platform
  sourcePlatform?: Platform
  brand?: BrandSettings | null
  contentType?: string
  mood?: string
  variationCount?: number
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()

    if (!body.platform) {
      return NextResponse.json({ error: 'platform is required' }, { status: 400 })
    }

    const action = body.action || 'generate'

    if (action === 'generate') {
      if (!body.prompt) {
        return NextResponse.json({ error: 'prompt is required for generation' }, { status: 400 })
      }

      const result = await generateContent({
        prompt: body.prompt,
        platform: body.platform,
        brand: body.brand || null,
        contentType: body.contentType,
        mood: body.mood,
      })

      return NextResponse.json({
        content: result.content,
        metadata: {
          provider: result.provider,
          model: result.model,
          tokensUsed: result.tokensUsed,
          costUsd: result.costUsd,
          durationMs: result.durationMs,
        },
      })
    }

    if (action === 'variations') {
      if (!body.content) {
        return NextResponse.json({ error: 'content is required for variations' }, { status: 400 })
      }

      const result = await generateVariations(
        body.content,
        body.platform,
        body.brand || null,
        body.variationCount || 3
      )

      // Parse variations from response
      const variations = result.content
        .split(/---VARIATION \d+---/)
        .map((v) => v.trim())
        .filter(Boolean)

      return NextResponse.json({
        variations,
        metadata: {
          provider: result.provider,
          model: result.model,
          tokensUsed: result.tokensUsed,
          costUsd: result.costUsd,
          durationMs: result.durationMs,
        },
      })
    }

    if (action === 'repurpose') {
      if (!body.content || !body.sourcePlatform) {
        return NextResponse.json(
          { error: 'content and sourcePlatform are required for repurposing' },
          { status: 400 }
        )
      }

      const result = await repurposeContent(
        body.content,
        body.sourcePlatform,
        body.platform,
        body.brand || null
      )

      return NextResponse.json({
        content: result.content,
        metadata: {
          provider: result.provider,
          model: result.model,
          tokensUsed: result.tokensUsed,
          costUsd: result.costUsd,
          durationMs: result.durationMs,
        },
      })
    }

    if (action === 'score') {
      if (!body.content) {
        return NextResponse.json({ error: 'content is required for scoring' }, { status: 400 })
      }

      const result = await scorePost(body.content, body.platform)

      return NextResponse.json(result)
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI generation failed'
    console.error('[AI Generate]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
