// @ts-nocheck
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  if (!slug) {
    return NextResponse.json({ error: 'slug required' }, { status: 400 })
  }
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error || !data) {
    return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
  }
  return NextResponse.json(data)
}
