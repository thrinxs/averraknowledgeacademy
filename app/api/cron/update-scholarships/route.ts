import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY!
const googleApiKey =
  process.env.GOOGLE_CUSTOM_SEARCH_API_KEY!
const googleSearchEngineId =
  process.env.GOOGLE_SEARCH_ENGINE_ID!
const cronSecret = process.env.CRON_SECRET!

// Search queries to find scholarships
const SCHOLARSHIP_QUERIES = [
  'fully funded scholarships 2025 2026 international students apply',
  'fully funded masters scholarships international students 2025 2026',
  'fully funded PhD scholarships international students 2025 2026',
  'government scholarships international students fully funded 2025',
  'university scholarships fully funded international application open 2025',
  'fully funded scholarships Africa students 2025 2026',
  'fully funded scholarships developing countries 2025 2026',
  'scholarship financial aid international students deadline 2025 2026',
  'fully funded postgraduate scholarships 2025 2026 apply now',
  'commonwealth chevening fulbright daad erasmus scholarships 2025 2026',
]

// Countries that commonly offer scholarships
const SCHOLARSHIP_COUNTRIES = [
  'United Kingdom', 'United States', 'Germany',
  'Canada', 'Australia', 'France', 'Netherlands',
  'Japan', 'South Korea', 'Turkey', 'Hungary',
  'China', 'Sweden', 'Norway', 'Finland',
  'Denmark', 'Belgium', 'Austria', 'Switzerland',
  'New Zealand', 'Ireland', 'Italy', 'Spain',
  'Portugal', 'Czech Republic', 'Poland',
  'Saudi Arabia', 'United Arab Emirates', 'Russia',
]

// Extract country from text
function extractCountry(text: string): string {
  const lowerText = text.toLowerCase()
  for (const country of SCHOLARSHIP_COUNTRIES) {
    if (lowerText.includes(country.toLowerCase())) {
      return country
    }
  }
  return 'International'
}

// Extract deadline from text
function extractDeadline(
  text: string
): string | null {
  const months = [
    'january', 'february', 'march', 'april',
    'may', 'june', 'july', 'august',
    'september', 'october', 'november', 'december',
    'jan', 'feb', 'mar', 'apr', 'jun',
    'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
  ]

  const lowerText = text.toLowerCase()

  for (const month of months) {
    const regex = new RegExp(
      `${month}\\s+(\\d{1,2})[,\\s]+(202[5-9])`,
      'i'
    )
    const match = lowerText.match(regex)
    if (match) {
      const monthIndex = months.indexOf(month) % 12
      const day = parseInt(match[1])
      const year = parseInt(match[2])
      const date = new Date(year, monthIndex, day)
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0]
      }
    }
  }

  return null
}

// Extract funding type from text
function extractFundingType(text: string): string {
  const lowerText = text.toLowerCase()
  if (
    lowerText.includes('fully funded') ||
    lowerText.includes('full scholarship') ||
    lowerText.includes('full funding')
  ) {
    return 'Fully Funded'
  }
  if (
    lowerText.includes('partial') ||
    lowerText.includes('partially funded')
  ) {
    return 'Partially Funded'
  }
  if (lowerText.includes('tuition')) {
    return 'Tuition Only'
  }
  if (lowerText.includes('stipend')) {
    return 'Stipend Only'
  }
  return 'Fully Funded'
}

// Extract degree levels from text
function extractLevels(text: string): string[] {
  const levels: string[] = []
  const lowerText = text.toLowerCase()

  if (
    lowerText.includes('bachelor') ||
    lowerText.includes('undergraduate') ||
    lowerText.includes('bsc') ||
    lowerText.includes('ba ')
  ) {
    levels.push('Undergraduate')
  }
  if (
    lowerText.includes('master') ||
    lowerText.includes('msc') ||
    lowerText.includes('mba') ||
    lowerText.includes('postgraduate')
  ) {
    levels.push("Master's")
  }
  if (
    lowerText.includes('phd') ||
    lowerText.includes('doctorate') ||
    lowerText.includes('doctoral')
  ) {
    levels.push('PhD')
  }

  return levels.length > 0 ? levels : ["Master's"]
}

