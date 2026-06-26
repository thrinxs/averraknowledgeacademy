import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      fullName,
      email,
      phone,
      whatsapp,
      dateOfBirth,
      gender,
      country,
      stateCity,
      educationLevel,
      fieldOfStudy,
      institution,
      institutionAccredited,
      graduationYear,
      cgpa,
      gradingScale,
      testScores,
      publications,
      workExperience,
      workExperienceYears,
      preferredCountries,
      scholarshipType,
      preferredStartDate,
      degreeLevel,
      fieldAbroad,
      specificCourse,
      reasonForStudying,
      specialCircumstances,
      selectedPackage,
      password,
      referralCode,
      promoCode,
      promoDiscount,
      emailUpdates,
    } = body

    if (!email || !password || !fullName) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Email, password, and full name are required.',
        },
        { status: 400 }
      )
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseServiceKey
    )

    // 1. Create auth user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: false,
        user_metadata: {
          full_name: fullName,
          role: 'student',
        },
      })

    if (authError) {
      if (
        authError.message.includes(
          'already been registered'
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              'An account with this email already exists. Please log in instead.',
          },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 400 }
      )
    }

    const userId = authData.user.id

    // 2. Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        email,
        phone,
        whatsapp,
        date_of_birth: dateOfBirth || null,
        gender,
        country,
        state_city: stateCity,
        role: 'student',
      })
      .eq('id', userId)

    if (profileError) {
      console.error(
        'Profile update error:',
        profileError
      )
    }

    // 3. Save academic background
    const { error: academicError } = await supabase
      .from('academic_backgrounds')
      .insert({
        user_id: userId,
        education_level: educationLevel,
        field_of_study: fieldOfStudy,
        institution,
        institution_accredited:
          institutionAccredited ?? null,
        graduation_year: graduationYear,
        cgpa,
        grading_scale: gradingScale,
        test_scores: testScores || [],
        publications: publications || null,
        work_experience: workExperience || null,
        work_experience_years:
          workExperienceYears || null,
      })

    if (academicError) {
      console.error(
        'Academic background error:',
        academicError
      )
    }

    // 4. Calculate final price
    const packagePrices: Record<string, number> = {
      basic: 30000,
      standard: 50000,
      premium: 150000,
    }

    let finalPrice =
      packagePrices[selectedPackage] || 0

    if (promoDiscount) {
      if (promoDiscount.type === 'percentage') {
        const off =
          (finalPrice * promoDiscount.value) / 100
        finalPrice = Math.max(
          0,
          Math.round(finalPrice - off)
        )
      } else if (promoDiscount.type === 'fixed') {
        finalPrice = Math.max(
          0,
          Math.round(
            finalPrice - promoDiscount.value
          )
        )
      }
    }

    // 5. Save scholarship preferences
    const { error: prefError } = await supabase
      .from('scholarship_preferences')
      .insert({
        user_id: userId,
        preferred_countries:
          preferredCountries || [],
        scholarship_type: scholarshipType,
        start_date: preferredStartDate,
        preferred_start_date: preferredStartDate,
        degree_level: degreeLevel,
        field_abroad: fieldAbroad,
        specific_course: specificCourse || null,
        reason: reasonForStudying,
        reason_for_studying: reasonForStudying,
        special_circumstances:
          specialCircumstances
            ? specialCircumstances
                .split('\n')
                .filter(Boolean)
            : [],
        selected_package: selectedPackage,
        promo_code: promoCode || null,
        referral_code: referralCode || null,
        final_price: finalPrice,
        payment_status: 'unpaid',
        email_updates: emailUpdates || false,
      })

    if (prefError) {
      console.error(
        'Scholarship preferences error:',
        prefError
      )
    }

    // 6. Increment promo usage
    if (promoCode) {
      await supabase.rpc('increment_promo_usage', {
        promo_code_value: promoCode,
      })
    }

    // 7. Send verification email
    const { error: verifyError } =
      await supabase.auth.admin.generateLink({
        type: 'signup',
        email,
        options: {
          redirectTo: `${
            request.headers.get('origin') ||
            'http://localhost:3000'
          }/auth/callback`,
        },
      })

    if (verifyError) {
      console.error(
        'Verification email error:',
        verifyError
      )
    }

    return NextResponse.json(
      {
        success: true,
        userId,
        email,
        redirectTo: `/auth/verify-email?email=${encodeURIComponent(email)}`,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('Registration error:', err)
    return NextResponse.json(
      {
        success: false,
        error:
          'Something went wrong. Please try again.',
      },
      { status: 500 }
    )
  }
}