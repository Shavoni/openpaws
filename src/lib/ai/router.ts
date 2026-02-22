import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

export type AIProvider = 'openclaw' | 'openai' | 'anthropic'

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AIResponse {
  content: string
  provider: AIProvider
  model: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  durationMs: number
}

// OpenClaw gateway (OpenAI-compatible API)
const openclawClient = process.env.OPENCLAW_API_URL
  ? new OpenAI({
      baseURL: process.env.OPENCLAW_API_URL + '/v1',
      apiKey: process.env.OPENCLAW_API_KEY || '',
    })
  : null

// Direct fallback clients
const openaiClient = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

const anthropicClient = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

async function callOpenclaw(
  messages: AIMessage[],
  options: { maxTokens?: number; temperature?: number } = {}
): Promise<AIResponse> {
  if (!openclawClient) throw new Error('OpenClaw not configured')

  const start = Date.now()
  const response = await openclawClient.chat.completions.create({
    model: 'openrouter/minimax/minimax-m2.5',
    messages,
    max_tokens: options.maxTokens ?? 2048,
    temperature: options.temperature ?? 0.7,
  })

  const choice = response.choices[0]
  return {
    content: choice.message.content || '',
    provider: 'openclaw',
    model: response.model || 'openclaw/default',
    usage: {
      promptTokens: response.usage?.prompt_tokens || 0,
      completionTokens: response.usage?.completion_tokens || 0,
      totalTokens: response.usage?.total_tokens || 0,
    },
    durationMs: Date.now() - start,
  }
}

async function callOpenai(
  messages: AIMessage[],
  options: { maxTokens?: number; temperature?: number } = {}
): Promise<AIResponse> {
  if (!openaiClient) throw new Error('OpenAI not configured')

  const start = Date.now()
  const response = await openaiClient.chat.completions.create({
    model: 'gpt-4o',
    messages,
    max_tokens: options.maxTokens ?? 2048,
    temperature: options.temperature ?? 0.7,
  })

  const choice = response.choices[0]
  return {
    content: choice.message.content || '',
    provider: 'openai',
    model: response.model,
    usage: {
      promptTokens: response.usage?.prompt_tokens || 0,
      completionTokens: response.usage?.completion_tokens || 0,
      totalTokens: response.usage?.total_tokens || 0,
    },
    durationMs: Date.now() - start,
  }
}

async function callAnthropic(
  messages: AIMessage[],
  options: { maxTokens?: number; temperature?: number } = {}
): Promise<AIResponse> {
  if (!anthropicClient) throw new Error('Anthropic not configured')

  const systemMessage = messages.find((m) => m.role === 'system')
  const chatMessages = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))

  const start = Date.now()
  const response = await anthropicClient.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: options.maxTokens ?? 2048,
    temperature: options.temperature ?? 0.7,
    system: systemMessage?.content || '',
    messages: chatMessages,
  })

  const textBlock = response.content.find((b) => b.type === 'text')
  return {
    content: textBlock?.text || '',
    provider: 'anthropic',
    model: response.model,
    usage: {
      promptTokens: response.usage.input_tokens,
      completionTokens: response.usage.output_tokens,
      totalTokens: response.usage.input_tokens + response.usage.output_tokens,
    },
    durationMs: Date.now() - start,
  }
}

// Priority: OpenClaw → OpenAI → Anthropic
const PROVIDER_CHAIN: Array<{
  name: AIProvider
  call: typeof callOpenclaw
}> = [
  { name: 'openclaw', call: callOpenclaw },
  { name: 'openai', call: callOpenai },
  { name: 'anthropic', call: callAnthropic },
]

export async function generateAI(
  messages: AIMessage[],
  options: { maxTokens?: number; temperature?: number } = {}
): Promise<AIResponse> {
  const errors: string[] = []

  for (const provider of PROVIDER_CHAIN) {
    try {
      return await provider.call(messages, options)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      errors.push(`${provider.name}: ${msg}`)
      continue
    }
  }

  throw new Error(`All AI providers failed:\n${errors.join('\n')}`)
}

export function estimateCostUsd(response: AIResponse): number {
  if (response.provider === 'openclaw') {
    // OpenClaw routes to cheapest — estimate based on OpenRouter pricing
    return (response.usage.promptTokens * 0.2 + response.usage.completionTokens * 0.6) / 1_000_000
  }
  if (response.provider === 'openai') {
    return (response.usage.promptTokens * 2.5 + response.usage.completionTokens * 10) / 1_000_000
  }
  if (response.provider === 'anthropic') {
    return (response.usage.promptTokens * 3 + response.usage.completionTokens * 15) / 1_000_000
  }
  return 0
}
