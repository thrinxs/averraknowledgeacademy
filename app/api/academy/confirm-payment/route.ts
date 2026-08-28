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
    const enrollmentId = formData.get('enrollment_id') as string
    const amountReceived = Number(formData.get('amount_received') || 0)
    const discountType = formData.get('discount_type') as string || 'none'
    const discountValue = Number(formData.get('discount_value') || 0)
    const finalAmount = Number(formData.get('final_amount') || amountReceived)
    const adminNotes = formData.get('notes') as string || ''
    const receiptFile = formData.get('receipt') as File | null

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

    // Upload receipt if provided
    let receiptUrl = null
    if (receiptFile && receiptFile.size > 0) {
      const ext = receiptFile.name.split('.').pop()
      const path = `receipts/${enrollmentId}/receipt.${ext}`
      const buffer = Buffer.from(await receiptFile.arrayBuffer())
      await supabaseAdmin.storage.from('avatars').upload(path, buffer, {
        contentType: receiptFile.type,
        upsert: true,
      })
      const { data: { publicUrl } } = supabaseAdmin.storage.from('avatars').getPublicUrl(path)
      receiptUrl = publicUrl
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
        amount_received: amountReceived,
        discount_type: discountType !== 'none' ? discountType : null,
        discount_value: discountType !== 'none' ? discountValue : null,
        final_amount_paid: finalAmount,
        admin_notes: adminNotes || null,
        receipt_url: receiptUrl,
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

    // Create assessments for all children (non-blocking)
    try {
      const origin = request.headers.get('origin') || 'https://www.averraknowledgeacademy.com'
      await fetch(`${origin}/api/academy/assessment/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollment_id: enrollmentId }),
      })
    } catch (assessmentErr) {
      console.error('Assessment creation error (non-fatal):', assessmentErr)
    }

    return NextResponse.json({ success: true })
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