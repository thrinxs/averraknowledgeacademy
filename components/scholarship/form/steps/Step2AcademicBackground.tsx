'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { FormData } from '../FormShell'
import { Plus, X, AlertTriangle } from 'lucide-react'

interface Props {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
  errors: Record<string, string>
}

const inputClass = `w-full px-4 py-3 rounded-xl border
text-sm transition-all duration-200
focus:outline-none focus:ring-2`

const labelClass = `block text-sm font-semibold mb-2`

const currentYear = new Date().getFullYear()
const years = Array.from(
  { length: 30 },
  (_, i) => currentYear + 5 - i
)

// NUC Accredited Universities in Nigeria
const NUC_UNIVERSITIES = [
  'Abia State University, Uturu',
  'Achievers University, Owo',
  'Adamawa State University, Mubi',
  'Adekunle Ajasin University, Akungba-Akoko',
  'Adeleke University, Ede',
  'Afe Babalola University, Ado-Ekiti',
  'African University of Science and Technology, Abuja',
  'Ahmadu Bello University, Zaria',
  'Ajayi Crowther University, Oyo',
  'Akwa Ibom State University, Ikot Akpaden',
  'Al-Hikmah University, Ilorin',
  'Al-Qalam University, Katsina',
  'Alex Ekwueme Federal University Ndufu-Alike, Ikwo',
  'Ambrose Alli University, Ekpoma',
  'American University of Nigeria, Yola',
  'Anchor University, Lagos',
  'Arthur Jarvis University, Akpabuyo',
  'Atiba University, Oyo',
  'Augustine University, Ilara-Epe',
  'Babcock University, Ilishan-Remo',
  'Bauchi State University, Gadau',
  'Bayero University, Kano',
  'Bells University of Technology, Ota',
  'Benson Idahosa University, Benin City',
  'Benue State University, Makurdi',
  'Bingham University, Karu',
  'Bowen University, Iwo',
  'Caleb University, Lagos',
  'Caritas University, Enugu',
  'Chrisland University, Abeokuta',
  'Christopher University, Mowe',
  'Clifford University, Owerrinta',
  'Coal City University, Enugu',
  'Covenant University, Ota',
  'Crawford University, Faith City, Igbesa',
  'Crescent University, Abeokuta',
  'Cross River University of Technology, Calabar',
  'Crown Hill University, Eiyenkorin',
  'Delta State University, Abraka',
  'Dominican University, Ibadan',
  'Dominion University, Ibadan',
  'Eastern Palm University, Ogboko',
  'Ebonyi State University, Abakaliki',
  'Edwin Clark University, Kiagbodo',
  'Ekiti State University, Ado-Ekiti',
  'El-Amin University, Minna',
  'Elizade University, Ilara-Mokin',
  'Emeka Odumegwu Ojukwu University, Uli',
  'Enugu State University of Science and Technology, Enugu',
  'Evangel University, Akaeze',
  'Federal University Birnin Kebbi',
  'Federal University Dutse, Jigawa',
  'Federal University Dutsin-Ma, Katsina',
  'Federal University Gashua, Yobe',
  'Federal University Gusau, Zamfara',
  'Federal University Kashere, Gombe',
  'Federal University Lafia, Nasarawa',
  'Federal University Lokoja, Kogi',
  'Federal University Ndufu-Alike, Ikwo',
  'Federal University Otuoke, Bayelsa',
  'Federal University Oye-Ekiti',
  'Federal University Wukari, Taraba',
  'Federal University of Agriculture, Abeokuta',
  'Federal University of Agriculture, Makurdi',
  'Federal University of Petroleum Resources, Effurun',
  'Federal University of Technology, Akure',
  'Federal University of Technology, Minna',
  'Federal University of Technology, Owerri',
  'Fountain University, Osogbo',
  'Gombe State University, Tudun Wada',
  'Godfrey Okoye University, Enugu',
  'Greenfield University, Kaduna',
  'Gregory University, Uturu',
  'Hallmark University, Ijebu-Itele',
  'Hezekiah University, Umudi',
  'Hussaini Adamu Federal Polytechnic (University Status)',
  'Ibrahim Badamasi Babangida University, Lapai',
  'Igbinedion University, Okada',
  'Ignatius Ajuru University of Education, Port Harcourt',
  'Imo State University, Owerri',
  'Joseph Ayo Babalola University, Ikeji-Arakeji',
  'Kaduna State University, Kaduna',
  'Kano University of Science and Technology, Wudil',
  'Kebbi State University of Science and Technology, Aliero',
  'Kings University, Ode-Omu',
  'Kogi State University, Anyigba',
  'Kwara State University, Malete',
  'Ladoke Akintola University of Technology, Ogbomoso',
  'Lagos State University, Ojo',
  'Landmark University, Omu-Aran',
  'Lead City University, Ibadan',
  'Legacy University, Okija',
  'Madonna University, Okija',
  'Mcpherson University, Seriki Sotayo',
  'Michael Okpara University of Agriculture, Umudike',
  'Micheal and Cecilia Ibru University, Agbarha-Otor',
  'Mountain Top University, Makogi-Oba',
  'Nasarawa State University, Keffi',
  'Nigerian Army University, Biu',
  'Nigerian Defence Academy, Kaduna',
  'Nigerian Maritime University, Okerenkoko',
  'Nile University of Nigeria, Abuja',
  'Novena University, Ogume',
  'Nnamdi Azikiwe University, Awka',
  'Obafemi Awolowo University, Ile-Ife',
  'Obong University, Obong Ntak',
  'Oduduwa University, Ipetumodu',
  'Olabisi Onabanjo University, Ago-Iwoye',
  'Ondo State University of Science and Technology, Okitipupa',
  'Pan-Atlantic University, Lagos',
  'Paul University, Awka',
  'Plateau State University, Bokkos',
  'Precious Cornerstone University, Ibadan',
  'Prince Abubakar Audu University, Anyigba',
  'Redeemer\'s University, Ede',
  'Renaissance University, Enugu',
  'Rhema University, Obeama-Asa',
  'Rivers State University, Port Harcourt',
  'Robert Orji University, Aba',
  'Salem University, Lokoja',
  'Samuel Adegboyega University, Ogwa',
  'Skyline University Nigeria, Kano',
  'Sokoto State University, Sokoto',
  'Southwestern University Nigeria, Okun Owa',
  'Spiritan University, Nneochi',
  'Sule Lamido University, Kafin-Hausa',
  'Summit University, Offa',
  'Tai Solarin University of Education, Ijebu-Ode',
  'Tansian University, Umunya',
  'Taraba State University, Jalingo',
  'The Technical University, Ibadan',
  'Thomas Adewumi University, Oko-Irese',
  'Trinity University, Lagos',
  'Umaru Musa Yar\'Adua University, Katsina',
  'Uniabuja — University of Abuja',
  'UniCross — University of Calabar',
  'UniIlorin — University of Ilorin',
  'UniJos — University of Jos',
  'UniLag — University of Lagos',
  'UniMaid — University of Maiduguri',
  'UniPort — University of Port Harcourt',
  'UniUyo — University of Uyo',
  'University of Africa, Toru-Orua',
  'University of Benin, Benin City',
  'University of Ibadan',
  'University of Medical Sciences, Ondo',
  'University of Mkar, Mkar',
  'University of Nigeria, Nsukka',
  'University of Offa',
  'Usumanu Danfodiyo University, Sokoto',
  'Veritas University, Abuja',
  'Wellspring University, Evbuobanosa',
  'Wesley University, Ondo',
  'Western Delta University, Oghara',
  'Yobe State University, Damaturu',
  'Yusuf Maitama Sule University, Kano',
  'Zamfara State University, Talata-Mafara',
].sort()

