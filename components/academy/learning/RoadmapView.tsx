'use client'

import { useState } from 'react'
import { CheckCircle, Circle, BookOpen, Loader2, ChevronDown, ChevronRight, Download } from 'lucide-react'

export interface RoadmapTopic {
  id: string
  subject_code: string
  topic_unit: string
  topic_name: string
  topic_index: number
  status: 'upcoming' | 'current' | 'completed'
  completed_at: string | null
  trainer_notes: string | null
}

interface Props {
  topics: RoadmapTopic[]
  childName: string
  canEdit: boolean
  onUpdateStatus?: (topicId: string, status: string, notes: string, childId: string) => Promise<void>
  childId?: string
}

const SUBJECT_NAMES: Record<string, string> = {
  ENG: 'English Language', MATH: 'Mathematics', SCI: 'Science',
  COMP: 'Computing', HIST: 'History', GEO: 'Geography',
  ART: 'Creative Arts', MUS: 'Music', PE: 'Physical Education',
  NHC: 'Nigerian History & Culture', REL: 'Religious Studies',
  BTECH: 'Basic Technology', BIO: 'Biology', CHEM: 'Chemistry',
  PHY: 'Physics', ECON: 'Economics', GOV: 'Government / Politics',
  ENGLIT: 'English Literature',
}

const SUBJECT_COLORS: Record<string, string> = {
  ENG: '#497296', MATH: '#10B981', SCI: '#8B5CF6',
  COMP: '#F59E0B', HIST: '#EC4899', GEO: '#14B8A6',
  ART: '#F97316', MUS: '#6366F1', PE: '#16A34A',
  NHC: '#DC2626', REL: '#7C3AED', BTECH: '#0891B2',
  BIO: '#65A30D', CHEM: '#CA8A04', PHY: '#2563EB',
  ECON: '#DB2777', GOV: '#9333EA', ENGLIT: '#0D9488',
}

