import { NextResponse } from 'next/server'

// GET /api/content — list posts
export async function GET() {
  return NextResponse.json({ data: [], total: 0, page: 1, pageSize: 20 })
}

// POST /api/content — create post
export async function POST() {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}
