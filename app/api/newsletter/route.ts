// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Ogiltig e-postadress.' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()

    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json(
          { message: 'Du prenumererar redan! Vi hör av oss med de bästa dealsen.' },
          { status: 200 }
        )
      }
      await supabase
        .from('newsletter_subscribers')
        .update({ status: 'active', unsubscribed_at: null })
        .eq('email', email.toLowerCase().trim())

      return NextResponse.json(
        { message: 'Välkommen tillbaka! Du prenumererar nu igen.' },
        { status: 200 }
      )
    }

    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.toLowerCase().trim(),
        name: name?.trim() || null,
        status: 'active',
        source: 'website',
        gdpr_consent: true,
      })

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json(
        { error: 'Något gick fel. Försök igen.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Tack! Du är nu prenumerant och får våra bästa deals först.' },
      { status: 201 }
    )

  } catch (err) {
    console.error('Newsletter API error:', err)
    return NextResponse.json(
      { error: 'Något gick fel. Försök igen.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    if (!token) {
      return NextResponse.json({ error: 'Ogiltig token.' }, { status: 400 })
    }
    const supabase = getSupabaseAdmin()
    await supabase
      .from('newsletter_subscribers')
      .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
      .eq('unsubscribe_token', token)
    return NextResponse.json(
      { message: 'Du har avprenumererat.' },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json({ error: 'Något gick fel.' }, { status: 500 })
  }
}
