'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Camera, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const EDUCATION_LEVELS = [
  'Secondary School', 'OND / HND', "Bachelor's Degree",
  "Master's Degree", 'PhD / Doctorate', 'Professional Certification', 'Other',
]
const GENDERS = ['Male', 'Female', 'Prefer not to say']
const TIMEZONES = [
  'Africa/Lagos', 'Africa/Nairobi', 'Africa/Johannesburg', 'Africa/Accra',
  'Africa/Cairo', 'Europe/London', 'Europe/Paris', 'Europe/Berlin',
  'America/New_York', 'America/Los_Angeles', 'America/Chicago',
  'Asia/Dubai', 'Asia/Kolkata', 'Asia/Singapore',
  'Australia/Sydney', 'Pacific/Auckland',
]
const REQUIRED_FIELDS = [
  'avatar_url', 'full_name', 'phone', 'date_of_birth', 'gender',
  'nationality', 'country', 'address', 'occupation', 'education_level',
]
const ROLE_DISPLAY: Record<string, { label: string; emoji: string; color: string }> = {
  admin:     { label: 'Administrator',     emoji: '⚙️', color: '#062850' },
  staff:     { label: 'Staff',             emoji: '👔', color: '#1D4469' },
  trainer:   { label: 'Trainer',           emoji: '🏫', color: '#325E84' },
  affiliate: { label: 'Affiliate Partner', emoji: '🤝', color: '#497296' },
  student:   { label: 'Student',           emoji: '🎓', color: '#497296' },
}

export function calculateProfileCompletion(p: Record<string, unknown>): number {
  const filled = REQUIRED_FIELDS.filter(
    (f) => p[f] && String(p[f]).trim() !== ''
  ).length
  return Math.round((filled / REQUIRED_FIELDS.length) * 100)
}

type ProfileData = Record<string, unknown>
interface Props {
  initialProfile: ProfileData
  userId: string
  userEmail: string
  dbRole: string
  services: string[]
}

const cls = 'w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#497296] transition-all bg-white'

function Field({ label, hint, span2, children }: {
  label: string; hint?: string; span2?: boolean; children: React.ReactNode
}) {
  return (
    <div className={span2 ? 'md:col-span-2' : ''}>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
      {children}
    </div>
  )
}

