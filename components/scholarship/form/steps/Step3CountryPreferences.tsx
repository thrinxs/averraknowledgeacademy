'use client'

import { useState, useMemo, useCallback } from 'react'
import { FormData } from '../FormShell'
import { X, ChevronDown } from 'lucide-react'
import CountryMap from '../CountryMap'

interface Props {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
  errors: Record<string, string>
}

const inputClass = `w-full px-4 py-3 rounded-xl border
text-sm transition-all duration-200
focus:outline-none focus:ring-2`

const labelClass = `block text-sm font-semibold mb-2`

const SCHOLARSHIP_COUNTRIES = [
  'Australia', 'Austria', 'Belgium', 'Canada', 'China',
  'Czech Republic', 'Denmark', 'Finland', 'France',
  'Germany', 'Hungary', 'Ireland', 'Italy', 'Japan',
  'Netherlands', 'New Zealand', 'Norway', 'Poland',
  'Portugal', 'Russia', 'Saudi Arabia', 'South Korea',
  'Spain', 'Sweden', 'Switzerland', 'Turkey',
  'United Arab Emirates', 'United Kingdom',
  'United States', 'Any Country',
]

export default function Step3CountryPreferences({
  formData,
  updateFormData,
  errors,
}: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () =>
      SCHOLARSHIP_COUNTRIES.filter(
        (c) =>
          c
            .toLowerCase()
            .includes(search.toLowerCase()) &&
          !formData.preferredCountries.includes(c)
      ),
    [search, formData.preferredCountries]
  )

  const addCountry = useCallback(
    (country: string) => {
      if (country === 'Any Country') {
        updateFormData({
          preferredCountries: ['Any Country'],
        })
        setSearch('')
        setDropdownOpen(false)
        return
      }
      if (
        !formData.preferredCountries.includes(country) &&
        !formData.preferredCountries.includes(
          'Any Country'
        )
      ) {
        updateFormData({
          preferredCountries: [
            ...formData.preferredCountries,
            country,
          ],
        })
      }
      setSearch('')
      setDropdownOpen(false)
    },
    [formData.preferredCountries, updateFormData]
  )

  const removeCountry = useCallback(
    (country: string) => {
      updateFormData({
        preferredCountries:
          formData.preferredCountries.filter(
            (c) => c !== country
          ),
      })
    },
    [formData.preferredCountries, updateFormData]
  )

  return (
    <div>
      {/* Step Header */}
      <div className="mb-8">
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: '#062850' }}
        >
          Country Preferences
        </h2>
        <p className="text-gray-500 text-sm">
          Tell us where you would like to study. Select
          from the dropdown below — the map will update
          to show your selected countries.
        </p>
      </div>

      <div className="space-y-6">

        {/* Country Multi-Select Dropdown */}
        <div>
          <label
            className={labelClass}
            style={{ color: '#062850' }}
          >
            Preferred Countries{' '}
            <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Select one or more countries. You can also
            select &quot;Any Country&quot; if you are
            open to all options.
          </p>

          {/* Selected Tags */}
          {formData.preferredCountries.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.preferredCountries.map(
                (country) => (
                  <span
                    key={country}
                    className="inline-flex items-center
                    gap-1.5 px-3 py-1.5 rounded-full
                    text-xs font-medium text-white"
                    style={{
                      backgroundColor: '#497296',
                    }}
                  >
                    {country}
                    <button
                      type="button"
                      onClick={() =>
                        removeCountry(country)
                      }
                      className="hover:opacity-70
                      transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )
              )}
            </div>
          )}

          {/* Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setDropdownOpen(!dropdownOpen)
              }
              className="w-full flex items-center
              justify-between px-4 py-3 rounded-xl
              border text-sm text-left transition-all
              duration-200"
              style={{
                borderColor:
                  errors.preferredCountries
                    ? '#EF4444'
                    : '#D1D5DB',
              }}
            >
              <span className="text-gray-500">
                {formData.preferredCountries.length > 0
                  ? `${formData.preferredCountries.length} ${
                      formData.preferredCountries
                        .length === 1
                        ? 'country'
                        : 'countries'
                    } selected`
                  : 'Select countries...'}
              </span>
              <ChevronDown
                className="w-4 h-4 text-gray-400
                transition-transform duration-200"
                style={{
                  transform: dropdownOpen
                    ? 'rotate(180deg)'
                    : 'rotate(0deg)',
                }}
              />
            </button>

            {dropdownOpen && (
              <div
                className="absolute top-full left-0
                right-0 mt-1 bg-white rounded-xl
                border border-gray-200 shadow-xl
                z-20 overflow-hidden"
              >
                <div className="p-3 border-b
                border-gray-100">
                  <input
                    type="text"
                    placeholder="Search countries..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm
                    border border-gray-200 rounded-lg
                    focus:outline-none"
                    autoFocus
                  />
                </div>

                <div className="max-h-48
                overflow-y-auto">
                  {filtered.length === 0 ? (
                    <div className="px-4 py-3 text-sm
                    text-gray-400 text-center">
                      No countries found
                    </div>
                  ) : (
                    filtered.map((country) => (
                      <button
                        key={country}
                        type="button"
                        onClick={() =>
                          addCountry(country)
                        }
                        className="w-full text-left
                        px-4 py-3 text-sm
                        transition-colors duration-150
                        hover:bg-blue-50 border-b
                        border-gray-50 last:border-0"
                        style={{ color: '#062850' }}
                      >
                        {country}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {errors.preferredCountries && (
            <p className="text-red-500 text-xs mt-1">
              {errors.preferredCountries}
            </p>
          )}
        </div>

        {/* Map */}
        <div>
          <label
            className={labelClass}
            style={{ color: '#062850' }}
          >
            Your Selected Countries
            <span
              className="text-gray-400 font-normal ml-2
              text-xs"
            >
              Map updates as you select countries above
            </span>
          </label>

          <CountryMap
            selectedCountries={
              formData.preferredCountries.includes(
                'Any Country'
              )
                ? []
                : formData.preferredCountries
            }
          />

          {formData.preferredCountries.includes(
            'Any Country'
          ) && (
            <p
              className="text-xs mt-2 text-center
              font-medium"
              style={{ color: '#497296' }}
            >
              You selected &quot;Any Country&quot; —
              all scholarship countries will be
              considered.
            </p>
          )}
        </div>

                {/* Scholarship Type */}
                <div>
          <label
            className={labelClass}
            style={{ color: '#062850' }}
          >
            Scholarship Type{' '}
            <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.scholarshipType}
            onChange={(e) =>
              updateFormData({
                scholarshipType: e.target.value,
              })
            }
            className={inputClass}
            style={{
              borderColor: errors.scholarshipType
                ? '#EF4444'
                : '#D1D5DB',
            }}
          >
            <option value="">
              Select scholarship type
            </option>
            <option value="fully_funded">
              Fully Funded
            </option>
            <option value="partially_funded">
              Partially Funded
            </option>
            <option value="tuition_only">
              Tuition Only
            </option>
            <option value="stipend_only">
              Stipend Only
            </option>
            <option value="any">Any Type</option>
          </select>
          {errors.scholarshipType && (
            <p className="text-red-500 text-xs mt-1">
              {errors.scholarshipType}
            </p>
          )}
        </div>

        {/* Preferred Start Date */}
        <div>
          <label
            className={labelClass}
            style={{ color: '#062850' }}
          >
            Preferred Start Date{' '}
            <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-2">
            When would you like to begin your studies abroad?
          </p>
          <select
            value={formData.preferredStartDate}
            onChange={(e) =>
              updateFormData({
                preferredStartDate: e.target.value,
              })
            }
            className={inputClass}
            style={{
              borderColor: errors.preferredStartDate
                ? '#EF4444'
                : '#D1D5DB',
            }}
          >
            <option value="">
              Select preferred start
            </option>
            {(() => {
              const now = new Date()
              const currentYear = now.getFullYear()
              const currentMonth = now.getMonth() + 1
              const options = []

              for (let y = currentYear; y <= currentYear + 3; y++) {
                if (y === currentYear) {
                  if (currentMonth < 9) {
                    options.push({
                      value: `${y}_sep`,
                      label: `September ${y}`,
                    })
                  }
                } else {
                  options.push({
                    value: `${y}_jan`,
                    label: `January ${y}`,
                  })
                  options.push({
                    value: `${y}_sep`,
                    label: `September ${y}`,
                  })
                }
              }

              return options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            })()}
            <option value="flexible">
              Flexible / Open
            </option>
          </select>
          {errors.preferredStartDate && (
            <p className="text-red-500 text-xs mt-1">
              {errors.preferredStartDate}
            </p>
          )}
        </div>

      </div>
    </div>
  )
}