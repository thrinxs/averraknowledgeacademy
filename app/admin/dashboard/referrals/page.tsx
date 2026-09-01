import { createClient } from '@supabase/supabase-js'
import { DollarSign, Clock, CheckCircle, Users } from 'lucide-react'
import AdminPayoutClient from '@/components/admin/AdminPayoutClient'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export default async function AdminReferralsPage() {
  const admin = getAdminClient()

  const { data: payouts } = await admin
    .from('referral_payouts')
    .select('*, profiles(full_name, email)')
    .order('requested_at', { ascending: false })

  const { data: referrals } = await admin
    .from('referrals')
    .select('*, profiles!referrer_id(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(50)

  const totalPending = (payouts || [])
    .filter(p => p.status === 'requested')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0)

  const totalPaidOut = (payouts || [])
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0)

  const pendingPayouts = (payouts || []).filter(p => p.status === 'requested')

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>
          Referral Program
        </h1>
        <p className="text-gray-500 text-sm">
          Manage payout requests and view referral activity. Process payouts every Friday.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Referrals', value: referrals?.length || 0, icon: Users, color: '#497296' },
          { label: 'Pending Payouts', value: `₦${totalPending.toLocaleString()}`, icon: Clock, color: '#F59E0B' },
          { label: 'Paid Out Total', value: `₦${totalPaidOut.toLocaleString()}`, icon: DollarSign, color: '#16A34A' },
          { label: 'Payout Requests', value: pendingPayouts.length, icon: CheckCircle, color: '#062850' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center gap-3 mb-2">
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
            <p className="text-xl font-bold" style={{ color: '#062850' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Payout requests */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-lg" style={{ color: '#062850' }}>Payout Requests</h2>
          {pendingPayouts.length > 0 && (
            <span className="text-xs px-3 py-1 rounded-full font-semibold text-white"
              style={{ backgroundColor: '#F59E0B' }}>
              {pendingPayouts.length} pending
            </span>
          )}
        </div>

        {pendingPayouts.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <p className="text-gray-500">No pending payout requests</p>
          </div>
        ) : (
          <AdminPayoutClient payouts={pendingPayouts} />
        )}
      </div>

      {/* Recent referrals */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-lg" style={{ color: '#062850' }}>Recent Referrals</h2>
        </div>
        {(!referrals || referrals.length === 0) ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 mx-auto mb-3" style={{ color: '#D1D5DB' }} />
            <p className="text-gray-500">No referrals yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {referrals.map((ref) => {
              const referrer = Array.isArray(ref.profiles) ? ref.profiles[0] : ref.profiles as { full_name: string; email: string } | null
              return (
                <div key={ref.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#062850' }}>
                      {referrer?.full_name || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500">{referrer?.email} → {ref.service}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(ref.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold" style={{ color: '#062850' }}>
                      ₦{Number(ref.commission_amount || 0).toLocaleString()}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full font-medium capitalize"
                      style={{
                        backgroundColor: ref.status === 'earned' ? '#F0FDF4' : ref.status === 'paid' ? '#EBF4FF' : '#FFF8F0',
                        color: ref.status === 'earned' ? '#16A34A' : ref.status === 'paid' ? '#497296' : '#F59E0B',
                      }}>
                      {ref.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
