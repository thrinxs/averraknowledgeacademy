import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { amount, bank_name, account_number, account_name } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }
    if (!bank_name || !account_number || !account_name) {
      return NextResponse.json({ error: 'Bank details required' }, { status: 400 })
    }

    const admin = getAdminClient()

    // Check wallet balance
    const { data: wallet } = await admin
      .from('referral_wallet')
      .select('pending_payout')
      .eq('user_id', user.id)
      .single()

    if (!wallet || wallet.pending_payout < amount) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    }

    // Create payout request
    await admin.from('referral_payouts').insert({
      user_id: user.id,
      amount,
      currency: 'NGN',
      bank_name,
      account_number,
      account_name,
      status: 'requested',
    })

    // Update wallet bank details
    await admin.from('referral_wallet').update({
      bank_name,
      account_number,
      account_name,
    }).eq('user_id', user.id)

    // Notify admin
    const { data: adminUsers } = await admin
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1)

    if (adminUsers?.[0]) {
      await admin.from('notifications').insert({
        user_id: adminUsers[0].id,
        type: 'payout',
        title: 'New Payout Request',
        message: `A user has requested a payout of ₦${Number(amount).toLocaleString()}.`,
        is_read: false,
        link: '/admin/dashboard/referrals',
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Payout request error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
