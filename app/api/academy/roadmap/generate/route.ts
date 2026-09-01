import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

interface CurriculumUnit {
  unit: string
  topics: string[]
  subtopics?: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { child_id, enrollment_id } = await request.json()
    if (!child_id || !enrollment_id) {
      return NextResponse.json({ error: 'child_id and enrollment_id required' }, { status: 400 })
    }

    const admin = getAdminClient()

    // Get child details
    const { data: child } = await admin
      .from('academy_children')
      .select('subjects, year_group_code')
      .eq('id', child_id)
      .single()

    if (!child) return NextResponse.json({ error: 'Child not found' }, { status: 404 })

    const yearCode = child.year_group_code
    const subjects: string[] = child.subjects || []

    // Check if roadmap already exists
    const { count } = await admin
      .from('learning_roadmap_progress')
      .select('id', { count: 'exact', head: true })
      .eq('child_id', child_id)

    if (count && count > 0) {
      return NextResponse.json({ success: true, message: 'Roadmap already exists', skipped: true })
    }

    const rowsToInsert: Record<string, unknown>[] = []

    for (const subjectCode of subjects) {
      // Get curriculum for this subject and year group
      const { data: curriculum } = await admin
        .from('averra_super_curriculum')
        .select('topics')
        .eq('year_group_code', yearCode)
        .eq('subject_code', subjectCode)
        .maybeSingle()

      if (!curriculum?.topics) continue

      const units: CurriculumUnit[] = Array.isArray(curriculum.topics)
        ? curriculum.topics
        : []

      let topicIndex = 0
      for (const unit of units) {
        const topics: string[] = unit.topics || []
        for (const topicName of topics) {
          rowsToInsert.push({
            child_id,
            enrollment_id,
            subject_code: subjectCode,
            topic_unit: unit.unit,
            topic_name: topicName,
            topic_index: topicIndex,
            status: topicIndex === 0 ? 'current' : 'upcoming',
          })
          topicIndex++
        }
      }
    }

    if (rowsToInsert.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No curriculum content found for this year group',
        topics_created: 0,
      })
    }

    // Insert in batches of 50
    const batchSize = 50
    for (let i = 0; i < rowsToInsert.length; i += batchSize) {
      const batch = rowsToInsert.slice(i, i + batchSize)
      await admin.from('learning_roadmap_progress').insert(batch)
    }

    return NextResponse.json({
      success: true,
      topics_created: rowsToInsert.length,
      subjects: subjects.length,
    })
  } catch (err) {
    console.error('Roadmap generate error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
