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
      name,
      email,
      course_slug,
      course_name,
    } = body

    if (!name || !email || !course_slug) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields.',
        },
        { status: 400 }
      )
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseServiceKey
    )

    const { error } = await supabase
      .from('course_waitlist')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        course_slug,
        course_name,
      })

    if (error) {
      if (
        error.message.includes('duplicate') ||
        error.message.includes('unique')
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              'You are already on the waitlist for this course.',
          },
          { status: 200 }
        )
      }
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (err) {
    console.error('Waitlist error:', err)
    return NextResponse.json(
      {
        success: false,
        error: 'Something went wrong.',
      },
      { status: 500 }
    )
  }
}