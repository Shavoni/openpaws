import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ data: null })
}

export async function PUT() {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}
