'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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

export default function LoginForm() {
  const [mounted, setMounted] = useState(false)
  const [showRedirect, setShowRedirect] =
    useState(false)
  const [redirectRoute, setRedirectRoute] =
    useState('/dashboard')
  const [previousPage, setPreviousPage] =
    useState('/')

  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] =
    useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setMounted(true)

    // Get the page user came from
    const from = searchParams.get('from')
    if (from) {
      setPreviousPage(decodeURIComponent(from))
    } else if (
      typeof document !== 'undefined' &&
      document.referrer
    ) {
      try {
        const ref = new URL(document.referrer)
        // Only use referrer if it's from our own site
        if (
          ref.origin === window.location.origin &&
          !ref.pathname.includes('/auth/')
        ) {
          setPreviousPage(ref.pathname)
        }
      } catch {
        // ignore invalid referrer
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const message = searchParams.get('message')

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

      if (signInError) {
        if (
          signInError.message
            .toLowerCase()
            .includes('email not confirmed')
        ) {
          setError(
            'Your email has not been verified yet. Please check your inbox.'
          )
        } else {
          setError(signInError.message)
        }
        return
      }

      const user = data.user
      if (!user) {
        setError('Login failed. Please try again.')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      const route = getDashboardRouteByRole(
        profile?.role
      )
      setRedirectRoute(route)
      setShowRedirect(true)
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
          message="Login Successful!"
          subtitle="You have been logged in to your Averra Knowledge Academy account."
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
        onSubmit={handleLogin}
        className="space-y-5"
      >
        {message === 'password_updated' && (
          <div
            className="rounded-2xl px-4 py-3 text-sm
            border"
            style={{
              backgroundColor: '#F0FDF4',
              borderColor: '#86EFAC',
              color: '#166534',
            }}
          >
            Your password has been updated
            successfully. Please log in with your
            new password.
          </div>
        )}

        {searchParams.get('verified') === 'true' && (
          <div
            className="rounded-2xl px-4 py-3 text-sm
            border"
            style={{
              backgroundColor: '#F0FDF4',
              borderColor: '#86EFAC',
              color: '#166534',
            }}
          >
            Your email has been verified
            successfully. You can now log in.
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
          <div className="flex items-center
          justify-between mb-2">
            <label
              className="block text-sm font-semibold"
              style={{ color: '#062850' }}
            >
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium
              hover:opacity-80 transition-opacity"
              style={{ color: '#497296' }}
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <input
              type={
                showPassword ? 'text' : 'password'
              }
              placeholder="Enter your password"
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
              Logging in...
            </>
          ) : (
            'Log In'
          )}
        </Button>

        <p className="text-xs text-center
        text-gray-400 leading-relaxed">
          By logging in, you agree to Averra
          Knowledge Academy&apos;s Terms of Service
          and Privacy Policy.
        </p>
      </form>
    </>
  )
}