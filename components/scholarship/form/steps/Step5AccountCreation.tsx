'use client'

import { useState, useMemo } from 'react'
import { FormData } from '../FormShell'
import {
  Eye,
  EyeOff,
  CheckCircle,
  Loader2,
  X,
  Tag,
} from 'lucide-react'
import Link from 'next/link'

interface Props {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
  errors: Record<string, string>
  isLoggedIn?: boolean
}

const inputClass = `w-full px-4 py-3 rounded-xl border
text-sm transition-all duration-200
focus:outline-none focus:ring-2`

const labelClass = `block text-sm font-semibold mb-2`

const PACKAGES = [
  {
    id: 'basic',
    name: 'Basic',
    price: 30000,
    priceDisplay: '₦30,000',
    color: '#497296',
    features: [
      '5 Scholarship Matches',
      'Detailed Match Report',
      'Country & Deadline Info',
      'Eligibility Breakdown',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 50000,
    priceDisplay: '₦50,000',
    color: '#325E84',
    features: [
      '5 Scholarship Matches',
      'SOP Review & Modification',
      'CV Review & Modification',
      'Application Guidance',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 150000,
    priceDisplay: '₦150,000',
    color: '#062850',
    features: [
      '5 Scholarship Matches',
      'Profile Boosting Coaching',
      'Interview Preparation',
      'WhatsApp Advisor Access',
    ],
  },
]

function formatPrice(amount: number): string {
  return (
    '₦' +
    amount.toLocaleString('en-NG', {
      minimumFractionDigits: 0,
    })
  )
}

export default function Step5AccountCreation({
  formData,
  updateFormData,
  errors,
  isLoggedIn = false,
}: Props) {
  const [showPassword, setShowPassword] =
    useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [promoInput, setPromoInput] = useState(
    formData.promoCode || ''
  )
  const [promoLoading, setPromoLoading] =
    useState(false)
  const [promoError, setPromoError] = useState('')
  const [promoSuccess, setPromoSuccess] =
    useState(false)

  const selectedPackage = PACKAGES.find(
    (p) => p.id === formData.package
  )

  const discountedPrice = useMemo(() => {
    if (!selectedPackage || !formData.promoDiscount)
      return null
    const original = selectedPackage.price
    const discount = formData.promoDiscount
    if (discount.type === 'percentage') {
      const off = (original * discount.value) / 100
      return Math.max(0, Math.round(original - off))
    }
    if (discount.type === 'fixed') {
      return Math.max(
        0,
        Math.round(original - discount.value)
      )
    }
    return null
  }, [selectedPackage, formData.promoDiscount])

  const discountAmount = useMemo(() => {
    if (
      !selectedPackage ||
      !formData.promoDiscount ||
      discountedPrice === null
    )
      return 0
    return selectedPackage.price - discountedPrice
  }, [
    selectedPackage,
    formData.promoDiscount,
    discountedPrice,
  ])

  const applyPromo = async () => {
    const code = promoInput.trim().toUpperCase()
    if (!code) {
      setPromoError('Please enter a promo code.')
      return
    }
    if (!formData.package) {
      setPromoError(
        'Please select a package first.'
      )
      return
    }
    setPromoLoading(true)
    setPromoError('')
    setPromoSuccess(false)

    try {
      const res = await fetch(
        '/api/promo/validate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            packageId: formData.package,
          }),
        }
      )
      const data = await res.json()

      if (data.valid) {
        updateFormData({
          promoCode: code,
          promoDiscount: {
            type: data.discount_type,
            value: data.discount_value,
            description: data.description,
            code: data.code,
          },
        })
        setPromoSuccess(true)
        setPromoError('')
      } else {
        setPromoError(
          data.error || 'Invalid promo code.'
        )
        updateFormData({
          promoCode: '',
          promoDiscount: null,
        })
        setPromoSuccess(false)
      }
    } catch {
      setPromoError(
        'Could not verify promo code. Please try again.'
      )
    } finally {
      setPromoLoading(false)
    }
  }

  const removePromo = () => {
    setPromoInput('')
    setPromoSuccess(false)
    setPromoError('')
    updateFormData({
      promoCode: '',
      promoDiscount: null,
    })
  }

  const handlePackageChange = (pkgId: string) => {
    updateFormData({ package: pkgId })
    if (formData.promoDiscount) {
      removePromo()
    }
  }

  return (
    <div>
      {/* Step Header */}
      <div className="mb-8">
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: '#062850' }}
        >
          {isLoggedIn
            ? 'Review & Pay'
            : 'Account Creation'}
        </h2>
        <p className="text-gray-500 text-sm">
          {isLoggedIn
            ? 'Review your package and choose how you would like to proceed.'
            : 'Choose your package, apply a promo code if you have one, create your account, and you are ready to go.'}
        </p>
      </div>

      <div className="space-y-8">

        {/* Package Selection */}
        <div>
          <label
            className={labelClass}
            style={{ color: '#062850' }}
          >
            Your Package{' '}
            <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-4">
            All packages include 5 personally matched
            and verified scholarships. You can change
            this now or upgrade later.
          </p>

          <div className="grid grid-cols-1 gap-4">
            {PACKAGES.map((pkg) => {
              const isSelected =
                formData.package === pkg.id
              const hasDiscount =
                isSelected &&
                formData.promoDiscount &&
                discountedPrice !== null

              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() =>
                    handlePackageChange(pkg.id)
                  }
                  className="w-full text-left
                  rounded-2xl border-2 p-5
                  transition-all duration-200"
                  style={{
                    borderColor: isSelected
                      ? pkg.color
                      : '#E5E7EB',
                    backgroundColor: isSelected
                      ? `${pkg.color}08`
                      : 'white',
                  }}
                >
                  <div className="flex items-center
                  justify-between mb-3">
                    <div className="flex items-center
                    gap-3">
                      <div
                        className="w-5 h-5
                        rounded-full border-2 flex
                        items-center justify-center
                        flex-shrink-0"
                        style={{
                          borderColor: isSelected
                            ? pkg.color
                            : '#D1D5DB',
                          backgroundColor: isSelected
                            ? pkg.color
                            : 'transparent',
                        }}
                      >
                        {isSelected && (
                          <div className="w-2 h-2
                          rounded-full bg-white" />
                        )}
                      </div>
                      <span
                        className="font-bold text-base"
                        style={{ color: pkg.color }}
                      >
                        {pkg.name}
                      </span>
                    </div>

                    <div className="text-right">
                      {hasDiscount ? (
                        <div>
                          <span
                            className="text-sm
                            line-through
                            text-gray-400 mr-2"
                          >
                            {pkg.priceDisplay}
                          </span>
                          <span
                            className="font-bold
                            text-lg"
                            style={{
                              color: '#16A34A',
                            }}
                          >
                            {formatPrice(
                              discountedPrice!
                            )}
                          </span>
                        </div>
                      ) : (
                        <span
                          className="font-bold text-lg"
                          style={{ color: '#062850' }}
                        >
                          {pkg.priceDisplay}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2
                  gap-1.5 pl-8">
                    {pkg.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center
                        gap-1.5 text-xs text-gray-600"
                      >
                        <CheckCircle
                          className="w-3.5 h-3.5
                          flex-shrink-0"
                          style={{ color: pkg.color }}
                        />
                        {feature}
                      </div>
                    ))}
                  </div>
                </button>
              )
            })}
          </div>

          {errors.package && (
            <p className="text-red-500 text-xs mt-2">
              {errors.package}
            </p>
          )}
        </div>

        {/* Promo Code */}
        <div>
          <label
            className={labelClass}
            style={{ color: '#062850' }}
          >
            <Tag
              className="w-4 h-4 inline mr-1"
              style={{ color: '#497296' }}
            />
            Promo Code
            <span className="text-gray-400
            font-normal ml-1">
              (optional)
            </span>
          </label>

          {promoSuccess && formData.promoDiscount ? (
            <div
              className="rounded-2xl p-4 border
              transition-all duration-300"
              style={{
                backgroundColor: '#F0FDF4',
                borderColor: '#86EFAC',
              }}
            >
              <div className="flex items-center
              justify-between">
                <div className="flex items-center
                gap-3">
                  <div
                    className="w-10 h-10 rounded-xl
                    flex items-center justify-center"
                    style={{
                      backgroundColor: '#16A34A',
                    }}
                  >
                    <Tag
                      className="w-5 h-5 text-white"
                    />
                  </div>
                  <div>
                    <div className="flex items-center
                    gap-2">
                      <span
                        className="font-bold text-sm"
                        style={{ color: '#166534' }}
                      >
                        {formData.promoDiscount.code}
                      </span>
                      <span
                        className="px-2 py-0.5
                        rounded-full text-xs
                        font-semibold text-white"
                        style={{
                          backgroundColor: '#16A34A',
                        }}
                      >
                        {formData.promoDiscount
                          .type === 'percentage'
                          ? `${formData.promoDiscount.value}% OFF`
                          : `${formatPrice(
                              formData.promoDiscount
                                .value
                            )} OFF`}
                      </span>
                    </div>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: '#166534' }}
                    >
                      {
                        formData.promoDiscount
                          .description
                      }
                    </p>
                    {selectedPackage &&
                      discountedPrice !== null && (
                      <p
                        className="text-xs mt-1
                        font-medium"
                        style={{ color: '#16A34A' }}
                      >
                        You save{' '}
                        {formatPrice(discountAmount)}{' '}
                        on the {selectedPackage.name}{' '}
                        package
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removePromo}
                  className="text-gray-400
                  hover:text-red-500
                  transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoInput}
                  onChange={(e) => {
                    setPromoInput(
                      e.target.value.toUpperCase()
                    )
                    setPromoError('')
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      applyPromo()
                    }
                  }}
                  className={inputClass}
                  style={{
                    borderColor: promoError
                      ? '#EF4444'
                      : '#D1D5DB',
                  }}
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  disabled={
                    promoLoading ||
                    !promoInput.trim()
                  }
                  className="px-6 py-3 rounded-xl
                  text-sm font-semibold text-white
                  transition-all duration-200
                  hover:opacity-90 hover:scale-105
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  flex items-center gap-2
                  flex-shrink-0"
                  style={{
                    backgroundColor: '#497296',
                  }}
                >
                  {promoLoading ? (
                    <>
                      <Loader2 className="w-4 h-4
                      animate-spin" />
                      Checking...
                    </>
                  ) : (
                    'Apply'
                  )}
                </button>
              </div>
              {promoError && (
                <p className="text-red-500 text-xs
                mt-2">
                  {promoError}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Price Summary */}
        {selectedPackage && (
          <div
            className="rounded-2xl p-5 border"
            style={{
              backgroundColor: '#F0F6FB',
              borderColor: '#97C3E0',
            }}
          >
            <p
              className="text-xs font-bold uppercase
              tracking-wider mb-3"
              style={{ color: '#497296' }}
            >
              Order Summary
            </p>
            <div className="space-y-2">
              <div className="flex items-center
              justify-between text-sm">
                <span style={{ color: '#062850' }}>
                  {selectedPackage.name} Package
                </span>
                <span
                  className="font-medium"
                  style={{ color: '#062850' }}
                >
                  {selectedPackage.priceDisplay}
                </span>
              </div>

              {formData.promoDiscount &&
                discountedPrice !== null && (
                <>
                  <div className="flex items-center
                  justify-between text-sm">
                    <span
                      className="flex items-center
                      gap-1"
                      style={{ color: '#16A34A' }}
                    >
                      <Tag className="w-3 h-3" />
                      Promo (
                      {formData.promoDiscount.code})
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: '#16A34A' }}
                    >
                      -{formatPrice(discountAmount)}
                    </span>
                  </div>
                  <div
                    className="border-t pt-2 mt-2
                    flex items-center
                    justify-between"
                    style={{
                      borderColor: '#97C3E0',
                    }}
                  >
                    <span
                      className="font-bold"
                      style={{ color: '#062850' }}
                    >
                      Total
                    </span>
                    <span
                      className="font-bold text-lg"
                      style={{ color: '#062850' }}
                    >
                      {formatPrice(discountedPrice)}
                    </span>
                  </div>
                </>
              )}

              {!formData.promoDiscount && (
                <div
                  className="border-t pt-2 mt-2
                  flex items-center justify-between"
                  style={{ borderColor: '#97C3E0' }}
                >
                  <span
                    className="font-bold"
                    style={{ color: '#062850' }}
                  >
                    Total
                  </span>
                  <span
                    className="font-bold text-lg"
                    style={{ color: '#062850' }}
                  >
                    {selectedPackage.priceDisplay}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* New user fields — password, referral,
            agreements, refund notice */}
        {!isLoggedIn && (
          <>
            {/* Password */}
            <div>
              <label
                className={labelClass}
                style={{ color: '#062850' }}
              >
                Password{' '}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={
                    showPassword ? 'text' : 'password'
                  }
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={(e) =>
                    updateFormData({
                      password: e.target.value,
                    })
                  }
                  className={`${inputClass} pr-12`}
                  style={{
                    borderColor: errors.password
                      ? '#EF4444'
                      : '#D1D5DB',
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2
                  -translate-y-1/2 text-gray-400
                  hover:text-gray-600
                  transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs
                mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                className={labelClass}
                style={{ color: '#062850' }}
              >
                Confirm Password{' '}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={
                    showConfirm ? 'text' : 'password'
                  }
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    updateFormData({
                      confirmPassword: e.target.value,
                    })
                  }
                  className={`${inputClass} pr-12`}
                  style={{
                    borderColor:
                      errors.confirmPassword
                        ? '#EF4444'
                        : '#D1D5DB',
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirm(!showConfirm)
                  }
                  className="absolute right-4 top-1/2
                  -translate-y-1/2 text-gray-400
                  hover:text-gray-600
                  transition-colors"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs
                mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Referral Code */}
            <div>
              <label
                className={labelClass}
                style={{ color: '#062850' }}
              >
                Referral Code
                <span className="text-gray-400
                font-normal ml-1">
                  (optional)
                </span>
              </label>
              <input
                type="text"
                placeholder="Enter referral code if you have one"
                value={formData.referralCode}
                onChange={(e) =>
                  updateFormData({
                    referralCode:
                      e.target.value.toUpperCase(),
                  })
                }
                className={inputClass}
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>

            {/* Agreements */}
            <div className="space-y-4">
              <label className="flex items-start
              gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) =>
                    updateFormData({
                      agreeTerms: e.target.checked,
                    })
                  }
                  className="w-4 h-4 mt-0.5
                  accent-[#497296] flex-shrink-0"
                />
                <span className="text-sm
                text-gray-600 leading-relaxed">
                  I agree to the{' '}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="font-medium underline
                    underline-offset-4
                    hover:opacity-80"
                    style={{ color: '#497296' }}
                  >
                    Terms of Service
                  </Link>
                  <span className="text-red-500 ml-1">
                    *
                  </span>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-red-500 text-xs
                -mt-2">
                  {errors.agreeTerms}
                </p>
              )}

              <label className="flex items-start
              gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreePrivacy}
                  onChange={(e) =>
                    updateFormData({
                      agreePrivacy: e.target.checked,
                    })
                  }
                  className="w-4 h-4 mt-0.5
                  accent-[#497296] flex-shrink-0"
                />
                <span className="text-sm
                text-gray-600 leading-relaxed">
                  I agree to the{' '}
                  <Link
                    href="/privacy"
                    target="_blank"
                    className="font-medium underline
                    underline-offset-4
                    hover:opacity-80"
                    style={{ color: '#497296' }}
                  >
                    Privacy Policy
                  </Link>
                  <span className="text-red-500 ml-1">
                    *
                  </span>
                </span>
              </label>
              {errors.agreePrivacy && (
                <p className="text-red-500 text-xs
                -mt-2">
                  {errors.agreePrivacy}
                </p>
              )}

              <label className="flex items-start
              gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.emailUpdates}
                  onChange={(e) =>
                    updateFormData({
                      emailUpdates: e.target.checked,
                    })
                  }
                  className="w-4 h-4 mt-0.5
                  accent-[#497296] flex-shrink-0"
                />
                <span className="text-sm
                text-gray-600 leading-relaxed">
                  Send me scholarship tips, updates,
                  and opportunities by email.
                  <span className="text-gray-400 ml-1">
                    (optional)
                  </span>
                </span>
              </label>
            </div>

            {/* No Refund Notice */}
            <div
              className="rounded-2xl p-4 text-sm
              leading-relaxed border"
              style={{
                backgroundColor: '#FFF8F0',
                borderColor: '#FED7AA',
                color: '#92400E',
              }}
            >
              <p className="font-semibold mb-1">
                Please note
              </p>
              <p>
                We do not offer refunds once payment
                is made. Our team begins working on
                your profile immediately after payment
                is confirmed. What we commit to is
                delivering 5 personally matched and
                manually verified scholarship options
                for every client, without exception.
              </p>
            </div>
          </>
        )}

        {/* Logged-in user — payment timing choice */}
        {isLoggedIn && (
          <div
            className="rounded-2xl p-5 border"
            style={{
              backgroundColor: '#F0F6FB',
              borderColor: '#97C3E0',
            }}
          >
            <p
              className="font-semibold text-sm mb-2"
              style={{ color: '#062850' }}
            >
              How would you like to proceed?
            </p>
            <p
              className="text-xs leading-relaxed mb-4"
              style={{ color: '#325E84' }}
            >
              You are logged in. Choose whether to
              pay now or save your application and
              pay later from your dashboard.
            </p>

            <div className="space-y-3">
              <label
                className="flex items-start gap-3
                p-4 rounded-xl border-2 cursor-pointer
                transition-all duration-200
                hover:-translate-y-0.5"
                style={{
                  borderColor:
                    formData.paymentTiming === 'now'
                      ? '#062850'
                      : '#E5E7EB',
                  backgroundColor:
                    formData.paymentTiming === 'now'
                      ? '#06285008'
                      : 'white',
                }}
              >
                <input
                  type="radio"
                  name="paymentTiming"
                  value="now"
                  checked={
                    formData.paymentTiming === 'now'
                  }
                  onChange={() =>
                    updateFormData({
                      paymentTiming: 'now',
                    })
                  }
                  className="mt-0.5 accent-[#062850]
                  flex-shrink-0"
                />
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: '#062850' }}
                  >
                    Pay now and get matched
                    immediately
                  </p>
                  <p className="text-xs text-gray-500
                  mt-0.5">
                    You will be redirected to Paystack
                    to complete payment. Your matches
                    will be delivered within 1 hour.
                  </p>
                </div>
              </label>

              <label
                className="flex items-start gap-3
                p-4 rounded-xl border-2 cursor-pointer
                transition-all duration-200
                hover:-translate-y-0.5"
                style={{
                  borderColor:
                    formData.paymentTiming === 'later'
                      ? '#062850'
                      : '#E5E7EB',
                  backgroundColor:
                    formData.paymentTiming === 'later'
                      ? '#06285008'
                      : 'white',
                }}
              >
                <input
                  type="radio"
                  name="paymentTiming"
                  value="later"
                  checked={
                    formData.paymentTiming === 'later'
                  }
                  onChange={() =>
                    updateFormData({
                      paymentTiming: 'later',
                    })
                  }
                  className="mt-0.5 accent-[#062850]
                  flex-shrink-0"
                />
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: '#062850' }}
                  >
                    Save and pay later from my
                    dashboard
                  </p>
                  <p className="text-xs text-gray-500
                  mt-0.5">
                    Your application will be saved.
                    You can complete payment any time
                    from your dashboard.
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Submission Error */}
        {errors.submit && (
          <div
            className="rounded-2xl px-5 py-4 border
            flex items-start gap-3"
            style={{
              backgroundColor: '#FEF2F2',
              borderColor: '#FECACA',
            }}
          >
            <span className="text-lg flex-shrink-0">
              ⚠
            </span>
            <div>
              <p
                className="font-semibold text-sm mb-1"
                style={{ color: '#991B1B' }}
              >
                Submission failed
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: '#991B1B' }}
              >
                {errors.submit}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}