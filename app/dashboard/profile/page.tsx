'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Camera, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { calculateProfileCompletion } from '@/components/dashboard/ProfileIncompleteModal'
import Image from 'next/image'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const EDUCATION_LEVELS = [
  'Secondary School', 'OND / HND', "Bachelor's Degree",
  "Master's Degree", 'PhD / Doctorate', 'Professional Certification', 'Other',
]

const GENDERS = ['Male', 'Female', 'Prefer not to say']

const TIMEZONES = [
  'Africa/Lagos', 'Africa/Nairobi', 'Africa/Johannesburg',
  'Europe/London', 'Europe/Paris', 'America/New_York',
  'America/Los_Angeles', 'Asia/Dubai', 'Asia/Kolkata', 'Australia/Sydney',
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
}

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [form, setForm] = useState<Partial<Profile>>({})
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [completion, setCompletion] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
    loadProfile()
  }, [])

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data) {
      setProfile(data)
      setForm(data)
      setCompletion(calculateProfileCompletion(data as Record<string, unknown>))
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

    const { error: saveError } = await supabase
      .from('profiles')
      .update({
        full_name: form.full_name,
        preferred_name: form.preferred_name,
        phone: form.phone,
        whatsapp: form.whatsapp,
        date_of_birth: form.date_of_birth,
        gender: form.gender,
        nationality: form.nationality,
        country: form.country,
        state_city: form.state_city,
        address: form.address,
        postal_code: form.postal_code,
        bio: form.bio,
        occupation: form.occupation,
        education_level: form.education_level,
        avatar_url: form.avatar_url,
        timezone: form.timezone,
      })
      .eq('id', profile.id)

    if (saveError) {
      setError('Failed to save. Please try again.')
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }

    setSaving(false)
  }

  if (!mounted) return null

  const completionColor = completion < 40
    ? '#EF4444'
    : completion < 60
    ? '#F59E0B'
    : '#16A34A'

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2"
          style={{ color: '#062850' }}
        >
          My Profile
        </h1>
        <p className="text-gray-500 text-sm">
          Keep your profile complete and up to date.
          Your legal name and photo will appear on your certificates.
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
        {completion < 60 && (
          <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Complete at least 60% to unlock payments and all features.
          </p>
        )}
        {completion >= 60 && (
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Your profile meets the minimum requirement.
          </p>
        )}
      </div>

      {/* Avatar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-lg mb-5" style={{ color: '#062850' }}>
          Profile Picture
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          This photo will appear on your certificates. Please use a clear, professional photo.
        </p>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center text-3xl border-4"
              style={{ borderColor: '#497296', backgroundColor: '#F0F6FB' }}
            >
              {form.avatar_url
                ? <Image
                    src={form.avatar_url}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                : '👤'
              }
            </div>
            {uploadingAvatar && (
              <div className="absolute inset-0 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(6,40,80,0.5)' }}
              >
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <Button
              onClick={() => fileRef.current?.click()}
              disabled={uploadingAvatar}
              className="flex items-center gap-2 text-white rounded-xl"
              style={{ backgroundColor: '#497296' }}
            >
              <Camera className="w-4 h-4" />
              {uploadingAvatar ? 'Uploading...' : 'Upload Photo'}
            </Button>
            <p className="text-xs text-gray-400 mt-2">
              JPG, PNG or WebP. Max 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-lg mb-5" style={{ color: '#062850' }}>
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Field label="Legal Full Name *" hint="As it appears on your ID — used on certificates">
            <input name="full_name" value={form.full_name || ''} onChange={handleChange}
              className={inputClass} placeholder="e.g. John Adebayo Smith" />
          </Field>

          <Field label="Preferred Name">
            <input name="preferred_name" value={form.preferred_name || ''} onChange={handleChange}
              className={inputClass} placeholder="What should we call you?" />
          </Field>

          <Field label="Email Address">
            <input value={form.email || ''} disabled
              className={inputClass + ' bg-gray-50 cursor-not-allowed text-gray-400'}
              placeholder="Change email in Settings" />
          </Field>

          <Field label="Phone Number *">
            <input name="phone" value={form.phone || ''} onChange={handleChange}
              className={inputClass} placeholder="+234 800 000 0000" />
          </Field>

          <Field label="WhatsApp Number">
            <input name="whatsapp" value={form.whatsapp || ''} onChange={handleChange}
              className={inputClass} placeholder="+234 800 000 0000" />
          </Field>

          <Field label="Date of Birth *">
            <input type="date" name="date_of_birth" value={form.date_of_birth || ''} onChange={handleChange}
              className={inputClass} />
          </Field>

          <Field label="Gender *">
            <select name="gender" value={form.gender || ''} onChange={handleChange} className={inputClass}>
              <option value="">Select gender</option>
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </Field>

          <Field label="Nationality *">
            <input name="nationality" value={form.nationality || ''} onChange={handleChange}
              className={inputClass} placeholder="e.g. Nigerian" />
          </Field>

          <Field label="Occupation *">
            <input name="occupation" value={form.occupation || ''} onChange={handleChange}
              className={inputClass} placeholder="e.g. Software Engineer, Student" />
          </Field>

          <Field label="Highest Education Level *">
            <select name="education_level" value={form.education_level || ''} onChange={handleChange} className={inputClass}>
              <option value="">Select level</option>
              {EDUCATION_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>

          <Field label="Timezone">
            <select name="timezone" value={form.timezone || ''} onChange={handleChange} className={inputClass}>
              <option value="">Select timezone</option>
              {TIMEZONES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>

        </div>

        <div className="mt-4">
          <Field label="Short Bio">
            <textarea name="bio" value={form.bio || ''} onChange={handleChange}
              rows={3} className={inputClass + ' resize-none'}
              placeholder="Tell us a little about yourself..." />
          </Field>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-lg mb-5" style={{ color: '#062850' }}>
          Residential Address
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Field label="Country of Residence *">
            <input name="country" value={form.country || ''} onChange={handleChange}
              className={inputClass} placeholder="e.g. Nigeria" />
          </Field>

          <Field label="State / City *">
            <input name="state_city" value={form.state_city || ''} onChange={handleChange}
              className={inputClass} placeholder="e.g. Lagos, Lagos State" />
          </Field>

          <div className="md:col-span-2">
            <Field label="Street Address *">
              <input name="address" value={form.address || ''} onChange={handleChange}
                className={inputClass} placeholder="e.g. 12 Victoria Island Close" />
            </Field>
          </div>

          <Field label="Postal / ZIP Code">
            <input name="postal_code" value={form.postal_code || ''} onChange={handleChange}
              className={inputClass} placeholder="e.g. 100001" />
          </Field>

        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Save */}
      <div className="flex items-center gap-4">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 text-white font-semibold rounded-xl"
          style={{ backgroundColor: '#062850' }}
        >
          {saving
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            : saved
            ? <><CheckCircle className="w-4 h-4" /> Saved!</>
            : <><Save className="w-4 h-4" /> Save Changes</>
          }
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

const inputClass = `w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
focus:outline-none focus:ring-2 focus:ring-[#497296] transition-all`
  .replace(/\n/g, ' ').replace(/\s+/g, ' ')

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
        {label}
      </label>
      {hint && <p className="text-xs text-gray-400 mb-1.5">{hint}</p>}
      {children}
    </div>
  )
}
