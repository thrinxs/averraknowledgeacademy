'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import {
  ChevronDown,
  Loader2,
  CheckCircle,
  Plus,
  TrendingUp,
} from 'lucide-react'

type Country = {
  country_code: string
  country_name: string
  flag: string
  curriculum_name: string
}

type YearGroup = {
  year_group_label: string
  year_group_code: string
}

type Topic = {
  name: string
  subtopics: string[]
}

type Unit = {
  name: string
  description?: string
  topics: Topic[]
}

type LocalData = {
  subject: string
  topics: { units: Unit[] }
  competencies: { by_end_of_year: string[] }
}

type AverraData = {
  subject: string
  topics: { units: Unit[] }
  source_contributions: Record<string, string[]>
  unique_additions: {
    added_beyond_england_nc?: string[]
    added_beyond_nigeria_nerdc?: string[]
  }
  competencies: { by_end_of_year: string[] }
}

type ComparisonData = {
  subject: string
  averra_advantage_summary: string
  what_averra_adds: {
    additions: Array<{
      source: string
      additions: string[]
    }>
  }
}

type SubjectData = {
  local: LocalData | null
  averra: AverraData | null
  comparison: ComparisonData | null
}

const SUBJECTS = [
  { code: 'ENG', label: 'English Language', emoji: '📖' },
  { code: 'MATH', label: 'Mathematics', emoji: '🔢' },
  { code: 'SCI', label: 'Science', emoji: '🔬' },
  { code: 'COMP', label: 'Computing', emoji: '💻' },
  { code: 'HIST', label: 'History', emoji: '🏛️' },
  { code: 'GEO', label: 'Geography', emoji: '🌍' },
  { code: 'ART', label: 'Creative Arts', emoji: '🎨' },
  { code: 'MUS', label: 'Music', emoji: '🎵' },
  { code: 'PE', label: 'Physical Education', emoji: '⚽' },
  {
    code: 'NHC',
    label: 'Nigerian History & Culture',
    emoji: '🪘',
  },
  {
    code: 'REL',
    label: 'Religious Studies',
    emoji: '🕊️',
  },
  {
    code: 'BTECH',
    label: 'Basic Technology',
    emoji: '⚙️',
  },
]

const FLAG_MAP: Record<string, string> = {
  GB: '🇬🇧',
  JP: '🇯🇵',
  EE: '🇪🇪',
  CA: '🇨🇦',
  NG: '🇳🇬',
  SG: '🇸🇬',
  FI: '🇫🇮',
}

const SOURCE_NAME_MAP: Record<string, string> = {
  GB: 'England',
  JP: 'Japan',
  EE: 'Estonia',
  CA: 'Canada',
  NG: 'Nigeria',
  SG: 'Singapore',
  FI: 'Finland',
}

// Count total subtopics across all units
function countSubtopics(units: Unit[]): number {
  return units.reduce(
    (total, unit) =>
      total +
      unit.topics.reduce(
        (t, topic) => t + topic.subtopics.length,
        0
      ),
    0
  )
}

function countTopics(units: Unit[]): number {
  return units.reduce(
    (total, unit) => total + unit.topics.length,
    0
  )
}

// Detect which source country a subtopic belongs to
function detectSource(sub: string): string | null {
  if (
    sub.includes('(Singapore)') ||
    sub.includes('🇸🇬')
  )
    return 'SG'
  if (sub.includes('(Japan)') || sub.includes('🇯🇵'))
    return 'JP'
  if (sub.includes('(Nigeria)') || sub.includes('🇳🇬'))
    return 'NG'
  if (sub.includes('(Finland)') || sub.includes('🇫🇮'))
    return 'FI'
  if (sub.includes('(Estonia)') || sub.includes('🇪🇪'))
    return 'EE'
  if (sub.includes('(Canada)') || sub.includes('🇨🇦'))
    return 'CA'
  if (sub.includes('(England)') || sub.includes('🇬🇧'))
    return 'GB'
  return null
}

function isExtraAddition(sub: string): boolean {
  return [
    '(Singapore)',
    '(Japan)',
    '(Nigeria)',
    '(Finland)',
    '(Estonia)',
    '(Canada)',
  ].some((tag) => sub.includes(tag))
}

