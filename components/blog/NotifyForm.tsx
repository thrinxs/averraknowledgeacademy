'use client'

import { useState } from 'react'
import { Bell, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NotifyFormProps {
  placeholder?: string
}

export default function NotifyForm({
  placeholder = 'Enter your email address',
}: NotifyFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/skills/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'blog' }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || 'Something went wrong. Please try again.')
      }

      setStatus('success')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center justify-center gap-2 text-green-400 font-medium text-lg">
        <CheckCircle className="w-5 h-5" />
        You&apos;re on the list! We&apos;ll notify you when we launch.
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
      >
        <input
          type="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          required
          disabled={status === 'loading'}
          className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/50 transition-all disabled:opacity-50"
        />
        <Button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:hover:scale-100 disabled:opacity-70"
          style={{ backgroundColor: '#497296', color: '#fff' }}
        >
          {status === 'loading' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Bell className="w-4 h-4 mr-2" />
          )}
          {status === 'loading' ? 'Submitting...' : 'Notify Me'}
        </Button>
      </form>

      {status === 'error' && (
        <p className="text-red-400 text-sm">{errorMsg}</p>
      )}
    </div>
  )
}