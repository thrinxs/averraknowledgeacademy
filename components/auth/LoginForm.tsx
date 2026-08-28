'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

const inputClass = `w-full px-4 py-3 rounded-xl border
text-sm transition-all duration-200 focus:outline-none
focus:ring-2`

export default function LoginForm() {
  const [mounted, setMounted] = useState(false)
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { setMounted(true) }, [])

  const message = searchParams.get('message')

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

      if (signInError) {
        setError(signInError.message)
        return
      }

      window.location.href = '/dashboard'
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <form onSubmit={handleLogin} className="space-y-5">

      {message === 'password_updated' && (
        <div
          className="rounded-2xl px-4 py-3 text-sm border"
          style={{
            backgroundColor: '#F0FDF4',
            borderColor: '#86EFAC',
            color: '#166534',
          }}
        >
          Your password has been updated successfully.
          Please log in with your new password.
        </div>
      )}

      {searchParams.get('verified') === 'true' && (
        <div
          className="rounded-2xl px-4 py-3 text-sm border"
          style={{
            backgroundColor: '#F0FDF4',
            borderColor: '#86EFAC',
            color: '#166534',
          }}
        >
          Your email has been verified successfully.
          You can now log in.
        </div>
      )}

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

      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            className="block text-sm font-semibold"
            style={{ color: '#062850' }}
          >
            Password
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-xs font-medium hover:opacity-80 transition-opacity"
            style={{ color: '#497296' }}
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputClass} pr-12`}
            style={{ borderColor: '#D1D5DB' }}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2
            text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword
              ? <EyeOff className="w-4 h-4" />
              : <Eye className="w-4 h-4" />
            }
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full text-white font-semibold py-6
        rounded-xl transition-all duration-300
        hover:opacity-90 disabled:opacity-60"
        style={{ backgroundColor: '#062850' }}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Logging in...
          </>
        ) : (
          'Log In'
        )}
      </Button>

      <p className="text-xs text-center text-gray-400 leading-relaxed">
        By logging in, you agree to Averra Knowledge
        Academy&apos;s Terms of Service and Privacy Policy.
      </p>

      <div className="text-center pt-2">
        <a
          href="/auth/staff-login"
          className="text-xs text-gray-300 hover:text-gray-500 transition-colors"
        >
          Staff / Admin Login
        </a>
      </div>

    </form>
  )
}
