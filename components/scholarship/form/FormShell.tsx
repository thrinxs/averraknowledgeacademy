'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import ProgressBar from './ProgressBar'
import FormNavigation from './FormNavigation'
import Step1BasicInfo from './steps/Step1BasicInfo'
import Step2AcademicBackground from './steps/Step2AcademicBackground'
import Step3CountryPreferences from './steps/Step3CountryPreferences'
import Step4CoursePreferences from './steps/Step4CoursePreferences'
import Step5AccountCreation from './steps/Step5AccountCreation'

export interface FormData {
  // Step 1
  fullName: string
  email: string
  phone: string
  whatsapp: string
  whatsappSameAsPhone: boolean
  dateOfBirth: string
  gender: string
  country: string
  stateCity: string

  // Step 2
  educationLevel: string
  fieldOfStudy: string
  institution: string
  institutionAccredited: boolean | null
  graduationYear: string
  cgpa: string
  gradingScale: string
  testScores: { name: string; score: string }[]
  publications: string
  workExperience: string
  workExperienceYears: string

  // Step 3
  preferredCountries: string[]
  scholarshipType: string
  preferredStartDate: string

  // Step 4
  degreeLevel: string
  fieldAbroad: string
  specificCourse: string
  reasonForStudying: string
  specialCircumstances: string

  // Step 5
  package: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
  agreePrivacy: boolean
  emailUpdates: boolean
  referralCode: string
  promoCode: string
  promoDiscount: {
    type: string
    value: number
    description: string
    code: string
  } | null
  paymentTiming: string
}

const STORAGE_KEY  = 'averra_scholarship_form'
const TOTAL_STEPS  = 5

const defaultFormData: FormData = {
  fullName:             '',
  email:                '',
  phone:                '',
  whatsapp:             '',
  whatsappSameAsPhone:  true,
  dateOfBirth:          '',
  gender:               '',
  country:              '',
  stateCity:            '',
  educationLevel:       '',
  fieldOfStudy:         '',
  institution:          '',
  institutionAccredited: null,
  graduationYear:       '',
  cgpa:                 '',
  gradingScale:         '',
  testScores:           [],
  publications:         '',
  workExperience:       '',
  workExperienceYears:  '',
  preferredCountries:   [],
  scholarshipType:      '',
  preferredStartDate:   '',
  degreeLevel:          '',
  fieldAbroad:          '',
  specificCourse:       '',
  reasonForStudying:    '',
  specialCircumstances: '',
  package:              '',
  password:             '',
  confirmPassword:      '',
  agreeTerms:           false,
  agreePrivacy:         false,
  emailUpdates:         false,
  referralCode:         '',
  promoCode:            '',
  promoDiscount:        null,
  paymentTiming:        'now',
}

