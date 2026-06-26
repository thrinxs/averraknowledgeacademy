'use client'

import { FormData } from '../FormShell'

interface Props {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
  errors: Record<string, string>
}

const inputClass = `w-full px-4 py-3 rounded-xl border
text-sm transition-all duration-200
focus:outline-none focus:ring-2`

const labelClass = `block text-sm font-semibold mb-2`

export default function Step1BasicInfo({
  formData,
  updateFormData,
  errors,
}: Props) {
  return (
    <div>
      {/* Step Header */}
      <div className="mb-8">
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: '#062850' }}
        >
          Basic Information
        </h2>
        <p className="text-gray-500 text-sm">
          Tell us about yourself so we can personalise
          your scholarship matches.
        </p>
      </div>

      <div className="space-y-6">

        {/* Full Name */}
        <div>
          <label
            className={labelClass}
            style={{ color: '#062850' }}
          >
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) =>
              updateFormData({ fullName: e.target.value })
            }
            className={inputClass}
            style={{
              borderColor: errors.fullName
                ? '#EF4444'
                : '#D1D5DB',
            }}
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            className={labelClass}
            style={{ color: '#062850' }}
          >
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={(e) =>
              updateFormData({ email: e.target.value })
            }
            className={inputClass}
            style={{
              borderColor: errors.email
                ? '#EF4444'
                : '#D1D5DB',
            }}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            className={labelClass}
            style={{ color: '#062850' }}
          >
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            placeholder="+234 800 000 0000"
            value={formData.phone}
            onChange={(e) => {
              const val = e.target.value
              updateFormData({
                phone: val,
                whatsapp: formData.whatsappSameAsPhone
                  ? val
                  : formData.whatsapp,
              })
            }}
            className={inputClass}
            style={{
              borderColor: errors.phone
                ? '#EF4444'
                : '#D1D5DB',
            }}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">
              {errors.phone}
            </p>
          )}
        </div>

        {/* WhatsApp */}
        <div>
          <label
            className={labelClass}
            style={{ color: '#062850' }}
          >
            WhatsApp Number
          </label>

          {/* Same as phone toggle */}
          <label className="flex items-center gap-2
          mb-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.whatsappSameAsPhone}
              onChange={(e) => {
                const checked = e.target.checked
                updateFormData({
                  whatsappSameAsPhone: checked,
                  whatsapp: checked
                    ? formData.phone
                    : formData.whatsapp,
                })
              }}
              className="w-4 h-4 rounded accent-[#497296]"
            />
            <span className="text-sm text-gray-600">
              Same as phone number
            </span>
          </label>

          {!formData.whatsappSameAsPhone && (
            <input
              type="tel"
              placeholder="+234 800 000 0000"
              value={formData.whatsapp}
              onChange={(e) =>
                updateFormData({ whatsapp: e.target.value })
              }
              className={inputClass}
              style={{ borderColor: '#D1D5DB' }}
            />
          )}

          {formData.whatsappSameAsPhone && (
            <p className="text-xs text-gray-400 mt-1">
              Using: {formData.phone || 'your phone number above'}
            </p>
          )}
        </div>

        {/* Date of Birth + Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* DOB */}
          <div>
            <label
              className={labelClass}
              style={{ color: '#062850' }}
            >
              Date of Birth{' '}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) =>
                updateFormData({ dateOfBirth: e.target.value })
              }
              className={inputClass}
              style={{
                borderColor: errors.dateOfBirth
                  ? '#EF4444'
                  : '#D1D5DB',
              }}
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-xs mt-1">
                {errors.dateOfBirth}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label
              className={labelClass}
              style={{ color: '#062850' }}
            >
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.gender}
              onChange={(e) =>
                updateFormData({ gender: e.target.value })
              }
              className={inputClass}
              style={{
                borderColor: errors.gender
                  ? '#EF4444'
                  : '#D1D5DB',
              }}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="prefer_not_to_say">
                Prefer not to say
              </option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">
                {errors.gender}
              </p>
            )}
          </div>

        </div>

        {/* Country */}
        <div>
          <label
            className={labelClass}
            style={{ color: '#062850' }}
          >
            Country of Residence{' '}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Nigeria"
            value={formData.country}
            onChange={(e) =>
              updateFormData({ country: e.target.value })
            }
            className={inputClass}
            style={{
              borderColor: errors.country
                ? '#EF4444'
                : '#D1D5DB',
            }}
          />
          {errors.country && (
            <p className="text-red-500 text-xs mt-1">
              {errors.country}
            </p>
          )}
        </div>

        {/* State / City */}
        <div>
          <label
            className={labelClass}
            style={{ color: '#062850' }}
          >
            State / City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Lagos"
            value={formData.stateCity}
            onChange={(e) =>
              updateFormData({ stateCity: e.target.value })
            }
            className={inputClass}
            style={{
              borderColor: errors.stateCity
                ? '#EF4444'
                : '#D1D5DB',
            }}
          />
          {errors.stateCity && (
            <p className="text-red-500 text-xs mt-1">
              {errors.stateCity}
            </p>
          )}
        </div>

      </div>
    </div>
  )
}