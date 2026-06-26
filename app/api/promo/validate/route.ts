import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      code,
      packageId,
      userName,
      userEmail,
    } = body

    if (!code || !packageId) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Code and package are required.',
        },
        { status: 400 }
      )
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseServiceKey
    )

    // Fetch the promo code
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase().trim())
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Invalid promo code.',
        },
        { status: 200 }
      )
    }

    // Check expiry
    if (data.expires_at) {
      const now = new Date()
      const expiry = new Date(data.expires_at)
      if (now > expiry) {
        return NextResponse.json(
          {
            valid: false,
            error: 'This promo code has expired.',
          },
          { status: 200 }
        )
      }
    }

    // Check max uses
    if (
      data.max_uses !== null &&
      data.times_used >= data.max_uses
    ) {
      return NextResponse.json(
        {
          valid: false,
          error:
            'This promo code has reached its maximum usage limit.',
        },
        { status: 200 }
      )
    }

    // Check applicable packages
    if (
      !data.applicable_packages.includes(packageId)
    ) {
      return NextResponse.json(
        {
          valid: false,
          error: `This promo code is not valid for the ${packageId} package.`,
        },
        { status: 200 }
      )
    }

    // Check verification if required
    if (data.requires_verification) {
      // If user details not provided yet —
      // tell the frontend to ask for them
      if (!userName || !userEmail) {
        return NextResponse.json(
          {
            valid: false,
            requires_verification: true,
            error:
              'This promo code requires verification. Please enter your full name and email address.',
          },
          { status: 200 }
        )
      }

      // Check against approved users list
      const approvedUsers: {
        name: string
        email: string
      }[] = data.approved_users || []

      const isApproved = approvedUsers.some(
        (u) =>
          u.name === userName.trim() &&
          u.email.toLowerCase() ===
            userEmail.trim().toLowerCase()
      )

      if (!isApproved) {
        return NextResponse.json(
          {
            valid: false,
            requires_verification: true,
            error:
              'This promo code is not valid for your account. Please check your name and email address.',
          },
          { status: 200 }
        )
      }
    }

    // Code is valid
    return NextResponse.json(
      {
        valid: true,
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        description: data.description,
        code: data.code,
        requires_verification:
          data.requires_verification || false,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('Promo validation error:', err)
    return NextResponse.json(
      {
        valid: false,
        error: 'Something went wrong.',
      },
      { status: 500 }
    )
  }
}