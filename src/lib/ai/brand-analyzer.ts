import type { BrandSettings } from '@/types'
import { analyzeBrandFromUrl } from './content-generator'

export interface BrandAnalysisResult {
  brandVoice: string
  brandTone: string
  targetAudience: string
  topicsInclude: string[]
  brandGuidelines: string
  provider: string
  model: string
}

export async function analyzeBrand(websiteUrl: string): Promise<BrandAnalysisResult> {
  const result = await analyzeBrandFromUrl(websiteUrl)
  return parseBrandAnalysis(result.content, result.provider, result.model)
}

function parseBrandAnalysis(content: string, provider: string, model: string): BrandAnalysisResult {
  const sections = {
    brandVoice: '',
    brandTone: '',
    targetAudience: '',
    topicsInclude: [] as string[],
    brandGuidelines: '',
  }

  const lines = content.split('\n')
  let currentSection = ''

  for (const line of lines) {
    const lower = line.toLowerCase()

    if (lower.includes('brand voice') || lower.includes('voice:')) {
      currentSection = 'voice'
      const value = extractValue(line)
      if (value) sections.brandVoice = value
    } else if (lower.includes('tone:') || lower.includes('tone (')) {
      currentSection = 'tone'
      const value = extractValue(line)
      if (value) sections.brandTone = value.toLowerCase().replace(/[^a-z]/g, '')
    } else if (lower.includes('target audience') || lower.includes('audience:')) {
      currentSection = 'audience'
      const value = extractValue(line)
      if (value) sections.targetAudience = value
    } else if (lower.includes('key topics') || lower.includes('topics:')) {
      currentSection = 'topics'
    } else if (lower.includes('guidelines') || lower.includes('dos and don')) {
      currentSection = 'guidelines'
      const value = extractValue(line)
      if (value) sections.brandGuidelines = value
    } else if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
      const item = line.trim().replace(/^[-•*]\s*/, '')
      if (currentSection === 'topics' && item) {
        sections.topicsInclude.push(item)
      } else if (currentSection === 'guidelines' && item) {
        sections.brandGuidelines += (sections.brandGuidelines ? '\n' : '') + item
      } else if (currentSection === 'voice' && item) {
        sections.brandVoice += (sections.brandVoice ? ' ' : '') + item
      } else if (currentSection === 'audience' && item) {
        sections.targetAudience += (sections.targetAudience ? ', ' : '') + item
      }
    }
  }

  // Ensure tone is one of the valid presets
  const validTones = ['professional', 'casual', 'witty', 'inspirational', 'educational', 'bold', 'friendly', 'authoritative']
  if (!validTones.includes(sections.brandTone)) {
    sections.brandTone = 'professional'
  }

  return { ...sections, provider, model }
}

function extractValue(line: string): string {
  const colonIdx = line.indexOf(':')
  if (colonIdx >= 0) {
    return line.slice(colonIdx + 1).trim()
  }
  return ''
}
