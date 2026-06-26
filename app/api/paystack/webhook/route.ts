import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY!
const paystackSecretKey =
  process.env.PAYSTACK_SECRET_KEY!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()

    const hash = crypto
      .createHmac('sha512', paystackSecretKey)
      .update(body)
      .digest('hex')

    const signature = request.headers.get(
      'x-paystack-signature'
    )

    if (hash !== signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const event = JSON.parse(body)

    if (event.event === 'charge.success') {
      const data = event.data
      const userId = data.metadata?.user_id

      if (!userId) {
        return NextResponse.json(
          { received: true },
          { status: 200 }
        )
      }

      const amountPaid = data.amount / 100

      const supabase = createClient(
        supabaseUrl,
        supabaseServiceKey
      )

      // Check if already processed
      const { data: prefs } = await supabase
        .from('scholarship_preferences')
        .select('payment_status')
        .eq('user_id', userId)
        .single()

      if (prefs?.payment_status === 'paid') {
        return NextResponse.json(
          { received: true },
          { status: 200 }
        )
      }

      await supabase
        .from('scholarship_preferences')
        .update({
          payment_status: 'paid',
          final_price: amountPaid,
        })
        .eq('user_id', userId)

      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('type', 'payment')

      if (!count || count === 0) {
        await supabase
          .from('notifications')
          .insert({
            user_id: userId,
            type: 'payment',
            title: 'Payment Confirmed',
            message:
              'Your payment has been confirmed. ' +
              'Your scholarship matches are being ' +
              'prepared.',
            is_read: false,
            link: '/dashboard/matches',
          })
      }
    }

    return NextResponse.json(
      { received: true },
      { status: 200 }
    )
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}