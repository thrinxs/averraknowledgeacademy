'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  User,
  Loader2,
  CheckCircle,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Props {
  profile: any
}

const inputClass = `w-full px-4 py-3 rounded-xl border
text-sm transition-all duration-200 focus:outline-none
focus:ring-2`

const labelClass = `block text-sm font-semibold mb-2`

export default function ProfileEditor({
  profile,
}: Props) {
  const [mounted, setMounted] = useState(false)

  const [fullName, setFullName] = useState(
    profile?.full_name || ''
  )
  const [phone, setPhone] = useState(
    profile?.phone || ''
  )
  const [whatsapp, setWhatsapp] = useState(
    profile?.whatsapp || ''
  )
  const [country, setCountry] = useState(
    profile?.country || ''
  )
  const [stateCity, setStateCity] = useState(
    profile?.state_city || ''
  )
  const [gender, setGender] = useState(
    profile?.gender || ''
  )

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSaved(false)

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone,
          whatsapp,
          country,
          state_city: stateCity,
          gender,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)

      if (updateError) {
        setError(updateError.message)
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (!mounted) return null

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: '#062850' }}
        >
          My Profile
        </h1>
        <p className="text-gray-500 text-sm">
          View and update your personal information.
        </p>
      </div>

      <div className="bg-white rounded-2xl border
      border-gray-100 p-6 md:p-8">

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8
        pb-6 border-b border-gray-100">
          <div
            className="w-16 h-16 rounded-full flex
            items-center justify-center text-white
            font-bold text-xl"
            style={{ backgroundColor: '#497296' }}
          >
            {fullName
              .split(' ')
              .map((n: string) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div>
            <p
              className="font-bold text-lg"
              style={{ color: '#062850' }}
            >
              {fullName || 'Your Name'}
            </p>
            <p className="text-sm text-gray-500">
              {profile?.email}
            </p>
          </div>
        </div>

        <div className="space-y-6">

          {/* Full Name */}
          <div>
            <label
              className={labelClass}
              style={{ color: '#062850' }}
            >
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              className={inputClass}
              style={{ borderColor: '#D1D5DB' }}
            />
          </div>

          {/* Email — read only */}
          <div>
            <label
              className={labelClass}
              style={{ color: '#062850' }}
            >
              Email Address
              <span className="text-gray-400
              font-normal ml-1">
                (cannot be changed here)
              </span>
            </label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className={`${inputClass}
              bg-gray-50 text-gray-400
              cursor-not-allowed`}
              style={{ borderColor: '#E5E7EB' }}
            />
          </div>

          {/* Phone + WhatsApp */}
          <div className="grid grid-cols-1
          sm:grid-cols-2 gap-4">
            <div>
              <label
                className={labelClass}
                style={{ color: '#062850' }}
              >
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                className={inputClass}
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
            <div>
              <label
                className={labelClass}
                style={{ color: '#062850' }}
              >
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) =>
                  setWhatsapp(e.target.value)
                }
                className={inputClass}
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label
              className={labelClass}
              style={{ color: '#062850' }}
            >
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) =>
                setGender(e.target.value)
              }
              className={inputClass}
              style={{ borderColor: '#D1D5DB' }}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="prefer_not_to_say">
                Prefer not to say
              </option>
            </select>
          </div>

          {/* Country + State */}
          <div className="grid grid-cols-1
          sm:grid-cols-2 gap-4">
            <div>
              <label
                className={labelClass}
                style={{ color: '#062850' }}
              >
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) =>
                  setCountry(e.target.value)
                }
                className={inputClass}
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
            <div>
              <label
                className={labelClass}
                style={{ color: '#062850' }}
              >
                State / City
              </label>
              <input
                type="text"
                value={stateCity}
                onChange={(e) =>
                  setStateCity(e.target.value)
                }
                className={inputClass}
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
          </div>

        </div>

        {/* Error */}
        {error && (
          <div
            className="mt-6 rounded-xl px-4 py-3
            text-sm border"
            style={{
              backgroundColor: '#FEF2F2',
              borderColor: '#FECACA',
              color: '#991B1B',
            }}
          >
            {error}
          </div>
        )}

        {/* Save Button */}
        <div className="mt-8 flex items-center
        justify-between">
          {saved && (
            <span
              className="flex items-center gap-2
              text-sm font-medium"
              style={{ color: '#16A34A' }}
            >
              <CheckCircle className="w-4 h-4" />
              Changes saved successfully
            </span>
          )}
          {!saved && <span />}

          <Button
            onClick={handleSave}
            disabled={saving}
            className="text-white font-semibold
            px-8 py-5 rounded-xl transition-all
            duration-300 hover:opacity-90
            hover:scale-105 disabled:opacity-60"
            style={{ backgroundColor: '#062850' }}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2
                animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>

      </div>
    </div>
  )
}