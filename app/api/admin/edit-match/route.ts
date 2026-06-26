import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from
  '@/lib/supabase-server'
import { sendMatchEditedEmail } from '@/lib/email'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    // Verify admin
    const serverSupabase =
      await createSupabaseServerClient()
    const {
      data: { user },
    } = await serverSupabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: profile } =
      await serverSupabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden — admin only' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      matchId,
      newScholarshipId,
      scholarshipEdits,
      matchReason,
      adminNotes,
      editNotes,
    } = body

    const supabase = createClient(
      supabaseUrl,
      supabaseServiceKey
    )

    // Get current match data
    const { data: currentMatch } = await supabase
      .from('scholarship_matches')
      .select(`
        *,
        scholarship:scholarships(*),
        profile:profiles!scholarship_matches_user_id_fkey(
          full_name, email
        )
      `)
      .eq('id', matchId)
      .single()

    if (!currentMatch) {
      return NextResponse.json(
        { error: 'Match not found.' },
        { status: 404 }
      )
    }

    const editHistory: any[] = []
    const now = new Date().toISOString()

    // 1. Swap scholarship if requested
    if (
      newScholarshipId &&
      newScholarshipId !==
        currentMatch.scholarship_id
    ) {
      editHistory.push({
        match_id: matchId,
        edited_by: user.id,
        edited_at: now,
        field_changed: 'scholarship_id',
        old_value: currentMatch.scholarship_id,
        new_value: newScholarshipId,
        notes: editNotes || null,
      })

      await supabase
        .from('scholarship_matches')
        .update({
          scholarship_id: newScholarshipId,
          was_edited: true,
          edited_by: user.id,
          edited_at: now,
          edit_notes: editNotes || null,
        })
        .eq('id', matchId)
    }

    // 2. Update match reason if changed
    if (
      matchReason &&
      matchReason !== currentMatch.match_reason
    ) {
      editHistory.push({
        match_id: matchId,
        edited_by: user.id,
        edited_at: now,
        field_changed: 'match_reason',
        old_value: currentMatch.match_reason,
        new_value: matchReason,
        notes: editNotes || null,
      })

      await supabase
        .from('scholarship_matches')
        .update({
          match_reason: matchReason,
          was_edited: true,
          edited_by: user.id,
          edited_at: now,
        })
        .eq('id', matchId)
    }

    // 3. Update admin notes if changed
    if (
      adminNotes !== undefined &&
      adminNotes !== currentMatch.admin_notes
    ) {
      editHistory.push({
        match_id: matchId,
        edited_by: user.id,
        edited_at: now,
        field_changed: 'admin_notes',
        old_value: currentMatch.admin_notes,
        new_value: adminNotes,
        notes: editNotes || null,
      })

      await supabase
        .from('scholarship_matches')
        .update({
          admin_notes: adminNotes,
          was_edited: true,
          edited_by: user.id,
          edited_at: now,
        })
        .eq('id', matchId)
    }

    // 4. Update scholarship details if provided
    if (
      scholarshipEdits &&
      Object.keys(scholarshipEdits).length > 0
    ) {
      const scholarshipId =
        newScholarshipId ||
        currentMatch.scholarship_id

      const currentScholarship =
        currentMatch.scholarship

      for (const [field, newValue] of Object.entries(
        scholarshipEdits
      )) {
        const oldValue =
          currentScholarship[field]

        if (
          oldValue !== newValue &&
          newValue !== undefined
        ) {
          editHistory.push({
            match_id: matchId,
            edited_by: user.id,
            edited_at: now,
            field_changed: `scholarship.${field}`,
            old_value: String(oldValue || ''),
            new_value: String(newValue || ''),
            notes: editNotes || null,
          })
        }
      }

      if (Object.keys(scholarshipEdits).length > 0) {
        await supabase
          .from('scholarships')
          .update(scholarshipEdits)
          .eq('id', scholarshipId)
      }
    }

    // 5. Save edit history
    if (editHistory.length > 0) {
      await supabase
        .from('match_edit_history')
        .insert(editHistory)
    }

    // 6. Notify user if anything was changed
    if (editHistory.length > 0) {
      const userId = currentMatch.user_id
      const userName =
        currentMatch.profile?.full_name ||
        'Student'
      const userEmail =
        currentMatch.profile?.email

      // In-app notification
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'matches',
          title:
            'Your Scholarship Match Has Been Updated',
          message:
            'Our team has reviewed and updated ' +
            'one of your scholarship matches to ' +
            'ensure the most accurate and ' +
            'up-to-date information for your ' +
            'profile. Please log in to your ' +
            'dashboard to view the changes.',
          is_read: false,
          link: '/dashboard/matches',
        })

      // Internal message
      await supabase.from('messages').insert({
        receiver_id: userId,
        sender_id: null,
        sender_name: 'Averra Team',
        sender_role: 'admin',
        recipient_role: 'scholarship_advisor',
        topic: 'Scholarship Match Updated',
        content:
          'Our team has reviewed your ' +
          'scholarship matches and made an ' +
          'update to ensure you have the most ' +
          'accurate and current information.\n\n' +
          'Please visit your dashboard to view ' +
          'the updated match details. If you ' +
          'have any questions about the changes, ' +
          'please send us a message and we will ' +
          'be happy to explain.\n\n' +
          'We are committed to finding you the ' +
          'best possible opportunities.',
        is_read: false,
      })

      // Email notification
      if (userEmail) {
        await sendMatchEditedEmail({
          to: userEmail,
          name: userName,
        }).catch((err) =>
          console.error(
            'Match edited email error:',
            err
          )
        )
      }
    }

    return NextResponse.json(
      {
        success: true,
        editsCount: editHistory.length,
        message: `${editHistory.length} change${editHistory.length === 1 ? '' : 's'} saved and user notified.`,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('Edit match error:', err)
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    )
  }
}