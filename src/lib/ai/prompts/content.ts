import type { BrandSettings, Platform } from '@/types'
import { PLATFORM_CHAR_LIMITS } from '@/lib/constants'

export function buildContentSystemPrompt(brand: BrandSettings | null, platform: Platform): string {
  const charLimit = PLATFORM_CHAR_LIMITS[platform] || 2200
  const platformName = platform.charAt(0).toUpperCase() + platform.slice(1)

  let prompt = `You are an expert social media content creator for ${platformName}.`

  if (brand) {
    prompt += `\n\nBRAND CONTEXT:`
    if (brand.brand_name) prompt += `\n- Brand: ${brand.brand_name}`
    if (brand.brand_voice) prompt += `\n- Voice: ${brand.brand_voice}`
    if (brand.brand_tone) prompt += `\n- Tone: ${brand.brand_tone}`
    if (brand.target_audience) prompt += `\n- Target Audience: ${brand.target_audience}`
    if (brand.brand_guidelines) prompt += `\n- Guidelines: ${brand.brand_guidelines}`
    if (brand.topics_include?.length) prompt += `\n- Cover these topics: ${brand.topics_include.join(', ')}`
    if (brand.topics_exclude?.length) prompt += `\n- Avoid these topics: ${brand.topics_exclude.join(', ')}`
    if (brand.hashtag_sets && Object.keys(brand.hashtag_sets).length > 0) {
      const tags = brand.hashtag_sets[platform] || brand.hashtag_sets['default'] || []
      if (tags.length) prompt += `\n- Preferred hashtags: ${tags.join(' ')}`
    }
    if (brand.example_posts?.length) {
      prompt += `\n\nEXAMPLE POSTS (match this style):`
      brand.example_posts.slice(0, 3).forEach((ex, i) => {
        prompt += `\n${i + 1}. "${ex.content}"`
      })
    }
  }

  prompt += `\n\nPLATFORM RULES for ${platformName}:`
  prompt += `\n- Character limit: ${charLimit}`
  prompt += `\n- Write content optimized for ${platformName}'s algorithm and audience behavior`

  if (platform === 'twitter') {
    prompt += `\n- Keep it punchy and conversational`
    prompt += `\n- Use 1-3 relevant hashtags max`
    prompt += `\n- Threads are ok for longer ideas — indicate with (1/n) format`
  } else if (platform === 'linkedin') {
    prompt += `\n- Professional but human — avoid corporate jargon`
    prompt += `\n- Open with a hook line that stops the scroll`
    prompt += `\n- Use line breaks for readability`
    prompt += `\n- End with a question or call to action`
  } else if (platform === 'instagram') {
    prompt += `\n- Visual-first — describe ideal image/carousel if relevant`
    prompt += `\n- Use 5-15 relevant hashtags at the end`
    prompt += `\n- Include a clear CTA (save, share, comment)`
  } else if (platform === 'tiktok') {
    prompt += `\n- Script format for video — include hook, body, CTA`
    prompt += `\n- Trending audio suggestions welcome`
    prompt += `\n- Keep it authentic and unpolished`
  } else if (platform === 'youtube') {
    prompt += `\n- Include title, description, and tags`
    prompt += `\n- SEO-optimized description with keywords`
  } else if (platform === 'facebook') {
    prompt += `\n- Community-oriented, conversation-starting`
    prompt += `\n- Questions and polls perform well`
  }

  prompt += `\n\nRESPOND WITH ONLY THE POST CONTENT. No explanations, no meta-commentary. Just the ready-to-publish text.`

  return prompt
}

export function buildContentUserPrompt(
  userInput: string,
  options?: { contentType?: string; mood?: string }
): string {
  let prompt = userInput

  if (options?.contentType) {
    prompt = `Create a ${options.contentType} post about: ${userInput}`
  }
  if (options?.mood) {
    prompt += `\n\nMood/energy: ${options.mood}`
  }

  return prompt
}

export function buildVariationsPrompt(
  originalContent: string,
  platform: Platform,
  count: number = 3
): string {
  return `Here's an existing ${platform} post:\n\n"${originalContent}"\n\nCreate ${count} different variations of this post. Each should have a different angle or hook but convey the same core message.\n\nFormat:\n---VARIATION 1---\n[content]\n---VARIATION 2---\n[content]\n---VARIATION 3---\n[content]`
}
