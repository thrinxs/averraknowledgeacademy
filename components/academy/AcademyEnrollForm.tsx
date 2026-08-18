'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  Eye,
  EyeOff,
  CheckCircle,
  Loader2,
} from 'lucide-react'

// ══════════════════════════════════════
// TYPES
// ══════════════════════════════════════
type ApplicantType = 'parent' | 'student'
type ClassType = 'private' | 'general'
type Currency = 'NGN' | 'GBP'
type BillingPeriod = 'monthly' | 'termly' | 'annually'

type Learner = {
  full_name: string
  date_of_birth: string
  country_code: string
  year_group_code: string
  year_group_label: string
  subjects: string[]
  learning_challenges: string
  school_name: string
}

type FormData = {
  applicant_type: ApplicantType
  full_name: string
  email: string
  phone: string
  whatsapp: string
  country: string
  date_of_birth: string
  relationship: string
  heard_from: string
  learners: Learner[]
  curriculum_confirmed: boolean
  class_type: ClassType
  billing_period: BillingPeriod
  preferred_days: string[]
  preferred_time: string
  timezone: string
  wants_parent_access: boolean | null
  optional_parent_name: string
  optional_parent_email: string
  optional_parent_phone: string
  optional_parent_relationship: string
  password: string
  confirm_password: string
  agree_terms: boolean
  agree_privacy: boolean
}

// ══════════════════════════════════════
// PRICING
// ══════════════════════════════════════
const NGN_PRICING: Record<ClassType, Record<string, number>> = {
  private: {
    '1-2': 100000,
    '3-4': 180000,
    '5-6': 250000,
  },
  general: {
    '1-2': 50000,
    '3-4': 90000,
    '5-6': 120000,
  },
}

const GBP_PRICING: Record<ClassType, Record<string, number>> = {
  private: {
    '1-2': 100,
    '3-4': 180,
    '5-6': 250,
  },
  general: {
    '1-2': 50,
    '3-4': 90,
    '5-6': 120,
  },
}

const BILLING_OPTIONS: {
  key: BillingPeriod
  label: string
  months: number
  discount: number
}[] = [
  { key: 'monthly',  label: 'Monthly',           months: 1,  discount: 0  },
  { key: 'termly',   label: 'Termly (3 months)',  months: 3,  discount: 5  },
  { key: 'annually', label: 'Annually',           months: 12, discount: 10 },
]

function getSubjectBundle(count: number): string {
  if (count <= 2) return '1-2'
  if (count <= 4) return '3-4'
  return '5-6'
}

function getMonthlyPrice(
  classType: ClassType,
  subjectCount: number,
  currency: Currency
): number {
  const bundle = getSubjectBundle(subjectCount)
  return currency === 'NGN'
    ? NGN_PRICING[classType][bundle]
    : GBP_PRICING[classType][bundle]
}

function calcTotal(
  monthlyPrice: number,
  billingPeriod: BillingPeriod,
  learnerCount: number
): { subtotal: number; discount: number; total: number } {
  const option = BILLING_OPTIONS.find(b => b.key === billingPeriod)!
  const base = monthlyPrice * learnerCount * option.months
  const discountAmount = (base * option.discount) / 100
  return {
    subtotal: base,
    discount: discountAmount,
    total: base - discountAmount,
  }
}

function getCurrency(countryCode: string): Currency {
  return countryCode === 'NG' ? 'NGN' : 'GBP'
}

function formatPrice(amount: number, currency: Currency): string {
  if (currency === 'NGN') {
    return `₦${amount.toLocaleString()}`
  }
  return `£${amount.toLocaleString()}`
}

// ══════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════
const DAYS = [
  'Monday','Tuesday','Wednesday',
  'Thursday','Friday','Saturday','Sunday',
]

const SUBJECTS_LIST = [
  { code: 'ENG',    label: 'English Language',         emoji: '📖' },
  { code: 'MATH',   label: 'Mathematics',               emoji: '🔢' },
  { code: 'SCI',    label: 'Science',                   emoji: '🔬' },
  { code: 'COMP',   label: 'Computing',                 emoji: '💻' },
  { code: 'HIST',   label: 'History',                   emoji: '🏛️' },
  { code: 'GEO',    label: 'Geography',                 emoji: '🌍' },
  { code: 'ART',    label: 'Creative Arts',             emoji: '🎨' },
  { code: 'MUS',    label: 'Music',                     emoji: '🎵' },
  { code: 'PE',     label: 'Physical Education',        emoji: '⚽' },
  { code: 'NHC',    label: 'Nigerian History & Culture',emoji: '🪘' },
  { code: 'REL',    label: 'Religious Studies',         emoji: '🕊️' },
  { code: 'BTECH',  label: 'Basic Technology',          emoji: '⚙️' },
  { code: 'BIO',    label: 'Biology',                   emoji: '🧬' },
  { code: 'CHEM',   label: 'Chemistry',                 emoji: '⚗️' },
  { code: 'PHY',    label: 'Physics',                   emoji: '⚡' },
  { code: 'ECON',   label: 'Economics',                 emoji: '📈' },
  { code: 'GOV',    label: 'Government / Politics',     emoji: '⚖️' },
  { code: 'ENGLIT', label: 'English Literature',        emoji: '📚' },
]

const TIMEZONES = [
  'Europe/London (GMT+0/+1)',
  'Europe/Paris (GMT+1/+2)',
  'Europe/Berlin (GMT+1/+2)',
  'Africa/Lagos (GMT+1)',
  'Africa/Accra (GMT+0)',
  'America/New_York (GMT-5/-4)',
  'America/Los_Angeles (GMT-8/-7)',
  'America/Toronto (GMT-5/-4)',
  'Australia/Sydney (GMT+10/+11)',
  'Asia/Dubai (GMT+4)',
  'Asia/Singapore (GMT+8)',
]

const PARENT_STEPS = [
  { number: 1, label: 'Your Info',   icon: '👤' },
  { number: 2, label: 'Learner',     icon: '🎓' },
  { number: 3, label: 'Curriculum',  icon: '📚' },
  { number: 4, label: 'Class Type',  icon: '🏫' },
  { number: 5, label: 'Schedule',    icon: '📅' },
  { number: 6, label: 'Account',     icon: '🔐' },
]

const STUDENT_STEPS = [
  { number: 1, label: 'Your Info',   icon: '👤' },
  { number: 2, label: 'Academic',    icon: '🎓' },
  { number: 3, label: 'Curriculum',  icon: '📚' },
  { number: 4, label: 'Class Type',  icon: '🏫' },
  { number: 5, label: 'Schedule',    icon: '📅' },
  { number: 6, label: 'Parent?',     icon: '👨‍👩‍👧' },
  { number: 7, label: 'Account',     icon: '🔐' },
]

const emptyLearner: Learner = {
  full_name: '',
  date_of_birth: '',
  country_code: '',
  year_group_code: '',
  year_group_label: '',
  subjects: [],
  learning_challenges: '',
  school_name: '',
}

const initialFormData: FormData = {
  applicant_type: 'parent',
  full_name: '',
  email: '',
  phone: '',
  whatsapp: '',
  country: '',
  date_of_birth: '',
  relationship: 'Parent',
  heard_from: '',
  learners: [{ ...emptyLearner }],
  curriculum_confirmed: false,
  class_type: 'private',
  billing_period: 'monthly',
  preferred_days: [],
  preferred_time: '',
  timezone: '',
  wants_parent_access: null,
  optional_parent_name: '',
  optional_parent_email: '',
  optional_parent_phone: '',
  optional_parent_relationship: '',
  password: '',
  confirm_password: '',
  agree_terms: false,
  agree_privacy: false,
}

