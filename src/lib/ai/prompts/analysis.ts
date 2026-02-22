import type { Post, Platform } from '@/types'

export function buildAnalysisPrompt(posts: Post[], platform?: Platform): string {
  let prompt = `You are a social media analytics expert. Analyze the following post performance data and provide actionable insights.`

  if (platform) {
    prompt += ` Focus on ${platform.charAt(0).toUpperCase() + platform.slice(1)} specifically.`
  }

  prompt += `\n\nPOST DATA:`

  for (const post of posts.slice(0, 20)) {
    prompt += `\n\n- Platform: ${post.platform}`
    prompt += `\n  Content: "${post.content.slice(0, 200)}${post.content.length > 200 ? '...' : ''}"`
    prompt += `\n  Source: ${post.source_type}`
    if (post.metrics) {
      prompt += `\n  Likes: ${post.metrics.likes || 0} | Comments: ${post.metrics.comments || 0} | Shares: ${post.metrics.shares || 0} | Views: ${post.metrics.views || 0}`
    }
    if (post.engagement_rate) prompt += `\n  Engagement: ${(post.engagement_rate * 100).toFixed(2)}%`
    if (post.viral_score) prompt += `\n  Viral Score: ${post.viral_score}`
  }

  prompt += `\n\nProvide your analysis in this format:`
  prompt += `\n1. TOP PERFORMERS — What worked and why (2-3 insights)`
  prompt += `\n2. WEAK SPOTS — What underperformed and why (2-3 insights)`
  prompt += `\n3. RECOMMENDATIONS — Specific, actionable next steps (3-5 items)`
  prompt += `\n4. BEST POSTING PATTERNS — Timing, format, or content type observations`

  return prompt
}

export function buildPostScorePrompt(content: string, platform: Platform): string {
  return `Score this ${platform} post from 1-10 on viral potential. Consider hook strength, emotional resonance, shareability, and platform-specific best practices.\n\nPOST:\n"${content}"\n\nRespond with ONLY a JSON object: {"score": N, "reasoning": "one sentence why", "suggestions": ["improvement 1", "improvement 2"]}`
}
