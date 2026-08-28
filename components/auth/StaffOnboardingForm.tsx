'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Camera, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const SECRET_QUESTIONS = [
  'What is the name of your primary school?',
  'What is your mother\u2019s maiden name?',
  'What was the name of your first pet?',
  'What city were you born in?',
  'What was the name of your first employer?',
  'What is your favourite childhood nickname?',
  'What was the make of your first car?',
]

const inputCls = 'w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#497296] transition-all'

export default function StaffOnboardingForm() {
  const [mounted, setMounted] = useState(false)
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''

  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarPreview, setAvatarPreview] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [secretQuestion, setSecretQuestion] = useState('')
  const [secretAnswer, setSecretAnswer] = useState('')
  const [secretCode, setSecretCode] = useState('')
  const [confirmCode, setConfirmCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)
  const [staffName, setStaffName] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
    if (token) validateToken()
  }, [token])

  async function validateToken() {
    const res = await fetch(`/api/staff/onboarding?token=${token}`)
    const data = await res.json()
    if (data.valid) {
      setTokenValid(true)
      setStaffName(data.full_name || '')
    } else {
      setTokenValid(false)
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB'); return }
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!avatarFile) { setError('Please upload your profile photo.'); return }
    if (!secretQuestion) { setError('Please select a security question.'); return }
    if (!secretAnswer.trim()) { setError('Please enter your security answer.'); return }
    if (secretCode.length < 6) { setError('Secret code must be at least 6 characters.'); return }
    if (secretCode !== confirmCode) { setError('Secret codes do not match.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('token', token)
      formData.append('avatar', avatarFile)
      formData.append('secret_question', secretQuestion)
      formData.append('secret_answer', secretAnswer)
      formData.append('secret_code', secretCode)
      formData.append('password', password)

      const res = await fetch('/api/staff/onboarding', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (!res.ok) { setError(data.error || 'Something went wrong.'); return }
      setSuccess(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  if (tokenValid === null) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#497296' }} />
      </div>
    )
  }

  if (tokenValid === false) {
    return (
      <div className="text-center py-6">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="font-bold text-lg mb-2" style={{ color: '#062850' }}>Invalid or Expired Link</h3>
        <p className="text-gray-500 text-sm">This onboarding link has expired or is invalid. Please contact your administrator for a new link.</p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="text-center py-6">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="font-bold text-xl mb-2" style={{ color: '#062850' }}>Account Activated!</h3>
        <p className="text-gray-600 text-sm mb-6">Your staff account is now fully set up. You can log in using the staff portal.</p>
        <a href="/auth/staff-login"
          className="inline-block px-8 py-3 rounded-xl text-white font-semibold"
          style={{ backgroundColor: '#062850' }}>
          Go to Staff Login
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {staffName && (
        <p className="text-gray-600 text-sm">
          Welcome, <strong style={{ color: '#062850' }}>{staffName}</strong>!
          Complete the steps below to activate your account.
        </p>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Profile photo */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2">
          Profile Photo * <span className="text-gray-400 font-normal">(appears on your certificates)</span>
        </label>
        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center border-4 flex-shrink-0"
            style={{ borderColor: '#497296', backgroundColor: '#F0F6FB' }}>
            {avatarPreview
              ? <Image src={avatarPreview} alt="Preview" width={80} height={80} className="w-full h-full object-cover" />
              : <span className="text-2xl">👤</span>}
          </div>
          <div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileSelect} />
            <Button type="button" onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 text-white rounded-xl mb-1"
              style={{ backgroundColor: '#497296' }}>
              <Camera className="w-4 h-4" />
              Upload Photo
            </Button>
            <p className="text-xs text-gray-400">JPG, PNG or WebP. Max 5MB.</p>
          </div>
        </div>
      </div>

      {/* Security question */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Security Question *</label>
        <select value={secretQuestion} onChange={(e) => setSecretQuestion(e.target.value)} className={inputCls} required>
          <option value="">Select a security question</option>
          {SECRET_QUESTIONS.map((q) => <option key={q} value={q}>{q}</option>)}
        </select>
      </div>

      {/* Security answer */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your Answer *</label>
        <input type="text" value={secretAnswer} onChange={(e) => setSecretAnswer(e.target.value)}
          className={inputCls} placeholder="Enter your answer" required />
        <p className="text-xs text-gray-400 mt-1">Remember this exactly — it is case insensitive but spelling matters.</p>
      </div>

      {/* Secret code */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
          Secret Code * <span className="text-gray-400 font-normal">(minimum 6 characters)</span>
        </label>
        <div className="relative">
          <input type={showCode ? 'text' : 'password'} value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
            className={inputCls + ' pr-12 font-mono tracking-widest'}
            placeholder="Create a secret code" required />
          <button type="button" onClick={() => setShowCode(!showCode)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm Secret Code *</label>
        <input type={showCode ? 'text' : 'password'} value={confirmCode}
          onChange={(e) => setConfirmCode(e.target.value)}
          className={inputCls + ' font-mono tracking-widest'}
          placeholder="Confirm your secret code" required />
      </div>

      {/* Password */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password *</label>
        <div className="relative">
          <input type={showPassword ? 'text' : 'password'} value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls + ' pr-12'}
            placeholder="Create a password (min 8 characters)" required />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm Password *</label>
        <input type={showPassword ? 'text' : 'password'} value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={inputCls} placeholder="Confirm your password" required />
      </div>

      <Button type="submit" disabled={loading}
        className="w-full py-3 text-white font-semibold rounded-xl"
        style={{ backgroundColor: '#062850' }}>
        {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Activating Account...</> : 'Activate My Account'}
      </Button>
    </form>
  )
}
