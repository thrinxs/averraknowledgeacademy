'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Payout {
  id: string; user_id: string; amount: number; currency: string
  bank_name: string; account_number: string; account_name: string
  status: string; requested_at: string
  profiles?: { full_name: string; email: string } | { full_name: string; email: string }[]
}

export default function AdminPayoutClient({ payouts }: { payouts: Payout[] }) {
  const [processing, setProcessing] = useState<string | null>(null)
  const [done, setDone] = useState<string[]>([])
  const router = useRouter()

  async function markAsPaid(payout: Payout) {
    setProcessing(payout.id)
    try {
      // Update payout status
      await supabase.from('referral_payouts').update({
        status: 'paid',
        paid_at: new Date().toISOString(),
      }).eq('id', payout.id)

      // Update wallet
      const { data: wallet } = await supabase
        .from('referral_wallet')
        .select('pending_payout, total_paid')
        .eq('user_id', payout.user_id)
        .single()

      if (wallet) {
        await supabase.from('referral_wallet').update({
          pending_payout: Math.max(0, (wallet.pending_payout || 0) - payout.amount),
          total_paid: (wallet.total_paid || 0) + payout.amount,
          last_paid_at: new Date().toISOString(),
        }).eq('user_id', payout.user_id)
      }

      // Notify user
      await supabase.from('notifications').insert({
        user_id: payout.user_id,
        type: 'payout',
        title: 'Payout Processed!',
        message: `Your payout of ₦${Number(payout.amount).toLocaleString()} has been processed and sent to your bank account.`,
        is_read: false,
        link: '/dashboard/earn',
      })

      setDone(prev => [...prev, payout.id])
      router.refresh()
    } catch (err) {
      console.error('Failed to mark as paid:', err)
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div className="divide-y divide-gray-50">
      {payouts.map((payout) => {
        const profile = Array.isArray(payout.profiles) ? payout.profiles[0] : payout.profiles as { full_name: string; email: string } | null
        const isPaid = done.includes(payout.id)

        return (
          <div key={payout.id} className="px-6 py-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="font-bold" style={{ color: '#062850' }}>
                  {profile?.full_name || 'Unknown User'}
                </p>
                <p className="text-xs text-gray-500 mb-3">{profile?.email}</p>
                <div className="space-y-1">
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">Bank:</span> {payout.bank_name}
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">Account:</span> {payout.account_number}
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">Name:</span> {payout.account_name}
                  </p>
                  <p className="text-xs text-gray-400">
                    Requested: {new Date(payout.requested_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <p className="text-2xl font-bold" style={{ color: '#062850' }}>
                  ₦{Number(payout.amount).toLocaleString()}
                </p>
                {isPaid ? (
                  <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                    <CheckCircle className="w-4 h-4" /> Marked as Paid
                  </div>
                ) : (
                  <button
                    onClick={() => markAsPaid(payout)}
                    disabled={processing === payout.id}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                    style={{ backgroundColor: '#16A34A' }}
                  >
                    {processing === payout.id
                      ? <><Loader2 className="w-4 h-4 animate-spin" />Processing...</>
                      : <><CheckCircle className="w-4 h-4" />Mark as Paid</>}
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
