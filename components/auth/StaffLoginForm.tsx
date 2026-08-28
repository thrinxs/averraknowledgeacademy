'use client'

import { useState } from 'react'
import { Eye, EyeOff, Loader2, Lock, Shield, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

const inputCls = 'w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#497296] transition-all'

type Step = 1 | 2 | 3

export default function StaffLoginForm() {
  const [step, setStep] = useState<Step>(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [secretAnswer, setSecretAnswer] = useState('')
  const [secretCode, setSecretCode] = useState('')
  const [showCode, setShowCode] = useState(false)
  const [secretQuestion, setSecretQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [locked, setLocked] = useState(false)

  // Step 1 — email + password
  async function handleStep1(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) { setError('Invalid email or password.'); setLoading(false); return }

      // Check role is staff/admin/trainer
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', (await supabase.auth.getUser()).data.user?.id || '')
        .single()

      if (!profile || !['admin', 'staff', 'trainer'].includes(profile.role)) {
        await supabase.auth.signOut()
        setError('This login is for staff only. Please use the main login page.')
        setLoading(false)
        return
      }

      // Fetch their secret question
      const res = await fetch('/api/staff/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'get_question' }),
      })
      const data = await res.json()
      if (!res.ok || !data.secret_question) {
        setError('Your staff account setup is incomplete. Please contact admin.')
        await supabase.auth.signOut()
        setLoading(false)
        return
      }

      setSecretQuestion(data.secret_question)
      setStep(2)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2 — secret question
  async function handleStep2(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/staff/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'verify_answer', secret_answer: secretAnswer }),
      })
      const data = await res.json()

      if (data.locked) {
        setLocked(true)
        setError('Your account has been locked after 3 failed attempts. Please contact your administrator.')
        await supabase.auth.signOut()
        return
      }

      if (!res.ok || !data.success) {
        const attempts = data.failed_attempts || failedAttempts + 1
        setFailedAttempts(attempts)
        setError(`Incorrect answer. ${3 - attempts} attempt${3 - attempts === 1 ? '' : 's'} remaining.`)
        return
      }

      setStep(3)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Step 3 — secret code
  async function handleStep3(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/staff/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'verify_code', secret_code: secretCode }),
      })
      const data = await res.json()

      if (data.locked) {
        setLocked(true)
        setError('Your account has been locked after 3 failed attempts. Please contact your administrator.')
        await supabase.auth.signOut()
        return
      }

      if (!res.ok || !data.success) {
        const attempts = data.failed_attempts || failedAttempts + 1
        setFailedAttempts(attempts)
        setError(`Incorrect code. ${3 - attempts} attempt${3 - attempts === 1 ? '' : 's'} remaining.`)
        return
      }

      // All steps passed — redirect to role dashboard
      window.location.href = data.redirect || '/admin/dashboard'
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (locked) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="font-bold text-lg mb-2" style={{ color: '#062850' }}>Account Locked</h3>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          Your account has been locked due to too many failed attempts.
          Please contact your administrator to unlock it.
        </p>
        <a href="https://wa.me/2349033440966" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold"
          style={{ backgroundColor: '#16A34A' }}>
          Contact Admin on WhatsApp
        </a>
      </div>
    )
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all"
              style={{
                backgroundColor: step >= s ? '#062850' : '#F0F6FB',
                color: step >= s ? '#ffffff' : '#9CA3AF',
              }}
            >
              {s}
            </div>
            {s < 3 && (
              <div className="flex-1 h-0.5 rounded-full transition-all"
                style={{ backgroundColor: step > s ? '#062850' : '#E5E7EB' }} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <form onSubmit={handleStep1} className="space-y-4">
          <div>
            <h2 className="text-lg font-bold mb-1" style={{ color: '#062850' }}>Sign In</h2>
            <p className="text-gray-500 text-sm mb-5">Enter your staff credentials to continue.</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className={inputCls} placeholder="your@email.com" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls + ' pr-12'} placeholder="Your password" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" disabled={loading}
            className="w-full py-3 text-white font-semibold rounded-xl"
            style={{ backgroundColor: '#062850' }}>
            {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Verifying...</> : 'Continue'}
          </Button>
        </form>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <form onSubmit={handleStep2} className="space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: '#F0F6FB' }}>
              <Shield className="w-5 h-5" style={{ color: '#497296' }} />
            </div>
            <h2 className="text-lg font-bold mb-1" style={{ color: '#062850' }}>Security Question</h2>
            <p className="text-gray-500 text-sm mb-5">Answer your security question to proceed.</p>
          </div>
          <div
            className="p-4 rounded-xl border-2 mb-2"
            style={{ borderColor: '#497296', backgroundColor: '#F0F6FB' }}>
            <p className="text-xs text-gray-500 mb-1">Your security question:</p>
            <p className="font-semibold text-sm" style={{ color: '#062850' }}>{secretQuestion}</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your Answer</label>
            <input type="text" value={secretAnswer} onChange={(e) => setSecretAnswer(e.target.value)}
              className={inputCls} placeholder="Enter your answer" required autoFocus />
          </div>
          <Button type="submit" disabled={loading}
            className="w-full py-3 text-white font-semibold rounded-xl"
            style={{ backgroundColor: '#062850' }}>
            {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Verifying...</> : 'Verify Answer'}
          </Button>
        </form>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <form onSubmit={handleStep3} className="space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: '#F0F6FB' }}>
              <Lock className="w-5 h-5" style={{ color: '#497296' }} />
            </div>
            <h2 className="text-lg font-bold mb-1" style={{ color: '#062850' }}>Secret Code</h2>
            <p className="text-gray-500 text-sm mb-5">Enter your personal secret code to complete login.</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Secret Code</label>
            <div className="relative">
              <input type={showCode ? 'text' : 'password'} value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                className={inputCls + ' pr-12 font-mono tracking-widest'}
                placeholder="Enter your secret code" required autoFocus />
              <button type="button" onClick={() => setShowCode(!showCode)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" disabled={loading}
            className="w-full py-3 text-white font-semibold rounded-xl"
            style={{ backgroundColor: '#062850' }}>
            {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Verifying...</> : 'Access Dashboard'}
          </Button>
        </form>
      )}
    </div>
  )
}