export default function ProfileEditor({ initialProfile, userId, userEmail, dbRole, services }: Props) {
  const [form, setForm] = useState<ProfileData>({ ...initialProfile, email: userEmail })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const completion = calculateProfileCompletion(form)
  const completionColor = completion < 40 ? '#EF4444' : completion < 60 ? '#F59E0B' : '#16A34A'
  const roleInfo = ROLE_DISPLAY[dbRole] || ROLE_DISPLAY.student

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB.'); return }
    setUploading(true); setError('')
    const ext = file.name.split('.').pop()
    const path = `avatars/${userId}/avatar.${ext}`
    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (uploadError) { setError('Upload failed: ' + uploadError.message); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
    setForm((prev) => ({ ...prev, avatar_url: publicUrl }))
    setUploading(false)
  }

  async function handleSave() {
    setSaving(true); setError(''); setSaved(false)
    const { error: saveError } = await supabase.from('profiles').update({
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
    }).eq('id', userId)
    if (saveError) setError('Failed to save: ' + saveError.message)
    else { setSaved(true); setTimeout(() => setSaved(false), 4000) }
    setSaving(false)
  }

  const avatarUrl = form.avatar_url as string | undefined

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>My Profile</h1>
        <p className="text-gray-500 text-sm">Keep your profile complete. Your legal name and photo will appear on your certificates.</p>
      </div>

      {/* Completion */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex justify-between items-center mb-3">
          <p className="font-semibold text-sm" style={{ color: '#062850' }}>Profile Completion</p>
          <p className="font-bold text-sm" style={{ color: completionColor }}>{completion}%</p>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${completion}%`, backgroundColor: completionColor }} />
        </div>
        {completion < 60 ? (
          <p className="text-xs text-amber-600 mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />Complete at least 60% to unlock payments and all features.</p>
        ) : (
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Your profile meets the minimum requirement.</p>
        )}
      </div>

      {/* Avatar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-lg mb-1" style={{ color: '#062850' }}>Profile Picture</h2>
        <p className="text-xs text-gray-400 mb-5">This photo will appear on your certificates. Please use a clear, professional photo.</p>
        <div className="flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center text-4xl border-4" style={{ borderColor: '#497296', backgroundColor: '#F0F6FB' }}>
              {avatarUrl ? <Image src={avatarUrl} alt="Profile" width={96} height={96} className="w-full h-full object-cover" /> : '👤'}
            </div>
            {uploading && (
              <div className="absolute inset-0 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(6,40,80,0.6)' }}>
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>
          <div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarUpload} />
            <Button onClick={() => fileRef.current?.click()} disabled={uploading} className="flex items-center gap-2 text-white rounded-xl mb-2" style={{ backgroundColor: '#497296' }}>
              <Camera className="w-4 h-4" />{uploading ? 'Uploading...' : 'Upload Photo'}
            </Button>
            <p className="text-xs text-gray-400">JPG, PNG or WebP. Max 5MB.</p>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-lg mb-5" style={{ color: '#062850' }}>Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Legal Full Name *" hint="As it appears on your ID — used on certificates">
            <input name="full_name" value={(form.full_name as string) || ''} onChange={handleChange} className={cls} placeholder="e.g. John Adebayo Smith" />
          </Field>
          <Field label="Preferred Name" hint="What should we call you?">
            <input name="preferred_name" value={(form.preferred_name as string) || ''} onChange={handleChange} className={cls} placeholder="e.g. John" />
          </Field>
          <Field label="Email Address" hint="To change your email, go to Settings">
            <input value={userEmail} disabled className={cls + ' bg-gray-50 cursor-not-allowed text-gray-400'} />
          </Field>
          <Field label="Phone Number *">
            <input name="phone" value={(form.phone as string) || ''} onChange={handleChange} className={cls} placeholder="+234 800 000 0000" />
          </Field>
          <Field label="WhatsApp Number">
            <input name="whatsapp" value={(form.whatsapp as string) || ''} onChange={handleChange} className={cls} placeholder="+234 800 000 0000" />
          </Field>
          <Field label="Date of Birth *">
            <input type="date" name="date_of_birth" value={(form.date_of_birth as string) || ''} onChange={handleChange} className={cls} />
          </Field>
          <Field label="Gender *">
            <select name="gender" value={(form.gender as string) || ''} onChange={handleChange} className={cls}>
              <option value="">Select gender</option>
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="Nationality *">
            <input name="nationality" value={(form.nationality as string) || ''} onChange={handleChange} className={cls} placeholder="e.g. Nigerian, British, Ghanaian" />
          </Field>
          <Field label="Occupation *">
            <input name="occupation" value={(form.occupation as string) || ''} onChange={handleChange} className={cls} placeholder="e.g. Software Engineer, Student, Teacher" />
          </Field>
          <Field label="Highest Education Level *">
            <select name="education_level" value={(form.education_level as string) || ''} onChange={handleChange} className={cls}>
              <option value="">Select level</option>
              {EDUCATION_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Timezone">
            <select name="timezone" value={(form.timezone as string) || ''} onChange={handleChange} className={cls}>
              <option value="">Select timezone</option>
              {TIMEZONES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Short Bio" span2>
            <textarea name="bio" value={(form.bio as string) || ''} onChange={handleChange} rows={3} className={cls + ' resize-none'} placeholder="Tell us a little about yourself..." />
          </Field>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-lg mb-5" style={{ color: '#062850' }}>Residential Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Country of Residence *">
            <input name="country" value={(form.country as string) || ''} onChange={handleChange} className={cls} placeholder="e.g. Nigeria" />
          </Field>
          <Field label="State / City *">
            <input name="state_city" value={(form.state_city as string) || ''} onChange={handleChange} className={cls} placeholder="e.g. Lagos, Lagos State" />
          </Field>
          <Field label="Street Address *" span2>
            <input name="address" value={(form.address as string) || ''} onChange={handleChange} className={cls} placeholder="e.g. 12 Victoria Island Close" />
          </Field>
          <Field label="Postal / ZIP Code">
            <input name="postal_code" value={(form.postal_code as string) || ''} onChange={handleChange} className={cls} placeholder="e.g. 100001" />
          </Field>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-lg mb-5" style={{ color: '#062850' }}>Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl flex items-center gap-3" style={{ backgroundColor: '#F0F6FB' }}>
            <span className="text-2xl">{roleInfo.emoji}</span>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Account Role</p>
              <p className="font-bold text-sm" style={{ color: roleInfo.color }}>{roleInfo.label}</p>
            </div>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: '#F0F6FB' }}>
            <p className="text-xs text-gray-500 mb-1">Member Since</p>
            <p className="font-bold text-sm" style={{ color: '#062850' }}>
              {form.created_at
                ? new Date(form.created_at as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                : '—'}
            </p>
          </div>
          <div className="md:col-span-2 p-4 rounded-xl" style={{ backgroundColor: '#F0F6FB' }}>
            <p className="text-xs text-gray-500 mb-2">Signed Up For</p>
            {services.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {services.map((s) => (
                  <span key={s} className="text-xs font-semibold px-3 py-1.5 rounded-full text-white" style={{ backgroundColor: '#497296' }}>{s}</span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">
                No services enrolled yet.{' '}
                <a href="/scholarship" className="underline" style={{ color: '#497296' }}>Explore our services →</a>
              </p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}

      <div className="flex items-center gap-4 pb-10">
        <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-8 py-3 text-white font-semibold rounded-xl" style={{ backgroundColor: '#062850' }}>
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </Button>
        {saved && <p className="text-green-600 text-sm font-medium flex items-center gap-1"><CheckCircle className="w-4 h-4" />Profile updated successfully</p>}
      </div>

    </div>
  )
}
