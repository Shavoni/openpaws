import type { BrandSettings, Platform, Post } from '@/types'
import { generateAI, estimateCostUsd, type AIResponse } from './router'
import { buildContentSystemPrompt, buildContentUserPrompt, buildVariationsPrompt } from './prompts/content'
import { buildRepurposePrompt } from './prompts/repurpose'
import { buildAnalysisPrompt, buildPostScorePrompt } from './prompts/analysis'

export interface GenerateContentRequest {
  prompt: string
  platform: Platform
  brand: BrandSettings | null
  contentType?: string
  mood?: string
}

export interface GenerateContentResult {
  content: string
  provider: string
  model: string
  tokensUsed: number
  costUsd: number
  durationMs: number
}

export async function generateContent(req: GenerateContentRequest): Promise<GenerateContentResult> {
  const systemPrompt = buildContentSystemPrompt(req.brand, req.platform)
  const userPrompt = buildContentUserPrompt(req.prompt, {
    contentType: req.contentType,
    mood: req.mood,
  })

  const response = await generateAI(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    { maxTokens: 1024, temperature: 0.8 }
  )

  return mapResult(response)
}

export async function generateVariations(
  content: string,
  platform: Platform,
  brand: BrandSettings | null,
  count: number = 3
): Promise<GenerateContentResult> {
  const systemPrompt = buildContentSystemPrompt(brand, platform)
  const userPrompt = buildVariationsPrompt(content, platform, count)

  const response = await generateAI(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    { maxTokens: 2048, temperature: 0.9 }
  )

  return mapResult(response)
}

export async function repurposeContent(
  content: string,
  sourcePlatform: Platform,
  targetPlatform: Platform,
  brand: BrandSettings | null
): Promise<GenerateContentResult> {
  const prompt = buildRepurposePrompt(content, sourcePlatform, targetPlatform, brand)

  const response = await generateAI(
    [
      { role: 'system', content: 'You are an expert social media content repurposing assistant.' },
      { role: 'user', content: prompt },
    ],
    { maxTokens: 1024, temperature: 0.7 }
  )

  return mapResult(response)
}

export async function analyzePerformance(
  posts: Post[],
  platform?: Platform
): Promise<GenerateContentResult> {
  const prompt = buildAnalysisPrompt(posts, platform)

  const response = await generateAI(
    [
      { role: 'system', content: 'You are a social media analytics expert.' },
      { role: 'user', content: prompt },
    ],
    { maxTokens: 2048, temperature: 0.5 }
  )

  return mapResult(response)
}

export async function scorePost(
  content: string,
  platform: Platform
): Promise<{ score: number; reasoning: string; suggestions: string[] }> {
  const prompt = buildPostScorePrompt(content, platform)

  const response = await generateAI(
    [
      { role: 'system', content: 'You are a viral content scoring engine. Respond only in valid JSON.' },
      { role: 'user', content: prompt },
    ],
    { maxTokens: 256, temperature: 0.3 }
  )

  try {
    return JSON.parse(response.content)
  } catch {
    return { score: 5, reasoning: 'Unable to parse score', suggestions: [] }
  }
}

export async function analyzeBrandFromUrl(url: string): Promise<GenerateContentResult> {
  const response = await generateAI(
    [
      {
        role: 'system',
        content: 'You are a brand strategist. Analyze the brand described and extract: brand voice, tone, target audience, key topics, and content guidelines. Respond in structured format.',
      },
      {
        role: 'user',
        content: `Analyze this brand's website and extract their brand identity: ${url}\n\nProvide:\n- Brand Voice (2-3 sentences describing how they communicate)\n- Tone (one word: professional, casual, witty, inspirational, educational, bold, friendly, authoritative)\n- Target Audience (who they're talking to)\n- Key Topics (5-10 topics they cover)\n- Content Guidelines (dos and don'ts based on their style)`,
      },
    ],
    { maxTokens: 1024, temperature: 0.5 }
  )

  return mapResult(response)
}

function mapResult(response: AIResponse): GenerateContentResult {
  return {
    content: response.content,
    provider: response.provider,
    model: response.model,
    tokensUsed: response.usage.totalTokens,
    costUsd: estimateCostUsd(response),
    durationMs: response.durationMs,
  }
}
