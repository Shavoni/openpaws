import type { BrandSettings, Platform } from '@/types'
import { PLATFORM_CHAR_LIMITS } from '@/lib/constants'

export function buildRepurposePrompt(
  originalContent: string,
  sourcePlatform: Platform,
  targetPlatform: Platform,
  brand: BrandSettings | null
): string {
  const targetLimit = PLATFORM_CHAR_LIMITS[targetPlatform] || 2200
  const targetName = targetPlatform.charAt(0).toUpperCase() + targetPlatform.slice(1)
  const sourceName = sourcePlatform.charAt(0).toUpperCase() + sourcePlatform.slice(1)

  let prompt = `You are an expert at repurposing social media content across platforms.`

  if (brand) {
    prompt += `\n\nBRAND: ${brand.brand_name || 'Unknown'}`
    if (brand.brand_voice) prompt += ` | Voice: ${brand.brand_voice}`
    if (brand.brand_tone) prompt += ` | Tone: ${brand.brand_tone}`
  }

  prompt += `\n\nORIGINAL ${sourceName.toUpperCase()} POST:\n"${originalContent}"`

  prompt += `\n\nREPURPOSE this for ${targetName}.`
  prompt += `\n- Character limit: ${targetLimit}`
  prompt += `\n- Adapt the tone and format for ${targetName}'s audience`
  prompt += `\n- Keep the core message but optimize for the new platform`

  if (targetPlatform === 'twitter') {
    prompt += `\n- Make it concise and punchy`
  } else if (targetPlatform === 'linkedin') {
    prompt += `\n- Make it professional with a strong hook`
  } else if (targetPlatform === 'instagram') {
    prompt += `\n- Add relevant hashtags (5-15)`
  } else if (targetPlatform === 'tiktok') {
    prompt += `\n- Write as a video script with hook/body/CTA`
  }

  prompt += `\n\nRESPOND WITH ONLY THE REPURPOSED CONTENT. No explanations.`

  return prompt
}

export function buildBatchRepurposePrompt(
  originalContent: string,
  sourcePlatform: Platform,
  targetPlatforms: Platform[],
  brand: BrandSettings | null
): string {
  const sourceName = sourcePlatform.charAt(0).toUpperCase() + sourcePlatform.slice(1)

  let prompt = `You are an expert at repurposing social media content across platforms.`

  if (brand?.brand_name) {
    prompt += ` Brand: ${brand.brand_name}.`
    if (brand.brand_voice) prompt += ` Voice: ${brand.brand_voice}.`
  }

  prompt += `\n\nORIGINAL ${sourceName.toUpperCase()} POST:\n"${originalContent}"`

  prompt += `\n\nRepurpose this for each platform below. Adapt tone, length, and format for each.`

  for (const target of targetPlatforms) {
    const name = target.charAt(0).toUpperCase() + target.slice(1)
    const limit = PLATFORM_CHAR_LIMITS[target] || 2200
    prompt += `\n\n---${name.toUpperCase()} (max ${limit} chars)---`
  }

  prompt += `\n\nRespond in the exact format above, with content under each platform header.`

  return prompt
}
