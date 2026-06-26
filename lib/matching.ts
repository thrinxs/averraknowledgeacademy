import { createClient } from '@supabase/supabase-js'
import { sendMatchesReadyEmail } from '@/lib/email'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface UserProfile {
  id: string
  full_name: string
  email: string
  country: string
}

interface AcademicBackground {
  education_level: string
  field_of_study: string
  cgpa: string
  grading_scale: string
  test_scores: { name: string; score: string }[]
  work_experience: string
  work_experience_years: string
}

interface ScholarshipPreferences {
  preferred_countries: string[]
  scholarship_type: string
  degree_level: string
  field_abroad: string
  specific_course: string
  reason_for_studying: string
  special_circumstances: string[]
  selected_package: string
  payment_status: string
}

interface Scholarship {
  id: string
  name: string
  country: string
  level: string[]
  fields: string[]
  funding_type: string
  covers: string[]
  deadline: string | null
  link: string
  description: string
  requires_ielts: boolean
  min_cgpa: string | null
  eligibility_summary: string
  required_documents: string[]
  is_active: boolean
  study_mode: string
  language_requirements: string | null
  duration: string | null
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function normalizeCGPA(cgpa: string, scale: string): number {
  const value = parseFloat(cgpa)
  if (isNaN(value)) return 0
  switch (scale) {
    case '4.0':        return value
    case '5.0':        return (value / 5.0) * 4.0
    case '7.0':        return (value / 7.0) * 4.0
    case '10.0':       return (value / 10.0) * 4.0
    case 'percentage': return (value / 100) * 4.0
    default:           return value
  }
}

function parseMinCGPA(minCgpa: string | null): number {
  if (!minCgpa) return 0
  const lower = minCgpa.toLowerCase()

  if (lower.includes('%')) {
    return (parseFloat(lower) / 100) * 4.0
  }

  if (lower.includes('/')) {
    const parts = lower.split('/')
    const numerator   = parseFloat(parts[0])
    const denominator = parseFloat(parts[1])
    if (!isNaN(numerator) && !isNaN(denominator)) {
      return (numerator / denominator) * 4.0
    }
  }

  if (lower.includes('first') || lower === '1st')            return 3.5
  if (lower.includes('2:1')   || lower.includes('second upper')) return 3.0
  if (lower.includes('2:2')   || lower.includes('second lower')) return 2.5

  const val = parseFloat(lower)
  return isNaN(val) ? 0 : val
}

function userHasIELTS(
  testScores: { name: string; score: string }[]
): boolean {
  if (!testScores || testScores.length === 0) return false
  return testScores.some(
    (t) =>
      t.name.toLowerCase().includes('ielts')    ||
      t.name.toLowerCase().includes('toefl')    ||
      t.name.toLowerCase().includes('pte')      ||
      t.name.toLowerCase().includes('duolingo')
  )
}

function normalizeDegreeLevel(level: string): string {
  const lower = level.toLowerCase()
  if (
    lower.includes('bachelor')     ||
    lower.includes('undergraduate') ||
    lower.includes('bsc')          ||
    lower.includes('ba')
  ) return 'undergraduate'
  if (
    lower.includes('master')       ||
    lower.includes('msc')          ||
    lower.includes('mba')          ||
    lower.includes('postgraduate')
  ) return 'masters'
  if (
    lower.includes('phd')      ||
    lower.includes('doctorate') ||
    lower.includes('doctoral')
  ) return 'phd'
  if (lower.includes('professional')) return 'professional'
  return lower
}

function scoreScholarship(
  scholarship: Scholarship,
  profile: UserProfile,
  academic: AcademicBackground,
  preferences: ScholarshipPreferences
): number {
  let score = 0

  // 1. COUNTRY MATCH (25 points)
  const preferredCountries = preferences.preferred_countries || []
  const hasAnyCountry = preferredCountries.includes('Any Country')

  if (hasAnyCountry) {
    score += 25
  } else if (
    preferredCountries.some(
      (c) => c.toLowerCase() === scholarship.country.toLowerCase()
    )
  ) {
    score += 25
  } else if (
    scholarship.country.toLowerCase() === 'international' ||
    scholarship.country.toLowerCase() === 'europe'        ||
    scholarship.country.toLowerCase() === 'multiple african countries'
  ) {
    score += 15
  } else {
    score += 5
  }

  // 2. DEGREE LEVEL MATCH (20 points)
  const userDegree = normalizeDegreeLevel(preferences.degree_level || '')
  const scholarshipLevels = (scholarship.level || []).map((l) =>
    normalizeDegreeLevel(l)
  )

  if (preferences.degree_level === 'any' || preferences.degree_level === '') {
    score += 20
  } else if (scholarshipLevels.includes(userDegree)) {
    score += 20
  } else if (
    scholarshipLevels.some(
      (l) => l.includes(userDegree) || userDegree.includes(l)
    )
  ) {
    score += 10
  }

  // 3. FIELD OF STUDY MATCH (20 points)
  const userField       = (preferences.field_abroad || '').toLowerCase()
  const scholarshipFields = (scholarship.fields || []).map((f) => f.toLowerCase())

  if (scholarshipFields.includes('all fields') || userField === '') {
    score += 20
  } else if (
    scholarshipFields.some(
      (f) => f.includes(userField) || userField.includes(f)
    )
  ) {
    score += 20
  } else if (
    scholarshipFields.some((f) =>
      f.split(' ').some(
        (word) => userField.includes(word) && word.length > 3
      )
    )
  ) {
    score += 8
  }

  // 4. FUNDING TYPE MATCH (15 points)
  const userFundingType    = preferences.scholarship_type || ''
  const scholarshipFunding = scholarship.funding_type || ''

  if (userFundingType === 'any' || userFundingType === '') {
    score += 15
  } else if (
    userFundingType === 'fully_funded' &&
    scholarshipFunding.toLowerCase().includes('fully funded')
  ) {
    score += 15
  } else if (
    userFundingType === 'partially_funded' &&
    scholarshipFunding.toLowerCase().includes('partially funded')
  ) {
    score += 15
  } else if (
    userFundingType === 'tuition_only' &&
    scholarshipFunding.toLowerCase().includes('tuition')
  ) {
    score += 15
  } else {
    score += 5
  }

  // 5. CGPA MEETS MINIMUM (10 points)
  const userCGPANormalized = normalizeCGPA(
    academic.cgpa || '0',
    academic.grading_scale || '4.0'
  )
  const minCGPANormalized = parseMinCGPA(scholarship.min_cgpa)

  if (minCGPANormalized === 0) {
    score += 10
  } else if (userCGPANormalized >= minCGPANormalized) {
    score += 10
  } else if (userCGPANormalized >= minCGPANormalized - 0.3) {
    score += 5
  }

  // 6. IELTS REQUIREMENT (5 points)
  const hasLanguageScore = userHasIELTS(academic.test_scores || [])

  if (!scholarship.requires_ielts) {
    score += 5
  } else if (hasLanguageScore) {
    score += 5
  }

  // 7. DEADLINE NOT PASSED (5 points)
  if (scholarship.deadline) {
    const deadline = new Date(scholarship.deadline)
    const now      = new Date()
    if (deadline > now) score += 5
  } else {
    score += 5
  }

  return Math.min(score, 100)
}

function generateMatchReason(
  scholarship: Scholarship,
  preferences: ScholarshipPreferences,
  score: number
): string {
  const reasons: string[] = []
  const preferredCountries = preferences.preferred_countries || []

  if (
    preferredCountries.includes('Any Country') ||
    preferredCountries.some(
      (c) => c.toLowerCase() === scholarship.country.toLowerCase()
    )
  ) {
    reasons.push(`matches your preferred country (${scholarship.country})`)
  }

  if ((scholarship.fields || []).includes('All Fields')) {
    reasons.push('open to all fields of study')
  } else if (
    preferences.field_abroad &&
    (scholarship.fields || []).some((f) =>
      f.toLowerCase().includes(preferences.field_abroad.toLowerCase())
    )
  ) {
    reasons.push(`matches your field (${preferences.field_abroad})`)
  }

  if (scholarship.funding_type.toLowerCase().includes('fully funded')) {
    reasons.push('fully funded opportunity')
  }

  if (!scholarship.requires_ielts) {
    reasons.push('no IELTS required')
  }

  if (!scholarship.deadline) {
    reasons.push('rolling deadline')
  } else {
    const deadline = new Date(scholarship.deadline)
    const now      = new Date()
    const daysLeft = Math.floor(
      (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )
    if (daysLeft > 0 && daysLeft < 90) {
      reasons.push(`deadline in ${daysLeft} days — apply soon`)
    }
  }

  if (reasons.length === 0) {
    return `Strong match based on your academic profile and preferences (score: ${score}/100).`
  }

  return `Matched because it ${reasons.join(', ')}. Overall match score: ${score}/100.`
}

// ─────────────────────────────────────────────
// MAIN EXPORTED FUNCTION
// ─────────────────────────────────────────────

export async function runMatchingAlgorithm(userId: string): Promise<{
  success: boolean
  matchCount: number
  error?: string
}> {
  try {
    // 1. Verify payment
    const { data: preferences, error: prefError } =
      await supabaseAdmin
        .from('scholarship_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()

    if (prefError || !preferences) {
      return {
        success: false,
        matchCount: 0,
        error: 'No scholarship application found.',
      }
    }

    if (preferences.payment_status !== 'paid') {
      return {
        success: false,
        matchCount: 0,
        error: 'Payment not confirmed.',
      }
    }

    // 2. Check if matches already exist
    const { count: existingCount } = await supabaseAdmin
      .from('scholarship_matches')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (existingCount && existingCount >= 5) {
      return { success: true, matchCount: existingCount }
    }

    // 3. Fetch user profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    // 4. Fetch academic background
    const { data: academic } = await supabaseAdmin
      .from('academic_backgrounds')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    // 5. Fetch active scholarships with valid deadlines
    const today = new Date().toISOString().split('T')[0]

    const { data: scholarships, error: schError } =
      await supabaseAdmin
        .from('scholarships')
        .select('*')
        .eq('is_active', true)
        .or(`deadline.is.null,deadline.gte.${today}`)

    if (schError || !scholarships || scholarships.length === 0) {
      return {
        success: false,
        matchCount: 0,
        error: 'No scholarships available in the database.',
      }
    }

    // 6. Score all scholarships
    const scoredScholarships = scholarships.map(
      (scholarship: Scholarship) => {
        const score = scoreScholarship(
          scholarship,
          profile,
          academic || ({} as AcademicBackground),
          preferences
        )
        return {
          scholarship,
          score,
          matchReason: generateMatchReason(scholarship, preferences, score),
        }
      }
    )

    // 7. Sort by score descending
    scoredScholarships.sort((a, b) => b.score - a.score)

    // 8. Deduplicate by name + country
    const seenScholarships = new Set<string>()
    const deduplicated = scoredScholarships.filter((item) => {
      const key =
        `${item.scholarship.name}__${item.scholarship.country}`.toLowerCase()
      if (seenScholarships.has(key)) return false
      seenScholarships.add(key)
      return true
    })

    // 9. Take top 5
    const top5 = deduplicated.slice(0, 5)

    if (top5.length === 0) {
      return {
        success: false,
        matchCount: 0,
        error: 'No suitable scholarships found for this profile.',
      }
    }

    // 10. Save matches to database
    const matchInserts = top5.map((item) => ({
      user_id:        userId,
      scholarship_id: item.scholarship.id,
      match_score:    item.score,
      match_reason:   item.matchReason,
      status:         'pending_verification',
      is_verified:    false,
      viewed:         false,
    }))

    const { error: insertError } = await supabaseAdmin
      .from('scholarship_matches')
      .insert(matchInserts)

    if (insertError) {
      console.error('[Matching] Insert error:', insertError)
      return {
        success: false,
        matchCount: 0,
        error: insertError.message,
      }
    }

    // 11. Send matches ready email
    const { data: userProfile } = await supabaseAdmin
      .from('profiles')
      .select('full_name, email')
      .eq('id', userId)
      .single()

    if (userProfile?.email) {
      await sendMatchesReadyEmail({
        to:          userProfile.email,
        name:        userProfile.full_name || 'Student',
        packageName: preferences.selected_package || 'Basic',
      }).catch((err) =>
        console.error('[Matching] Email error:', err)
      )
    }

    // 12. Create matches ready notification
    await supabaseAdmin.from('notifications').insert({
      user_id: userId,
      type:    'matches',
      title:   'Your Scholarship Matches Are Ready!',
      message:
        'We have found your 5 best scholarship matches based on your profile and ' +
        'preferences. Our team is now manually verifying each match to confirm ' +
        'accuracy and eligibility. This usually takes up to 24 hours. You will be ' +
        'notified once verification is complete.',
      is_read: false,
      link:    '/dashboard/matches',
    })

    // 13. Create matches ready message
    await supabaseAdmin.from('messages').insert({
      receiver_id: userId,
      sender_id:   null,
      topic:       'Your Scholarship Matches Are Ready',
      content:
        'Congratulations! We have successfully identified your 5 best scholarship ' +
        'matches based on your academic profile, preferred countries, field of study, ' +
        'and degree level.\n\nOur team is currently reviewing each match to manually ' +
        'verify that all details are accurate and that you meet the eligibility ' +
        'requirements. This process usually takes up to 24 hours.\n\nYou will receive ' +
        'another notification once verification is complete and your matches are ' +
        'confirmed. In the meantime, you can view your matches in your dashboard.',
      is_read: false,
    })

    return { success: true, matchCount: top5.length }

  } catch (err) {
    console.error('[Matching] Unexpected error:', err)
    return {
      success: false,
      matchCount: 0,
      error: 'Unexpected error during matching.',
    }
  }
}