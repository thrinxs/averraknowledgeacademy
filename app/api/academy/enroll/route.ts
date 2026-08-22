import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

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
    const body = await request.json()
    const {
      applicant_type,
      full_name,
      email,
      password,
      phone,
      whatsapp,
      country,
      date_of_birth,
      relationship,
      learners,
      learning_format, class_type,
      lesson_duration,
      lessons_per_week,
      preferred_days,
      preferred_time,
      timezone,
      billing_period,
      billing_amount,
      registration_fee,
      monthly_fee_per_learner,
      wants_parent_access,
      optional_parent_name,
      optional_parent_email,
      optional_parent_phone,
      optional_parent_relationship,
    } = body

    // ── Step 1: Create auth account ──────────────
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name,
          account_type: 'student',
          role: 'student',
        },
      })

    if (authError) {
      if (
        authError.message.toLowerCase().includes('already') ||
        authError.message.toLowerCase().includes('exists') ||
        authError.message.toLowerCase().includes('registered')
      ) {
        return NextResponse.json(
          {
            error:
              'An account with this email already exists. ' +
              'If you started enrollment before, please ' +
              'contact us on WhatsApp: +234 903 344 0966 ' +
              'and we will complete your setup.',
          },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    const userId = authData.user.id

    // ── Step 2: Update profile ───────────────────
    await supabaseAdmin
      .from('profiles')
      .update({
        full_name,
        phone,
        whatsapp: whatsapp || phone,
        country,
        role: 'student',
      })
      .eq('id', userId)

    // ── Step 3: Create enrollment ────────────────
    const { data: enrollment, error: enrollError } =
      await supabaseAdmin
        .from('academy_enrollments')
        .insert({
          parent_id: userId,
          applicant_type,
          learner_is_account_holder:
            applicant_type === 'student',
          registration_fee,
          billing_period,
          billing_amount,
          billing_currency: 'GBP',
          payment_status: 'unpaid',
          status: 'pending',
          // Optional parent (student flow)
          optional_parent_name:
            wants_parent_access
              ? optional_parent_name
              : null,
          optional_parent_email:
            wants_parent_access
              ? optional_parent_email
              : null,
          optional_parent_phone:
            wants_parent_access
              ? optional_parent_phone
              : null,
          optional_parent_relationship:
            wants_parent_access
              ? optional_parent_relationship
              : null,
          notes:
            `Days: ${preferred_days.join(', ')}. ` +
            `Time: ${preferred_time}. ` +
            `Timezone: ${timezone}. ` +
            `Format: ${learning_format}. ` +
            `Duration: ${lesson_duration}hr. ` +
            `Lessons/week: ${lessons_per_week}. ` +
            (applicant_type === 'student' && relationship
              ? `Relationship: ${relationship}.`
              : ''),
        })
        .select()
        .single()

    if (enrollError) {
      return NextResponse.json(
        { error: enrollError.message },
        { status: 500 }
      )
    }

    // ── Step 4: Save each learner ────────────────
    for (const learner of learners) {
      const { error: learnerError } =
        await supabaseAdmin
          .from('academy_children')
          .insert({
            parent_id: userId,
            enrollment_id: enrollment.id,
            full_name: applicant_type === 'student'
              ? full_name  // student's own name
              : learner.full_name,
            date_of_birth:
              learner.date_of_birth ||
              (applicant_type === 'student'
                ? date_of_birth
                : null),
            country_code: learner.country_code,
            year_group_code: learner.year_group_code,
            year_group_label: learner.year_group_label,
            subjects: learner.subjects,
            subject_codes: learner.subjects,
            learning_format: class_type,
            lesson_duration,
            lessons_per_week,
            preferred_days,
            preferred_time,
            timezone,
            monthly_fee: monthly_fee_per_learner,
            currency: 'GBP',
            learning_challenges:
              learner.learning_challenges || null,
            school_name: learner.school_name || null,
            is_self_enrolled: applicant_type === 'student',
            status: 'pending',
          })

      if (learnerError) {
        return NextResponse.json(
          { error: learnerError.message },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      userId,
      enrollment_id: enrollment?.id || '',
      currency,
      billing_amount,
    })

  } catch (error) {
    console.error('Enrollment API error:', error)
    return NextResponse.json(
      {
        error: 'Something went wrong. Please try again.',
      },
      { status: 500 }
    )
  }
}