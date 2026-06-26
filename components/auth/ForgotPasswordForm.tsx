'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

const inputClass = `w-full px-4 py-3 rounded-xl border
text-sm transition-all duration-200 focus:outline-none
focus:ring-2`

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleResetRequest = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=/auth/reset-password`

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          email,
          {
            redirectTo,
          }
        )

      if (error) {
        setError(error.message)
        return
      }

      setSent(true)
    } catch {
      setError(
        'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleResetRequest}
      className="space-y-5"
    >
      {error && (
        <div
          className="rounded-2xl px-4 py-3 text-sm border"
          style={{
            backgroundColor: '#FEF2F2',
            borderColor: '#FECACA',
            color: '#991B1B',
          }}
        >
          {error}
        </div>
      )}

      {sent && (
        <div
          className="rounded-2xl px-4 py-3 text-sm border"
          style={{
            backgroundColor: '#F0FDF4',
            borderColor: '#86EFAC',
            color: '#166534',
          }}
        >
          A password reset link has been sent to your
          email address. Please check your inbox.
        </div>
      )}

      <div>
        <label
          className="block text-sm font-semibold mb-2"
          style={{ color: '#062850' }}
        >
          Email Address
        </label>
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          style={{ borderColor: '#D1D5DB' }}
          required
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full text-white font-semibold py-6 rounded-xl transition-all duration-300 hover:opacity-90 hover:scale-105 disabled:opacity-60"
        style={{ backgroundColor: '#062850' }}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          'Send Reset Link'
        )}
      </Button>
    </form>
  )
}