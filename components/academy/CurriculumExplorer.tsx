'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  CheckCircle,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ArrowLeft,
} from 'lucide-react'

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

type CurriculumMeta = {
  source_url: string | null
}

type Subtopic = string

type Topic = {
  name: string
  subtopics: Subtopic[]
}

type Unit = {
  name: string
  description?: string
  topics: Topic[]
}

type CurriculumData = {
  topics: Unit[]
  competencies?: { by_end_of_year?: string[] }
  source_contributions?: Record<string, string[]>
  unique_additions?: { added_beyond?: string[] }
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
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [localCurriculum, setLocalCurriculum] = useState<CurriculumData | null>(null)
  const [averraCurriculum, setAverraCurriculum] = useState<CurriculumData | null>(null)
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({})
  const [loadingCountries, setLoadingCountries] = useState(true)
  const [loadingYears, setLoadingYears] = useState(false)
  const [loadingSubjects, setLoadingSubjects] = useState(false)
  const [loadingCurriculum, setLoadingCurriculum] = useState(false)
  const [activeTab, setActiveTab] = useState<'local' | 'averra'>('local')
  const [equivalentYear, setEquivalentYear] = useState<string>('')
  const [curriculumMeta, setCurriculumMeta] = useState<CurriculumMeta | null>(null)

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

  useEffect(() => {
    if (!selectedCountry) return
    setSelectedYear('')
    setSubjects([])
    setSelectedSubject(null)
    setLocalCurriculum(null)
    setAverraCurriculum(null)
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

  useEffect(() => {
    if (!selectedCountry || !selectedYear) return
    setSelectedSubject(null)
    setLocalCurriculum(null)
    setAverraCurriculum(null)
    setEquivalentYear('')
    setLoadingSubjects(true)
    async function fetchSubjects() {
      const [subjectsRes, yearRes] = await Promise.all([
        supabase
          .from('country_subjects')
          .select('subject_code,subject_name,subject_type,averra_teaches,averra_subject_code')
          .eq('country_code', selectedCountry)
          .eq('year_group_code', selectedYear)
          .order('subject_type')
          .order('subject_name'),
        supabase
          .from('year_group_equivalencies')
          .select('equivalent_uk_year')
          .eq('country_code', selectedCountry)
          .eq('year_group_code', selectedYear)
          .maybeSingle()
      ])
      if (subjectsRes.data) setSubjects(subjectsRes.data)
      if (yearRes.data?.equivalent_uk_year) {
        setEquivalentYear(yearRes.data.equivalent_uk_year)
      }
      setLoadingSubjects(false)
    }
    fetchSubjects()
  }, [selectedCountry, selectedYear])

  async function handleSubjectClick(subject: Subject) {
    if (!subject.averra_teaches) return
    setSelectedSubject(subject)
    setLocalCurriculum(null)
    setAverraCurriculum(null)
    setCurriculumMeta(null)
    setExpandedUnits({})
    setActiveTab('local')
    setLoadingCurriculum(true)

    const [localRes, averraRes] = await Promise.all([
      supabase
        .from('local_curricula')
        .select('topics,competencies,source_url')
        .eq('country_code', selectedCountry)
        .eq('year_group_code', selectedYear)
        .eq('subject_code', subject.subject_code)
        .maybeSingle(),
      supabase
        .from('averra_super_curriculum')
        .select('topics,competencies,source_contributions,unique_additions')
        .eq('year_group_code', equivalentYear)
        .eq('subject_code', subject.subject_code)
        .maybeSingle(),
    ])

    if (localRes.data) {
      setLocalCurriculum(localRes.data)
      setCurriculumMeta({ source_url: localRes.data.source_url || null })
    }
    if (averraRes.data) setAverraCurriculum(averraRes.data)
    setLoadingCurriculum(false)
  }

  function toggleUnit(unitName: string) {
    setExpandedUnits(prev => ({ ...prev, [unitName]: !prev[unitName] }))
  }

  const selectedCountryData = countries.find(c => c.country_code === selectedCountry)
  const selectedYearData = yearGroups.find(y => y.year_group_code === selectedYear)
  const compulsory = subjects.filter(s => s.subject_type === 'compulsory')
  const elective = subjects.filter(s => s.subject_type === 'elective')
  const averraTeaches = subjects.filter(s => s.averra_teaches)
  const averraDoesNotTeach = subjects.filter(s => !s.averra_teaches)

  const grouped = yearGroups.reduce((acc, yg) => {
    const stage = yg.stage || 'primary'
    if (!acc[stage]) acc[stage] = []
    acc[stage].push(yg)
    return acc
  }, {} as Record<string, YearGroup[]>)

  const activeCurriculum = activeTab === 'local' ? localCurriculum : averraCurriculum

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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
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
                  <span className="text-xs font-semibold text-center leading-tight"
                  style={{ color: isSelected ? 'white' : '#062850' }}>
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
                <span key={exam}
                className="px-3 py-1 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: '#497296' }}>
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
              {['primary','junior_secondary','senior_secondary'].map(stage => {
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
      {selectedYear && !selectedSubject && (
        <div>
          <p className="text-sm font-bold mb-5" style={{ color: '#062850' }}>
            Step 3 — Subjects for {selectedYearData?.year_group_label}
            <span className="text-gray-400 font-normal ml-2">
              — click any green subject to view its curriculum
            </span>
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

              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Subjects', value: subjects.length, color: '#062850', bg: '#EBF4FF' },
                  { label: 'Compulsory', value: compulsory.length, color: '#065F46', bg: '#ECFDF5' },
                  { label: 'Elective', value: elective.length, color: '#B45309', bg: '#FFFBEB' },
                  { label: 'Averra Teaches', value: averraTeaches.length, color: '#16A34A', bg: '#F0FDF4' },
                ].map(stat => (
                  <div key={stat.label} className="rounded-2xl p-4 text-center"
                  style={{ backgroundColor: stat.bg }}>
                    <p className="text-2xl font-bold mb-1" style={{ color: stat.color }}>
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Averra Teaches */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <h3 className="font-bold" style={{ color: '#062850' }}>
                    Subjects Averra Teaches ({averraTeaches.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {averraTeaches.map(subject => (
                    <button
                      key={subject.subject_code}
                      onClick={() => handleSubjectClick(subject)}
                      className="flex items-center gap-3 p-4 rounded-xl
                      border border-green-100 bg-green-50 text-left
                      transition-all duration-200 hover:shadow-md
                      hover:-translate-y-0.5 hover:border-green-300 group"
                    >
                      <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-500" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm" style={{ color: '#062850' }}>
                          {subject.subject_name}
                        </p>
                        <p className="text-xs text-gray-400 capitalize">
                          {subject.subject_type}
                        </p>
                      </div>
                      <BookOpen className="w-4 h-4 text-green-400
                      opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Not Yet Taught */}
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
                      <div key={subject.subject_code}
                      className="flex items-center gap-3 p-4 rounded-xl
                      border border-gray-100 bg-gray-50">
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
                    but are not yet offered by Averra. We are expanding regularly.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Step 4 — Curriculum Detail */}
      {selectedSubject && (
        <div>
          {/* Back button */}
          <button
            onClick={() => {
              setSelectedSubject(null)
              setLocalCurriculum(null)
              setAverraCurriculum(null)
            }}
            className="flex items-center gap-2 text-sm text-gray-500
            hover:text-[#062850] transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform
            group-hover:-translate-x-1" />
            Back to subjects
          </button>

          {/* Subject header */}
          <div className="rounded-2xl p-6 mb-6"
          style={{ backgroundColor: '#062850' }}>
            <p className="text-blue-300 text-xs font-semibold uppercase
            tracking-wide mb-1">
              {selectedCountryData?.flag} {selectedCountryData?.country_name} —{' '}
              {selectedYearData?.year_group_label}
            </p>
            <h3 className="text-2xl font-bold text-white mb-1">
              {selectedSubject.subject_name}
            </h3>
            <p className="text-blue-300 text-sm capitalize">
              {selectedSubject.subject_type} subject
            </p>
          </div>

          {/* Official Curriculum Link */}
          {curriculumMeta?.source_url && (
            <a
              href={curriculumMeta.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-2xl mb-6
              border-2 transition-all duration-200 hover:scale-105 group"
              style={{ borderColor: '#497296', backgroundColor: '#F0F6FB' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center
                justify-center flex-shrink-0 text-lg"
                style={{ backgroundColor: '#062850' }}
              >
                📄
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm" style={{ color: '#062850' }}>
                  View Official {selectedCountryData?.country_name} Curriculum
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Opens the official government curriculum document in a new tab
                </p>
              </div>
              <div
                className="text-xs font-bold px-3 py-1.5 rounded-lg text-white
                flex-shrink-0 group-hover:opacity-90"
                style={{ backgroundColor: '#497296' }}
              >
                Open →
              </div>
            </a>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('local')}
              className="px-5 py-2.5 rounded-xl text-sm font-bold
              transition-all duration-200"
              style={{
                backgroundColor: activeTab === 'local' ? '#062850' : '#F0F6FB',
                color: activeTab === 'local' ? 'white' : '#062850',
              }}
            >
              📋 {selectedCountryData?.country_name} Curriculum
            </button>
            <button
              onClick={() => setActiveTab('averra')}
              className="px-5 py-2.5 rounded-xl text-sm font-bold
              transition-all duration-200"
              style={{
                backgroundColor: activeTab === 'averra' ? '#062850' : '#F0F6FB',
                color: activeTab === 'averra' ? 'white' : '#062850',
              }}
            >
              ✨ Averra Super Curriculum
            </button>
          </div>

          {loadingCurriculum ? (
            <div className="flex items-center justify-center gap-3 py-20">
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#062850' }} />
              <span className="text-gray-400 text-sm">Loading curriculum...</span>
            </div>
          ) : !activeCurriculum ? (
            <div className="rounded-2xl p-12 text-center"
            style={{ backgroundColor: '#F0F6FB' }}>
              <div className="text-4xl mb-4">📚</div>
              <p className="font-bold mb-2" style={{ color: '#062850' }}>
                {activeTab === 'averra'
                  ? 'Averra Super Curriculum coming soon for this level'
                  : 'Detailed curriculum content coming soon'}
              </p>
              <p className="text-gray-400 text-sm mb-4">
                {activeTab === 'averra'
                  ? 'We are building the enhanced Averra curriculum for this year group.'
                  : 'We are currently building out the full curriculum detail for this subject and year group.'}
              </p>
              {activeTab === 'local' && curriculumMeta?.source_url && (
                <a
                  href={curriculumMeta.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3
                  rounded-xl text-sm font-bold text-white transition-all
                  hover:opacity-90 hover:scale-105"
                  style={{ backgroundColor: '#062850' }}
                >
                  📄 View Official Curriculum Instead →
                </a>
              )}
            </div>
          ) : (
            <div className="space-y-4">

              {/* Competencies */}
              {activeCurriculum.competencies?.by_end_of_year &&
              activeCurriculum.competencies.by_end_of_year.length > 0 && (
                <div className="rounded-2xl p-6 mb-6"
                style={{ backgroundColor: '#F0F6FB' }}>
                  <h4 className="font-bold mb-3" style={{ color: '#062850' }}>
                    🎯 By the end of this year, the learner should be able to:
                  </h4>
                  <ul className="space-y-2">
                    {activeCurriculum.competencies.by_end_of_year.map((comp, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-500" />
                        {comp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Units */}
              {activeTab === 'averra' && activeCurriculum.source_contributions && (
                <div className="rounded-2xl p-5 mb-6"
                style={{ backgroundColor: '#062850' }}>
                  <h4 className="font-bold text-white mb-3 text-sm">
                    🌍 Drawn from 7 World Education Systems
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(activeCurriculum.source_contributions).map(([source, contributions]) => (
                      <div key={source}
                      className="bg-white/10 rounded-xl p-3">
                        <p className="text-xs font-bold text-white mb-1">{source}</p>
                        {(contributions as string[]).map((c, i) => (
                          <p key={i} className="text-xs text-blue-200 leading-relaxed">• {c}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(activeCurriculum.topics || []).map((unit, ui) => (
                <div key={ui}
                className="rounded-2xl border border-gray-100 overflow-hidden">

                  {/* Unit header */}
                  <button
                    onClick={() => toggleUnit(`${ui}`)}
                    className="w-full flex items-center justify-between
                    p-5 text-left transition-colors hover:bg-gray-50"
                    style={{ backgroundColor: expandedUnits[`${ui}`] ? '#F0F6FB' : 'white' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center
                      justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: '#062850' }}>
                        {ui + 1}
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ color: '#062850' }}>
                          {unit.name}
                        </p>
                        {unit.description && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {unit.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {expandedUnits[`${ui}`]
                      ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    }
                  </button>

                  {/* Topics */}
                  {expandedUnits[`${ui}`] && (
                    <div className="border-t border-gray-100">
                      {(unit.topics || []).map((topic, ti) => (
                        <div key={ti}
                        className="px-5 py-4 border-b border-gray-50 last:border-0">
                          <p className="font-semibold text-sm mb-2"
                          style={{ color: '#325E84' }}>
                            {topic.name}
                          </p>
                          {topic.subtopics && topic.subtopics.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-1">
                              {topic.subtopics.map((sub, si) => (
                                <span key={si}
                                className="px-3 py-1 rounded-full text-xs
                                font-medium text-gray-600 border border-gray-100"
                                style={{ backgroundColor: '#F9FAFB' }}>
                                  {sub}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
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
            Choose your country above to explore the full curriculum for
            every year group and see which subjects Averra teaches.
          </p>
        </div>
      )}

    </div>
  )
}
