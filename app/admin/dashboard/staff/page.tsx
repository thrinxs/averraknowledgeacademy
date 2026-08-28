'use client'

import { useState, useEffect } from 'react'
import { Loader2, UserPlus, Unlock, CheckCircle, AlertCircle, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

type StaffMember = {
  user_id: string
  full_name: string
  email: string
  role: string
  onboarding_completed: boolean
  locked_at: string | null
  failed_attempts: number
}

const inputCls = 'w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#497296] transition-all'

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [inviting, setInviting] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState('')
  const [inviteError, setInviteError] = useState('')
  const [form, setForm] = useState({ full_name: '', email: '', role: 'staff' })
  const [unlocking, setUnlocking] = useState<string | null>(null)

  useEffect(() => { loadStaff() }, [])

  async function loadStaff() {
    setLoading(true)
    const res = await fetch('/api/staff/list')
    if (res.ok) {
      const data = await res.json()
      setStaff(data.staff || [])
    }
    setLoading(false)
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviting(true)
    setInviteError('')
    setInviteSuccess('')
    try {
      const res = await fetch('/api/staff/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setInviteError(data.error || 'Failed to send invite'); return }
      setInviteSuccess(`Invitation sent to ${form.email}`)
      setForm({ full_name: '', email: '', role: 'staff' })
      loadStaff()
    } catch {
      setInviteError('Something went wrong.')
    } finally {
      setInviting(false)
    }
  }

  async function handleUnlock(userId: string) {
    setUnlocking(userId)
    await fetch('/api/staff/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    })
    setUnlocking(null)
    loadStaff()
  }

  return (
    <div className="p-6 md:p-10">

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>
          Staff Management
        </h1>
        <p className="text-gray-500 text-sm">Invite staff, trainers and admins. Manage locked accounts.</p>
      </div>

      {/* Invite form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
        <h2 className="font-bold text-lg mb-5 flex items-center gap-2" style={{ color: '#062850' }}>
          <UserPlus className="w-5 h-5" style={{ color: '#497296' }} />
          Invite Staff Member
        </h2>

        {inviteSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <p className="text-green-700 text-sm">{inviteSuccess}</p>
          </div>
        )}
        {inviteError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-red-700 text-sm">{inviteError}</p>
          </div>
        )}

        <form onSubmit={handleInvite} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
            <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className={inputCls} placeholder="e.g. John Smith" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputCls} placeholder="staff@email.com" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
              className={inputCls}>
              <option value="staff">Staff</option>
              <option value="trainer">Trainer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <Button type="submit" disabled={inviting}
              className="flex items-center gap-2 text-white px-8 py-3 rounded-xl"
              style={{ backgroundColor: '#062850' }}>
              {inviting
                ? <><Loader2 className="w-4 h-4 animate-spin" />Sending Invite...</>
                : <><Mail className="w-4 h-4" />Send Onboarding Invite</>}
            </Button>
          </div>
        </form>
      </div>

      {/* Staff list */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-lg" style={{ color: '#062850' }}>All Staff Members</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#497296' }} />
          </div>
        ) : staff.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No staff members yet. Invite someone above.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {staff.map((member) => (
              <div key={member.user_id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: '#062850' }}>
                    {member.full_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{member.email}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium capitalize"
                    style={{
                      backgroundColor: member.role === 'admin' ? '#FEF2F2' : '#F0F6FB',
                      color: member.role === 'admin' ? '#DC2626' : '#497296',
                    }}>
                    {member.role}
                  </span>
                  {member.onboarding_completed ? (
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-50 text-green-700">
                      Active
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-amber-50 text-amber-700">
                      Pending Setup
                    </span>
                  )}
                  {member.locked_at && (
                    <Button
                      onClick={() => handleUnlock(member.user_id)}
                      disabled={unlocking === member.user_id}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl text-white"
                      style={{ backgroundColor: '#DC2626' }}>
                      {unlocking === member.user_id
                        ? <Loader2 className="w-3 h-3 animate-spin" />
                        : <><Unlock className="w-3 h-3" />Unlock</>}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
