import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

const BASE_URL = 'https://www.averraknowledgeacademy.com'

const SERVICES = [
  { name: 'Scholarship', slug: 'scholarship', description: 'Scholarship matching service' },
  { name: 'Junior Academy', slug: 'academy/junior', description: 'Ages 5-18 live tutoring' },
  { name: 'Skills Courses', slug: 'skills', description: 'Practical skills training' },
  { name: 'Career Training', slug: 'careers', description: 'Career coaching and training' },
]

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = getAdminClient()

    // Get or create wallet
    let { data: wallet } = await admin
      .from('referral_wallet')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!wallet) {
      const { data: newWallet } = await admin
        .from('referral_wallet')
        .insert({ user_id: user.id })
        .select()
        .single()
      wallet = newWallet
    }

    // Get referral history
    const { data: referrals } = await admin
      .from('referrals')
      .select('*')
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false })

    // Generate ref code from user ID
    const refCode = user.id.slice(0, 8).toUpperCase()

    // Build referral links
    const links = SERVICES.map(s => ({
      ...s,
      ref_code: refCode,
      url: `${BASE_URL}/${s.slug}?ref=${refCode}`,
      whatsapp_url: `https://wa.me/?text=${encodeURIComponent(
        `Join me on Averra Knowledge Academy — ${s.description}! Use my referral link: ${BASE_URL}/${s.slug}?ref=${refCode}`
      )}`,
    }))

    return NextResponse.json({
      ref_code: refCode,
      wallet: wallet || { total_earned: 0, total_paid: 0, pending_payout: 0 },
      referrals: referrals || [],
      links,
    })
  } catch (err) {
    console.error('Referral GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
