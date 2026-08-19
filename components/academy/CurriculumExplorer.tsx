'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle, XCircle, ChevronDown, Loader2 } from 'lucide-react'

type Country = {
  country_code: string
  country_name: string
  flag: string
  curriculum_name: string
  curriculum_authority: string
  exam_system: string[]
}

type YearGroup = {
  year_group_code: string
  year_group_label: string
  stage: string
  sort_order: number
}

type Subject = {
  subject_code: string
  subject_name: string
  subject_type: string
  averra_teaches: boolean
  averra_subject_code: string | null
}

const STAGE_LABELS: Record<string, string> = {
  primary: '🏫 Primary',
  junior_secondary: '📘 Junior Secondary',
  senior_secondary: '🎓 Senior Secondary',
}

const STAGE_COLORS: Record<string, string> = {
  primary: '#065F46',
  junior_secondary: '#062850',
  senior_secondary: '#6D28D9',
}

export default function CurriculumExplorer() {
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [yearGroups, setYearGroups] = useState<YearGroup[]>([])
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loadingCountries, setLoadingCountries] = useState(true)
  const [loadingYears, setLoadingYears] = useState(false)
  const [loadingSubjects, setLoadingSubjects] = useState(false)

  // Load countries on mount
  useEffect(() => {
    async function fetchCountries() {
      const { data } = await supabase
        .from('academy_countries')
        .select('country_code,country_name,flag,curriculum_name,curriculum_authority,exam_system')
        .eq('is_active', true)
        .order('country_name')
      if (data) setCountries(data)
      setLoadingCountries(false)
    }
    fetchCountries()
  }, [])

  // Load year groups when country changes
  useEffect(() => {
    if (!selectedCountry) return
    setSelectedYear('')
    setSubjects([])
    setLoadingYears(true)
    async function fetchYearGroups() {
      const { data } = await supabase
        .from('year_group_equivalencies')
        .select('year_group_code,year_group_label,stage,sort_order')
        .eq('country_code', selectedCountry)
        .order('sort_order')
      if (data) setYearGroups(data)
      setLoadingYears(false)
    }
    fetchYearGroups()
  }, [selectedCountry])

  // Load subjects when year group changes
  useEffect(() => {
    if (!selectedCountry || !selectedYear) return
    setLoadingSubjects(true)
    async function fetchSubjects() {
      const { data } = await supabase
        .from('country_subjects')
        .select('subject_code,subject_name,subject_type,averra_teaches,averra_subject_code')
        .eq('country_code', selectedCountry)
        .eq('year_group_code', selectedYear)
        .order('subject_type')
        .order('subject_name')
      if (data) setSubjects(data)
      setLoadingSubjects(false)
    }
    fetchSubjects()
  }, [selectedCountry, selectedYear])

  const selectedCountryData = countries.find(c => c.country_code === selectedCountry)
  const selectedYearData = yearGroups.find(y => y.year_group_code === selectedYear)

  const compulsory = subjects.filter(s => s.subject_type === 'compulsory')
  const elective = subjects.filter(s => s.subject_type === 'elective')
  const averraTeaches = subjects.filter(s => s.averra_teaches)
  const averraDoesNotTeach = subjects.filter(s => !s.averra_teaches)

  // Group year groups by stage
  const grouped = yearGroups.reduce((acc, yg) => {
    const stage = yg.stage || 'primary'
    if (!acc[stage]) acc[stage] = []
    acc[stage].push(yg)
    return acc
  }, {} as Record<string, YearGroup[]>)

  return (
    <div className="w-full">

      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4"
        style={{ color: '#062850' }}>
          Explore the Curriculum
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Select your country and year group to see exactly what is taught,
          which subjects Averra covers, and what the Averra Super Curriculum
          adds on top of your local curriculum.
        </p>
      </div>

      {/* Step 1 — Country */}
      <div className="mb-8">
        <p className="text-sm font-bold mb-3" style={{ color: '#062850' }}>
          Step 1 — Select Your Country
        </p>

        {loadingCountries ? (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading countries...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {countries.map(country => {
              const isSelected = selectedCountry === country.country_code
              return (
                <button
                  key={country.country_code}
                  onClick={() => setSelectedCountry(country.country_code)}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl
                  border-2 transition-all duration-200 hover:scale-105"
                  style={{
                    borderColor: isSelected ? '#062850' : '#E5E7EB',
                    backgroundColor: isSelected ? '#062850' : 'white',
                  }}
                >
                  <span className="text-3xl">{country.flag}</span>
                  <span
                    className="text-xs font-semibold text-center leading-tight"
                    style={{ color: isSelected ? 'white' : '#062850' }}
                  >
                    {country.country_name}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Country info */}
      {selectedCountryData && (
        <div className="rounded-2xl p-5 mb-8 flex flex-wrap gap-4
        items-start justify-between"
        style={{ backgroundColor: '#F0F6FB' }}>
          <div>
            <p className="font-bold text-lg mb-1" style={{ color: '#062850' }}>
              {selectedCountryData.flag} {selectedCountryData.country_name}
            </p>
            <p className="text-sm text-gray-500 mb-1">
              <span className="font-semibold">Curriculum:</span>{' '}
              {selectedCountryData.curriculum_name}
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Authority:</span>{' '}
              {selectedCountryData.curriculum_authority}
            </p>
          </div>
          {selectedCountryData.exam_system?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedCountryData.exam_system.map(exam => (
                <span
                  key={exam}
                  className="px-3 py-1 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: '#497296' }}
                >
                  {exam}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2 — Year Group */}
      {selectedCountry && (
        <div className="mb-8">
          <p className="text-sm font-bold mb-3" style={{ color: '#062850' }}>
            Step 2 — Select Year Group / Class
          </p>

          {loadingYears ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading year groups...
            </div>
          ) : (
            <div className="space-y-4">
              {['primary', 'junior_secondary', 'senior_secondary'].map(stage => {
                const groups = grouped[stage]
                if (!groups || groups.length === 0) return null
                return (
                  <div key={stage}>
                    <p className="text-xs font-bold uppercase tracking-wide mb-2"
                    style={{ color: STAGE_COLORS[stage] }}>
                      {STAGE_LABELS[stage]}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {groups.map(yg => {
                        const isSelected = selectedYear === yg.year_group_code
                        return (
                          <button
                            key={yg.year_group_code}
                            onClick={() => setSelectedYear(yg.year_group_code)}
                            className="px-4 py-2 rounded-xl border-2 text-sm
                            font-medium transition-all duration-200 hover:scale-105"
                            style={{
                              borderColor: isSelected ? STAGE_COLORS[stage] : '#E5E7EB',
                              backgroundColor: isSelected ? STAGE_COLORS[stage] : 'white',
                              color: isSelected ? 'white' : '#374151',
                            }}
                          >
                            {yg.year_group_label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Step 3 — Subjects */}
      {selectedYear && (
        <div>
          <p className="text-sm font-bold mb-5" style={{ color: '#062850' }}>
            Step 3 — Subjects for {selectedYearData?.year_group_label}
          </p>

          {loadingSubjects ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading subjects...
            </div>
          ) : subjects.length === 0 ? (
            <div className="rounded-2xl p-8 text-center"
            style={{ backgroundColor: '#F0F6FB' }}>
              <p className="text-gray-400 text-sm">
                No subjects found for this year group yet.
              </p>
            </div>
          ) : (
            <div className="space-y-8">

              {/* Summary bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Subjects', value: subjects.length, color: '#062850', bg: '#EBF4FF' },
                  { label: 'Compulsory', value: compulsory.length, color: '#065F46', bg: '#ECFDF5' },
                  { label: 'Elective', value: elective.length, color: '#B45309', bg: '#FFFBEB' },
                  { label: 'Averra Teaches', value: averraTeaches.length, color: '#16A34A', bg: '#F0FDF4' },
                ].map(stat => (
                  <div key={stat.label}
                  className="rounded-2xl p-4 text-center"
                  style={{ backgroundColor: stat.bg }}>
                    <p className="text-2xl font-bold mb-1" style={{ color: stat.color }}>
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Subjects Averra Teaches */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <h3 className="font-bold" style={{ color: '#062850' }}>
                    Subjects Averra Teaches ({averraTeaches.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {averraTeaches.map(subject => (
                    <div
                      key={subject.subject_code}
                      className="flex items-center gap-3 p-4 rounded-xl
                      border border-green-100 bg-green-50"
                    >
                      <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-500" />
                      <div>
                        <p className="font-semibold text-sm" style={{ color: '#062850' }}>
                          {subject.subject_name}
                        </p>
                        <p className="text-xs text-gray-400 capitalize">
                          {subject.subject_type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subjects Averra Does Not Yet Teach */}
              {averraDoesNotTeach.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-gray-300" />
                    <h3 className="font-bold" style={{ color: '#062850' }}>
                      Not Currently Taught by Averra ({averraDoesNotTeach.length})
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {averraDoesNotTeach.map(subject => (
                      <div
                        key={subject.subject_code}
                        className="flex items-center gap-3 p-4 rounded-xl
                        border border-gray-100 bg-gray-50"
                      >
                        <XCircle className="w-5 h-5 flex-shrink-0 text-gray-300" />
                        <div>
                          <p className="font-semibold text-sm text-gray-500">
                            {subject.subject_name}
                          </p>
                          <p className="text-xs text-gray-400 capitalize">
                            {subject.subject_type}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    These subjects are part of the {selectedCountryData?.country_name} curriculum
                    but are not yet offered by Averra. We are expanding our subject offering
                    regularly.
                  </p>
                </div>
              )}

            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!selectedCountry && !loadingCountries && (
        <div className="rounded-3xl p-16 text-center mt-8"
        style={{ backgroundColor: '#F0F6FB' }}>
          <div className="text-6xl mb-4">🌍</div>
          <p className="font-bold text-lg mb-2" style={{ color: '#062850' }}>
            Select a country to get started
          </p>
          <p className="text-gray-400 text-sm">
            Choose your country above to explore the curriculum for every
            year group and see which subjects Averra teaches.
          </p>
        </div>
      )}

    </div>
  )
}
