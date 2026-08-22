import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function POST(request: NextRequest) {
  try {
    const { enrollment_id } = await request.json()

    if (!enrollment_id) {
      return NextResponse.json(
        { error: 'enrollment_id is required' },
        { status: 400 }
      )
    }

    const supabase = getAdminClient()

    // Fetch enrollment
    const { data: enrollment, error } = await supabase
      .from('academy_enrollments')
      .select('*')
      .eq('id', enrollment_id)
      .single()

    if (error || !enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      )
    }

    if (enrollment.payment_status === 'paid') {
      return NextResponse.json(
        { error: 'This enrollment has already been paid' },
        { status: 400 }
      )
    }

    const amountInKobo = Math.round(Number(enrollment.billing_amount) * 100)

    const reference = `AVR-ACAD-${enrollment_id.slice(0, 8).toUpperCase()}-${Date.now()}`

    const origin = request.headers.get('origin') || 'https://www.averraknowledgeacademy.com'
    const callbackUrl = `${origin}/api/academy/paystack/callback?reference=${reference}&enrollment_id=${enrollment_id}`

    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: enrollment.email,
        amount: amountInKobo,
        reference,
        callback_url: callbackUrl,
        metadata: {
          enrollment_id,
          service: 'academy',
        },
      }),
    })

    const paystackData = await paystackRes.json()

    if (!paystackData.status) {
      return NextResponse.json(
        { error: paystackData.message || 'Paystack initialization failed' },
        { status: 500 }
      )
    }

    // Mark as pending
    await supabase
      .from('academy_enrollments')
      .update({ payment_status: 'pending' })
      .eq('id', enrollment_id)

    return NextResponse.json({
      authorization_url: paystackData.data.authorization_url,
      reference,
    })

  } catch (err: unknown) {
    console.error('Academy Paystack initialize error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
