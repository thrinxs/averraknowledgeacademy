'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export default function VerifyEmailContent() {
  const [mounted, setMounted] = useState(false)

  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleResend = async () => {
    if (!email) return

    setLoading(true)
    setMessage('')
    setError('')

    try {
      const redirectTo =
        `${window.location.origin}/auth/callback`

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      })

      if (error) {
        setError(error.message)
        return
      }

      setMessage(
        'Verification email resent successfully.'
      )
    } catch {
      setError(
        'Could not resend verification email.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      <div
        className="w-16 h-16 rounded-2xl flex
        items-center justify-center mx-auto"
        style={{ backgroundColor: '#F0F6FB' }}
      >
        <Mail
          className="w-8 h-8"
          style={{ color: '#497296' }}
        />
      </div>

      <div className="text-center">
        <h2
          className="text-xl font-bold mb-3"
          style={{ color: '#062850' }}
        >
          Verify Your Email
        </h2>
        <p className="text-sm text-gray-500
        leading-relaxed">
          We have sent a verification link to{' '}
          <span className="font-semibold text-gray-700">
            {email || 'your email address'}
          </span>
          . Please check your inbox and click the link
          to activate your account.
        </p>
      </div>

      {message && (
        <div
          className="rounded-2xl px-4 py-3 text-sm
          border"
          style={{
            backgroundColor: '#F0FDF4',
            borderColor: '#86EFAC',
            color: '#166534',
          }}
        >
          {message}
        </div>
      )}

      {error && (
        <div
          className="rounded-2xl px-4 py-3 text-sm
          border"
          style={{
            backgroundColor: '#FEF2F2',
            borderColor: '#FECACA',
            color: '#991B1B',
          }}
        >
          {error}
        </div>
      )}

      <div className="space-y-3">
        <Button
          type="button"
          onClick={handleResend}
          disabled={loading || !email}
          className="w-full text-white font-semibold
          py-6 rounded-xl transition-all duration-300
          hover:opacity-90 hover:scale-105
          disabled:opacity-60"
          style={{ backgroundColor: '#062850' }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2
              animate-spin" />
              Resending...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Resend Verification Email
            </>
          )}
        </Button>

        <Link href="/auth/login">
          <Button
            type="button"
            variant="outline"
            className="w-full py-6 rounded-xl
            font-semibold"
            style={{
              borderColor: '#062850',
              color: '#062850',
            }}
          >
            Go to Login
          </Button>
        </Link>
      </div>

      <p className="text-xs text-center text-gray-400
      leading-relaxed">
        After verifying your email, you will be sent
        to your dashboard automatically.
      </p>
    </div>
  )
}