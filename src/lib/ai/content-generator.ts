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
        content: 'You are a brand strategist. Analyze the brand from the given URL and return ONLY valid JSON, no markdown, no code fences, no explanation. Just the raw JSON object.',
      },
      {
        role: 'user',
        content: `Analyze this brand: ${url}

Return ONLY this JSON structure (no markdown, no code fences):
{
  "brandName": "the brand or creator name",
  "brandVoice": "2-3 sentences describing how they communicate",
  "brandTone": "one of: confident, warm, educational, playful, professional, witty, bold, empathetic",
  "targetAudience": "1-2 sentences describing who they talk to",
  "topicsInclude": ["topic1", "topic2", "topic3", "topic4", "topic5"],
  "topicsExclude": ["topic to avoid 1", "topic to avoid 2", "topic to avoid 3"],
  "brandGuidelines": "2-3 sentences on content dos and don'ts",
  "examplePosts": ["A sample social media post written in this brand's voice", "Another sample post in their style"]
}`,
      },
    ],
    { maxTokens: 1024, temperature: 0.5 }
  )

  return mapResult(response)
}

export interface RestyleBrandRequest {
  brandName: string
  targetAudience: string
  topicsInclude: string[]
  tones: string[]
}

export async function restyleBrand(req: RestyleBrandRequest): Promise<GenerateContentResult> {
  const toneList = req.tones.join(', ')
  const topicList = req.topicsInclude.join(', ')

  const response = await generateAI(
    [
      {
        role: 'system',
        content: 'You are a brand voice specialist. Rewrite brand content to match a specific tone. Return ONLY valid JSON, no markdown, no code fences.',
      },
      {
        role: 'user',
        content: `Brand: ${req.brandName}
Audience: ${req.targetAudience}
Topics: ${topicList}
Desired tone: ${toneList}

Rewrite the brand voice description and example posts to match the "${toneList}" tone.

Return ONLY this JSON (no markdown, no code fences):
{
  "brandVoice": "2-3 sentences describing how this brand communicates in a ${toneList} tone",
  "examplePosts": ["A social media post in a ${toneList} tone for this brand", "Another ${toneList} post for this brand", "A third ${toneList} post for this brand"]
}`,
      },
    ],
    { maxTokens: 512, temperature: 0.8 }
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