// Extract what the scholarship covers
function extractCovers(text: string): string[] {
  const covers: string[] = []
  const lowerText = text.toLowerCase()

  if (lowerText.includes('tuition')) {
    covers.push('Tuition fees')
  }
  if (
    lowerText.includes('living') ||
    lowerText.includes('stipend') ||
    lowerText.includes('allowance')
  ) {
    covers.push('Living allowance')
  }
  if (
    lowerText.includes('flight') ||
    lowerText.includes('travel') ||
    lowerText.includes('airfare')
  ) {
    covers.push('Travel costs')
  }
  if (lowerText.includes('accommodation')) {
    covers.push('Accommodation')
  }
  if (
    lowerText.includes('health') ||
    lowerText.includes('medical') ||
    lowerText.includes('insurance')
  ) {
    covers.push('Health insurance')
  }
  if (lowerText.includes('book')) {
    covers.push('Books and materials')
  }

  return covers.length > 0
    ? covers
    : ['Tuition fees', 'Living allowance']
}

// Extract fields from text
function extractFields(text: string): string[] {
  const fieldKeywords: Record<string, string> = {
    'computer science': 'Computer Science',
    'engineering': 'Engineering',
    'medicine': 'Medicine',
    'medical': 'Medicine',
    'public health': 'Public Health',
    'business': 'Business',
    'mba': 'Business Administration',
    'economics': 'Economics',
    'law': 'Law',
    'arts': 'Arts & Humanities',
    'social science': 'Social Sciences',
    'agriculture': 'Agriculture',
    'environment': 'Environmental Science',
    'education': 'Education',
    'mathematics': 'Mathematics',
    'physics': 'Physics',
    'chemistry': 'Chemistry',
    'biology': 'Biology',
    'data science': 'Data Science',
    'artificial intelligence': 'Artificial Intelligence',
  }

  const lowerText = text.toLowerCase()
  const fields: string[] = []

  for (const [keyword, field] of Object.entries(
    fieldKeywords
  )) {
    if (
      lowerText.includes(keyword) &&
      !fields.includes(field)
    ) {
      fields.push(field)
    }
  }

  return fields.length > 0 ? fields : ['All Fields']
}

// Check if text looks like a real scholarship
function isLikelyScholarship(
  title: string,
  snippet: string
): boolean {
  const text = `${title} ${snippet}`.toLowerCase()
  const scholarshipKeywords = [
    'scholarship',
    'fellowship',
    'grant',
    'award',
    'funded',
    'financial aid',
    'bursary',
  ]
  return scholarshipKeywords.some((kw) =>
    text.includes(kw)
  )
}

// Search Google for scholarships
async function searchScholarships(
  query: string
): Promise<any[]> {
  try {
    const url = new URL(
      'https://www.googleapis.com/customsearch/v1'
    )
    url.searchParams.set('key', googleApiKey)
    url.searchParams.set('cx', googleSearchEngineId)
    url.searchParams.set('q', query)
    url.searchParams.set('num', '10')

    const response = await fetch(url.toString())
    const data = await response.json()

    if (data.error) {
      console.error(
        'Google API error:',
        data.error.message
      )
      return []
    }

    return data.items || []
  } catch (err) {
    console.error('Search error:', err)
    return []
  }
}