export default function CurriculumExplorer() {
  const [mounted, setMounted] = useState(false)
  const [countries, setCountries] = useState<Country[]>([])
  const [yearGroups, setYearGroups] = useState<YearGroup[]>(
    []
  )
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedSubjects, setSelectedSubjects] = useState<
    string[]
  >(['ENG'])
  const [activeSubjectTab, setActiveSubjectTab] =
    useState('ENG')
  const [loading, setLoading] = useState(false)
  const [loadingCountries, setLoadingCountries] =
    useState(true)
  const [curriculumData, setCurriculumData] = useState<Record<
    string,
    SubjectData
  > | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) fetchCountries()
  }, [mounted])

  useEffect(() => {
    if (selectedCountry) fetchYearGroups(selectedCountry)
  }, [selectedCountry])

  async function fetchCountries() {
    try {
      setLoadingCountries(true)
      setError(null)
      const { data, error: err } = await supabase
        .from('academy_countries')
        .select(
          'country_code,country_name,flag,curriculum_name'
        )
        .eq('is_active', true)
        .order('tier', { ascending: true })
        .order('country_name', { ascending: true })
      if (err) {
        setError('Could not load countries.')
        return
      }
      if (data) setCountries(data)
    } catch {
      setError('Something went wrong.')
    } finally {
      setLoadingCountries(false)
    }
  }

  async function fetchYearGroups(code: string) {
    const { data } = await supabase
      .from('year_group_equivalencies')
      .select('year_group_label,year_group_code')
      .eq('country_code', code)
      .order('age_min', { ascending: true })
    if (data) setYearGroups(data)
    setSelectedYear('')
    setCurriculumData(null)
  }

  function toggleSubject(code: string) {
    setSelectedSubjects((prev) => {
      if (prev.includes(code)) {
        if (prev.length === 1) return prev
        return prev.filter((s) => s !== code)
      }
      return [...prev, code]
    })
  }

  async function handleShowCurriculum() {
    if (!selectedCountry || !selectedYear) return
    setLoading(true)
    setCurriculumData(null)
    try {
      const results = await Promise.all(
        selectedSubjects.map(async (subjectCode) => {
          const [localRes, averraRes, compRes] =
            await Promise.all([
              supabase
                .from('local_curricula')
                .select('*')
                .eq('country_code', selectedCountry)
                .eq('year_group_code', selectedYear)
                .eq('subject_code', subjectCode)
                .maybeSingle(),
              supabase
                .from('averra_super_curriculum')
                .select('*')
                .eq('year_group_code', 'Y2')
                .eq('subject_code', subjectCode)
                .maybeSingle(),
              supabase
                .from('curriculum_comparisons')
                .select('*')
                .eq('country_code', selectedCountry)
                .eq('year_group_code', selectedYear)
                .eq('subject_code', subjectCode)
                .maybeSingle(),
            ])
          return {
            subjectCode,
            local: localRes.data as LocalData | null,
            averra: averraRes.data as AverraData | null,
            comparison:
              compRes.data as ComparisonData | null,
          }
        })
      )
      const dataBySubject: Record<string, SubjectData> = {}
      results.forEach((r) => {
        dataBySubject[r.subjectCode] = {
          local: r.local,
          averra: r.averra,
          comparison: r.comparison,
        }
      })
      setCurriculumData(dataBySubject)
      setActiveSubjectTab(selectedSubjects[0])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  const activeData: SubjectData = curriculumData?.[
    activeSubjectTab
  ] ?? {
    local: null,
    averra: null,
    comparison: null,
  }

  const selectedCountryData = countries.find(
    (c) => c.country_code === selectedCountry
  )

  // Stats for impact bar
  const localUnits = activeData.local?.topics.units ?? []
  const averraUnits = activeData.averra?.topics.units ?? []
  const localSubtopicCount = countSubtopics(localUnits)
  const averraSubtopicCount = countSubtopics(averraUnits)
  const localTopicCount = countTopics(localUnits)
  const averraTopicCount = countTopics(averraUnits)
  const extraSubtopics =
    averraSubtopicCount - localSubtopicCount
  const extraTopics = averraTopicCount - localTopicCount

  return (
    <section
      className="py-24"
      style={{ backgroundColor: '#F0F6FB' }}
      id="explorer"
    >
      <div className="max-w-7xl mx-auto px-4
      sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2
            px-4 py-2 rounded-full text-sm font-medium
            text-white mb-4"
            style={{ backgroundColor: '#497296' }}
          >
            🔍 Interactive Curriculum Explorer
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: '#062850' }}
          >
            See Exactly What Your Child Will Learn
          </h2>
          <p className="text-gray-600 text-lg
          max-w-2xl mx-auto">
            Select your child&apos;s country, year group
            and subjects. See your local curriculum compared
            side by side with the Averra Super Curriculum —
            and discover exactly how much more your child
            will learn.
          </p>
        </div>

        {/* Selector Card */}
        <div className="bg-white rounded-3xl p-8
        shadow-sm border border-gray-100 mb-8">

          {error && (
            <div className="mb-6 p-4 rounded-xl
            bg-red-50 border border-red-100">
              <p className="text-red-600 text-sm">
                ⚠️ {error}
              </p>
              <button
                onClick={fetchCountries}
                className="text-red-600 underline text-sm
                mt-1"
              >
                Try again
              </button>
            </div>
          )}

          {/* Country + Year Row */}
          <div className="grid grid-cols-1 md:grid-cols-2
          gap-6 mb-6">

            <div>
              <label
                className="block text-sm font-semibold
                mb-2"
                style={{ color: '#062850' }}
              >
                Step 1: Where does your child study?
              </label>
              <div className="relative">
                {loadingCountries ? (
                  <div className="w-full px-4 py-3
                  rounded-xl border border-gray-200
                  bg-gray-50 flex items-center gap-2
                  text-gray-400 text-sm">
                    <Loader2 className="w-4 h-4
                    animate-spin" />
                    Loading countries...
                  </div>
                ) : (
                  <>
                    <select
                      value={selectedCountry}
                      onChange={(e) =>
                        setSelectedCountry(e.target.value)
                      }
                      className="w-full px-4 py-3 pr-10
                      rounded-xl border border-gray-200
                      appearance-none bg-white text-gray-700
                      focus:outline-none cursor-pointer"
                    >
                      <option value="">
                        Select country...
                      </option>
                      {countries.map((c) => (
                        <option
                          key={c.country_code}
                          value={c.country_code}
                        >
                          {c.flag} {c.country_name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-3 top-1/2
                      -translate-y-1/2 w-5 h-5 text-gray-400
                      pointer-events-none"
                    />
                  </>
                )}
              </div>
              {!loadingCountries && (
                <p className="text-xs text-gray-400 mt-1">
                  {countries.length} countries available
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-semibold
                mb-2"
                style={{ color: '#062850' }}
              >
                Step 2: What year/class are they in?
              </label>
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) =>
                    setSelectedYear(e.target.value)
                  }
                  disabled={!selectedCountry}
                  className="w-full px-4 py-3 pr-10
                  rounded-xl border border-gray-200
                  appearance-none bg-white text-gray-700
                  focus:outline-none disabled:opacity-50
                  disabled:cursor-not-allowed cursor-pointer"
                >
                  <option value="">
                    {selectedCountry
                      ? 'Select year group...'
                      : 'Select country first...'}
                  </option>
                  {yearGroups.map((y) => (
                    <option
                      key={y.year_group_code}
                      value={y.year_group_code}
                    >
                      {y.year_group_label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2
                  -translate-y-1/2 w-5 h-5 text-gray-400
                  pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Subject Multi-Select */}
          <div className="mb-6">
            <label
              className="block text-sm font-semibold mb-3"
              style={{ color: '#062850' }}
            >
              Step 3: Select subjects
              <span className="text-gray-400
              font-normal ml-2">
                (select one or more)
              </span>
            </label>
            <div className="flex flex-wrap gap-3">
              {SUBJECTS.map((subject) => {
                const isSelected =
                  selectedSubjects.includes(subject.code)
                return (
                  <button
                    key={subject.code}
                    onClick={() =>
                      toggleSubject(subject.code)
                    }
                    className={`flex items-center gap-2
                    px-4 py-2 rounded-full border-2 text-sm
                    font-medium transition-all duration-200
                    hover:scale-105 active:scale-95
                    ${
                      isSelected
                        ? 'text-white shadow-md'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#497296]'
                    }`}
                    style={
                      isSelected
                        ? {
                            backgroundColor: '#062850',
                            borderColor: '#062850',
                          }
                        : {}
                    }
                  >
                    <span>{subject.emoji}</span>
                    {subject.label}
                    {isSelected && (
                      <span className="ml-1 text-xs
                      bg-white/20 rounded-full w-4 h-4
                      flex items-center justify-center">
                        ✓
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
            {selectedSubjects.length > 0 && (
              <p className="text-xs text-gray-400 mt-2">
                {selectedSubjects.length} subject
                {selectedSubjects.length > 1 ? 's' : ''}
                {' '}selected
              </p>
            )}
          </div>

          <Button
            onClick={handleShowCurriculum}
            disabled={
              !selectedCountry ||
              !selectedYear ||
              selectedSubjects.length === 0 ||
              loading
            }
            className="w-full md:w-auto px-8 py-3
            text-white font-semibold rounded-xl
            transition-all duration-300 hover:opacity-90
            hover:scale-105 disabled:opacity-50
            disabled:cursor-not-allowed"
            style={{ backgroundColor: '#062850' }}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4
                animate-spin" />
                Loading Curriculum...
              </>
            ) : (
              '🎓 Show Me The Comparison'
            )}
          </Button>
        </div>

        {/* ═══════════════════════════════════════ */}
        {/* RESULTS                                */}
        {/* ═══════════════════════════════════════ */}
        {curriculumData && (
          <div className="space-y-4">

            {/* Subject Tabs */}
            {selectedSubjects.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {selectedSubjects.map((code) => {
                  const s = SUBJECTS.find(
                    (x) => x.code === code
                  )
                  const isActive = activeSubjectTab === code
                  return (
                    <button
                      key={code}
                      onClick={() =>
                        setActiveSubjectTab(code)
                      }
                      className="flex items-center gap-2
                      px-5 py-2.5 rounded-full font-semibold
                      text-sm transition-all duration-200
                      hover:scale-105"
                      style={
                        isActive
                          ? {
                              backgroundColor: '#062850',
                              color: 'white',
                            }
                          : {
                              backgroundColor: 'white',
                              color: '#062850',
                              border: '2px solid #062850',
                            }
                      }
                    >
                      {s?.emoji} {s?.label}
                    </button>
                  )
                })}
              </div>
            )}

            {activeData.local && activeData.averra ? (
              <>
                {/* ══════════════════════════════ */}
                {/* IMPACT SUMMARY BAR            */}
                {/* ══════════════════════════════ */}
                <div
                  className="rounded-2xl p-6"
                  style={{ backgroundColor: '#062850' }}
                >
                  <div className="flex items-center
                  gap-2 mb-4">
                    <TrendingUp className="w-5 h-5
                    text-yellow-300" />
                    <h3 className="font-bold text-white
                    text-lg">
                      The Averra Advantage —
                      {' '}{activeData.local.subject}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2
                  md:grid-cols-4 gap-4">
                    {[
                      {
                        label: 'Local Topics',
                        value: localTopicCount,
                        sub: `across ${localUnits.length} units`,
                        color: 'text-blue-200',
                      },
                      {
                        label: 'Averra Topics',
                        value: averraTopicCount,
                        sub: `across ${averraUnits.length} units`,
                        color: 'text-yellow-300',
                        big: true,
                      },
                      {
                        label: 'Local Learning Points',
                        value: localSubtopicCount,
                        sub: 'individual points',
                        color: 'text-blue-200',
                      },
                      {
                        label: 'Averra Learning Points',
                        value: averraSubtopicCount,
                        sub: `+${extraSubtopics} extra beyond local`,
                        color: 'text-yellow-300',
                        big: true,
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className={`rounded-xl p-4 text-center
                        ${stat.big
                          ? 'bg-white/20 border border-white/30'
                          : 'bg-white/10'
                        }`}
                      >
                        <div
                          className={`text-3xl font-bold
                          ${stat.color}`}
                        >
                          {stat.value}
                          {stat.big && (
                            <span className="text-lg ml-1">
                              🔥
                            </span>
                          )}
                        </div>
                        <div className="text-white
                        text-xs font-semibold mt-1">
                          {stat.label}
                        </div>
                        <div className="text-blue-300
                        text-xs mt-0.5">
                          {stat.sub}
                        </div>
                      </div>
                    ))}
                  </div>

                  {extraTopics > 0 && (
                    <div className="mt-4 pt-4
                    border-t border-white/20">
                      <p className="text-blue-200
                      text-sm text-center">
                        ✨ The Averra Super Curriculum
                        gives your child{' '}
                        <span className="text-yellow-300
                        font-bold">
                          {extraSubtopics} more learning
                          points
                        </span>{' '}
                        than the local curriculum alone
                        — drawn from 7 of the world&apos;s
                        best education systems.
                      </p>
                    </div>
                  )}
                </div>

                {/* ══════════════════════════════ */}
                {/* COMPARISON TABLE              */}
                {/* ══════════════════════════════ */}
                <div className="rounded-2xl overflow-hidden
                border border-gray-200 bg-white shadow-sm">

                  {/* Table Column Headers */}
                  <div className="grid grid-cols-2
                  sticky top-16 z-10">
                    <div
                      className="px-6 py-4 flex items-center
                      gap-3 border-r border-gray-200"
                      style={{ backgroundColor: '#EBF4FF' }}
                    >
                      <span className="text-2xl">
                        {selectedCountryData?.flag}
                      </span>
                      <div>
                        <p
                          className="font-bold text-sm"
                          style={{ color: '#062850' }}
                        >
                          📚 Local Curriculum
                        </p>
                        <p className="text-xs
                        text-gray-500 leading-tight">
                          {
                            selectedCountryData?.curriculum_name
                          }
                        </p>
                      </div>
                    </div>
                    <div
                      className="px-6 py-4 flex items-center
                      gap-3"
                      style={{ backgroundColor: '#062850' }}
                    >
                      <span className="text-2xl">✨</span>
                      <div>
                        <p className="font-bold text-sm
                        text-white">
                          Averra Super Curriculum
                        </p>
                        <p className="text-xs
                        text-blue-300 leading-tight">
                          🇬🇧🇯🇵🇪🇪🇨🇦🇳🇬🇸🇬🇫🇮 7 World
                          Systems Fused
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Unit by Unit Rows */}
                  {averraUnits.map(
                    (averraUnit, unitIndex) => {
                      // Find the equivalent local unit
                      // by index or name match
                      const localUnit =
                        localUnits[unitIndex] || null

                      // Count topics in each
                      const localTopicsInUnit =
                        localUnit?.topics.length ?? 0
                      const averraTopicsInUnit =
                        averraUnit.topics.length

                      // Count subtopics
                      const localSubsInUnit =
                        localUnit?.topics.reduce(
                          (t, topic) =>
                            t + topic.subtopics.length,
                          0
                        ) ?? 0
                      const averraSubsInUnit =
                        averraUnit.topics.reduce(
                          (t, topic) =>
                            t + topic.subtopics.length,
                          0
                        )

                      return (
                        <div
                          key={averraUnit.name}
                          className="border-t
                          border-gray-200"
                        >
                          {/* Unit Name Header */}
                          <div className="grid grid-cols-2">
                            <div
                              className="px-6 py-2.5
                              border-r border-gray-200
                              flex items-center
                              justify-between gap-2"
                              style={{
                                backgroundColor: '#F0F6FB',
                              }}
                            >
                              <div className="flex
                              items-center gap-2">
                                <div
                                  className="w-1.5 h-6
                                  rounded-full flex-shrink-0"
                                  style={{
                                    backgroundColor:
                                      '#497296',
                                  }}
                                />
                                <span
                                  className="font-bold
                                  text-sm"
                                  style={{ color: '#062850' }}
                                >
                                  {localUnit?.name ||
                                    averraUnit.name}
                                </span>
                              </div>
                              {localUnit && (
                                <span
                                  className="text-xs
                                  font-medium px-2 py-0.5
                                  rounded-full flex-shrink-0"
                                  style={{
                                    backgroundColor:
                                      '#EBF4FF',
                                    color: '#497296',
                                  }}
                                >
                                  {localSubsInUnit} points
                                </span>
                              )}
                            </div>
                            <div
                              className="px-6 py-2.5 flex
                              items-center justify-between
                              gap-2"
                              style={{
                                backgroundColor: '#1D4469',
                              }}
                            >
                              <div className="flex
                              items-center gap-2">
                                <div className="w-1.5 h-6
                                rounded-full flex-shrink-0
                                bg-blue-300" />
                                <span className="font-bold
                                text-sm text-white">
                                  {averraUnit.name}
                                </span>
                              </div>
                              <span
                                className="text-xs
                                font-bold px-2 py-0.5
                                rounded-full flex-shrink-0
                                text-yellow-900"
                                style={{
                                  backgroundColor:
                                    '#FEF08A',
                                }}
                              >
                                {averraSubsInUnit} points 🔥
                              </span>
                            </div>
                          </div>

                          {/* Topics Content */}
                          <div className="grid grid-cols-2">

                            {/* LOCAL COLUMN */}
                            <div
                              className="px-6 py-4 border-r
                              border-gray-200"
                            >
                              {localUnit ? (
                                <div className="space-y-4">
                                  {localUnit.topics.map(
                                    (topic) => (
                                      <div key={topic.name}>
                                        <p
                                          className="text-xs
                                          font-bold uppercase
                                          tracking-wide mb-2
                                          pb-1 border-b
                                          border-gray-100"
                                          style={{
                                            color: '#497296',
                                          }}
                                        >
                                          {topic.name}
                                        </p>
                                        <ul className="space-y-1.5">
                                          {topic.subtopics.map(
                                            (sub) => (
                                              <li
                                                key={sub}
                                                className="flex
                                                items-start
                                                gap-2"
                                              >
                                                <CheckCircle
                                                  className="w-3.5
                                                  h-3.5
                                                  flex-shrink-0
                                                  mt-0.5"
                                                  style={{
                                                    color:
                                                      '#497296',
                                                  }}
                                                />
                                                <span className="text-xs
                                                text-gray-600
                                                leading-snug">
                                                  {sub}
                                                </span>
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      </div>
                                    )
                                  )}
                                </div>
                              ) : (
                                <div className="flex
                                items-center gap-2
                                py-2">
                                  <span className="text-xs
                                  text-gray-400 italic">
                                    Not covered in local
                                    curriculum
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* AVERRA COLUMN */}
                            <div className="px-6 py-4">
                              <div className="space-y-4">
                                {averraUnit.topics.map(
                                  (topic) => (
                                    <div key={topic.name}>
                                      <p
                                        className="text-xs
                                        font-bold uppercase
                                        tracking-wide mb-2
                                        pb-1 border-b
                                        border-gray-100"
                                        style={{
                                          color: '#325E84',
                                        }}
                                      >
                                        {topic.name}
                                      </p>
                                      <ul className="space-y-1.5">
                                        {topic.subtopics.map(
                                          (sub) => {
                                            const extra =
                                              isExtraAddition(
                                                sub
                                              )
                                            const source =
                                              detectSource(sub)

                                            // Clean the
                                            // source tag
                                            // from display
                                            const cleanSub =
                                              sub.replace(
                                                /\s*\([A-Za-z\s+]+\)$/,
                                                ''
                                              )

                                            return (
                                              <li
                                                key={sub}
                                                className={`flex
                                                items-start
                                                gap-2 rounded-lg
                                                ${extra
                                                  ? 'bg-amber-50 px-2 py-1 -mx-2'
                                                  : ''
                                                }`}
                                              >
                                                {extra ? (
                                                  <Plus
                                                    className="w-3.5
                                                    h-3.5
                                                    flex-shrink-0
                                                    mt-0.5
                                                    text-amber-500"
                                                  />
                                                ) : (
                                                  <CheckCircle
                                                    className="w-3.5
                                                    h-3.5
                                                    flex-shrink-0
                                                    mt-0.5"
                                                    style={{
                                                      color:
                                                        '#325E84',
                                                    }}
                                                  />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                  <span
                                                    className={`text-xs
                                                    leading-snug
                                                    ${extra
                                                      ? 'text-amber-800 font-medium'
                                                      : 'text-gray-600'
                                                    }`}
                                                  >
                                                    {cleanSub}
                                                  </span>
                                                  {source &&
                                                    extra && (
                                                      <span
                                                        className="ml-1.5
                                                        text-lg
                                                        leading-none"
                                                      >
                                                        {
                                                          FLAG_MAP[
                                                            source
                                                          ]
                                                        }
                                                      </span>
                                                    )}
                                                </div>
                                              </li>
                                            )
                                          }
                                        )}
                                      </ul>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }
                  )}

                  {/* Averra-Only Units */}
                  {averraUnits.length > localUnits.length &&
                    averraUnits
                      .slice(localUnits.length)
                      .map((extraUnit) => (
                        <div
                          key={extraUnit.name}
                          className="border-t border-gray-200"
                        >
                          <div className="grid grid-cols-2">
                            <div
                              className="px-6 py-2.5
                              border-r border-gray-200
                              flex items-center"
                              style={{
                                backgroundColor: '#F0F6FB',
                              }}
                            >
                              <span className="text-xs
                              italic text-gray-400">
                                — not in local curriculum —
                              </span>
                            </div>
                            <div
                              className="px-6 py-2.5 flex
                              items-center justify-between"
                              style={{
                                backgroundColor: '#1D4469',
                              }}
                            >
                              <div className="flex items-center
                              gap-2">
                                <div className="w-1.5 h-6
                                rounded-full bg-yellow-300
                                flex-shrink-0" />
                                <span className="font-bold
                                text-sm text-white">
                                  ✨ {extraUnit.name}
                                </span>
                              </div>
                              <span
                                className="text-xs font-bold
                                px-2 py-0.5 rounded-full
                                text-yellow-900 flex-shrink-0"
                                style={{
                                  backgroundColor: '#FEF08A',
                                }}
                              >
                                Averra Only 🔥
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2">
                            <div
                              className="px-6 py-4 border-r
                              border-gray-200"
                              style={{
                                backgroundColor: '#FAFAFA',
                              }}
                            />
                            <div className="px-6 py-4">
                              <div className="space-y-4">
                                {extraUnit.topics.map(
                                  (topic) => (
                                    <div key={topic.name}>
                                      <p
                                        className="text-xs
                                        font-bold uppercase
                                        tracking-wide mb-2
                                        pb-1 border-b
                                        border-gray-100"
                                        style={{
                                          color: '#325E84',
                                        }}
                                      >
                                        {topic.name}
                                      </p>
                                      <ul className="space-y-1.5">
                                        {topic.subtopics.map(
                                          (sub) => {
                                            const source =
                                              detectSource(sub)
                                            const cleanSub =
                                              sub.replace(
                                                /\s*\([A-Za-z\s+]+\)$/,
                                                ''
                                              )
                                            return (
                                              <li
                                                key={sub}
                                                className="flex
                                                items-start
                                                gap-2 bg-amber-50
                                                rounded-lg px-2
                                                py-1 -mx-2"
                                              >
                                                <Plus
                                                  className="w-3.5
                                                  h-3.5
                                                  flex-shrink-0
                                                  mt-0.5
                                                  text-amber-500"
                                                />
                                                <div className="flex-1 min-w-0">
                                                  <span className="text-xs
                                                  text-amber-800
                                                  font-medium
                                                  leading-snug">
                                                    {cleanSub}
                                                  </span>
                                                  {source && (
                                                    <span className="ml-1.5
                                                    text-lg
                                                    leading-none">
                                                      {
                                                        FLAG_MAP[
                                                          source
                                                        ]
                                                      }
                                                    </span>
                                                  )}
                                                </div>
                                              </li>
                                            )
                                          }
                                        )}
                                      </ul>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>

                {/* ══════════════════════════════ */}
                {/* ADVANTAGE SUMMARY             */}
                {/* ══════════════════════════════ */}
                {activeData.comparison && (
                  <div className="space-y-4">

                    {/* Summary Paragraph */}
                    <div
                      className="rounded-2xl p-6 border-l-4"
                      style={{
                        backgroundColor: '#F0F6FB',
                        borderColor: '#497296',
                      }}
                    >
                      <p
                        className="text-sm md:text-base
                        leading-relaxed font-medium"
                        style={{ color: '#062850' }}
                      >
                        ⭐{' '}
                        {
                          activeData.comparison
                            .averra_advantage_summary
                        }
                      </p>
                    </div>

                    {/* Source Cards Grid */}
                    <div>
                      <h4
                        className="font-bold text-base mb-4
                        flex items-center gap-2"
                        style={{ color: '#062850' }}
                      >
                        <Plus className="w-5 h-5" />
                        What Each World Curriculum Adds
                        to Your Child&apos;s Learning
                      </h4>
                      <div className="grid grid-cols-1
                      md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeData.comparison
                          .what_averra_adds.additions.map(
                            (sourceData) => {
                              const codeEntry = Object.entries(
                                FLAG_MAP
                              ).find(([, flag]) =>
                                sourceData.source.includes(
                                  flag
                                )
                              )
                              const code =
                                codeEntry?.[0] || 'GB'

                              return (
                                <div
                                  key={sourceData.source}
                                  className="rounded-2xl
                                  border border-gray-100
                                  overflow-hidden"
                                >
                                  {/* Card Header */}
                                  <div
                                    className="px-4 py-3
                                    flex items-center gap-2"
                                    style={{
                                      backgroundColor:
                                        '#062850',
                                    }}
                                  >
                                    <span className="text-xl">
                                      {FLAG_MAP[code]}
                                    </span>
                                    <span className="font-bold
                                    text-sm text-white">
                                      {SOURCE_NAME_MAP[
                                        code
                                      ] ||
                                        sourceData.source}
                                    </span>
                                    <span
                                      className="ml-auto
                                      text-xs px-2 py-0.5
                                      rounded-full
                                      text-yellow-900
                                      font-bold"
                                      style={{
                                        backgroundColor:
                                          '#FEF08A',
                                      }}
                                    >
                                      +
                                      {
                                        sourceData.additions
                                          .length
                                      }
                                    </span>
                                  </div>
                                  {/* Card Body */}
                                  <div className="px-4 py-3
                                  bg-white">
                                    <ul className="space-y-1.5">
                                      {sourceData.additions.map(
                                        (addition) => (
                                          <li
                                            key={addition}
                                            className="flex
                                            items-start gap-2
                                            text-xs
                                            text-gray-600"
                                          >
                                            <Plus
                                              className="w-3
                                              h-3 flex-shrink-0
                                              mt-0.5"
                                              style={{
                                                color:
                                                  '#497296',
                                              }}
                                            />
                                            {addition}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              )
                            }
                          )}
                      </div>
                    </div>

                    {/* By Year End Competencies */}
                    {activeData.averra?.competencies
                      ?.by_end_of_year && (
                      <div
                        className="rounded-2xl p-6 border-2"
                        style={{
                          borderColor: '#497296',
                          backgroundColor: '#F0F6FB',
                        }}
                      >
                        <h4
                          className="font-bold text-base
                          mb-4 flex items-center gap-2"
                          style={{ color: '#062850' }}
                        >
                          🏆 By The End of This Year,
                          Your Child Will Be Able To:
                        </h4>
                        <div className="grid grid-cols-1
                        md:grid-cols-2 gap-2.5">
                          {activeData.averra.competencies.by_end_of_year.map(
                            (competency, i) => (
                              <div
                                key={i}
                                className="flex items-start
                                gap-2"
                              >
                                <div
                                  className="w-5 h-5
                                  rounded-full flex items-center
                                  justify-center flex-shrink-0
                                  mt-0.5 text-xs font-bold
                                  text-white"
                                  style={{
                                    backgroundColor: '#497296',
                                  }}
                                >
                                  {i + 1}
                                </div>
                                <span className="text-sm
                                text-gray-700 leading-snug">
                                  {competency}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl
              text-center py-16 px-8">
                <p className="text-gray-500 text-lg mb-2">
                  No curriculum data available yet for
                  this selection.
                </p>
                <p className="text-gray-400 text-sm">
                  We currently have full data for:
                  🇬🇧 England Year 2 — English & Maths.
                  <br />
                  More countries and year groups are
                  being added regularly.
                </p>
              </div>
            )}

            {/* CTA */}
            {activeData.local && (
              <div
                className="rounded-2xl p-8 flex flex-col
                sm:flex-row items-center justify-between
                gap-4"
                style={{ backgroundColor: '#062850' }}
              >
                <div>
                  <p className="font-bold text-white
                  text-xl mb-1">
                    Ready to give your child this advantage?
                  </p>
                  <p className="text-blue-300 text-sm">
                    Enroll tonight — first session within
                    48 hours.
                  </p>
                </div>
                <a href="/academy/enroll">
                  <Button
                    className="bg-white font-bold px-10
                    py-4 rounded-xl transition-all
                    duration-300 hover:scale-105 shadow-lg
                    whitespace-nowrap text-base"
                    style={{ color: '#062850' }}
                  >
                    Enroll My Child Now →
                  </Button>
                </a>
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  )
}