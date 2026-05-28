// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { randomBytes } from 'crypto'

function createSupabase() {
      const cookieStore = cookies()
      return createServerClient(
              process.env.NEXT_PUBLIC_SUPABASE_URL!,
              process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
                    cookies: {
                                getAll() { return cookieStore.getAll() },
                                setAll(cookiesToSet) {
                                              cookiesToSet.forEach(({ name, value, options }) =>
                                                              cookieStore.set(name, value, options)
                                                                             )
                                },
                    },
          }
            )
}

export async function POST(request: NextRequest) {
      try {
              const body = await request.json()
              const { email, name } = body

        if (!email || !email.includes('@')) {
                  return NextResponse.json({ error: 'Ogiltig e-postadress' }, { status: 400 })
        }

        const supabase = createSupabase()

        // Check if already subscribed
        const { data: existing } = await supabase
                .from('newsletter_subscribers')
                .select('id, status')
                .eq('email', email.toLowerCase().trim())
                .single()

        if (existing) {
                  if (existing.status === 'active') {
                              return NextResponse.json({ message: 'Du prenumererar redan!' }, { status: 200 })
                  }
                  await supabase
                    .from('newsletter_subscribers')
                    .update({ status: 'active', name: name || null, updated_at: new Date().toISOString() })
                    .eq('id', existing.id)
                  return NextResponse.json({ message: 'Valkommen tillbaka! Du prenumererar nu igen.' })
        }

        const unsubscribeToken = randomBytes(32).toString('hex')

        const { error } = await supabase
                .from('newsletter_subscribers')
                .insert({
                            email: email.toLowerCase().trim(),
                            name: name?.trim() || null,
                            status: 'active',
                            unsubscribe_token: unsubscribeToken,
                            source: 'website',
                            gdpr_consent: true,
                            gdpr_consent_at: new Date().toISOString(),
                })

        if (error) {
                  console.error('Newsletter insert error:', error)
                  return NextResponse.json({ error: 'Nagot gick fel, forsok igen' }, { status: 500 })
        }

        return NextResponse.json({ message: 'Tack! Du ar nu prenumerant.' })
      } catch (err) {
              console.error('Newsletter error:', err)
              return NextResponse.json({ error: 'Serverfel' }, { status: 500 })
      }
}

export async function DELETE(request: NextRequest) {
      try {
              const { searchParams } = new URL(request.url)
              const token = searchParams.get('token')

        if (!token) {
                  return NextResponse.json({ error: 'Ogiltig lank' }, { status: 400 })
        }

        const supabase = createSupabase()

        await supabase
                .from('newsletter_subscribers')
                .update({ status: 'unsubscribed', updated_at: new Date().toISOString() })
                .eq('unsubscribe_token', token)

        return NextResponse.json({ message: 'Du har avprenumererats.' })
      } catch {
              return NextResponse.json({ error: 'Serverfel' }, { status: 500 })
      }
}
