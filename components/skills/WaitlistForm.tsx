'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Bell,
  Loader2,
  CheckCircle,
  Mail,
  User,
} from 'lucide-react'

interface Props {
  courseName: string
  courseSlug: string
  color: string
}

const inputClass = `w-full px-4 py-3 rounded-xl border
text-sm transition-all duration-200
focus:outline-none focus:ring-2`

export default function WaitlistForm({
  courseName,
  courseSlug,
  color,
}: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Please enter your name.')
      return
    }
    if (!email.trim()) {
      setError('Please enter your email.')
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email.')
      return
    }

    setLoading(true)

    try {
      // Save to Supabase waitlist table
      // We'll use a simple fetch to our API
      const response = await fetch(
        '/api/skills/waitlist',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            course_slug: courseSlug,
            course_name: courseName,
          }),
        }
      )

      const data = await response.json()

      if (!data.success) {
        setError(
          data.error ||
            'Something went wrong. Please try again.'
        )
        return
      }

      setSuccess(true)
    } catch {
      setError(
        'Could not submit. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="bg-white rounded-2xl border-2
      overflow-hidden shadow-sm"
      style={{ borderColor: color }}
    >
      {/* Header */}
      <div
        className="px-6 py-5"
        style={{ backgroundColor: color }}
      >
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-white" />
          <div>
            <p className="text-white font-bold
            text-sm">
              Join the Waitlist
            </p>
            <p className="text-white/70 text-xs">
              Be first to know when this course
              opens
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {success ? (
          <div className="text-center py-4">
            <CheckCircle
              className="w-12 h-12 mx-auto mb-3"
              style={{ color: '#16A34A' }}
            />
            <p
              className="font-bold text-base mb-1"
              style={{ color: '#062850' }}
            >
              You&apos;re on the waitlist!
            </p>
            <p className="text-gray-500 text-sm">
              We will email you at{' '}
              <span className="font-medium">
                {email}
              </span>{' '}
              when {courseName} is ready to enroll.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <p className="text-gray-600 text-sm
            leading-relaxed">
              This course is coming soon. Enter your
              details below and we will notify you
              when enrollment opens.
            </p>

            <div>
              <label
                className="block text-xs
                font-semibold mb-1.5"
                style={{ color: '#062850' }}
              >
                Your Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3.5
                  top-1/2 -translate-y-1/2 w-4 h-4
                  text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className={`${inputClass} pl-10`}
                  style={{
                    borderColor: '#D1D5DB',
                  }}
                />
              </div>
            </div>

            <div>
              <label
                className="block text-xs
                font-semibold mb-1.5"
                style={{ color: '#062850' }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5
                  top-1/2 -translate-y-1/2 w-4 h-4
                  text-gray-400"
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className={`${inputClass} pl-10`}
                  style={{
                    borderColor: '#D1D5DB',
                  }}
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full text-white
              font-semibold py-5 rounded-xl
              transition-all duration-300
              hover:opacity-90 hover:scale-[1.02]
              disabled:opacity-60"
              style={{ backgroundColor: color }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4
                  mr-2 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 mr-2" />
                  Notify Me When It Opens
                </>
              )}
            </Button>

            <p className="text-xs text-center
            text-gray-400">
              No spam. We only email when the
              course is ready.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}