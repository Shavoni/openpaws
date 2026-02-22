import { NextResponse } from 'next/server'

// In-memory store for API layer (mirrors client Zustand via request bodies)
// In production, this would hit Supabase. For now, accepts client-side data.

export async function GET(request: Request) {
  const url = new URL(request.url)
  const year = url.searchParams.get('year')
  const month = url.searchParams.get('month')
  const date = url.searchParams.get('date')
  const status = url.searchParams.get('status')

  // Return filter params for client-side filtering
  // The Zustand store is the source of truth until Supabase is wired
  return NextResponse.json({
    data: [],
    filters: { year, month, date, status },
    message: 'Use client-side store. Supabase integration pending.',
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { platforms, content, scheduledAt, timeOfDay } = body

    if (!platforms?.length) {
      return NextResponse.json(
        { error: 'At least one platform is required' },
        { status: 400 }
      )
    }

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    if (!scheduledAt) {
      return NextResponse.json(
        { error: 'Scheduled date/time is required' },
        { status: 400 }
      )
    }

    // Validate date is in the future
    const scheduleDate = new Date(scheduledAt)
    if (scheduleDate <= new Date()) {
      return NextResponse.json(
        { error: 'Scheduled time must be in the future' },
        { status: 400 }
      )
    }

    // Return validated data for the client store to persist
    return NextResponse.json({
      data: {
        platforms,
        content,
        scheduledAt,
        timeOfDay: timeOfDay || 'custom',
        status: 'scheduled',
      },
      message: 'Post validated. Persisted in client store.',
    })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
