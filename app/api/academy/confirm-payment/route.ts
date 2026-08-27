import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { sendPaymentConfirmedEmail } from '@/lib/academy-emails'
import { createSupabaseServerClient } from
  '@/lib/supabase-server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export async function POST(request: NextRequest) {
  try {
    // Verify admin is logged in
    const supabase = await createSupabaseServerClient()
    const { data: { user } } =
      await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(
        new URL('/auth/login', request.url)
      )
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(
        new URL('/dashboard', request.url)
      )
    }

    const formData = await request.formData()
    const enrollmentId =
      formData.get('enrollment_id') as string

    if (!enrollmentId) {
      return NextResponse.redirect(
        new URL(
          '/admin/dashboard/academy?error=missing_id',
          request.url
        )
      )
    }

    // Get enrollment + parent details
    const { data: enrollment } = await supabaseAdmin
      .from('academy_enrollments')
      .select(`
        id, parent_id, billing_period,
        billing_amount, currency,
        profiles!parent_id (
          full_name, email
        )
      `)
      .eq('id', enrollmentId)
      .single()

    if (!enrollment) {
      return NextResponse.redirect(
        new URL(
          '/admin/dashboard/academy?error=not_found',
          request.url
        )
      )
    }

    // Mark enrollment as paid
    await supabaseAdmin
      .from('academy_enrollments')
      .update({
        payment_status: 'paid',
        registration_paid: true,
        billing_paid: true,
        billing_paid_at: new Date().toISOString(),
        status: 'active',
      })
      .eq('id', enrollmentId)

    // Mark all children as active
    await supabaseAdmin
      .from('academy_children')
      .update({ status: 'active' })
      .eq('enrollment_id', enrollmentId)

    // Create notification for parent
    await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: enrollment.parent_id,
        type: 'payment',
        title: '✅ Payment Confirmed!',
        message:
          'Your Averra Academy enrollment payment ' +
          'has been confirmed. Our team will contact ' +
          'you within 24 hours to confirm your ' +
          'timetable and begin your child\'s ' +
          'baseline assessment.',
        is_read: false,
        link: '/dashboard/academy',
      })

    // Create message for parent
    await supabaseAdmin
      .from('messages')
      .insert({
        sender_id: user.id,
        receiver_id: enrollment.parent_id,
        content:
          'Great news! Your Academy enrollment ' +
          'payment has been confirmed. ✅\n\n' +
          'Our team will reach out within 24 hours ' +
          'to confirm your timetable. Your child\'s ' +
          'Baseline Assessment will then be ' +
          'scheduled and classes will begin shortly ' +
          'after.\n\n' +
          'Thank you for choosing Averra Academy! 🎓',
        is_read: false,
      })

    // Send payment confirmed email to parent
    try {
      const profile = Array.isArray(enrollment.profiles)
        ? enrollment.profiles[0]
        : enrollment.profiles
      if (profile?.email) {
        await sendPaymentConfirmedEmail({
          to: profile.email,
          parentName: profile.full_name || 'there',
          currency: enrollment.currency || 'GBP',
          billingAmount: enrollment.billing_amount || 0,
          paymentMethod: 'bank_transfer',
        })
      }
    } catch (emailErr) {
      console.error('Payment confirmed email error (non-fatal):', emailErr)
    }

    return NextResponse.redirect(
      new URL(
        '/admin/dashboard/academy?success=payment_confirmed',
        request.url
      )
    )
  } catch (error) {
    console.error('Confirm payment error:', error)
    return NextResponse.redirect(
      new URL(
        '/admin/dashboard/academy?error=server_error',
        request.url
      )
    )
  }
}