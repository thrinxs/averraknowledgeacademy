'use client'

import { useState, useEffect, useCallback } from 'react'
import { Copy, Check, Share2, ExternalLink, Loader2, AlertCircle, CheckCircle, DollarSign, Users, TrendingUp, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ReferralLink {
  name: string; slug: string; description: string
  ref_code: string; url: string; whatsapp_url: string
}

interface Referral {
  id: string; service: string; status: string
  commission_amount: number; currency: string; created_at: string
}

interface Wallet {
  total_earned: number; total_paid: number; pending_payout: number
  bank_name?: string; account_number?: string; account_name?: string
}

const inputCls = 'w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#497296] transition-all'

export default function EarnPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [links, setLinks] = useState<ReferralLink[]>([])
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [showPayoutForm, setShowPayoutForm] = useState(false)
  const [payoutAmount, setPayoutAmount] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [submittingPayout, setSubmittingPayout] = useState(false)
  const [payoutSuccess, setPayoutSuccess] = useState(false)
  const [payoutError, setPayoutError] = useState('')

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/referral')
      const data = await res.json()
      if (data.links) setLinks(data.links)
      if (data.wallet) {
        setWallet(data.wallet)
        setBankName(data.wallet.bank_name || '')
        setAccountNumber(data.wallet.account_number || '')
        setAccountName(data.wallet.account_name || '')
      }
      if (data.referrals) setReferrals(data.referrals)
    } catch (err) {
      console.error('Failed to load referral data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { setMounted(true); loadData() }, [loadData])

  function copyToClipboard(url: string) {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  async function handlePayoutRequest() {
    setPayoutError('')
    if (!payoutAmount || Number(payoutAmount) <= 0) {
      setPayoutError('Please enter a valid amount')
      return
    }
    if (!bankName || !accountNumber || !accountName) {
      setPayoutError('Please fill in all bank details')
      return
    }
    setSubmittingPayout(true)
    try {
      const res = await fetch('/api/referral/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(payoutAmount),
          bank_name: bankName,
          account_number: accountNumber,
          account_name: accountName,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPayoutSuccess(true)
      setShowPayoutForm(false)
      setPayoutAmount('')
      loadData()
    } catch (err) {
      setPayoutError(err instanceof Error ? err.message : 'Failed to submit request')
    } finally {
      setSubmittingPayout(false)
    }
  }

  const STATUS_COLORS: Record<string, string> = {
    earned: '#16A34A', pending: '#F59E0B', paid: '#497296', cancelled: '#DC2626',
  }
  const STATUS_BG: Record<string, string> = {
    earned: '#F0FDF4', pending: '#FFF8F0', paid: '#EBF4FF', cancelled: '#FEF2F2',
  }

  if (!mounted) return null

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#497296' }} />
    </div>
  )

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>
          Earn With Averra
        </h1>
        <p className="text-gray-500 text-sm">
          Share your referral links. Earn 10% of the first month fee for every person who joins using your link.
          Payments are made every Friday.
        </p>
      </div>

      {/* Wallet stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Earned', value: `₦${(wallet?.total_earned || 0).toLocaleString()}`, icon: TrendingUp, color: '#16A34A', bg: '#F0FDF4' },
          { label: 'Pending Payout', value: `₦${(wallet?.pending_payout || 0).toLocaleString()}`, icon: Clock, color: '#F59E0B', bg: '#FFF8F0' },
          { label: 'Total Paid Out', value: `₦${(wallet?.total_paid || 0).toLocaleString()}`, icon: DollarSign, color: '#497296', bg: '#EBF4FF' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: stat.bg }}>
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: '#062850' }}>{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Referrals count */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#EBF4FF' }}>
          <Users className="w-6 h-6" style={{ color: '#497296' }} />
        </div>
        <div>
          <p className="text-2xl font-bold" style={{ color: '#062850' }}>{referrals.length}</p>
          <p className="text-xs text-gray-500">Total Referrals</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs font-semibold" style={{ color: '#062850' }}>How it works</p>
          <p className="text-xs text-gray-500">You earn 10% of the first month fee when your referral makes payment</p>
        </div>
      </div>

      {/* Payout section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg" style={{ color: '#062850' }}>Request Payout</h2>
          <span className="text-xs px-3 py-1 rounded-full font-semibold"
            style={{ backgroundColor: '#EBF4FF', color: '#497296' }}>
            Paid every Friday
          </span>
        </div>

        {payoutSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <p className="text-green-700 text-sm">Payout request submitted! We will process it on Friday.</p>
          </div>
        )}

        <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: '#F0F6FB' }}>
          <p className="text-sm font-semibold mb-1" style={{ color: '#062850' }}>
            Available balance: <span style={{ color: '#16A34A' }}>₦{(wallet?.pending_payout || 0).toLocaleString()}</span>
          </p>
          <p className="text-xs text-gray-500">
            You can also use your earnings to offset fees on any Averra service at checkout.
          </p>
        </div>

        {!showPayoutForm ? (
          <Button onClick={() => setShowPayoutForm(true)}
            disabled={!wallet || wallet.pending_payout <= 0}
            className="flex items-center gap-2 text-white rounded-xl px-6"
            style={{ backgroundColor: wallet && wallet.pending_payout > 0 ? '#062850' : '#9CA3AF' }}>
            <DollarSign className="w-4 h-4" /> Request Payout
          </Button>
        ) : (
          <div className="space-y-3">
            {payoutError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{payoutError}</p>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Amount (₦)</label>
              <input type="number" value={payoutAmount} onChange={(e) => setPayoutAmount(e.target.value)}
                className={inputCls} placeholder="Enter amount"
                max={wallet?.pending_payout || 0} />
              <p className="text-xs text-gray-400 mt-1">Max: ₦{(wallet?.pending_payout || 0).toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Bank Name</label>
              <input value={bankName} onChange={(e) => setBankName(e.target.value)}
                className={inputCls} placeholder="e.g. Access Bank" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Account Number</label>
              <input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)}
                className={inputCls} placeholder="10-digit account number" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Account Name</label>
              <input value={accountName} onChange={(e) => setAccountName(e.target.value)}
                className={inputCls} placeholder="As it appears on your bank account" />
            </div>
            <div className="flex gap-3">
              <Button onClick={handlePayoutRequest} disabled={submittingPayout}
                className="flex-1 text-white rounded-xl" style={{ backgroundColor: '#062850' }}>
                {submittingPayout ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Submitting...</> : 'Submit Request'}
              </Button>
              <Button variant="outline" onClick={() => { setShowPayoutForm(false); setPayoutError('') }}
                className="rounded-xl">Cancel</Button>
            </div>
          </div>
        )}
      </div>

      {/* Referral links */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-lg mb-5" style={{ color: '#062850' }}>Your Referral Links</h2>
        <div className="space-y-4">
          {links.map((link) => (
            <div key={link.slug} className="p-4 rounded-xl border border-gray-100"
              style={{ backgroundColor: '#FAFAFA' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-sm" style={{ color: '#062850' }}>{link.name}</p>
                <p className="text-xs text-gray-400">{link.description}</p>
              </div>

              {/* URL display */}
              <div className="flex items-center gap-2 p-2 rounded-lg border border-gray-100 bg-white mb-3">
                <code className="text-xs text-gray-600 flex-1 truncate">{link.url}</code>
                <button onClick={() => copyToClipboard(link.url)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium flex-shrink-0 transition-all"
                  style={{ backgroundColor: copiedUrl === link.url ? '#F0FDF4' : '#F0F6FB', color: copiedUrl === link.url ? '#16A34A' : '#497296' }}>
                  {copiedUrl === link.url ? <><Check className="w-3 h-3" />Copied!</> : <><Copy className="w-3 h-3" />Copy</>}
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 flex-wrap">
                <a href={link.whatsapp_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-white text-xs font-semibold"
                  style={{ backgroundColor: '#16A34A' }}>
                  <Share2 className="w-3 h-3" /> Share on WhatsApp
                </a>
                <a href={link.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                  <ExternalLink className="w-3 h-3" /> Preview Link
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commission rates */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-lg mb-4" style={{ color: '#062850' }}>Commission Rates</h2>
        <div className="space-y-2">
          {[
            { service: 'Scholarship Basic', commission: '₦3,000' },
            { service: 'Scholarship Standard', commission: '₦5,000' },
            { service: 'Scholarship Premium', commission: '₦15,000' },
            { service: 'Academy Standard (General Class)', commission: '₦5,000 / £3' },
            { service: 'Academy Premium (Private Class)', commission: '₦10,000 / £5.50' },
          ].map((item) => (
            <div key={item.service} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-600">{item.service}</span>
              <span className="text-sm font-bold" style={{ color: '#16A34A' }}>{item.commission}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Commission is 10% of the first month fee, paid after the referred person makes their first payment.
          Unlimited referrals. No cap on earnings.
        </p>
      </div>

      {/* Referral history */}
      {referrals.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-lg mb-4" style={{ color: '#062850' }}>Referral History</h2>
          <div className="space-y-3">
            {referrals.map((ref) => (
              <div key={ref.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#062850' }}>{ref.service}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(ref.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold" style={{ color: '#062850' }}>
                    ₦{Number(ref.commission_amount || 0).toLocaleString()}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full font-medium capitalize"
                    style={{ backgroundColor: STATUS_BG[ref.status] || '#F0F6FB', color: STATUS_COLORS[ref.status] || '#497296' }}>
                    {ref.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
