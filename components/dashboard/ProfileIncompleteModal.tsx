'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProfileField {
  key: string
  label: string
  filled: boolean
}

interface ProfileIncompleteModalProps {
  profile: Record<string, unknown>
}

const REQUIRED_FIELDS = [
  { key: 'avatar_url', label: 'Profile Picture' },
  { key: 'full_name', label: 'Legal Full Name' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'date_of_birth', label: 'Date of Birth' },
  { key: 'gender', label: 'Gender' },
  { key: 'nationality', label: 'Nationality' },
  { key: 'country', label: 'Country of Residence' },
  { key: 'address', label: 'Residential Address' },
  { key: 'occupation', label: 'Occupation' },
  { key: 'education_level', label: 'Education Level' },
]

export function calculateProfileCompletion(profile: Record<string, unknown>): number {
  const filled = REQUIRED_FIELDS.filter(
    (f) => profile[f.key] && String(profile[f.key]).trim() !== ''
  ).length
  return Math.round((filled / REQUIRED_FIELDS.length) * 100)
}

export default function ProfileIncompleteModal({
  profile,
}: ProfileIncompleteModalProps) {
  const [mounted, setMounted] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const sessionDismissed = sessionStorage.getItem('profile_modal_dismissed')
    if (sessionDismissed) setDismissed(true)
  }, [])

  const completion = calculateProfileCompletion(profile)
  const shouldShow = completion < 60 && !dismissed

  function handleDismiss() {
    sessionStorage.setItem('profile_modal_dismissed', 'true')
    setDismissed(true)
  }

  function handleComplete() {
    router.push('/dashboard/profile')
  }

  const fields: ProfileField[] = REQUIRED_FIELDS.map((f) => ({
    key: f.key,
    label: f.label,
    filled: Boolean(profile[f.key] && String(profile[f.key]).trim() !== ''),
  }))

  const missingFields = fields.filter((f) => !f.filled)

  if (!mounted || !shouldShow) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(6, 40, 80, 0.7)' }}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between"
          style={{ backgroundColor: '#062850' }}
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-amber-400" />
            <h2 className="font-bold text-white text-lg">
              Complete Your Profile
            </h2>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg text-blue-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-6">

          {/* Completion bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold" style={{ color: '#062850' }}>
                Profile Completion
              </p>
              <p className="text-sm font-bold" style={{ color: '#497296' }}>
                {completion}%
              </p>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${completion}%`,
                  backgroundColor: completion < 40
                    ? '#EF4444'
                    : completion < 60
                    ? '#F59E0B'
                    : '#16A34A',
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              You need at least 60% to make payments and access all features.
            </p>
          </div>

          {/* Missing fields */}
          <div className="mb-6">
            <p className="text-sm font-semibold mb-3" style={{ color: '#062850' }}>
              Missing information ({missingFields.length} fields):
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {fields.map((field) => (
                <div
                  key={field.key}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl"
                  style={{
                    backgroundColor: field.filled ? '#F0FDF4' : '#FFF8F0',
                  }}
                >
                  {field.filled
                    ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    : <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  }
                  <span
                    className="text-sm"
                    style={{ color: field.filled ? '#16A34A' : '#92400E' }}
                  >
                    {field.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleComplete}
              className="w-full py-3 text-white font-semibold rounded-xl"
              style={{ backgroundColor: '#497296' }}
            >
              Complete My Profile →
            </Button>
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="w-full py-3 rounded-xl text-sm text-gray-500"
            >
              Remind Me Later
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}
