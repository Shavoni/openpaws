import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params

  // Client store is source of truth until Supabase is wired
  return NextResponse.json({
    data: null,
    id,
    message: 'Use client-side store for lookups. Supabase integration pending.',
  })
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { id } = params

    // Validate scheduledAt if provided
    if (body.scheduledAt) {
      const scheduleDate = new Date(body.scheduledAt)
      if (scheduleDate <= new Date()) {
        return NextResponse.json(
          { error: 'Scheduled time must be in the future' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json({
      data: { id, ...body },
      message: 'Update validated. Apply to client store.',
    })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params

  return NextResponse.json({
    data: { id },
    message: 'Delete confirmed. Remove from client store.',
  })
}
