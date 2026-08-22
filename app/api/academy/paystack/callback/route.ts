import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')
    const enrollmentId = searchParams.get('enrollment_id')

    if (!reference || !enrollmentId) {
      return NextResponse.redirect(
        new URL('/dashboard/academy?payment=failed', request.url)
      )
    }

    // Verify with Paystack
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    )

    const verifyData = await verifyRes.json()

    const supabase = getAdminClient()

    if (
      !verifyData.status ||
      verifyData.data?.status !== 'success'
    ) {
      await supabase
        .from('academy_enrollments')
        .update({ payment_status: 'failed' })
        .eq('id', enrollmentId)

      return NextResponse.redirect(
        new URL('/dashboard/academy?payment=failed', request.url)
      )
    }

    // Mark enrollment as paid
    await supabase
      .from('academy_enrollments')
      .update({ payment_status: 'paid' })
      .eq('id', enrollmentId)

    // Activate all children for this enrollment
    await supabase
      .from('academy_children')
      .update({ status: 'active' })
      .eq('enrollment_id', enrollmentId)

    return NextResponse.redirect(
      new URL('/dashboard/academy?payment=success', request.url)
    )

  } catch (err: unknown) {
    console.error('Academy Paystack callback error:', err)
    return NextResponse.redirect(
      new URL('/dashboard/academy?payment=failed', request.url)
    )
  }
}