export default function FormShell() {
  const searchParams = useSearchParams()
  const packageParam = searchParams.get('package') ?? ''

  // mounted must be FIRST useState
  const [mounted, setMounted]           = useState(false)
  const [currentUser, setCurrentUser]   = useState<any>(null)
  const [currentStep, setCurrentStep]   = useState(1)
  const [formData, setFormData]         = useState<FormData>(() => ({
    ...defaultFormData,
    package: packageParam,
  }))
  const [savedIndicator, setSavedIndicator] = useState(false)
  const [isSubmitting, setIsSubmitting]     = useState(false)
  const [stepErrors, setStepErrors]         = useState<Record<string, string>>({})

  // ── Mount effect — loads localStorage + checks auth ──
  useEffect(() => {
    setMounted(true)

    // Load saved form data from localStorage
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as FormData
        setFormData({
          ...parsed,
          package:        packageParam || parsed.package || '',
          promoCode:      parsed.promoCode      || '',
          promoDiscount:  parsed.promoDiscount  || null,
          paymentTiming:  parsed.paymentTiming  || 'now',
        })
      } catch {
        // ignore corrupt data
      }
    }

    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setCurrentUser(user)
        setFormData((prev) => ({
          ...prev,
          email: prev.email || user.email || '',
        }))
      } else {
        setCurrentUser(null)
      }
    }

    checkUser()

    // Re-check auth when user returns to this tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') checkUser()
    }

    const handleFocus = () => checkUser()

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    // Listen for Supabase auth state changes in real time
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange(
        (event: AuthChangeEvent, session: Session | null) => {
          if (event === 'SIGNED_IN' && session?.user) {
            setCurrentUser(session.user)
            setFormData((prev) => ({
              ...prev,
              email: prev.email || session.user.email || '',
            }))
          } else if (event === 'SIGNED_OUT') {
            setCurrentUser(null)
          }
        }
      )

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      subscription.unsubscribe()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Save to localStorage whenever formData changes ──
  useEffect(() => {
    if (!mounted) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
    setSavedIndicator(true)
    const timer = setTimeout(() => setSavedIndicator(false), 2000)
    return () => clearTimeout(timer)
  }, [formData, mounted])

  const updateFormData = useCallback(
    (updates: Partial<FormData>) => {
      setFormData((prev) => ({ ...prev, ...updates }))
    },
    []
  )

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.fullName.trim())
        errors.fullName = 'Full name is required'
      if (!formData.email.trim())
        errors.email = 'Email address is required'
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        errors.email = 'Enter a valid email address'
      if (!formData.phone.trim())
        errors.phone = 'Phone number is required'
      if (!formData.dateOfBirth)
        errors.dateOfBirth = 'Date of birth is required'
      if (!formData.gender)
        errors.gender = 'Please select your gender'
      if (!formData.country.trim())
        errors.country = 'Country is required'
      if (!formData.stateCity.trim())
        errors.stateCity = 'State or city is required'
    }

    if (step === 2) {
      if (!formData.educationLevel)
        errors.educationLevel = 'Education level is required'
      if (!formData.fieldOfStudy.trim())
        errors.fieldOfStudy = 'Field of study is required'
      if (!formData.institution.trim())
        errors.institution = 'Institution name is required'
      if (!formData.graduationYear)
        errors.graduationYear = 'Graduation year is required'
      if (!formData.cgpa.trim())
        errors.cgpa = 'CGPA is required'
      if (!formData.gradingScale)
        errors.gradingScale = 'Grading scale is required'
    }

    if (step === 3) {
      if (formData.preferredCountries.length === 0)
        errors.preferredCountries = 'Select at least one preferred country'
      if (!formData.scholarshipType)
        errors.scholarshipType = 'Scholarship type is required'
      if (!formData.preferredStartDate)
        errors.preferredStartDate = 'Preferred start date is required'
    }

    if (step === 4) {
      if (!formData.degreeLevel)
        errors.degreeLevel = 'Degree level is required'
      if (!formData.fieldAbroad.trim())
        errors.fieldAbroad = 'Field of study abroad is required'
      if (!formData.reasonForStudying.trim())
        errors.reasonForStudying = 'Please tell us your reason for studying abroad'
    }

    if (step === 5) {
      if (!formData.package)
        errors.package = 'Please select a package'

      // Only validate password + terms for new users
      if (!currentUser) {
        if (!formData.password)
          errors.password = 'Password is required'
        else if (formData.password.length < 8)
          errors.password = 'Password must be at least 8 characters'
        if (!formData.confirmPassword)
          errors.confirmPassword = 'Please confirm your password'
        else if (formData.password !== formData.confirmPassword)
          errors.confirmPassword = 'Passwords do not match'
        if (!formData.agreeTerms)
          errors.agreeTerms = 'You must agree to the Terms of Service'
        if (!formData.agreePrivacy)
          errors.agreePrivacy = 'You must agree to the Privacy Policy'
      }
    }

    setStepErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNext = () => {
    if (!validateStep(currentStep)) return
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1)
      setStepErrors({})
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      if (currentUser) {
        // ── Logged-in user — save preferences ──
        const response = await fetch('/api/scholarship/save-preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId:               currentUser.id,
            educationLevel:       formData.educationLevel,
            fieldOfStudy:         formData.fieldOfStudy,
            institution:          formData.institution,
            institutionAccredited: formData.institutionAccredited,
            graduationYear:       formData.graduationYear,
            cgpa:                 formData.cgpa,
            gradingScale:         formData.gradingScale,
            testScores:           formData.testScores,
            publications:         formData.publications,
            workExperience:       formData.workExperience,
            workExperienceYears:  formData.workExperienceYears,
            preferredCountries:   formData.preferredCountries,
            scholarshipType:      formData.scholarshipType,
            preferredStartDate:   formData.preferredStartDate,
            degreeLevel:          formData.degreeLevel,
            fieldAbroad:          formData.fieldAbroad,
            specificCourse:       formData.specificCourse,
            reasonForStudying:    formData.reasonForStudying,
            specialCircumstances: formData.specialCircumstances,
            selectedPackage:      formData.package,
            promoCode:            formData.promoCode,
            promoDiscount:        formData.promoDiscount,
            referralCode:         formData.referralCode,
            emailUpdates:         formData.emailUpdates,
          }),
        })

        const result = await response.json()

        if (!result.success) {
          setStepErrors({
            submit: result.error || 'Could not save your application.',
          })
          return
        }

        localStorage.removeItem(STORAGE_KEY)

        if (formData.paymentTiming === 'now') {
          const payResponse = await fetch('/api/paystack/initialize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser.id }),
          })

          const payResult = await payResponse.json()

          if (payResult.success && payResult.authorization_url) {
            window.location.href = payResult.authorization_url
          } else {
            window.location.href = '/dashboard/scholarship'
          }
        } else {
          window.location.href = '/dashboard/scholarship'
        }

      } else {
        // ── New user — create account ──
        const response = await fetch('/api/scholarship/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName:             formData.fullName,
            email:                formData.email,
            phone:                formData.phone,
            whatsapp:             formData.whatsappSameAsPhone
                                    ? formData.phone
                                    : formData.whatsapp,
            dateOfBirth:          formData.dateOfBirth,
            gender:               formData.gender,
            country:              formData.country,
            stateCity:            formData.stateCity,
            educationLevel:       formData.educationLevel,
            fieldOfStudy:         formData.fieldOfStudy,
            institution:          formData.institution,
            institutionAccredited: formData.institutionAccredited,
            graduationYear:       formData.graduationYear,
            cgpa:                 formData.cgpa,
            gradingScale:         formData.gradingScale,
            testScores:           formData.testScores,
            publications:         formData.publications,
            workExperience:       formData.workExperience,
            workExperienceYears:  formData.workExperienceYears,
            preferredCountries:   formData.preferredCountries,
            scholarshipType:      formData.scholarshipType,
            preferredStartDate:   formData.preferredStartDate,
            degreeLevel:          formData.degreeLevel,
            fieldAbroad:          formData.fieldAbroad,
            specificCourse:       formData.specificCourse,
            reasonForStudying:    formData.reasonForStudying,
            specialCircumstances: formData.specialCircumstances,
            selectedPackage:      formData.package,
            password:             formData.password,
            referralCode:         formData.referralCode,
            promoCode:            formData.promoCode,
            promoDiscount:        formData.promoDiscount,
            emailUpdates:         formData.emailUpdates,
          }),
        })

        const result = await response.json()

        if (!result.success) {
          setStepErrors({
            submit: result.error || 'Registration failed. Please try again.',
          })
          return
        }

        localStorage.removeItem(STORAGE_KEY)
        window.location.href = result.redirectTo
      }

    } catch (error) {
      console.error('[FormShell] Submission error:', error)
      setStepErrors({
        submit: 'Something went wrong. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // All hooks above — safe to return early now
  if (!mounted) return null

  const stepProps = {
    formData,
    updateFormData,
    errors: stepErrors,
  }

  return (
    <div>

      {/* Saved Indicator */}
      <div
        className={`text-center text-xs mb-4 transition-all duration-300 font-medium
          ${savedIndicator ? 'opacity-100' : 'opacity-0'}`}
        style={{ color: '#497296' }}
      >
        ✓ Progress saved
      </div>

      {/* Progress Bar */}
      <ProgressBar
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
      />

      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">

        {currentStep === 1 && <Step1BasicInfo           {...stepProps} />}
        {currentStep === 2 && <Step2AcademicBackground  {...stepProps} />}
        {currentStep === 3 && <Step3CountryPreferences  {...stepProps} />}
        {currentStep === 4 && <Step4CoursePreferences   {...stepProps} />}
        {currentStep === 5 && (
          <Step5AccountCreation
            {...stepProps}
            isLoggedIn={!!currentUser}
          />
        )}

        <FormNavigation
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onBack={handleBack}
          onNext={handleNext}
          isSubmitting={isSubmitting}
          canSubmit={
            currentStep !== TOTAL_STEPS ||
            !!currentUser ||
            (formData.agreeTerms && formData.agreePrivacy)
          }
          submitLabel={
            currentUser
              ? formData.paymentTiming === 'now'
                ? 'Save & Pay Now'
                : 'Save to Dashboard'
              : 'Create My Account'
          }
        />

      </div>

      {/* Step counter */}
      <p className="text-center text-gray-400 text-xs mt-4">
        Step {currentStep} of {TOTAL_STEPS}
      </p>

    </div>
  )
}