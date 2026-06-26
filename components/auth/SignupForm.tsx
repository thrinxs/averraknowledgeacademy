'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from
  'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { getDashboardRouteByRole } from '@/utils/auth'
import RedirectOverlay from './RedirectOverlay'

const inputClass = `w-full px-4 py-3 rounded-xl border
text-sm transition-all duration-200 focus:outline-none
focus:ring-2`

export default function SignupForm() {
  const [mounted, setMounted] = useState(false)
  const [showRedirect, setShowRedirect] =
    useState(false)
  const [redirectRoute, setRedirectRoute] =
    useState('/dashboard')
  const [previousPage, setPreviousPage] =
    useState('/')

  const router = useRouter()
  const searchParams = useSearchParams()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')
  const [showPassword, setShowPassword] =
    useState(false)
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setMounted(true)

    const from = searchParams.get('from')
    if (from) {
      setPreviousPage(decodeURIComponent(from))
    } else if (
      typeof document !== 'undefined' &&
      document.referrer
    ) {
      try {
        const ref = new URL(document.referrer)
        if (
          ref.origin === window.location.origin &&
          !ref.pathname.includes('/auth/')
        ) {
          setPreviousPage(ref.pathname)
        }
      } catch {
        // ignore
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSignup = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError(
        'Password must be at least 8 characters long.'
      )
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const redirectTo =
        `${window.location.origin}/auth/callback`

      const { data, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectTo,
            data: {
              full_name: fullName,
              role: 'student',
            },
          },
        })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      if (data.session && data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle()

        setRedirectRoute(
          getDashboardRouteByRole(profile?.role)
        )
        setShowRedirect(true)
        return
      }

      router.push(
        `/auth/verify-email?email=${encodeURIComponent(email)}`
      )
    } catch {
      setError(
        'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <>
      {showRedirect && (
        <RedirectOverlay
          message="Account Created!"
          subtitle="Your Averra Knowledge Academy account is ready."
          redirectTo={redirectRoute}
          onStay={() => {
            setShowRedirect(false)
            if (window.history.length > 2) {
              window.history.back()
            } else {
              router.push('/')
            }
          }}
        />
      )}

      <form
        onSubmit={handleSignup}
        className="space-y-5"
      >
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

        <div>
          <label
            className="block text-sm font-semibold
            mb-2"
            style={{ color: '#062850' }}
          >
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
            className={inputClass}
            style={{ borderColor: '#D1D5DB' }}
            required
          />
        </div>

        <div>
          <label
            className="block text-sm font-semibold
            mb-2"
            style={{ color: '#062850' }}
          >
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className={inputClass}
            style={{ borderColor: '#D1D5DB' }}
            required
          />
        </div>

        <div>
          <label
            className="block text-sm font-semibold
            mb-2"
            style={{ color: '#062850' }}
          >
            Password
          </label>
          <div className="relative">
            <input
              type={
                showPassword ? 'text' : 'password'
              }
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className={`${inputClass} pr-12`}
              style={{ borderColor: '#D1D5DB' }}
              required
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-1/2
              -translate-y-1/2 text-gray-400
              hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label
            className="block text-sm font-semibold
            mb-2"
            style={{ color: '#062850' }}
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={
                showConfirmPassword
                  ? 'text'
                  : 'password'
              }
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              className={`${inputClass} pr-12`}
              style={{ borderColor: '#D1D5DB' }}
              required
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-4 top-1/2
              -translate-y-1/2 text-gray-400
              hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
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
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>

        <p className="text-xs text-center
        text-gray-400 leading-relaxed">
          By creating an account, you agree to Averra
          Knowledge Academy&apos;s Terms of Service
          and Privacy Policy.
        </p>
      </form>
    </>
  )
}