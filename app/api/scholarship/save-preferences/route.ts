import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, ...formFields } = body

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

    // Check if academic background exists
    const { data: existingAcademic } = await supabase
      .from('academic_backgrounds')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    if (existingAcademic) {
      // Update existing
      await supabase
        .from('academic_backgrounds')
        .update({
          education_level:
            formFields.educationLevel,
          field_of_study: formFields.fieldOfStudy,
          institution: formFields.institution,
          institution_accredited:
            formFields.institutionAccredited ?? null,
          graduation_year:
            formFields.graduationYear,
          cgpa: formFields.cgpa,
          grading_scale: formFields.gradingScale,
          test_scores: formFields.testScores || [],
          publications:
            formFields.publications || null,
          work_experience:
            formFields.workExperience || null,
          work_experience_years:
            formFields.workExperienceYears || null,
        })
        .eq('user_id', userId)
    } else {
      // Insert new
      await supabase
        .from('academic_backgrounds')
        .insert({
          user_id: userId,
          education_level:
            formFields.educationLevel,
          field_of_study: formFields.fieldOfStudy,
          institution: formFields.institution,
          institution_accredited:
            formFields.institutionAccredited ?? null,
          graduation_year:
            formFields.graduationYear,
          cgpa: formFields.cgpa,
          grading_scale: formFields.gradingScale,
          test_scores: formFields.testScores || [],
          publications:
            formFields.publications || null,
          work_experience:
            formFields.workExperience || null,
          work_experience_years:
            formFields.workExperienceYears || null,
        })
    }

    // Calculate final price
    const packagePrices: Record<string, number> = {
      basic: 30000,
      standard: 50000,
      premium: 150000,
    }

    let finalPrice =
      packagePrices[formFields.selectedPackage] || 0

    if (formFields.promoDiscount) {
      if (
        formFields.promoDiscount.type === 'percentage'
      ) {
        const off =
          (finalPrice *
            formFields.promoDiscount.value) /
          100
        finalPrice = Math.max(
          0,
          Math.round(finalPrice - off)
        )
      } else if (
        formFields.promoDiscount.type === 'fixed'
      ) {
        finalPrice = Math.max(
          0,
          Math.round(
            finalPrice -
              formFields.promoDiscount.value
          )
        )
      }
    }

    // Check if scholarship preferences exist
    const { data: existingPrefs } = await supabase
      .from('scholarship_preferences')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    const prefsData = {
      user_id: userId,
      preferred_countries:
        formFields.preferredCountries || [],
      scholarship_type:
        formFields.scholarshipType,
      start_date: formFields.preferredStartDate,
      preferred_start_date:
        formFields.preferredStartDate,
      degree_level: formFields.degreeLevel,
      field_abroad: formFields.fieldAbroad,
      specific_course:
        formFields.specificCourse || null,
      reason: formFields.reasonForStudying,
      reason_for_studying:
        formFields.reasonForStudying,
      special_circumstances:
        formFields.specialCircumstances
          ? formFields.specialCircumstances
              .split('\n')
              .filter(Boolean)
          : [],
      selected_package:
        formFields.selectedPackage,
      promo_code: formFields.promoCode || null,
      referral_code:
        formFields.referralCode || null,
      final_price: finalPrice,
      payment_status: 'unpaid',
      email_updates:
        formFields.emailUpdates || false,
    }

    if (existingPrefs) {
      await supabase
        .from('scholarship_preferences')
        .update(prefsData)
        .eq('user_id', userId)
    } else {
      await supabase
        .from('scholarship_preferences')
        .insert(prefsData)
    }

    // Increment promo usage if applicable
    if (formFields.promoCode) {
      await supabase.rpc('increment_promo_usage', {
        promo_code_value: formFields.promoCode,
      })
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (err) {
    console.error('Save preferences error:', err)
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