export default function RoadmapView({ topics, childName, canEdit, onUpdateStatus, childId }: Props) {
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({})
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({})
  const [updatingTopic, setUpdatingTopic] = useState<string | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<RoadmapTopic | null>(null)
  const [lessonPlan, setLessonPlan] = useState<Record<string, unknown> | null>(null)
  const [loadingPlan, setLoadingPlan] = useState(false)
  const [editNotes, setEditNotes] = useState('')

  // Group topics by subject then by unit
  const grouped: Record<string, Record<string, RoadmapTopic[]>> = {}
  for (const topic of topics) {
    if (!grouped[topic.subject_code]) grouped[topic.subject_code] = {}
    if (!grouped[topic.subject_code][topic.topic_unit]) grouped[topic.subject_code][topic.topic_unit] = []
    grouped[topic.subject_code][topic.topic_unit].push(topic)
  }

  function toggleSubject(subject: string) {
    setExpandedSubjects(prev => ({ ...prev, [subject]: !prev[subject] }))
  }

  function toggleUnit(key: string) {
    setExpandedUnits(prev => ({ ...prev, [key]: !prev[key] }))
  }

  async function handleMarkComplete(topic: RoadmapTopic) {
    if (!onUpdateStatus || !childId) return
    setUpdatingTopic(topic.id)
    await onUpdateStatus(topic.id, 'completed', editNotes, childId)
    setUpdatingTopic(null)
    setSelectedTopic(null)
    setEditNotes('')
  }

  async function handleMarkCurrent(topic: RoadmapTopic) {
    if (!onUpdateStatus || !childId) return
    setUpdatingTopic(topic.id)
    await onUpdateStatus(topic.id, 'current', '', childId)
    setUpdatingTopic(null)
  }

  async function loadLessonPlan(topic: RoadmapTopic) {
    setSelectedTopic(topic)
    setLessonPlan(null)
    setLoadingPlan(true)
    try {
      const params = new URLSearchParams({
        subject_code: topic.subject_code,
        year_group_code: 'Year 2',
        topic_unit: topic.topic_unit,
        topic_name: topic.topic_name,
      })
      const res = await fetch(`/api/academy/lesson-plan?${params}`)
      const data = await res.json()
      if (data.lesson_plan) setLessonPlan(data.lesson_plan)
    } catch (err) {
      console.error('Failed to load lesson plan:', err)
    } finally {
      setLoadingPlan(false)
    }
  }

  function downloadLessonPlan() {
    if (!lessonPlan || !selectedTopic) return
    const objectivesList = (lessonPlan.objectives as string[])
      .map((o: string, i: number) => (i + 1) + '. ' + o)
      .join('\n')
    const resourcesList = (lessonPlan.resources as string[])
      .map((r: string) => '\u2022 ' + r)
      .join('\n')
    const lines = [
      'AVERRA KNOWLEDGE ACADEMY \u2014 LESSON PLAN',
      '=======================================',
      'Subject: ' + (SUBJECT_NAMES[selectedTopic.subject_code] || selectedTopic.subject_code),
      'Topic Unit: ' + selectedTopic.topic_unit,
      'Topic: ' + selectedTopic.topic_name,
      'Duration: ' + String(lessonPlan.duration_minutes) + ' minutes',
      '',
      'LEARNING OBJECTIVES',
      '-------------------',
      objectivesList,
      '',
      'STARTER ACTIVITY (5 mins)',
      '--------------------------',
      String(lessonPlan.starter_activity),
      '',
      'MAIN TEACHING (20 mins)',
      '------------------------',
      String(lessonPlan.main_teaching),
      '',
      'PRACTICE ACTIVITY (15 mins)',
      '----------------------------',
      String(lessonPlan.practice_activity),
      '',
      'PLENARY / WRAP-UP (5 mins)',
      '----------------------------',
      String(lessonPlan.plenary),
      '',
      'RESOURCES',
      '---------',
      resourcesList,
      '',
      'DIFFERENTIATION',
      '---------------',
      String(lessonPlan.differentiation),
      '',
      'ASSESSMENT CRITERIA',
      '-------------------',
      String(lessonPlan.assessment_criteria),
      '',
      '---',
      'Generated by Averra Knowledge Academy | Averra Super Curriculum',
    ]
    const text = lines.join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Lesson_Plan_' + selectedTopic.topic_name.replace(/\s+/g, '_') + '.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Calculate progress per subject
  function getSubjectProgress(subjectCode: string) {
    const subjectTopics = topics.filter(t => t.subject_code === subjectCode)
    const completed = subjectTopics.filter(t => t.status === 'completed').length
    return { completed, total: subjectTopics.length, pct: subjectTopics.length > 0 ? Math.round((completed / subjectTopics.length) * 100) : 0 }
  }

  return (
    <div className="space-y-4">

      {/* Lesson Plan Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(6,40,80,0.7)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
              <div>
                <p className="text-xs text-gray-500">{SUBJECT_NAMES[selectedTopic.subject_code]}</p>
                <h2 className="font-bold text-lg" style={{ color: '#062850' }}>{selectedTopic.topic_name}</h2>
              </div>
              <div className="flex items-center gap-2">
                {lessonPlan && (
                  <button onClick={downloadLessonPlan}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl text-white text-xs font-semibold"
                    style={{ backgroundColor: '#497296' }}>
                    <Download className="w-3 h-3" /> Download
                  </button>
                )}
                <button onClick={() => { setSelectedTopic(null); setLessonPlan(null) }}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {loadingPlan ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#497296' }} />
                  <p className="ml-3 text-gray-500">Generating lesson plan...</p>
                </div>
              ) : lessonPlan ? (
                <div className="space-y-6">
                  {/* Objectives */}
                  <div>
                    <h3 className="font-bold text-sm mb-2" style={{ color: '#062850' }}>🎯 Learning Objectives</h3>
                    <ul className="space-y-1">
                      {(lessonPlan.objectives as string[]).map((obj: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sections */}
                  {[
                    { label: '🚀 Starter Activity (5 mins)', key: 'starter_activity' },
                    { label: '📚 Main Teaching (20 mins)', key: 'main_teaching' },
                    { label: '✏️ Practice Activity (15 mins)', key: 'practice_activity' },
                    { label: '🎓 Plenary / Wrap-up (5 mins)', key: 'plenary' },
                  ].map((section) => (
                    <div key={section.key}>
                      <h3 className="font-bold text-sm mb-2" style={{ color: '#062850' }}>{section.label}</h3>
                      <div className="p-4 rounded-xl text-sm text-gray-700 leading-relaxed"
                        style={{ backgroundColor: '#F0F6FB' }}>
                        {lessonPlan[section.key] as string}
                      </div>
                    </div>
                  ))}

                  {/* Resources */}
                  <div>
                    <h3 className="font-bold text-sm mb-2" style={{ color: '#062850' }}>📋 Resources</h3>
                    <ul className="space-y-1">
                      {(lessonPlan.resources as string[]).map((r: string, i: number) => (
                        <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                          <span style={{ color: '#497296' }}>•</span> {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Differentiation */}
                  <div>
                    <h3 className="font-bold text-sm mb-2" style={{ color: '#062850' }}>🎨 Differentiation</h3>
                    <div className="p-4 rounded-xl text-sm text-gray-700 leading-relaxed whitespace-pre-line"
                      style={{ backgroundColor: '#F0F6FB' }}>
                      {lessonPlan.differentiation as string}
                    </div>
                  </div>

                  {/* Assessment */}
                  <div>
                    <h3 className="font-bold text-sm mb-2" style={{ color: '#062850' }}>✅ Assessment Criteria</h3>
                    <div className="p-4 rounded-xl text-sm text-gray-700 leading-relaxed whitespace-pre-line"
                      style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                      {lessonPlan.assessment_criteria as string}
                    </div>
                  </div>

                  {/* Mark as taught */}
                  {canEdit && selectedTopic.status !== 'completed' && (
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Trainer Notes (optional)</p>
                      <textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#497296] resize-none mb-3"
                        placeholder="Add any notes about how this topic was taught..."
                      />
                      <button
                        onClick={() => handleMarkComplete(selectedTopic)}
                        disabled={updatingTopic === selectedTopic.id}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
                        style={{ backgroundColor: '#16A34A' }}
                      >
                        {updatingTopic === selectedTopic.id
                          ? <><Loader2 className="w-4 h-4 animate-spin" />Marking as Taught...</>
                          : <><CheckCircle className="w-4 h-4" />Mark Topic as Taught</>}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Failed to load lesson plan.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subject cards */}
      {Object.entries(grouped).map(([subjectCode, units]) => {
        const color = SUBJECT_COLORS[subjectCode] || '#497296'
        const progress = getSubjectProgress(subjectCode)
        const isExpanded = expandedSubjects[subjectCode] !== false // default open

        return (
          <div key={subjectCode} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">

            {/* Subject header */}
            <button
              onClick={() => toggleSubject(subjectCode)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
              style={{ backgroundColor: color }}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-white" />
                <div>
                  <p className="font-bold text-white">{SUBJECT_NAMES[subjectCode] || subjectCode}</p>
                  <p className="text-xs text-white opacity-80">
                    {progress.completed} of {progress.total} topics completed
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Progress circle */}
                <div className="relative w-10 h-10">
                  <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                    <circle cx="18" cy="15" r="15" fill="none" stroke="white" strokeWidth="3"
                      strokeDasharray={`${(progress.pct / 100) * 94} 94`}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{progress.pct}%</span>
                  </div>
                </div>
                {isExpanded
                  ? <ChevronDown className="w-4 h-4 text-white" />
                  : <ChevronRight className="w-4 h-4 text-white" />}
              </div>
            </button>

            {/* Progress bar */}
            <div className="w-full h-1.5" style={{ backgroundColor: `${color}20` }}>
              <div className="h-full transition-all duration-700"
                style={{ width: `${progress.pct}%`, backgroundColor: color }} />
            </div>

            {/* Units */}
            {isExpanded && (
              <div className="p-4 space-y-3">
                {Object.entries(units).map(([unitName, unitTopics]) => {
                  const unitKey = `${subjectCode}-${unitName}`
                  const isUnitExpanded = expandedUnits[unitKey] !== false
                  const unitCompleted = unitTopics.filter(t => t.status === 'completed').length
                  const unitTotal = unitTopics.length

                  return (
                    <div key={unitName} className="rounded-xl border border-gray-100 overflow-hidden">

                      {/* Unit header */}
                      <button
                        onClick={() => toggleUnit(unitKey)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {isUnitExpanded
                            ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                            : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                          <p className="text-sm font-semibold" style={{ color: '#062850' }}>{unitName}</p>
                        </div>
                        <span className="text-xs text-gray-400">{unitCompleted}/{unitTotal}</span>
                      </button>

                      {/* Topics list */}
                      {isUnitExpanded && (
                        <div className="border-t border-gray-50">
                          {unitTopics.map((topic) => {
                            const isCompleted = topic.status === 'completed'
                            const isCurrent = topic.status === 'current'
                            const isUpcoming = topic.status === 'upcoming'

                            return (
                              <div key={topic.id}
                                className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0 group hover:bg-gray-50 transition-colors">

                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  {/* Status icon */}
                                  {isCompleted ? (
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                  ) : isCurrent ? (
                                    <div className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                                      style={{ borderColor: '#3B82F6', backgroundColor: '#EFF6FF' }}>
                                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                    </div>
                                  ) : (
                                    <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                                  )}

                                  {/* Topic name */}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm truncate"
                                      style={{
                                        color: isCompleted ? '#16A34A' : isCurrent ? '#1D4ED8' : '#9CA3AF',
                                        fontWeight: isCurrent ? 600 : 400,
                                      }}>
                                      {topic.topic_name}
                                    </p>
                                    {isCompleted && topic.completed_at && (
                                      <p className="text-xs text-green-500">
                                        Completed {new Date(topic.completed_at).toLocaleDateString('en-GB')}
                                      </p>
                                    )}
                                    {isCurrent && (
                                      <p className="text-xs text-blue-500 font-medium">Currently teaching</p>
                                    )}
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                  {/* Lesson plan button — trainer only */}
                                  {canEdit && (
                                    <button
                                      onClick={() => loadLessonPlan(topic)}
                                      className="opacity-0 group-hover:opacity-100 text-xs px-2 py-1 rounded-lg font-medium transition-all"
                                      style={{ backgroundColor: '#EBF4FF', color: '#497296' }}>
                                      Lesson Plan
                                    </button>
                                  )}

                                  {/* Mark current */}
                                  {canEdit && isUpcoming && (
                                    <button
                                      onClick={() => handleMarkCurrent(topic)}
                                      disabled={updatingTopic === topic.id}
                                      className="opacity-0 group-hover:opacity-100 text-xs px-2 py-1 rounded-lg font-medium transition-all"
                                      style={{ backgroundColor: '#EFF6FF', color: '#3B82F6' }}>
                                      {updatingTopic === topic.id ? '...' : 'Start'}
                                    </button>
                                  )}

                                  {/* Mark complete */}
                                  {canEdit && (isCompleted ? null : (
                                    <button
                                      onClick={() => loadLessonPlan(topic)}
                                      disabled={updatingTopic === topic.id}
                                      className="opacity-0 group-hover:opacity-100 text-xs px-2 py-1 rounded-lg font-medium transition-all"
                                      style={{ backgroundColor: '#F0FDF4', color: '#16A34A' }}>
                                      {updatingTopic === topic.id ? '...' : 'Mark Taught'}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      {topics.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: '#497296' }} />
          <p className="text-gray-500 font-medium mb-1">No roadmap generated yet</p>
          <p className="text-gray-400 text-sm">The learning roadmap will appear here once a trainer is assigned.</p>
        </div>
      )}
    </div>
  )
}