export default function AcademyEnrollForm() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [countries, setCountries] = useState<
    { country_code: string; country_name: string; flag: string }[]
  >([])
  const [yearGroupsByCountry, setYearGroupsByCountry] = useState<
    Record<string, { year_group_label: string; year_group_code: string }[]>
  >({})
  const [formData, setFormData] = useState<FormData>(initialFormData)

  useEffect(() => {
    setMounted(true)
    fetchCountries()
  }, [])

  async function fetchCountries() {
    const { data } = await supabase
      .from('academy_countries')
      .select('country_code,country_name,flag')
      .eq('is_active', true)
      .order('country_name')
    if (data) setCountries(data)
  }

  async function fetchYearGroups(countryCode: string) {
    if (yearGroupsByCountry[countryCode]) return
    const { data } = await supabase
      .from('year_group_equivalencies')
      .select('year_group_label,year_group_code')
      .eq('country_code', countryCode)
      .order('age_min')
    if (data) {
      setYearGroupsByCountry(prev => ({
        ...prev,
        [countryCode]: data,
      }))
    }
  }

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  function updateLearner(index: number, key: keyof Learner, value: string | string[]) {
    setFormData(prev => {
      const learners = [...prev.learners]
      learners[index] = { ...learners[index], [key]: value }
      return { ...prev, learners }
    })
  }

  function toggleLearnerSubject(index: number, code: string) {
    const learner = formData.learners[index]
    if (learner.subjects.includes(code)) {
      updateLearner(index, 'subjects', learner.subjects.filter(s => s !== code))
    } else if (learner.subjects.length < 6) {
      updateLearner(index, 'subjects', [...learner.subjects, code])
    }
  }

  function toggleDay(day: string) {
    const updated = formData.preferred_days.includes(day)
      ? formData.preferred_days.filter(d => d !== day)
      : [...formData.preferred_days, day]
    update('preferred_days', updated)
  }

  function addLearner() {
    update('learners', [...formData.learners, { ...emptyLearner }])
  }

  function removeLearner(index: number) {
    if (formData.learners.length === 1) return
    update('learners', formData.learners.filter((_, i) => i !== index))
  }

  // Currency based on applicant country
  const currency = getCurrency(formData.country)

  // Price calculations
  const primaryLearner = formData.learners[0]
  const subjectCount = Math.max(primaryLearner.subjects.length, 1)
  const monthlyPrice = getMonthlyPrice(
    formData.class_type,
    subjectCount,
    currency
  )
  const { subtotal, discount, total } = calcTotal(
    monthlyPrice,
    formData.billing_period,
    formData.learners.length
  )
  const billingOption = BILLING_OPTIONS.find(
    b => b.key === formData.billing_period
  )!

  const STEPS = formData.applicant_type === 'parent'
    ? PARENT_STEPS
    : STUDENT_STEPS
  const MAX_STEP = STEPS.length

  function canProceed(): boolean {
    switch (step) {
      case 1:
        return !!(
          formData.full_name.trim() &&
          formData.email.trim() &&
          formData.phone.trim() &&
          formData.country.trim()
        )
      case 2:
        return formData.learners.every(l =>
          l.full_name.trim() !== '' &&
          l.country_code !== '' &&
          l.year_group_code !== '' &&
          l.subjects.length > 0
        )
      case 3:
        return formData.curriculum_confirmed === true
      case 4:
        return true
      case 5:
        return (
          formData.preferred_days.length > 0 &&
          formData.preferred_time.trim() !== '' &&
          formData.timezone.trim() !== ''
        )
      case 6:
        if (formData.applicant_type === 'student') {
          if (formData.wants_parent_access === null) return false
          if (formData.wants_parent_access === true) {
            return !!(
              formData.optional_parent_name.trim() &&
              formData.optional_parent_email.trim() &&
              formData.optional_parent_phone.trim()
            )
          }
          return true
        }
        return (
          formData.password.length >= 8 &&
          formData.password === formData.confirm_password &&
          formData.agree_terms === true &&
          formData.agree_privacy === true
        )
      case 7:
        return (
          formData.password.length >= 8 &&
          formData.password === formData.confirm_password &&
          formData.agree_terms === true &&
          formData.agree_privacy === true
        )
      default:
        return true
    }
  }

  async function handleSubmit() {
    if (!canProceed()) return
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/academy/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicant_type: formData.applicant_type,
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          whatsapp: formData.whatsapp || formData.phone,
          country: formData.country,
          date_of_birth: formData.date_of_birth || null,
          relationship: formData.applicant_type === 'parent'
            ? formData.relationship : null,
          learners: formData.learners,
          class_type: formData.class_type,
          currency,
          monthly_price: monthlyPrice,
          billing_period: formData.billing_period,
          billing_amount: total,
          preferred_days: formData.preferred_days,
          preferred_time: formData.preferred_time,
          timezone: formData.timezone,
          wants_parent_access: formData.applicant_type === 'student'
            ? formData.wants_parent_access : false,
          optional_parent_name: formData.optional_parent_name || null,
          optional_parent_email: formData.optional_parent_email || null,
          optional_parent_phone: formData.optional_parent_phone || null,
          optional_parent_relationship: formData.optional_parent_relationship || null,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Something went wrong.')
        setLoading(false)
        return
      }

      router.push('/academy/enroll/verify')
    } catch (err) {
      console.error(err)
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  if (!mounted) return null

  // ── STEP 0 — WHO IS APPLYING ─────────────────────
  if (step === 0) {
    return (
      <div
        className="min-h-screen flex items-center
        justify-center py-12 px-4"
        style={{ backgroundColor: '#F0F6FB' }}
      >
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <Link href="/academy" className="inline-block mb-6">
              <Image
                src="/logo.png"
                alt="Averra Knowledge Academy"
                width={200}
                height={200}
                className="h-16 w-auto mx-auto object-contain"
              />
            </Link>
            <h1
              className="text-2xl md:text-3xl font-bold mb-2"
              style={{ color: '#062850' }}
            >
              Start Your Enrolment
            </h1>
            <p className="text-gray-500">
              First, tell us who is applying today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => { update('applicant_type', 'parent'); setStep(1) }}
              className="bg-white rounded-2xl p-8 border-2
              border-gray-100 text-left transition-all duration-300
              hover:border-[#062850] hover:shadow-xl
              hover:-translate-y-1 group"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center
                justify-center mb-5 text-3xl transition-all
                duration-300 group-hover:scale-110"
                style={{ backgroundColor: '#F0F6FB' }}
              >
                👨‍👩‍👧
              </div>
              <h2 className="font-bold text-xl mb-2"
              style={{ color: '#062850' }}>
                Parent / Guardian
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                I am enrolling my child or ward into Averra Academy.
              </p>
              <ul className="space-y-1.5">
                {[
                  'Primary school learners',
                  'Secondary school learners',
                  'University students',
                ].map(item => (
                  <li key={item} className="flex items-center
                  gap-2 text-xs text-gray-500">
                    <CheckCircle className="w-3.5 h-3.5 flex-shrink-0"
                    style={{ color: '#497296' }} />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center gap-2 text-sm
              font-semibold" style={{ color: '#062850' }}>
                Enrol My Learner
                <ChevronRight className="w-4 h-4 transition-transform
                duration-200 group-hover:translate-x-1" />
              </div>
            </button>

            <button
              onClick={() => { update('applicant_type', 'student'); setStep(1) }}
              className="bg-white rounded-2xl p-8 border-2
              border-gray-100 text-left transition-all duration-300
              hover:border-[#062850] hover:shadow-xl
              hover:-translate-y-1 group"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center
                justify-center mb-5 text-3xl transition-all
                duration-300 group-hover:scale-110"
                style={{ backgroundColor: '#F0F6FB' }}
              >
                🎓
              </div>
              <h2 className="font-bold text-xl mb-2"
              style={{ color: '#062850' }}>
                Learner / Student
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                I am enrolling myself — I am the learner.
              </p>
              <ul className="space-y-1.5">
                {[
                  'Applying for yourself',
                  'Any age or level',
                  'Option to add parent access',
                ].map(item => (
                  <li key={item} className="flex items-center
                  gap-2 text-xs text-gray-500">
                    <CheckCircle className="w-3.5 h-3.5 flex-shrink-0"
                    style={{ color: '#497296' }} />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center gap-2 text-sm
              font-semibold" style={{ color: '#062850' }}>
                Enrol Myself
                <ChevronRight className="w-4 h-4 transition-transform
                duration-200 group-hover:translate-x-1" />
              </div>
            </button>
          </div>

          <div className="text-center mt-8">
            <Link href="/academy" className="text-sm text-gray-400
            hover:text-gray-600 transition-colors">
              ← Back to Academy page
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── STEPS 1–7 ────────────────────────────────────
  return (
    <div className="min-h-screen py-12 px-4"
    style={{ backgroundColor: '#F0F6FB' }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/academy" className="inline-block mb-6">
            <Image
              src="/logo.png"
              alt="Averra Knowledge Academy"
              width={200}
              height={200}
              className="h-16 w-auto mx-auto object-contain"
            />
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span
              className="text-xs px-3 py-1 rounded-full
              font-semibold text-white"
              style={{ backgroundColor: '#497296' }}
            >
              {formData.applicant_type === 'parent'
                ? '👨‍👩‍👧 Parent / Guardian'
                : '🎓 Learner / Student'}
            </span>
            <button
              onClick={() => setStep(0)}
              className="text-xs text-gray-400
              hover:text-gray-600 underline"
            >
              Change
            </button>
          </div>
          <h1
            className="text-2xl md:text-3xl font-bold mb-1"
            style={{ color: '#062850' }}
          >
            Start Your Enrolment
          </h1>
          <p className="text-gray-500 text-sm">
            Takes about 5 minutes to complete
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm
        border border-gray-100 mb-6">
          <div className="flex items-center justify-between">
            {STEPS.map((s, index) => {
              const isDone = step > s.number
              const isActive = step === s.number
              return (
                <div key={s.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center
                      justify-center text-xs font-bold transition-all
                      duration-300 ${isDone || isActive ? '' : 'bg-gray-100 text-gray-400'}
                      ${isActive ? 'ring-4 ring-blue-100' : ''}`}
                      style={isDone || isActive
                        ? { backgroundColor: '#062850', color: 'white' }
                        : {}}
                    >
                      {isDone ? '✓' : s.icon}
                    </div>
                    <span className={`text-xs mt-1 font-medium hidden sm:block
                    ${isActive ? 'text-[#062850]' : isDone ? 'text-gray-500' : 'text-gray-400'}`}>
                      {s.label}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className="flex-1 h-0.5 mx-2 transition-all duration-300"
                      style={{ backgroundColor: step > s.number ? '#062850' : '#e5e7eb' }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm
        border border-gray-100 overflow-hidden">

          {/* Step Header */}
          <div className="px-8 py-5 border-b border-gray-100"
          style={{ backgroundColor: '#F0F6FB' }}>
            <h2 className="font-bold text-lg" style={{ color: '#062850' }}>
              {formData.applicant_type === 'parent' && (
                <>
                  {step === 1 && '👤 Your Information'}
                  {step === 2 && '🎓 Learner Details'}
                  {step === 3 && '📚 Curriculum Preview'}
                  {step === 4 && '🏫 Class Type & Pricing'}
                  {step === 5 && '📅 Schedule Preferences'}
                  {step === 6 && '🔐 Create Account'}
                </>
              )}
              {formData.applicant_type === 'student' && (
                <>
                  {step === 1 && '👤 Your Personal Information'}
                  {step === 2 && '🎓 Your Academic Information'}
                  {step === 3 && '📚 Your Curriculum Preview'}
                  {step === 4 && '🏫 Class Type & Pricing'}
                  {step === 5 && '📅 Schedule Preferences'}
                  {step === 6 && '👨‍👩‍👧 Parent / Guardian Access'}
                  {step === 7 && '🔐 Create Account'}
                </>
              )}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Step {step} of {MAX_STEP}
            </p>
          </div>

          <div className="px-8 py-8">

            {/* ════════════════════════════ */}
            {/* STEP 1 — APPLICANT INFO     */}
            {/* ════════════════════════════ */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5"
                    style={{ color: '#062850' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={e => update('full_name', e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-xl border
                      border-gray-200 text-sm focus:outline-none
                      focus:ring-2 focus:ring-[#497296]"
                    />
                  </div>

                  {formData.applicant_type === 'parent' ? (
                    <div>
                      <label className="block text-sm font-semibold mb-1.5"
                      style={{ color: '#062850' }}>
                        Relationship to Learner *
                      </label>
                      <div className="relative">
                        <select
                          value={formData.relationship}
                          onChange={e => update('relationship', e.target.value)}
                          className="w-full px-4 py-3 pr-10 rounded-xl
                          border border-gray-200 appearance-none text-sm
                          focus:outline-none focus:ring-2 focus:ring-[#497296]"
                        >
                          <option>Parent</option>
                          <option>Guardian</option>
                          <option>Grandparent</option>
                          <option>Older Sibling</option>
                          <option>Other</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2
                        -translate-y-1/2 w-4 h-4 text-gray-400
                        pointer-events-none" />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-semibold mb-1.5"
                      style={{ color: '#062850' }}>
                        Date of Birth
                        <span className="text-gray-400 font-normal ml-1">
                          (optional)
                        </span>
                      </label>
                      <input
                        type="date"
                        value={formData.date_of_birth}
                        onChange={e => update('date_of_birth', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border
                        border-gray-200 text-sm focus:outline-none
                        focus:ring-2 focus:ring-[#497296]"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5"
                  style={{ color: '#062850' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => update('email', e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border
                    border-gray-200 text-sm focus:outline-none
                    focus:ring-2 focus:ring-[#497296]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5"
                    style={{ color: '#062850' }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => update('phone', e.target.value)}
                      placeholder="+234 or +44..."
                      className="w-full px-4 py-3 rounded-xl border
                      border-gray-200 text-sm focus:outline-none
                      focus:ring-2 focus:ring-[#497296]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5"
                    style={{ color: '#062850' }}>
                      WhatsApp
                      <span className="text-gray-400 font-normal ml-1">
                        (if different)
                      </span>
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={e => update('whatsapp', e.target.value)}
                      placeholder="Same as phone if blank"
                      className="w-full px-4 py-3 rounded-xl border
                      border-gray-200 text-sm focus:outline-none
                      focus:ring-2 focus:ring-[#497296]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5"
                  style={{ color: '#062850' }}>
                    Country of Residence *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.country}
                      onChange={e => update('country', e.target.value)}
                      className="w-full px-4 py-3 pr-10 rounded-xl
                      border border-gray-200 appearance-none text-sm
                      focus:outline-none focus:ring-2 focus:ring-[#497296]"
                    >
                      <option value="">Select country...</option>
                      {countries.map(c => (
                        <option key={c.country_code} value={c.country_code}>
                          {c.flag} {c.country_name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2
                    -translate-y-1/2 w-4 h-4 text-gray-400
                    pointer-events-none" />
                  </div>
                  {formData.country && (
                    <p className="text-xs mt-1.5"
                    style={{ color: '#497296' }}>
                      {currency === 'NGN'
                        ? '💰 Prices will be shown in ₦ (Naira) — payment via Paystack'
                        : '💰 Prices will be shown in £ (GBP) — payment via bank transfer'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5"
                  style={{ color: '#062850' }}>
                    How did you hear about us?
                  </label>
                  <div className="relative">
                    <select
                      value={formData.heard_from}
                      onChange={e => update('heard_from', e.target.value)}
                      className="w-full px-4 py-3 pr-10 rounded-xl
                      border border-gray-200 appearance-none text-sm
                      focus:outline-none focus:ring-2 focus:ring-[#497296]"
                    >
                      <option value="">Select...</option>
                      <option>Google / Search</option>
                      <option>Instagram</option>
                      <option>Facebook</option>
                      <option>TikTok</option>
                      <option>WhatsApp</option>
                      <option>Friend / Family Referral</option>
                      <option>LinkedIn</option>
                      <option>Other</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2
                    -translate-y-1/2 w-4 h-4 text-gray-400
                    pointer-events-none" />
                  </div>
                </div>
              </div>
            )}

            {/* ════════════════════════════ */}
            {/* STEP 2 — LEARNER DETAILS    */}
            {/* ════════════════════════════ */}
            {step === 2 && (
              <div className="space-y-8">
                {formData.applicant_type === 'parent' && (
                  <div
                    className="flex items-center justify-between
                    p-4 rounded-xl border border-gray-100"
                    style={{ backgroundColor: '#F0F6FB' }}
                  >
                    <div>
                      <p className="font-semibold text-sm"
                      style={{ color: '#062850' }}>
                        Number of learners to enrol
                      </p>
                      <p className="text-xs text-gray-500">
                        You can add more later
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => removeLearner(formData.learners.length - 1)}
                        disabled={formData.learners.length === 1}
                        className="w-8 h-8 rounded-full border border-gray-200
                        flex items-center justify-center hover:bg-gray-100
                        disabled:opacity-40"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-lg w-6 text-center"
                      style={{ color: '#062850' }}>
                        {formData.learners.length}
                      </span>
                      <button
                        type="button"
                        onClick={addLearner}
                        className="w-8 h-8 rounded-full border border-gray-200
                        flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {formData.learners.map((learner, li) => (
                  <LearnerCard
                    key={li}
                    index={li}
                    learner={learner}
                    showRemove={formData.applicant_type === 'parent' && formData.learners.length > 1}
                    countries={countries}
                    yearGroupsByCountry={yearGroupsByCountry}
                    onRemove={() => removeLearner(li)}
                    onUpdate={(key, value) => updateLearner(li, key, value)}
                    onFetchYearGroups={fetchYearGroups}
                    onToggleSubject={code => toggleLearnerSubject(li, code)}
                    label={
                      formData.applicant_type === 'parent'
                        ? (formData.learners.length > 1 ? `Learner ${li + 1}` : 'Learner Details')
                        : 'Your Academic Information'
                    }
                    isParentFlow={formData.applicant_type === 'parent'}
                  />
                ))}
              </div>
            )}

            {/* ════════════════════════════ */}
            {/* STEP 3 — CURRICULUM         */}
            {/* ════════════════════════════ */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="rounded-2xl p-6"
                style={{ backgroundColor: '#F0F6FB' }}>
                  <h3 className="font-bold text-lg mb-3"
                  style={{ color: '#062850' }}>
                    ✨ Your Averra Super Curriculum
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {formData.applicant_type === 'parent'
                      ? 'Your learner will follow the Averra Super Curriculum — a fusion of seven of the world's best education systems.'
                      : 'You will follow the Averra Super Curriculum — personalised to your academic profile.'}
                  </p>

                  {formData.learners.map((learner, li) => (
                    <div key={li} className="bg-white rounded-xl p-4 mb-3
                    border border-gray-100">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">
                          {formData.applicant_type === 'parent' ? '👦' : '🎓'}
                        </span>
                        <span className="font-bold" style={{ color: '#062850' }}>
                          {learner.full_name || (formData.applicant_type === 'student'
                            ? formData.full_name : `Learner ${li + 1}`)}
                        </span>
                        <span className="text-sm text-gray-500">
                          — {learner.year_group_label} •{' '}
                          {countries.find(c => c.country_code === learner.country_code)?.flag}{' '}
                          {countries.find(c => c.country_code === learner.country_code)?.country_name}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {learner.subjects.map(code => {
                          const s = SUBJECTS_LIST.find(x => x.code === code)
                          return (
                            <span key={code} className="px-3 py-1 rounded-full
                            text-xs font-medium text-white"
                            style={{ backgroundColor: '#497296' }}>
                              {s?.emoji} {s?.label}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { flag: '🇬🇧', name: 'England' },
                      { flag: '🇯🇵', name: 'Japan' },
                      { flag: '🇪🇪', name: 'Estonia' },
                      { flag: '🇨🇦', name: 'Canada' },
                      { flag: '🇳🇬', name: 'Nigeria' },
                      { flag: '🇸🇬', name: 'Singapore' },
                      { flag: '🇫🇮', name: 'Finland' },
                      { flag: '🧠', name: 'You' },
                    ].map(item => (
                      <div key={item.name}
                      className="flex items-center gap-2 bg-white
                      rounded-lg px-3 py-2 border border-gray-100">
                        <span>{item.flag}</span>
                        <span className="text-xs font-medium text-gray-600">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl p-4 flex items-center gap-3 border"
                style={{ borderColor: '#497296', backgroundColor: '#F0F6FB' }}>
                  <span className="text-2xl">🔍</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: '#062850' }}>
                      Want to explore the full curriculum?
                    </p>
                    <p className="text-xs text-gray-500">
                      See every topic side by side on the Academy page.
                    </p>
                  </div>
                  <Link href="/academy#explorer" target="_blank"
                  className="text-xs font-semibold whitespace-nowrap
                  px-4 py-2 rounded-lg text-white"
                  style={{ backgroundColor: '#497296' }}>
                    View →
                  </Link>
                </div>

                <label
                  className="flex items-start gap-3 cursor-pointer
                  p-4 rounded-xl border-2 transition-all duration-200"
                  style={{
                    borderColor: formData.curriculum_confirmed ? '#22c55e' : '#e5e7eb',
                    backgroundColor: formData.curriculum_confirmed ? '#f0fdf4' : 'white',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.curriculum_confirmed}
                    onChange={e => update('curriculum_confirmed', e.target.checked)}
                    className="mt-0.5 w-5 h-5 accent-[#062850]
                    cursor-pointer flex-shrink-0"
                  />
                  <span className="text-sm font-semibold"
                  style={{ color: '#062850' }}>
                    {formData.applicant_type === 'parent'
                      ? 'I have reviewed the Averra Super Curriculum and I am happy for my learner to proceed.'
                      : 'I have reviewed the Averra Super Curriculum and I am happy to proceed.'}
                  </span>
                </label>
              </div>
            )}

            {/* ════════════════════════════ */}
            {/* STEP 4 — CLASS TYPE         */}
            {/* ════════════════════════════ */}
            {step === 4 && (
              <div className="space-y-6">

                {/* Class Type Selection */}
                <div>
                  <label className="block text-sm font-bold mb-3"
                  style={{ color: '#062850' }}>
                    Choose Your Class Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        key: 'private' as ClassType,
                        emoji: '👤',
                        label: 'Private Class',
                        desc: 'One-on-one with your dedicated teacher. Maximum attention, fully personalised lessons.',
                        highlight: 'Best results',
                      },
                      {
                        key: 'general' as ClassType,
                        emoji: '👥',
                        label: 'General Class',
                        desc: 'Group sessions with other learners at the same level. Collaborative and affordable.',
                        highlight: 'Best value',
                      },
                    ].map(cls => {
                      const isSelected = formData.class_type === cls.key
                      const subjectCount = Math.max(
                        primaryLearner.subjects.length, 1
                      )
                      const bundle = getSubjectBundle(subjectCount)
                      const price = currency === 'NGN'
                        ? NGN_PRICING[cls.key][bundle]
                        : GBP_PRICING[cls.key][bundle]
                      const symbol = currency === 'NGN' ? '₦' : '£'

                      return (
                        <button
                          key={cls.key}
                          type="button"
                          onClick={() => update('class_type', cls.key)}
                          className={`p-6 rounded-2xl border-2 text-left
                          transition-all duration-200 hover:scale-105
                          ${isSelected ? '' : 'bg-white border-gray-200'}`}
                          style={isSelected
                            ? { backgroundColor: '#062850', borderColor: '#062850' }
                            : {}}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-3xl">{cls.emoji}</span>
                            <span
                              className="text-xs px-2 py-1 rounded-full font-bold"
                              style={{
                                backgroundColor: isSelected ? '#497296' : '#F0F6FB',
                                color: isSelected ? 'white' : '#062850',
                              }}
                            >
                              {cls.highlight}
                            </span>
                          </div>
                          <h3 className={`font-bold text-lg mb-2
                          ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                            {cls.label}
                          </h3>
                          <p className={`text-xs leading-relaxed mb-4
                          ${isSelected ? 'text-blue-200' : 'text-gray-500'}`}>
                            {cls.desc}
                          </p>
                          <div className={`text-2xl font-bold
                          ${isSelected ? 'text-yellow-300' : 'text-[#062850]'}`}>
                            {symbol}{price.toLocaleString()}
                            <span className={`text-xs font-normal ml-1
                            ${isSelected ? 'text-blue-300' : 'text-gray-400'}`}>
                              /month
                            </span>
                          </div>
                          <p className={`text-xs mt-1
                          ${isSelected ? 'text-blue-300' : 'text-gray-400'}`}>
                            for {primaryLearner.subjects.length || 1} subject
                            {(primaryLearner.subjects.length || 1) > 1 ? 's' : ''}
                            {' '}({bundle} bundle)
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Pricing Table */}
                <div className="rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="px-5 py-3"
                  style={{ backgroundColor: '#062850' }}>
                    <p className="font-bold text-white text-sm">
                      Full Pricing Reference
                      ({currency === 'NGN' ? '₦ Nigerian Naira' : '£ British Pounds'})
                    </p>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ backgroundColor: '#F0F6FB' }}>
                        <th className="px-4 py-3 text-left text-xs
                        font-bold text-gray-500">Subjects</th>
                        <th className="px-4 py-3 text-right text-xs
                        font-bold" style={{ color: '#062850' }}>
                          👤 Private
                        </th>
                        <th className="px-4 py-3 text-right text-xs
                        font-bold" style={{ color: '#062850' }}>
                          👥 General
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { range: '1-2 subjects', bundle: '1-2' },
                        { range: '3-4 subjects', bundle: '3-4' },
                        { range: '5-6 subjects', bundle: '5-6' },
                      ].map(row => {
                        const symbol = currency === 'NGN' ? '₦' : '£'
                        const pricing = currency === 'NGN'
                          ? NGN_PRICING : GBP_PRICING
                        const isCurrentBundle =
                          getSubjectBundle(primaryLearner.subjects.length || 1) === row.bundle
                        return (
                          <tr
                            key={row.bundle}
                            className="border-t border-gray-50"
                            style={isCurrentBundle
                              ? { backgroundColor: '#EBF4FF' }
                              : {}}
                          >
                            <td className="px-4 py-3 text-xs text-gray-600">
                              {row.range}
                              {isCurrentBundle && (
                                <span className="ml-2 text-xs font-bold
                                text-[#497296]">← yours</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right text-xs
                            font-bold" style={{ color: '#062850' }}>
                              {symbol}{pricing.private[row.bundle].toLocaleString()}/mo
                            </td>
                            <td className="px-4 py-3 text-right text-xs
                            font-bold" style={{ color: '#062850' }}>
                              {symbol}{pricing.general[row.bundle].toLocaleString()}/mo
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  <div className="px-4 py-2 text-xs text-gray-400
                  border-t border-gray-50">
                    Maximum 6 subjects per learner
                  </div>
                </div>

                {/* Billing Period */}
                <div>
                  <label className="block text-sm font-bold mb-3"
                  style={{ color: '#062850' }}>
                    Payment Period
                    <span className="text-gray-400 font-normal ml-1">
                      — longer periods save more
                    </span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {BILLING_OPTIONS.map(opt => {
                      const isSelected = formData.billing_period === opt.key
                      const base = monthlyPrice * formData.learners.length * opt.months
                      const disc = (base * opt.discount) / 100
                      const final = base - disc
                      const symbol = currency === 'NGN' ? '₦' : '£'

                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => update('billing_period', opt.key)}
                          className={`p-4 rounded-xl border-2 text-left
                          transition-all duration-200 hover:scale-105 relative
                          ${isSelected ? '' : 'bg-white border-gray-200'}`}
                          style={isSelected
                            ? { backgroundColor: '#062850', borderColor: '#062850' }
                            : {}}
                        >
                          {opt.discount > 0 && (
                            <span className="absolute -top-2 -right-2 text-xs
                            font-bold px-2 py-0.5 rounded-full text-yellow-900"
                            style={{ backgroundColor: '#FEF08A' }}>
                              -{opt.discount}%
                            </span>
                          )}
                          <div className={`font-bold text-sm
                          ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                            {opt.label}
                          </div>
                          <div className={`text-base font-bold mt-1
                          ${isSelected ? 'text-yellow-300' : 'text-[#062850]'}`}>
                            {symbol}{final.toLocaleString()}
                          </div>
                          {opt.discount > 0 && (
                            <div className={`text-xs line-through
                            ${isSelected ? 'text-blue-300' : 'text-gray-400'}`}>
                              {symbol}{base.toLocaleString()}
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="rounded-2xl p-6"
                style={{ backgroundColor: '#062850' }}>
                  <h3 className="font-bold text-white text-lg mb-4">
                    💰 Your Summary
                  </h3>
                  <div className="space-y-2 mb-4">
                    {[
                      {
                        label: 'Class type',
                        value: formData.class_type === 'private'
                          ? 'Private Class' : 'General Class',
                      },
                      {
                        label: 'Subjects',
                        value: `${primaryLearner.subjects.length || 1} subject${
                          (primaryLearner.subjects.length || 1) > 1 ? 's' : ''
                        } (${getSubjectBundle(primaryLearner.subjects.length || 1)} bundle)`,
                      },
                      {
                        label: 'Monthly price per learner',
                        value: formatPrice(monthlyPrice, currency),
                      },
                      ...(formData.learners.length > 1 ? [{
                        label: 'Learners',
                        value: `× ${formData.learners.length}`,
                      }] : []),
                      {
                        label: 'Billing period',
                        value: billingOption.label,
                      },
                    ].map(row => (
                      <div key={row.label}
                      className="flex justify-between text-sm">
                        <span className="text-blue-200">{row.label}</span>
                        <span className="text-white font-semibold">
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-green-300">
                        Discount ({billingOption.discount}% off)
                      </span>
                      <span className="text-green-300 font-semibold">
                        -{formatPrice(discount, currency)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-white/20 pt-4
                  flex justify-between items-center">
                    <span className="text-blue-200 font-semibold">
                      Total Due
                    </span>
                    <span className="text-3xl font-bold text-yellow-300">
                      {formatPrice(total, currency)}
                    </span>
                  </div>
                  <p className="text-blue-300 text-xs mt-3">
                    {currency === 'NGN'
                      ? '💳 Payment via Paystack (card, bank transfer, USSD)'
                      : '🏦 Payment via bank transfer (GBP account)'}
                  </p>
                </div>
              </div>
            )}

            {/* ════════════════════════════ */}
            {/* STEP 5 — SCHEDULE           */}
            {/* ════════════════════════════ */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-3"
                  style={{ color: '#062850' }}>
                    Preferred Days *
                    <span className="text-gray-400 font-normal ml-1">
                      (select all that apply)
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {DAYS.map(day => {
                      const isSelected = formData.preferred_days.includes(day)
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`px-4 py-2.5 rounded-xl border-2
                          font-medium text-sm transition-all duration-200
                          hover:scale-105 ${isSelected
                            ? 'text-white'
                            : 'bg-white text-gray-600 border-gray-200'}`}
                          style={isSelected
                            ? { backgroundColor: '#062850', borderColor: '#062850' }
                            : {}}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-3"
                  style={{ color: '#062850' }}>
                    Preferred Time of Day *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { key: 'Morning (8am – 12pm)',   emoji: '🌅', desc: '8:00 AM – 12:00 PM' },
                      { key: 'Afternoon (12pm – 4pm)', emoji: '☀️', desc: '12:00 PM – 4:00 PM' },
                      { key: 'Evening (4pm – 8pm)',    emoji: '🌆', desc: '4:00 PM – 8:00 PM' },
                    ].map(time => {
                      const isSelected = formData.preferred_time === time.key
                      return (
                        <button
                          key={time.key}
                          type="button"
                          onClick={() => update('preferred_time', time.key)}
                          className={`p-4 rounded-xl border-2 text-center
                          transition-all duration-200 hover:scale-105
                          ${isSelected ? '' : 'bg-white border-gray-200'}`}
                          style={isSelected
                            ? { backgroundColor: '#062850', borderColor: '#062850' }
                            : {}}
                        >
                          <div className="text-2xl mb-1">{time.emoji}</div>
                          <div className={`font-semibold text-sm
                          ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                            {time.key.split(' (')[0]}
                          </div>
                          <div className={`text-xs mt-0.5
                          ${isSelected ? 'text-blue-200' : 'text-gray-500'}`}>
                            {time.desc}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1.5"
                  style={{ color: '#062850' }}>
                    Your Timezone *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.timezone}
                      onChange={e => update('timezone', e.target.value)}
                      className="w-full px-4 py-3 pr-10 rounded-xl
                      border border-gray-200 appearance-none text-sm
                      focus:outline-none focus:ring-2 focus:ring-[#497296]"
                    >
                      <option value="">Select timezone...</option>
                      {TIMEZONES.map(tz => (
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2
                    -translate-y-1/2 w-4 h-4 text-gray-400
                    pointer-events-none" />
                  </div>
                </div>

                {formData.class_type === 'general' && (
                  <div className="rounded-xl p-4 flex items-start gap-3"
                  style={{ backgroundColor: '#FEF3C7' }}>
                    <span className="text-xl flex-shrink-0">ℹ️</span>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      <strong>General Class:</strong> You will be assigned
                      to a class group based on your preferred time and
                      availability. Our team will confirm your exact
                      group within 24 hours.
                    </p>
                  </div>
                )}

                <div className="rounded-xl p-4 flex items-start gap-3"
                style={{ backgroundColor: '#F0F6FB' }}>
                  <span className="text-xl flex-shrink-0">📞</span>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Our team will contact you within{' '}
                    <strong>24 hours</strong> to confirm your exact
                    timetable.
                  </p>
                </div>
              </div>
            )}

            {/* ════════════════════════════════ */}
            {/* STEP 6 — STUDENT: PARENT ACCESS */}
            {/* ════════════════════════════════ */}
            {step === 6 && formData.applicant_type === 'student' && (
              <div className="space-y-6">
                <div className="rounded-2xl p-6"
                style={{ backgroundColor: '#F0F6FB' }}>
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-3xl">👨‍👩‍👧</span>
                    <div>
                      <h3 className="font-bold text-lg mb-1"
                      style={{ color: '#062850' }}>
                        Would you like a parent or guardian to
                        observe your progress?
                      </h3>
                      <p className="text-gray-500 text-sm">
                        This is completely optional. If you add a parent,
                        they can see your timetable and progress reports —
                        but cannot change your account settings.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => update('wants_parent_access', true)}
                      className={`p-5 rounded-xl border-2 text-center
                      transition-all duration-200 hover:scale-105
                      ${formData.wants_parent_access === true
                        ? '' : 'bg-white border-gray-200'}`}
                      style={formData.wants_parent_access === true
                        ? { backgroundColor: '#062850', borderColor: '#062850' }
                        : {}}
                    >
                      <div className="text-2xl mb-2">✅</div>
                      <div className={`font-bold text-sm
                      ${formData.wants_parent_access === true
                        ? 'text-white' : 'text-gray-800'}`}>
                        Yes, add a parent
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        update('wants_parent_access', false)
                        update('optional_parent_name', '')
                        update('optional_parent_email', '')
                        update('optional_parent_phone', '')
                      }}
                      className={`p-5 rounded-xl border-2 text-center
                      transition-all duration-200 hover:scale-105
                      ${formData.wants_parent_access === false
                        ? '' : 'bg-white border-gray-200'}`}
                      style={formData.wants_parent_access === false
                        ? { backgroundColor: '#062850', borderColor: '#062850' }
                        : {}}
                    >
                      <div className="text-2xl mb-2">🙅</div>
                      <div className={`font-bold text-sm
                      ${formData.wants_parent_access === false
                        ? 'text-white' : 'text-gray-800'}`}>
                        No, not now
                      </div>
                    </button>
                  </div>
                </div>

                {formData.wants_parent_access === true && (
                  <div className="space-y-4 p-6 rounded-2xl
                  border border-gray-100 bg-white">
                    <h4 className="font-bold" style={{ color: '#062850' }}>
                      Parent / Guardian Details
                    </h4>
                    <p className="text-sm text-gray-500">
                      We will send them an invitation to create
                      their observer account.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-1.5"
                        style={{ color: '#062850' }}>
                          Parent&apos;s Full Name *
                        </label>
                        <input
                          type="text"
                          value={formData.optional_parent_name}
                          onChange={e => update('optional_parent_name', e.target.value)}
                          placeholder="e.g. Mrs Adeyemi"
                          className="w-full px-4 py-3 rounded-xl border
                          border-gray-200 text-sm focus:outline-none
                          focus:ring-2 focus:ring-[#497296]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1.5"
                        style={{ color: '#062850' }}>
                          Relationship to You *
                        </label>
                        <div className="relative">
                          <select
                            value={formData.optional_parent_relationship}
                            onChange={e => update('optional_parent_relationship', e.target.value)}
                            className="w-full px-4 py-3 pr-10 rounded-xl
                            border border-gray-200 appearance-none text-sm
                            focus:outline-none focus:ring-2 focus:ring-[#497296]"
                          >
                            <option value="">Select...</option>
                            <option>Mother</option>
                            <option>Father</option>
                            <option>Guardian</option>
                            <option>Grandparent</option>
                            <option>Older Sibling</option>
                            <option>Other</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2
                          -translate-y-1/2 w-4 h-4 text-gray-400
                          pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1.5"
                      style={{ color: '#062850' }}>
                        Parent&apos;s Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.optional_parent_email}
                        onChange={e => update('optional_parent_email', e.target.value)}
                        placeholder="parent@example.com"
                        className="w-full px-4 py-3 rounded-xl border
                        border-gray-200 text-sm focus:outline-none
                        focus:ring-2 focus:ring-[#497296]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1.5"
                      style={{ color: '#062850' }}>
                        Parent&apos;s Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        value={formData.optional_parent_phone}
                        onChange={e => update('optional_parent_phone', e.target.value)}
                        placeholder="+234 or +44..."
                        className="w-full px-4 py-3 rounded-xl border
                        border-gray-200 text-sm focus:outline-none
                        focus:ring-2 focus:ring-[#497296]"
                      />
                    </div>

                    <div className="p-3 rounded-xl text-xs text-gray-600"
                    style={{ backgroundColor: '#F0F6FB' }}>
                      🔒 Your parent will only have{' '}
                      <strong>read-only access</strong>.
                      They cannot make changes to your enrollment or account.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ════════════════════════════════════ */}
            {/* ACCOUNT + PAYMENT STEP              */}
            {/* Parent: step 6 / Student: step 7    */}
            {/* ════════════════════════════════════ */}
            {((formData.applicant_type === 'parent' && step === 6) ||
              (formData.applicant_type === 'student' && step === 7)) && (
              <div className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold mb-1.5"
                    style={{ color: '#062850' }}>
                      Create Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={e => update('password', e.target.value)}
                        placeholder="At least 8 characters"
                        className="w-full px-4 py-3 pr-12 rounded-xl
                        border border-gray-200 text-sm focus:outline-none
                        focus:ring-2 focus:ring-[#497296]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2
                        text-gray-400"
                      >
                        {showPassword
                          ? <EyeOff className="w-4 h-4" />
                          : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formData.password.length > 0 &&
                     formData.password.length < 8 && (
                      <p className="text-red-500 text-xs mt-1">
                        At least 8 characters required
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1.5"
                    style={{ color: '#062850' }}>
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={formData.confirm_password}
                        onChange={e => update('confirm_password', e.target.value)}
                        placeholder="Repeat password"
                        className={`w-full px-4 py-3 pr-12 rounded-xl
                        border text-sm focus:outline-none focus:ring-2
                        focus:ring-[#497296]
                        ${formData.confirm_password &&
                          formData.password !== formData.confirm_password
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-200'}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2
                        text-gray-400"
                      >
                        {showConfirm
                          ? <EyeOff className="w-4 h-4" />
                          : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formData.confirm_password &&
                     formData.password !== formData.confirm_password && (
                      <p className="text-red-500 text-xs mt-1">
                        Passwords do not match
                      </p>
                    )}
                    {formData.confirm_password &&
                     formData.password === formData.confirm_password &&
                     formData.password.length >= 8 && (
                      <p className="text-green-500 text-xs mt-1">
                        ✓ Passwords match
                      </p>
                    )}
                  </div>
                </div>

                {/* Final Order Summary */}
                <div className="rounded-2xl p-6 border border-gray-100"
                style={{ backgroundColor: '#F0F6FB' }}>
                  <h3 className="font-bold text-base mb-4"
                  style={{ color: '#062850' }}>
                    📋 Final Order Summary
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Class type</span>
                      <span className="font-semibold"
                      style={{ color: '#062850' }}>
                        {formData.class_type === 'private'
                          ? '👤 Private Class'
                          : '👥 General Class'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {billingOption.label} ({formData.learners.length} learner
                        {formData.learners.length > 1 ? 's' : ''})
                      </span>
                      <span className="font-semibold"
                      style={{ color: '#062850' }}>
                        {formatPrice(subtotal, currency)}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">
                          Discount ({billingOption.discount}% off)
                        </span>
                        <span className="text-green-600 font-semibold">
                          -{formatPrice(discount, currency)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-200 pt-4
                  flex justify-between items-center">
                    <span className="font-bold"
                    style={{ color: '#062850' }}>
                      Total Due
                    </span>
                    <span className="text-2xl font-bold"
                    style={{ color: '#062850' }}>
                      {formatPrice(total, currency)}
                    </span>
                  </div>
                  <div className="mt-3 p-3 rounded-xl text-xs
                  text-gray-600 bg-white border border-gray-200">
                    {currency === 'NGN'
                      ? '💳 You will be redirected to Paystack to complete payment after registration.'
                      : '🏦 Payment instructions (bank transfer) will be shown after registration.'}
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agree_terms}
                      onChange={e => update('agree_terms', e.target.checked)}
                      className="mt-0.5 w-5 h-5 cursor-pointer
                      flex-shrink-0 accent-[#062850]"
                    />
                    <span className="text-sm text-gray-600">
                      I agree to the{' '}
                      <Link href="/terms" target="_blank"
                      className="underline font-medium"
                      style={{ color: '#497296' }}
                      onClick={e => e.stopPropagation()}>
                        Terms of Service
                      </Link>
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agree_privacy}
                      onChange={e => update('agree_privacy', e.target.checked)}
                      className="mt-0.5 w-5 h-5 cursor-pointer
                      flex-shrink-0 accent-[#062850]"
                    />
                    <span className="text-sm text-gray-600">
                      I agree to the{' '}
                      <Link href="/privacy" target="_blank"
                      className="underline font-medium"
                      style={{ color: '#497296' }}
                      onClick={e => e.stopPropagation()}>
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                </div>

                {/* Requirements */}
                <div className="rounded-xl p-4 space-y-1.5
                border border-gray-100"
                style={{ backgroundColor: '#F0F6FB' }}>
                  <p className="text-xs font-semibold mb-2"
                  style={{ color: '#062850' }}>
                    To enable the button, complete:
                  </p>
                  {[
                    { done: formData.password.length >= 8, label: 'Password (8+ characters)' },
                    {
                      done: formData.password === formData.confirm_password && formData.password.length >= 8,
                      label: 'Passwords match',
                    },
                    { done: formData.agree_terms, label: 'Terms of Service agreed' },
                    { done: formData.agree_privacy, label: 'Privacy Policy agreed' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-2 text-xs">
                      {item.done
                        ? <CheckCircle className="w-4 h-4 text-green-500" />
                        : <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
                      <span className={item.done
                        ? 'text-green-600 font-medium'
                        : 'text-gray-500'}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                    <p className="text-red-600 text-sm">⚠️ {error}</p>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Navigation */}
          <div className="px-8 py-5 border-t border-gray-100
          flex items-center justify-between"
          style={{ backgroundColor: '#F0F6FB' }}>
            <Button
              type="button"
              variant="outline"
              onClick={() => step > 1 ? setStep(step - 1) : setStep(0)}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              {step === 1 ? 'Change Type' : 'Back'}
            </Button>

            {step < MAX_STEP ? (
              <Button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2 text-white
                font-semibold px-8 disabled:opacity-50
                disabled:cursor-not-allowed"
                style={{ backgroundColor: '#062850' }}
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!canProceed() || loading}
                className="flex items-center gap-2 text-white
                font-semibold px-8 disabled:opacity-50
                disabled:cursor-not-allowed"
                style={{ backgroundColor: '#062850' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account & Continue
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════
// LEARNER CARD COMPONENT
// ══════════════════════════════════════
function LearnerCard({
  index,
  learner,
  showRemove,
  countries,
  yearGroupsByCountry,
  onRemove,
  onUpdate,
  onFetchYearGroups,
  onToggleSubject,
  label,
  isParentFlow,
}: {
  index: number
  learner: Learner
  showRemove: boolean
  countries: { country_code: string; country_name: string; flag: string }[]
  yearGroupsByCountry: Record<string, { year_group_label: string; year_group_code: string }[]>
  onRemove: () => void
  onUpdate: (key: keyof Learner, value: string | string[]) => void
  onFetchYearGroups: (code: string) => void
  onToggleSubject: (code: string) => void
  label: string
  isParentFlow: boolean
}) {
  const SUBJECTS_LIST = [
    { code: 'ENG',    label: 'English Language',         emoji: '📖' },
    { code: 'MATH',   label: 'Mathematics',               emoji: '🔢' },
    { code: 'SCI',    label: 'Science',                   emoji: '🔬' },
    { code: 'COMP',   label: 'Computing',                 emoji: '💻' },
    { code: 'HIST',   label: 'History',                   emoji: '🏛️' },
    { code: 'GEO',    label: 'Geography',                 emoji: '🌍' },
    { code: 'ART',    label: 'Creative Arts',             emoji: '🎨' },
    { code: 'MUS',    label: 'Music',                     emoji: '🎵' },
    { code: 'PE',     label: 'Physical Education',        emoji: '⚽' },
    { code: 'NHC',    label: 'Nigerian History & Culture',emoji: '🪘' },
    { code: 'REL',    label: 'Religious Studies',         emoji: '🕊️' },
    { code: 'BTECH',  label: 'Basic Technology',          emoji: '⚙️' },
    { code: 'BIO',    label: 'Biology',                   emoji: '🧬' },
    { code: 'CHEM',   label: 'Chemistry',                 emoji: '⚗️' },
    { code: 'PHY',    label: 'Physics',                   emoji: '⚡' },
    { code: 'ECON',   label: 'Economics',                 emoji: '📈' },
    { code: 'GOV',    label: 'Government / Politics',     emoji: '⚖️' },
    { code: 'ENGLIT', label: 'English Literature',        emoji: '📚' },
  ]

  return (
    <div className="border border-gray-100 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold" style={{ color: '#062850' }}>
          {label}
        </h3>
        {showRemove && (
          <button type="button" onClick={onRemove}
          className="text-xs text-red-400 hover:text-red-600">
            Remove
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5"
            style={{ color: '#062850' }}>
              {isParentFlow ? "Learner's Full Name *" : 'Your Full Name *'}
            </label>
            <input
              type="text"
              value={learner.full_name}
              onChange={e => onUpdate('full_name', e.target.value)}
              placeholder={isParentFlow ? 'e.g. Sophia Johnson' : 'Your name'}
              className="w-full px-4 py-3 rounded-xl border
              border-gray-200 text-sm focus:outline-none
              focus:ring-2 focus:ring-[#497296]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5"
            style={{ color: '#062850' }}>
              Date of Birth
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <input
              type="date"
              value={learner.date_of_birth}
              onChange={e => onUpdate('date_of_birth', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border
              border-gray-200 text-sm focus:outline-none
              focus:ring-2 focus:ring-[#497296]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5"
          style={{ color: '#062850' }}>
            {isParentFlow ? 'School Name' : 'Your School / University'}
            <span className="text-gray-400 font-normal ml-1">(optional)</span>
          </label>
          <input
            type="text"
            value={learner.school_name}
            onChange={e => onUpdate('school_name', e.target.value)}
            placeholder={isParentFlow
              ? "e.g. St Mary's Primary School"
              : 'e.g. University of Lagos'}
            className="w-full px-4 py-3 rounded-xl border
            border-gray-200 text-sm focus:outline-none
            focus:ring-2 focus:ring-[#497296]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5"
            style={{ color: '#062850' }}>
              {isParentFlow
                ? 'Country Where Learner Studies *'
                : 'Country Where You Study *'}
            </label>
            <div className="relative">
              <select
                value={learner.country_code}
                onChange={e => {
                  onUpdate('country_code', e.target.value)
                  onUpdate('year_group_code', '')
                  onUpdate('year_group_label', '')
                  onFetchYearGroups(e.target.value)
                }}
                className="w-full px-4 py-3 pr-10 rounded-xl
                border border-gray-200 appearance-none text-sm
                focus:outline-none focus:ring-2 focus:ring-[#497296]"
              >
                <option value="">Select country...</option>
                {countries.map(c => (
                  <option key={c.country_code} value={c.country_code}>
                    {c.flag} {c.country_name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2
              -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5"
            style={{ color: '#062850' }}>
              {isParentFlow ? 'Year / Class *' : 'Your Year / Level *'}
            </label>
            <div className="relative">
              <select
                value={learner.year_group_code}
                onChange={e => {
                  const code = e.target.value
                  const yg = (yearGroupsByCountry[learner.country_code] || [])
                    .find(y => y.year_group_code === code)
                  onUpdate('year_group_code', code)
                  onUpdate('year_group_label', yg?.year_group_label || code)
                }}
                disabled={!learner.country_code}
                className="w-full px-4 py-3 pr-10 rounded-xl
                border border-gray-200 appearance-none text-sm
                focus:outline-none focus:ring-2 focus:ring-[#497296]
                disabled:opacity-50"
              >
                <option value="">
                  {learner.country_code
                    ? 'Select year...'
                    : 'Select country first...'}
                </option>
                {(yearGroupsByCountry[learner.country_code] || []).map(y => (
                  <option key={y.year_group_code} value={y.year_group_code}>
                    {y.year_group_label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2
              -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2"
          style={{ color: '#062850' }}>
            {isParentFlow
              ? 'Subjects *'
              : 'Subjects You Need Help With *'}
            <span className="text-gray-400 font-normal ml-1">
              (select up to 6)
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {SUBJECTS_LIST.map(subject => {
              const isSelected = learner.subjects.includes(subject.code)
              const isDisabled = !isSelected && learner.subjects.length >= 6
              return (
                <button
                  key={subject.code}
                  type="button"
                  onClick={() => !isDisabled && onToggleSubject(subject.code)}
                  className={`flex items-center gap-1.5 px-3 py-1.5
                  rounded-full border text-xs font-medium
                  transition-all duration-200
                  ${isSelected
                    ? 'text-white border-transparent'
                    : isDisabled
                    ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#497296] hover:scale-105'
                  }`}
                  style={isSelected
                    ? { backgroundColor: '#062850' }
                    : {}}
                >
                  {subject.emoji} {subject.label}
                  {isSelected && ' ✓'}
                </button>
              )
            })}
          </div>
          {learner.subjects.length > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              {learner.subjects.length} of 6 subjects selected
            </p>
          )}
          {learner.subjects.length === 6 && (
            <p className="text-xs text-amber-600 mt-1">
              Maximum 6 subjects reached
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5"
          style={{ color: '#062850' }}>
            {isParentFlow
              ? 'Any known learning needs or challenges?'
              : "Any learning needs or challenges you'd like us to know?"}
            <span className="text-gray-400 font-normal ml-1">(optional)</span>
          </label>
          <textarea
            value={learner.learning_challenges}
            onChange={e => onUpdate('learning_challenges', e.target.value)}
            placeholder="e.g. Dyslexia, needs extra help with reading..."
            rows={2}
            className="w-full px-4 py-3 rounded-xl border
            border-gray-200 text-sm focus:outline-none
            focus:ring-2 focus:ring-[#497296] resize-none"
          />
        </div>
      </div>
    </div>
  )
}
