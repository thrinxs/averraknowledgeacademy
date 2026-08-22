'use client'

import { useState, useEffect, useRef } from 'react'
import { Camera, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { calculateProfileCompletion } from '@/components/dashboard/ProfileIncompleteModal'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

const EDUCATION_LEVELS = [
  'Secondary School',
  'OND / HND',
  "Bachelor's Degree",
  "Master's Degree",
  'PhD / Doctorate',
  'Professional Certification',
  'Other',
]

const GENDERS = ['Male', 'Female', 'Prefer not to say']

const TIMEZONES = [
  'Africa/Lagos',
  'Africa/Nairobi',
  'Africa/Johannesburg',
  'Africa/Accra',
  'Africa/Cairo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Australia/Sydney',
  'Pacific/Auckland',
]

type Profile = {
  id: string
  full_name: string
  preferred_name: string
  email: string
  phone: string
  whatsapp: string
  date_of_birth: string
  gender: string
  nationality: string
  country: string
  state_city: string
  address: string
  postal_code: string
  bio: string
  occupation: string
  education_level: string
  avatar_url: string
  timezone: string
  role: string
  created_at: string
}

const EMPTY: Partial<Profile> = {
  full_name: '',
  preferred_name: '',
  email: '',
  phone: '',
  whatsapp: '',
  date_of_birth: '',
  gender: '',
  nationality: '',
  country: '',
  state_city: '',
  address: '',
  postal_code: '',
  bio: '',
  occupation: '',
  education_level: '',
  avatar_url: '',
  timezone: '',
}

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [form, setForm] = useState<Partial<Profile>>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')
  const [completion, setCompletion] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
    loadProfile()
  }, [])

  async function loadProfile() {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        setLoadError('Could not load your session. Please refresh the page.')
        return
      }

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) {
        setLoadError('Could not load your profile. Please refresh.')
        return
      }

      if (data) {
        setProfile(data as Profile)
        setForm({ ...EMPTY, ...data })
        setCompletion(calculateProfileCompletion(data as Record<string, unknown>))
      }
    } catch {
      setLoadError('An unexpected error occurred. Please refresh.')
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const updated = { ...form, [e.target.name]: e.target.value }
    setForm(updated)
    setCompletion(calculateProfileCompletion(updated as Record<string, unknown>))
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !profile) return

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.')
      return
    }

    setUploadingAvatar(true)
    setError('')

    const ext = file.name.split('.').pop()
    const path = `avatars/${profile.id}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setError('Failed to upload image. Please try again.')
      setUploadingAvatar(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(path)

    const updated = { ...form, avatar_url: publicUrl }
    setForm(updated)
    setCompletion(calculateProfileCompletion(updated as Record<string, unknown>))
    setUploadingAvatar(false)
  }

  async function handleSave() {
    if (!profile) return
    setSaving(true)
    setError('')
    setSaved(false)

    const { error: saveError } = await supabase
      .from('profiles')
      .update({
        full_name: form.full_name || '',
        preferred_name: form.preferred_name || '',
        phone: form.phone || '',
        whatsapp: form.whatsapp || '',
        date_of_birth: form.date_of_birth || null,
        gender: form.gender || '',
        nationality: form.nationality || '',
        country: form.country || '',
        state_city: form.state_city || '',
        address: form.address || '',
        postal_code: form.postal_code || '',
        bio: form.bio || '',
        occupation: form.occupation || '',
        education_level: form.education_level || '',
        avatar_url: form.avatar_url || '',
        timezone: form.timezone || '',
      })
      .eq('id', profile.id)

    if (saveError) {
      setError('Failed to save profile. Please try again. Error: ' + saveError.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 4000)
    }

    setSaving(false)
  }

  if (!mounted) return null

  const completionColor =
    completion < 40 ? '#EF4444' : completion < 60 ? '#F59E0B' : '#16A34A'

  const inputCls =
    'w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#497296] transition-all bg-white'

  function Field({
    label,
    hint,
    children,
    span2,
  }: {
    label: string
    hint?: string
    children: React.ReactNode
    span2?: boolean
  }) {
    return (
      <div className={span2 ? 'md:col-span-2' : ''}>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          {label}
        </label>
        {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
        {children}
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="p-10 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
        <p className="text-red-600 font-semibold">{loadError}</p>
        <button
          onClick={loadProfile}
          className="mt-4 px-6 py-2 rounded-xl text-white text-sm"
          style={{ backgroundColor: '#062850' }}
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="p-10 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: '#497296' }} />
          <p className="text-gray-500 text-sm">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>
          My Profile
        </h1>
        <p className="text-gray-500 text-sm">
          Keep your profile complete. Your legal name and photo will appear on your certificates.
        </p>
      </div>

      {/* Completion bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex justify-between items-center mb-3">
          <p className="font-semibold text-sm" style={{ color: '#062850' }}>
            Profile Completion
          </p>
          <p className="font-bold text-sm" style={{ color: completionColor }}>
            {completion}%
          </p>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${completion}%`, backgroundColor: completionColor }}
          />
        </div>
        {completion < 60 ? (
          <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Complete at least 60% to unlock payments and all features.
          </p>
        ) : (
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Your profile meets the minimum requirement.
          </p>
        )}
      </div>

      {/* Profile Picture */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-lg mb-1" style={{ color: '#062850' }}>
          Profile Picture
        </h2>
        <p className="text-xs text-gray-400 mb-5">
          This photo will appear on your certificates. Please use a clear, professional photo.
        </p>
        <div className="flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <div
              className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center text-4xl border-4"
              style={{ borderColor: '#497296', backgroundColor: '#F0F6FB' }}
            >
              {form.avatar_url ? (
                <Image
                  src={form.avatar_url}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                '👤'
              )}
            </div>
            {uploadingAvatar && (
              <div
                className="absolute inset-0 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(6,40,80,0.6)' }}
              >
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <Button
              onClick={() => fileRef.current?.click()}
              disabled={uploadingAvatar}
              className="flex items-center gap-2 text-white rounded-xl mb-2"
              style={{ backgroundColor: '#497296' }}
            >
              <Camera className="w-4 h-4" />
              {uploadingAvatar ? 'Uploading...' : 'Upload Photo'}
            </Button>
            <p className="text-xs text-gray-400">JPG, PNG or WebP. Max 5MB.</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-lg mb-5" style={{ color: '#062850' }}>
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Field
            label="Legal Full Name *"
            hint="As it appears on your ID — used on certificates"
          >
            <input
              name="full_name"
              value={form.full_name || ''}
              onChange={handleChange}
              className={inputCls}
              placeholder="e.g. John Adebayo Smith"
            />
          </Field>

          <Field label="Preferred Name" hint="What should we call you?">
            <input
              name="preferred_name"
              value={form.preferred_name || ''}
              onChange={handleChange}
              className={inputCls}
              placeholder="e.g. John"
            />
          </Field>

          <Field label="Email Address" hint="To change your email, go to Settings">
            <input
              value={form.email || ''}
              disabled
              className={inputCls + ' bg-gray-50 cursor-not-allowed text-gray-400'}
            />
          </Field>

          <Field label="Phone Number *">
            <input
              name="phone"
              value={form.phone || ''}
              onChange={handleChange}
              className={inputCls}
              placeholder="+234 800 000 0000"
            />
          </Field>

          <Field label="WhatsApp Number">
            <input
              name="whatsapp"
              value={form.whatsapp || ''}
              onChange={handleChange}
              className={inputCls}
              placeholder="+234 800 000 0000"
            />
          </Field>

          <Field label="Date of Birth *">
            <input
              type="date"
              name="date_of_birth"
              value={form.date_of_birth || ''}
              onChange={handleChange}
              className={inputCls}
            />
          </Field>

          <Field label="Gender *">
            <select
              name="gender"
              value={form.gender || ''}
              onChange={handleChange}
              className={inputCls}
            >
              <option value="">Select gender</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </Field>

          <Field label="Nationality *">
            <input
              name="nationality"
              value={form.nationality || ''}
              onChange={handleChange}
              className={inputCls}
              placeholder="e.g. Nigerian, British, Ghanaian"
            />
          </Field>

          <Field label="Occupation *">
            <input
              name="occupation"
              value={form.occupation || ''}
              onChange={handleChange}
              className={inputCls}
              placeholder="e.g. Software Engineer, Student, Teacher"
            />
          </Field>

          <Field label="Highest Education Level *">
            <select
              name="education_level"
              value={form.education_level || ''}
              onChange={handleChange}
              className={inputCls}
            >
              <option value="">Select level</option>
              {EDUCATION_LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </Field>

          <Field label="Timezone">
            <select
              name="timezone"
              value={form.timezone || ''}
              onChange={handleChange}
              className={inputCls}
            >
              <option value="">Select timezone</option>
              {TIMEZONES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>

          <Field label="Short Bio" span2>
            <textarea
              name="bio"
              value={form.bio || ''}
              onChange={handleChange}
              rows={3}
              className={inputCls + ' resize-none'}
              placeholder="Tell us a little about yourself..."
            />
          </Field>

        </div>
      </div>

      {/* Residential Address */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-lg mb-5" style={{ color: '#062850' }}>
          Residential Address
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Field label="Country of Residence *">
            <input
              name="country"
              value={form.country || ''}
              onChange={handleChange}
              className={inputCls}
              placeholder="e.g. Nigeria"
            />
          </Field>

          <Field label="State / City *">
            <input
              name="state_city"
              value={form.state_city || ''}
              onChange={handleChange}
              className={inputCls}
              placeholder="e.g. Lagos, Lagos State"
            />
          </Field>

          <Field label="Street Address *" span2>
            <input
              name="address"
              value={form.address || ''}
              onChange={handleChange}
              className={inputCls}
              placeholder="e.g. 12 Victoria Island Close"
            />
          </Field>

          <Field label="Postal / ZIP Code">
            <input
              name="postal_code"
              value={form.postal_code || ''}
              onChange={handleChange}
              className={inputCls}
              placeholder="e.g. 100001"
            />
          </Field>

        </div>
      </div>

      {/* Account Info — read only */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-lg mb-5" style={{ color: '#062850' }}>
          Account Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl" style={{ backgroundColor: '#F0F6FB' }}>
            <p className="text-xs text-gray-500 mb-1">Account Role</p>
            <p className="font-bold text-sm capitalize" style={{ color: '#062850' }}>
              {profile.role || 'Student'}
            </p>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: '#F0F6FB' }}>
            <p className="text-xs text-gray-500 mb-1">Member Since</p>
            <p className="font-bold text-sm" style={{ color: '#062850' }}>
              {profile.created_at
                ? new Date(profile.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Save button */}
      <div className="flex items-center gap-4 pb-10">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 text-white font-semibold rounded-xl"
          style={{ backgroundColor: '#062850' }}
        >
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
          ) : saved ? (
            <><CheckCircle className="w-4 h-4" /> Saved!</>
          ) : (
            <><Save className="w-4 h-4" /> Save Changes</>
          )}
        </Button>
        {saved && (
          <p className="text-green-600 text-sm font-medium flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Profile updated successfully
          </p>
        )}
      </div>

    </div>
  )
}