// ── Internationally accepted test scores ──
const TEST_CATEGORIES = [
  {
    category: 'Language Proficiency',
    tests: [
      'IELTS',
      'TOEFL',
      'PTE Academic',
      'Duolingo English Test',
      'Cambridge C1 Advanced (CAE)',
      'Cambridge C2 Proficiency (CPE)',
      'OET',
      'CELPIP',
      'TestDaF (German)',
      'DELF / DALF (French)',
      'DELE (Spanish)',
      'JLPT (Japanese)',
      'TOPIK (Korean)',
      'HSK (Chinese / Mandarin)',
    ],
  },
  {
    category: 'Graduate Admission',
    tests: [
      'GRE',
      'GMAT',
      'MCAT',
      'LSAT',
      'SAT',
      'ACT',
    ],
  },
]

const ALL_TESTS = TEST_CATEGORIES.flatMap((c) => c.tests)

function TestNameDropdown({
  value,
  onChange,
}: {
  value: string
  onChange: (val: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [isCustom, setIsCustom] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () =>
      document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = useMemo(() => {
    if (!value.trim()) return ALL_TESTS
    return ALL_TESTS.filter((t) =>
      t.toLowerCase().includes(value.toLowerCase())
    )
  }, [value])

  const handleSelect = (test: string) => {
    onChange(test)
    setOpen(false)
    setIsCustom(false)
  }

  const handleCustom = () => {
    setIsCustom(true)
    setOpen(false)
    onChange('')
  }

  return (
    <div className="relative" ref={ref}>
      <input
        type="text"
        placeholder={
          isCustom
            ? 'Type test name...'
            : 'Select or search test...'
        }
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
          setIsCustom(false)
        }}
        onFocus={() => {
          if (!isCustom) setOpen(true)
        }}
        className={inputClass}
        style={{ borderColor: '#D1D5DB' }}
      />

      {open && (
        <div
          className="absolute top-full left-0 right-0
          mt-1 bg-white rounded-xl border border-gray-200
          shadow-xl z-30 overflow-hidden"
        >
          <div className="max-h-60 overflow-y-auto">
            {filtered.length > 0 ? (
              <>
                {TEST_CATEGORIES.map((cat) => {
                  const catTests = cat.tests.filter((t) =>
                    !value.trim()
                      ? true
                      : t
                          .toLowerCase()
                          .includes(
                            value.toLowerCase()
                          )
                  )
                  if (catTests.length === 0) return null
                  return (
                    <div key={cat.category}>
                      <div
                        className="px-4 py-2 text-xs
                        font-bold uppercase tracking-wider
                        bg-gray-50 border-b border-gray-100
                        sticky top-0"
                        style={{ color: '#497296' }}
                      >
                        {cat.category}
                      </div>
                      {catTests.map((test) => (
                        <button
                          key={test}
                          type="button"
                          onMouseDown={() =>
                            handleSelect(test)
                          }
                          className="w-full text-left px-4
                          py-2.5 text-sm transition-colors
                          duration-150 hover:bg-blue-50
                          border-b border-gray-50
                          last:border-0"
                          style={{ color: '#062850' }}
                        >
                          {test}
                        </button>
                      ))}
                    </div>
                  )
                })}
              </>
            ) : (
              <div className="px-4 py-3 text-sm
              text-gray-400 text-center">
                No matching tests found
              </div>
            )}

            <button
              type="button"
              onMouseDown={handleCustom}
              className="w-full text-left px-4 py-3
              text-sm font-medium border-t
              border-gray-100 transition-colors
              duration-150 hover:bg-blue-50"
              style={{ color: '#497296' }}
            >
              + Enter a custom test name
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Step2AcademicBackground({
  formData,
  updateFormData,
  errors,
}: Props) {
  const testScores = formData.testScores ?? []

  // Institution autocomplete state
  const [institutionInput, setInstitutionInput] = useState(
    formData.institution
  )
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [institutionTouched, setInstitutionTouched] =
    useState(false)
  const institutionRef = useRef<HTMLDivElement>(null)

  // Test score state
  const [newTestName, setNewTestName] = useState('')
  const [newTestScore, setNewTestScore] = useState('')

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        institutionRef.current &&
        !institutionRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false)
        setInstitutionTouched(true)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () =>
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      )
  }, [])

  const suggestions = useMemo(() => {
    if (!institutionInput.trim()) return []
    return NUC_UNIVERSITIES.filter((u) =>
      u.toLowerCase().includes(
        institutionInput.toLowerCase()
      )
    ).slice(0, 8)
  }, [institutionInput])

  const isAccredited = useMemo(() => {
    if (!institutionInput.trim()) return null
    return NUC_UNIVERSITIES.some(
      (u) =>
        u.toLowerCase() === institutionInput.toLowerCase()
    )
  }, [institutionInput])

  const handleInstitutionSelect = (name: string) => {
    setInstitutionInput(name)
    updateFormData({
      institution: name,
      institutionAccredited: true,
    })
    setShowSuggestions(false)
    setInstitutionTouched(true)
  }

  const handleInstitutionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = e.target.value
    setInstitutionInput(val)
    setShowSuggestions(true)
    updateFormData({
      institution: val,
      institutionAccredited: null,
    })
  }

  const handleInstitutionBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false)
      setInstitutionTouched(true)
      const accredited = NUC_UNIVERSITIES.some(
        (u) =>
          u.toLowerCase() === institutionInput.toLowerCase()
      )
      updateFormData({
        institution: institutionInput,
        institutionAccredited: institutionInput.trim()
          ? accredited
          : null,
      })
    }, 150)
  }

  // Test score handlers
  const addTestScore = () => {
    if (!newTestName.trim() || !newTestScore.trim()) return
    const updated = [
      ...testScores,
      {
        name: newTestName.trim(),
        score: newTestScore.trim(),
      },
    ]
    updateFormData({ testScores: updated })
    setNewTestName('')
    setNewTestScore('')
  }

  const removeTestScore = (index: number) => {
    const updated = testScores.filter(
      (_, i) => i !== index
    )
    updateFormData({ testScores: updated })
  }

  return (
    <div>
      {/* Step Header */}
      <div className="mb-8">
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: '#062850' }}
        >
          Academic Background
        </h2>
        <p className="text-gray-500 text-sm">
          Your academic profile helps us find scholarships
          you are genuinely eligible for.
        </p>
      </div>

      <div className="space-y-6">

        {/* Education Level */}
        <div>
          <label
            className={labelClass}
            style={{ color: '#062850' }}
          >
            Highest Education Level{' '}
            <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.educationLevel}
            onChange={(e) =>
              updateFormData({
                educationLevel: e.target.value,
              })
            }
            className={inputClass}
            style={{
              borderColor: errors.educationLevel
                ? '#EF4444'
                : '#D1D5DB',
            }}
          >
            <option value="">Select education level</option>
            <option value="high_school">
              High School / Secondary
            </option>
            <option value="diploma">Diploma / HND</option>
            <option value="bachelor">
              Bachelor&apos;s Degree
            </option>
            <option value="master">
              Master&apos;s Degree
            </option>
            <option value="phd">PhD</option>
            <option value="other">Other</option>
          </select>
          {errors.educationLevel && (
            <p className="text-red-500 text-xs mt-1">
              {errors.educationLevel}
            </p>
          )}
        </div>

        {/* Field of Study */}
        <div>
          <label
            className={labelClass}
            style={{ color: '#062850' }}
          >
            Field of Study{' '}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Computer Science, Medicine, Law"
            value={formData.fieldOfStudy}
            onChange={(e) =>
              updateFormData({
                fieldOfStudy: e.target.value,
              })
            }
            className={inputClass}
            style={{
              borderColor: errors.fieldOfStudy
                ? '#EF4444'
                : '#D1D5DB',
            }}
          />
          {errors.fieldOfStudy && (
            <p className="text-red-500 text-xs mt-1">
              {errors.fieldOfStudy}
            </p>
          )}
        </div>

        {/* Institution — Autocomplete */}
        <div ref={institutionRef}>
          <label
            className={labelClass}
            style={{ color: '#062850' }}
          >
            Institution{' '}
            <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Start typing your institution name. If your
            school is not in our list, you can still
            enter it manually.
          </p>

          <div className="relative">
            <input
              type="text"
              placeholder="e.g. University of Lagos"
              value={institutionInput}
              onChange={handleInstitutionChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={handleInstitutionBlur}
              className={inputClass}
              style={{
                borderColor: errors.institution
                  ? '#EF4444'
                  : institutionTouched &&
                    institutionInput.trim() &&
                    isAccredited === false
                  ? '#F59E0B'
                  : institutionTouched && isAccredited
                  ? '#22C55E'
                  : '#D1D5DB',
              }}
            />

            {showSuggestions &&
              suggestions.length > 0 && (
              <div
                className="absolute top-full left-0
                right-0 mt-1 bg-white rounded-xl
                border border-gray-200 shadow-xl
                z-20 overflow-hidden"
              >
                <div className="max-h-52 overflow-y-auto">
                  {suggestions.map((uni) => (
                    <button
                      key={uni}
                      type="button"
                      onMouseDown={() =>
                        handleInstitutionSelect(uni)
                      }
                      className="w-full text-left px-4
                      py-3 text-sm transition-colors
                      duration-150 hover:bg-blue-50
                      border-b border-gray-50
                      last:border-0"
                      style={{ color: '#062850' }}
                    >
                      <span className="font-medium">
                        {uni}
                      </span>
                      <span
                        className="ml-2 text-xs"
                        style={{ color: '#497296' }}
                      >
                        ✓ NUC Accredited
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {institutionTouched &&
            institutionInput.trim() &&
            isAccredited === true && (
            <p
              className="text-xs mt-1.5 flex items-center
              gap-1.5 font-medium"
              style={{ color: '#16A34A' }}
            >
              <span>✓</span>
              NUC accredited institution
            </p>
          )}

          {institutionTouched &&
            institutionInput.trim() &&
            isAccredited === false && (
            <div
              className="mt-2 rounded-xl px-4 py-3
              flex items-start gap-2 text-sm border"
              style={{
                backgroundColor: '#FFFBEB',
                borderColor: '#FCD34D',
              }}
            >
              <AlertTriangle
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                style={{ color: '#D97706' }}
              />
              <div style={{ color: '#92400E' }}>
                <p className="font-semibold mb-0.5">
                  Institution not found in our
                  accredited list
                </p>
                <p className="text-xs leading-relaxed">
                  You can still proceed with your
                  application. However, some scholarships
                  may require a degree from an accredited
                  institution. If your school is
                  accredited and not on our list, please
                  continue — our team will verify during
                  the matching process.
                </p>
              </div>
            </div>
          )}

          {errors.institution && (
            <p className="text-red-500 text-xs mt-1">
              {errors.institution}
            </p>
          )}
        </div>

        {/* Graduation Year */}
        <div>
          <label
            className={labelClass}
            style={{ color: '#062850' }}
          >
            Graduation Year{' '}
            <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.graduationYear}
            onChange={(e) =>
              updateFormData({
                graduationYear: e.target.value,
              })
            }
            className={inputClass}
            style={{
              borderColor: errors.graduationYear
                ? '#EF4444'
                : '#D1D5DB',
            }}
          >
            <option value="">Select year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {errors.graduationYear && (
            <p className="text-red-500 text-xs mt-1">
              {errors.graduationYear}
            </p>
          )}
        </div>

        {/* CGPA + Grading Scale */}
        <div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={labelClass}
                style={{ color: '#062850' }}
              >
                CGPA <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 3.8"
                value={formData.cgpa}
                onChange={(e) =>
                  updateFormData({ cgpa: e.target.value })
                }
                className={inputClass}
                style={{
                  borderColor: errors.cgpa
                    ? '#EF4444'
                    : '#D1D5DB',
                }}
              />
              {errors.cgpa && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.cgpa}
                </p>
              )}
            </div>

            <div>
              <label
                className={labelClass}
                style={{ color: '#062850' }}
              >
                Grading Scale{' '}
                <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.gradingScale}
                onChange={(e) =>
                  updateFormData({
                    gradingScale: e.target.value,
                  })
                }
                className={inputClass}
                style={{
                  borderColor: errors.gradingScale
                    ? '#EF4444'
                    : '#D1D5DB',
                }}
              >
                <option value="">Select scale</option>
                <option value="4.0">4.0 Scale</option>
                <option value="5.0">5.0 Scale</option>
                <option value="7.0">7.0 Scale</option>
                <option value="10.0">10.0 Scale</option>
                <option value="percentage">
                  Percentage (%)
                </option>
                <option value="other">Other</option>
              </select>
              {errors.gradingScale && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.gradingScale}
                </p>
              )}
            </div>
          </div>

          {/* Auto Class/Position */}
          {(() => {
            const cgpaNum = parseFloat(formData.cgpa)
            const scale = formData.gradingScale

            if (
              !formData.cgpa.trim() ||
              !scale ||
              isNaN(cgpaNum)
            )
              return null

            let classification = ''
            let classColor = '#6B7280'

            if (scale === '4.0') {
              if (cgpaNum >= 3.50) {
                classification = 'First Class Honours'
                classColor = '#16A34A'
              } else if (cgpaNum >= 3.00) {
                classification = 'Second Class Upper'
                classColor = '#2563EB'
              } else if (cgpaNum >= 2.50) {
                classification = 'Second Class Lower'
                classColor = '#497296'
              } else if (cgpaNum >= 2.00) {
                classification = 'Third Class'
                classColor = '#D97706'
              } else if (cgpaNum >= 1.00) {
                classification = 'Pass'
                classColor = '#92400E'
              } else {
                classification = 'Below minimum'
                classColor = '#EF4444'
              }
            } else if (scale === '5.0') {
              if (cgpaNum >= 4.50) {
                classification = 'First Class Honours'
                classColor = '#16A34A'
              } else if (cgpaNum >= 3.50) {
                classification = 'Second Class Upper'
                classColor = '#2563EB'
              } else if (cgpaNum >= 2.40) {
                classification = 'Second Class Lower'
                classColor = '#497296'
              } else if (cgpaNum >= 1.50) {
                classification = 'Third Class'
                classColor = '#D97706'
              } else if (cgpaNum >= 1.00) {
                classification = 'Pass'
                classColor = '#92400E'
              } else {
                classification = 'Below minimum'
                classColor = '#EF4444'
              }
            } else if (scale === '7.0') {
              if (cgpaNum >= 5.95) {
                classification = 'First Class Honours'
                classColor = '#16A34A'
              } else if (cgpaNum >= 4.95) {
                classification = 'Second Class Upper'
                classColor = '#2563EB'
              } else if (cgpaNum >= 3.95) {
                classification = 'Second Class Lower'
                classColor = '#497296'
              } else if (cgpaNum >= 2.95) {
                classification = 'Third Class'
                classColor = '#D97706'
              } else if (cgpaNum >= 1.00) {
                classification = 'Pass'
                classColor = '#92400E'
              } else {
                classification = 'Below minimum'
                classColor = '#EF4444'
              }
            } else if (scale === 'percentage') {
              if (cgpaNum >= 70) {
                classification = 'First Class Honours'
                classColor = '#16A34A'
              } else if (cgpaNum >= 60) {
                classification = 'Second Class Upper'
                classColor = '#2563EB'
              } else if (cgpaNum >= 50) {
                classification = 'Second Class Lower'
                classColor = '#497296'
              } else if (cgpaNum >= 45) {
                classification = 'Third Class'
                classColor = '#D97706'
              } else if (cgpaNum >= 40) {
                classification = 'Pass'
                classColor = '#92400E'
              } else {
                classification = 'Below minimum'
                classColor = '#EF4444'
              }
            } else {
              return (
                <p className="text-xs text-gray-400 mt-3">
                  Class position is not auto-determined
                  for this grading scale.
                </p>
              )
            }

            if (!classification) return null

            return (
              <div
                className="mt-3 flex items-center gap-2
                px-4 py-2.5 rounded-xl text-sm font-medium
                border"
                style={{
                  backgroundColor: `${classColor}10`,
                  borderColor: `${classColor}30`,
                  color: classColor,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full
                  flex-shrink-0"
                  style={{ backgroundColor: classColor }}
                />
                {classification}
                <span
                  className="text-xs font-normal
                  opacity-70 ml-1"
                >
                  ({formData.cgpa} on {scale}
                  {scale === 'percentage'
                    ? ''
                    : ' scale'})
                </span>
              </div>
            )
          })()}
        </div>

        {/* Test Scores — Flexible */}
        <div>
          <label
            className={labelClass}
            style={{ color: '#062850' }}
          >
            Test Scores
            <span className="text-gray-400 font-normal ml-1">
              (optional)
            </span>
          </label>
          <p className="text-xs text-gray-500 mb-4">
            Add any language or academic test scores you
            have. You do not need these to use our service
            — but they help us find better matches.
          </p>

          {/* Added Scores */}
          {testScores.length > 0 && (
            <div className="space-y-2 mb-4">
              {testScores.map((ts, index) => (
                <div
                  key={index}
                  className="flex items-center
                  justify-between px-4 py-3 rounded-xl
                  border text-sm"
                  style={{
                    borderColor: '#97C3E0',
                    backgroundColor: '#F0F6FB',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="font-semibold"
                      style={{ color: '#062850' }}
                    >
                      {ts.name}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full
                      text-xs font-medium text-white"
                      style={{
                        backgroundColor: '#497296',
                      }}
                    >
                      {ts.score}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTestScore(index)}
                    className="text-gray-400
                    hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Score */}
          <div
            className="rounded-xl border p-4"
            style={{ borderColor: '#E5E7EB' }}
          >
            <p
              className="text-xs font-semibold mb-3"
              style={{ color: '#062850' }}
            >
              Add a test score
            </p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <TestNameDropdown
                value={newTestName}
                onChange={setNewTestName}
              />
              <input
                type="text"
                placeholder="Score (e.g. 7.5)"
                value={newTestScore}
                onChange={(e) =>
                  setNewTestScore(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addTestScore()
                  }
                }}
                className={inputClass}
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
            <button
              type="button"
              onClick={addTestScore}
              disabled={
                !newTestName.trim() ||
                !newTestScore.trim()
              }
              className="flex items-center gap-2 px-4
              py-2 rounded-xl text-sm font-medium
              text-white transition-all duration-200
              hover:opacity-90 disabled:opacity-40
              disabled:cursor-not-allowed"
              style={{ backgroundColor: '#497296' }}
            >
              <Plus className="w-4 h-4" />
              Add Score
            </button>
          </div>
        </div>

        {/* Publications */}
        <div>
          <label
            className={labelClass}
            style={{ color: '#062850' }}
          >
            Publications
            <span className="text-gray-400 font-normal ml-1">
              (optional)
            </span>
          </label>
          <textarea
            placeholder="List any academic papers, articles, or research you have published. Leave blank if none."
            value={formData.publications}
            onChange={(e) =>
              updateFormData({
                publications: e.target.value,
              })
            }
            rows={3}
            className={`${inputClass} resize-none`}
            style={{ borderColor: '#D1D5DB' }}
          />
        </div>

        {/* Work Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-2
        gap-6">
          <div>
            <label
              className={labelClass}
              style={{ color: '#062850' }}
            >
              Work Experience
              <span className="text-gray-400 font-normal
              ml-1">
                (optional)
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g. Software Engineer at Google"
              value={formData.workExperience}
              onChange={(e) =>
                updateFormData({
                  workExperience: e.target.value,
                })
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
              Years of Experience
              <span className="text-gray-400 font-normal
              ml-1">
                (optional)
              </span>
            </label>
            <select
              value={formData.workExperienceYears}
              onChange={(e) =>
                updateFormData({
                  workExperienceYears: e.target.value,
                })
              }
              className={inputClass}
              style={{ borderColor: '#D1D5DB' }}
            >
              <option value="">Select years</option>
              <option value="0">Less than 1 year</option>
              <option value="1">1 year</option>
              <option value="2">2 years</option>
              <option value="3">3 years</option>
              <option value="4">4 years</option>
              <option value="5">5 years</option>
              <option value="6+">6+ years</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  )
}