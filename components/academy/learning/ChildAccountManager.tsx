'use client'

import { useState } from 'react'
import { Eye, EyeOff, CheckCircle, Loader2, AlertCircle, User, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Child {
  id: string; full_name: string; year_group_label: string
  subjects: string[]; child_user_id: string | null
}

const inputCls = 'w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#497296] transition-all'
const SUBJECT_NAMES: Record<string, string> = {
  ENG: 'English Language', MATH: 'Mathematics', SCI: 'Science',
  COMP: 'Computing', HIST: 'History', GEO: 'Geography',
}

export default function ChildAccountManager({ children }: { children: Child[] }) {
  const [creatingFor, setCreatingFor] = useState<string | null>(null)
  const [form, setForm] = useState({ email: '', password: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<Record<string, boolean>>({})

  async function handleCreate(child: Child) {
    setError('')
    if (!form.email || !form.email.includes('@')) { setError('Enter a valid email'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/academy/child-account/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          child_db_id: child.id,
          child_email: form.email,
          child_name: child.full_name,
          temp_password: form.password,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuccess(prev => ({ ...prev, [child.id]: true }))
      setCreatingFor(null)
      setForm({ email: '', password: '', confirm: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {children.map(child => {
        const hasAccount = child.child_user_id || success[child.id]
        const isCreating = creatingFor === child.id

        return (
          <div key={child.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between"
              style={{ backgroundColor: '#062850' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: '#497296' }}>
                  {child.full_name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-white">{child.full_name}</p>
                  <p className="text-blue-300 text-xs">{child.year_group_label}</p>
                </div>
              </div>
              {hasAccount ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-xs text-green-300 font-semibold">Account Active</span>
                </div>
              ) : (
                <button onClick={() => { setCreatingFor(isCreating ? null : child.id); setError('') }}
                  className="text-xs px-3 py-1.5 rounded-xl font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors">
                  {isCreating ? 'Cancel' : 'Create Login'}
                </button>
              )}
            </div>

            <div className="p-5">
              {/* Subjects */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {child.subjects.map(s => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                    style={{ backgroundColor: '#497296' }}>
                    {SUBJECT_NAMES[s] || s}
                  </span>
                ))}
              </div>

              {hasAccount && !isCreating && (
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                  <p className="text-sm font-semibold text-green-700 mb-1">✅ Child account is set up</p>
                  <p className="text-xs text-green-600">
                    {child.full_name} can log in independently at{' '}
                    <a href="/auth/login" className="underline font-semibold">averraknowledgeacademy.com/auth/login</a>
                  </p>
                </div>
              )}

              {isCreating && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl mb-2" style={{ backgroundColor: '#EBF4FF' }}>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Create a login for <strong>{child.full_name}</strong>. They will receive an email with their login details.
                      You can still monitor their progress from your account.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Child's Email Address
                    </label>
                    <input type="email" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className={inputCls} placeholder="child@email.com" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Password
                    </label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        className={inputCls + ' pr-12'} placeholder="Minimum 8 characters" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm Password</label>
                    <input type={showPassword ? 'text' : 'password'} value={form.confirm}
                      onChange={e => setForm({ ...form, confirm: e.target.value })}
                      className={inputCls} placeholder="Repeat password" />
                  </div>

                  <Button onClick={() => handleCreate(child)} disabled={loading}
                    className="w-full text-white font-semibold rounded-xl py-3"
                    style={{ backgroundColor: '#062850' }}>
                    {loading
                      ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Creating Account...</>
                      : <><User className="w-4 h-4 mr-2" />Create {child.full_name}'s Account</>}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )
      })}

      {children.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <User className="w-12 h-12 mx-auto mb-4" style={{ color: '#D1D5DB' }} />
          <p className="text-gray-500">No learners enrolled yet</p>
        </div>
      )}
    </div>
  )
}
