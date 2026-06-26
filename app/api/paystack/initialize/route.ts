import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY!
const paystackSecretKey =
  process.env.PAYSTACK_SECRET_KEY!

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'User ID is required.',
        },
        { status: 400 }
      )
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseServiceKey
    )

    // Get user profile
    const { data: profile, error: profileError } =
      await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', userId)
        .single()

    if (profileError || !profile) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found.',
        },
        { status: 404 }
      )
    }

    // Get scholarship preferences
    const {
      data: preferences,
      error: prefError,
    } = await supabase
      .from('scholarship_preferences')
      .select(
        'selected_package, final_price, payment_status'
      )
      .eq('user_id', userId)
      .single()

    if (prefError || !preferences) {
      return NextResponse.json(
        {
          success: false,
          error:
            'No scholarship application found.',
        },
        { status: 404 }
      )
    }

    if (preferences.payment_status === 'paid') {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment has already been made.',
        },
        { status: 400 }
      )
    }

    // Calculate amount in kobo
    const packagePrices: Record<string, number> = {
      basic: 30000,
      standard: 50000,
      premium: 150000,
    }

    const amount = preferences.final_price
      ? Number(preferences.final_price) * 100
      : (packagePrices[
          preferences.selected_package
        ] || 0) * 100

    if (amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid amount.',
        },
        { status: 400 }
      )
    }

    const origin =
      request.headers.get('origin') ||
      'http://localhost:3000'

    // Initialize Paystack transaction
    const paystackResponse = await fetch(
      'https://api.paystack.co/transaction/initialize',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: profile.email,
          amount,
          currency: 'NGN',
          reference: `AVR-${userId.slice(0, 8)}-${Date.now()}`,
          callback_url: `${origin}/api/paystack/callback`,
          metadata: {
            user_id: userId,
            package: preferences.selected_package,
            full_name: profile.full_name,
            custom_fields: [
              {
                display_name: 'Package',
                variable_name: 'package',
                value:
                  preferences.selected_package,
              },
              {
                display_name: 'Full Name',
                variable_name: 'full_name',
                value: profile.full_name,
              },
            ],
          },
        }),
      }
    )

    const paystackData =
      await paystackResponse.json()

    if (!paystackData.status) {
      return NextResponse.json(
        {
          success: false,
          error:
            paystackData.message ||
            'Payment initialization failed.',
        },
        { status: 400 }
      )
    }

    // Update payment status to pending
    await supabase
      .from('scholarship_preferences')
      .update({ payment_status: 'pending' })
      .eq('user_id', userId)

    return NextResponse.json(
      {
        success: true,
        authorization_url:
          paystackData.data.authorization_url,
        reference: paystackData.data.reference,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('Paystack init error:', err)
    return NextResponse.json(
      {
        success: false,
        error: 'Something went wrong.',
      },
      { status: 500 }
    )
  }
}