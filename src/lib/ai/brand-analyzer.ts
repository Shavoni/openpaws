import { analyzeBrandFromUrl } from './content-generator'

export interface BrandAnalysisResult {
  brandName: string
  brandVoice: string
  brandTone: string
  targetAudience: string
  topicsInclude: string[]
  topicsExclude: string[]
  brandGuidelines: string
  examplePosts: string[]
  provider: string
  model: string
}

export async function analyzeBrand(websiteUrl: string): Promise<BrandAnalysisResult> {
  const result = await analyzeBrandFromUrl(websiteUrl)
  return parseBrandAnalysis(result.content, result.provider, result.model)
}

const VALID_TONES = ['confident', 'warm', 'educational', 'playful', 'professional', 'witty', 'bold', 'empathetic']

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/^#+\s*/gm, '')
    .replace(/`/g, '')
    .trim()
}

function parseBrandAnalysis(content: string, provider: string, model: string): BrandAnalysisResult {
  // Try JSON parse first (strip code fences if present)
  const jsonStr = content
    .replace(/^```(?:json)?\s*/m, '')
    .replace(/\s*```\s*$/m, '')
    .trim()

  try {
    const parsed = JSON.parse(jsonStr)
    const tone = String(parsed.brandTone || '').toLowerCase().trim()
    return {
      brandName: stripMarkdown(String(parsed.brandName || '')),
      brandVoice: stripMarkdown(String(parsed.brandVoice || '')),
      brandTone: VALID_TONES.includes(tone) ? tone : 'professional',
      targetAudience: stripMarkdown(String(parsed.targetAudience || '')),
      topicsInclude: Array.isArray(parsed.topicsInclude)
        ? parsed.topicsInclude.map((t: unknown) => stripMarkdown(String(t))).filter(Boolean)
        : [],
      topicsExclude: Array.isArray(parsed.topicsExclude)
        ? parsed.topicsExclude.map((t: unknown) => stripMarkdown(String(t))).filter(Boolean)
        : [],
      brandGuidelines: stripMarkdown(String(parsed.brandGuidelines || '')),
      examplePosts: Array.isArray(parsed.examplePosts)
        ? parsed.examplePosts.map((p: unknown) => stripMarkdown(String(p))).filter(Boolean)
        : [],
      provider,
      model,
    }
  } catch {
    // Fall through to line-based parsing
  }

  // Fallback: line-based parsing for non-JSON responses
  const sections = {
    brandName: '',
    brandVoice: '',
    brandTone: '',
    targetAudience: '',
    topicsInclude: [] as string[],
    topicsExclude: [] as string[],
    brandGuidelines: '',
    examplePosts: [] as string[],
  }

  const lines = content.split('\n')
  let currentSection = ''

  for (const rawLine of lines) {
    const line = stripMarkdown(rawLine)
    const lower = line.toLowerCase()

    if (lower.includes('brand voice') || (lower.includes('voice') && lower.includes(':'))) {
      currentSection = 'voice'
      const value = extractValue(line)
      if (value) sections.brandVoice = value
    } else if (lower.includes('tone') && lower.includes(':')) {
      currentSection = 'tone'
      const value = extractValue(line)
      if (value) sections.brandTone = value.toLowerCase().replace(/[^a-z]/g, '')
    } else if (lower.includes('target audience') || lower.includes('audience:')) {
      currentSection = 'audience'
      const value = extractValue(line)
      if (value) sections.targetAudience = value
    } else if (lower.includes('key topics') || lower.includes('topics:') || lower.includes('topics include')) {
      currentSection = 'topics'
    } else if (lower.includes('guidelines') || lower.includes('dos and don')) {
      currentSection = 'guidelines'
      const value = extractValue(line)
      if (value) sections.brandGuidelines = value
    } else if (line.startsWith('-') || line.startsWith('•') || /^\d+[\.\)]/.test(line)) {
      const item = line.replace(/^[-•*]\s*/, '').replace(/^\d+[\.\)]\s*/, '').trim()
      if (currentSection === 'topics' && item) {
        sections.topicsInclude.push(item)
      } else if (currentSection === 'guidelines' && item) {
        sections.brandGuidelines += (sections.brandGuidelines ? '\n' : '') + item
      } else if (currentSection === 'voice' && item) {
        sections.brandVoice += (sections.brandVoice ? ' ' : '') + item
      } else if (currentSection === 'audience' && item) {
        sections.targetAudience += (sections.targetAudience ? ', ' : '') + item
      }
    } else if (line.trim() && currentSection) {
      // Continuation line — append to current section
      if (currentSection === 'voice') sections.brandVoice += ' ' + line.trim()
      else if (currentSection === 'audience') sections.targetAudience += ' ' + line.trim()
      else if (currentSection === 'guidelines') sections.brandGuidelines += ' ' + line.trim()
    }
  }

  if (!VALID_TONES.includes(sections.brandTone)) {
    sections.brandTone = 'professional'
  }

  return { ...sections, provider, model }
}

function extractValue(line: string): string {
  // Find the last colon that precedes actual content (skip colons inside markdown)
  const match = line.match(/[^:]*:\s*(.+)/)
  if (match) {
    return match[1].trim()
  }
  return ''
}
