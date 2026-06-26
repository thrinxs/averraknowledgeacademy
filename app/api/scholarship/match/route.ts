import { NextRequest, NextResponse } from 'next/server'
import { runMatchingAlgorithm } from '@/lib/matching'

export async function POST(request: NextRequest) {
  try {
    const body     = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required.' },
        { status: 400 }
      )
    }

    const result = await runMatchingAlgorithm(userId)

    if (!result.success) {
      const status =
        result.error === 'Payment not confirmed.' ? 403 :
        result.error === 'No scholarship application found.' ? 404 :
        400

      return NextResponse.json(
        { success: false, error: result.error },
        { status }
      )
    }

    return NextResponse.json(
      {
        success:    true,
        matchCount: result.matchCount,
        message:    `Successfully matched ${result.matchCount} scholarships.`,
      },
      { status: 200 }
    )

  } catch (err) {
    console.error('[Match Route] Unexpected error:', err)
    return NextResponse.json(
      { success: false, error: 'Something went wrong.' },
      { status: 500 }
    )
  }
}