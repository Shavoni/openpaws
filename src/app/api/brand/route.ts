import { NextRequest, NextResponse } from 'next/server'
import { analyzeBrand } from '@/lib/ai/brand-analyzer'
import { restyleBrand } from '@/lib/ai/content-generator'

export async function GET() {
  return NextResponse.json({ data: null })
}

export async function PUT() {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}

// POST /api/brand — analyze or restyle brand
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Restyle action — regenerate voice + posts for a new tone
    if (body.action === 'restyle') {
      const { brandName, targetAudience, topicsInclude, tones } = body

      if (!tones?.length) {
        return NextResponse.json({ error: 'tones is required' }, { status: 400 })
      }

      const result = await restyleBrand({
        brandName: brandName || 'This brand',
        targetAudience: targetAudience || '',
        topicsInclude: topicsInclude || [],
        tones,
      })

      // Parse the JSON from the AI response
      const jsonStr = result.content
        .replace(/^```(?:json)?\s*/m, '')
        .replace(/\s*```\s*$/m, '')
        .trim()

      let parsed
      try {
        parsed = JSON.parse(jsonStr)
      } catch {
        return NextResponse.json({
          brandVoice: result.content,
          examplePosts: [],
        })
      }

      return NextResponse.json({
        brandVoice: parsed.brandVoice || '',
        examplePosts: Array.isArray(parsed.examplePosts) ? parsed.examplePosts : [],
        metadata: { provider: result.provider, model: result.model },
      })
    }

    // Default: analyze a URL
    const { url } = body

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'url is required' }, { status: 400 })
    }

    const result = await analyzeBrand(url)

    return NextResponse.json({
      brandName: result.brandName,
      brandVoice: result.brandVoice,
      brandTone: result.brandTone,
      targetAudience: result.targetAudience,
      topicsInclude: result.topicsInclude,
      topicsExclude: result.topicsExclude,
      brandGuidelines: result.brandGuidelines,
      examplePosts: result.examplePosts,
      metadata: {
        provider: result.provider,
        model: result.model,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Brand analysis failed'
    console.error('[Brand API]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