// Convert search result to scholarship record
function processSearchResult(item: any): any | null {
  const title = item.title || ''
  const snippet = item.snippet || ''
  const link = item.link || ''
  const fullText = `${title} ${snippet}`

  if (!isLikelyScholarship(title, snippet)) {
    return null
  }

  // Clean up the title
  const name = title
    .replace(
      /\s*[-|]\s*(apply|deadline|2025|2026|open).*/gi,
      ''
    )
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200)

  if (!name || name.length < 10) return null

  const country = extractCountry(fullText)
  const deadline = extractDeadline(fullText)
  const fundingType = extractFundingType(fullText)
  const levels = extractLevels(fullText)
  const covers = extractCovers(fullText)
  const fields = extractFields(fullText)

  return {
    name,
    country,
    university: null,
    level: levels,
    fields,
    funding_type: fundingType,
    covers,
    deadline: deadline || null,
    link,
    description: snippet.slice(0, 500),
    eligibility_summary: snippet.slice(0, 300),
    requires_ielts: fullText
      .toLowerCase()
      .includes('ielts'),
    min_cgpa: null,
    requires_work_experience: fullText
      .toLowerCase()
      .includes('work experience'),
    source_url: link,
    is_active: true,
    last_updated: new Date().toISOString(),
    required_documents: [],
    application_steps: [],
    language_requirements: fullText
      .toLowerCase()
      .includes('ielts')
      ? 'IELTS required'
      : fullText.toLowerCase().includes('toefl')
      ? 'TOEFL required'
      : null,
    eligible_nationalities: [],
  }
}

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader =
    request.headers.get('authorization')
  const cronHeader =
    request.headers.get('x-cron-secret')

  const isVercel =
    authHeader === `Bearer ${cronSecret}`
  const isManual = cronHeader === cronSecret

  if (!isVercel && !isManual) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const supabase = createClient(
    supabaseUrl,
    supabaseServiceKey
  )

  const stats = {
    queriesRun: 0,
    resultsFound: 0,
    newScholarships: 0,
    updatedScholarships: 0,
    skipped: 0,
    errors: 0,
  }

  try {
    const allScholarships: any[] = []

    // Run all search queries
    for (const query of SCHOLARSHIP_QUERIES) {
      console.log(`Searching: ${query}`)
      const results = await searchScholarships(query)
      stats.queriesRun++
      stats.resultsFound += results.length

      for (const result of results) {
        const scholarship =
          processSearchResult(result)
        if (scholarship) {
          allScholarships.push(scholarship)
        }
      }

      // Small delay between requests to avoid
      // rate limiting
      await new Promise((r) =>
        setTimeout(r, 500)
      )
    }

    console.log(
      `Processed ${allScholarships.length} potential scholarships`
    )

    // Deduplicate by link
    const seen = new Set<string>()
    const uniqueScholarships = allScholarships.filter(
      (s) => {
        if (seen.has(s.link)) return false
        seen.add(s.link)
        return true
      }
    )

    // Insert or update each scholarship
    for (const scholarship of uniqueScholarships) {
      try {
        // Check if scholarship already exists by link
        const { data: existing } = await supabase
          .from('scholarships')
          .select('id, name')
          .eq('source_url', scholarship.link)
          .maybeSingle()

        if (existing) {
          // Update existing scholarship
          await supabase
            .from('scholarships')
            .update({
              last_updated: scholarship.last_updated,
              is_active: true,
              deadline: scholarship.deadline,
              description: scholarship.description,
            })
            .eq('id', existing.id)

          stats.updatedScholarships++
        } else {
          // Insert new scholarship
          const { error: insertError } =
            await supabase
              .from('scholarships')
              .insert(scholarship)

          if (insertError) {
            console.error(
              'Insert error:',
              insertError.message
            )
            stats.errors++
          } else {
            stats.newScholarships++
          }
        }
      } catch (err) {
        console.error(
          'Processing error:',
          err
        )
        stats.errors++
      }
    }

    // Create admin notification with summary
    await supabase.from('notifications').insert({
      user_id: null,
      type: 'system',
      title: 'Scholarship Database Updated',
      message:
        `Friday update complete. ` +
        `${stats.newScholarships} new scholarships added, ` +
        `${stats.updatedScholarships} updated, ` +
        `${stats.errors} errors. ` +
        `Total queries run: ${stats.queriesRun}.`,
      is_read: false,
      link: '/admin/dashboard/scholarships',
    })

    return NextResponse.json(
      {
        success: true,
        stats,
        message: `Update complete. ${stats.newScholarships} new scholarships added.`,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('Cron job error:', err)
    return NextResponse.json(
      {
        success: false,
        error: 'Cron job failed.',
        stats,
      },
      { status: 500 }
    )
  }
}