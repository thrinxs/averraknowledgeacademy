'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

const inputClass = `w-full px-4 py-3 rounded-xl border
text-sm transition-all duration-200 focus:outline-none
focus:ring-2`

export default function ResetPasswordForm() {
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')
  const [showPassword, setShowPassword] =
    useState(false)
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleResetPassword = async (
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
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        setError(
          'This reset link may be invalid or expired. Please request a new one.'
        )
        return
      }

      setSuccess(true)
      await supabase.auth.signOut()

      setTimeout(() => {
        router.replace(
          '/auth/login?message=password_updated'
        )
      }, 1200)
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
      onSubmit={handleResetPassword}
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

      {success && (
        <div
          className="rounded-2xl px-4 py-3 text-sm border"
          style={{
            backgroundColor: '#F0FDF4',
            borderColor: '#86EFAC',
            color: '#166534',
          }}
        >
          Password updated successfully. Redirecting
          to login...
        </div>
      )}

      <div>
        <label
          className="block text-sm font-semibold mb-2"
          style={{ color: '#062850' }}
        >
          New Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
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
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
          className="block text-sm font-semibold mb-2"
          style={{ color: '#062850' }}
        >
          Confirm New Password
        </label>
        <div className="relative">
          <input
            type={
              showConfirmPassword ? 'text' : 'password'
            }
            placeholder="Repeat your new password"
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
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
        disabled={loading || success}
        className="w-full text-white font-semibold py-6 rounded-xl transition-all duration-300 hover:opacity-90 hover:scale-105 disabled:opacity-60"
        style={{ backgroundColor: '#062850' }}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Updating password...
          </>
        ) : (
          'Update Password'
        )}
      </Button>
    </form>
  )
}