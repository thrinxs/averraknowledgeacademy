'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import { BookOpen, Edit3, CheckCircle, Loader2, ChevronDown, ChevronRight, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SUBJECT_COLORS: Record<string, string> = {
  ENG: '#497296', MATH: '#10B981', SCI: '#8B5CF6',
  COMP: '#F59E0B', HIST: '#EC4899', GEO: '#14B8A6',
}

const SUBJECT_NAMES: Record<string, string> = {
  ENG: 'English Language', MATH: 'Mathematics', SCI: 'Science',
  COMP: 'Computing', HIST: 'History', GEO: 'Geography',
  ART: 'Creative Arts', MUS: 'Music', PE: 'Physical Education',
}

interface LessonPlan {
  id: string
  subject_code: string
  year_group_code: string
  topic_unit: string
  topic_name: string
  duration_minutes: number
  objectives: string[]
  starter_activity: string
  main_teaching: string
  practice_activity: string
  plenary: string
  resources: string[]
  differentiation: string
  assessment_criteria: string
  is_auto_generated: boolean
}

interface RoadmapTopic {
  id: string
  child_id: string
  subject_code: string
  topic_unit: string
  topic_name: string
  topic_index: number
  status: string
}

export default function PrincipalCurriculumPage() {
  const [mounted, setMounted] = useState(false)
  const [plans, setPlans] = useState<LessonPlan[]>([])
  const [topics, setTopics] = useState<RoadmapTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({})
  const [filterSubject, setFilterSubject] = useState('')
  const [filterYear, setFilterYear] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    const [plansRes, topicsRes] = await Promise.all([
      supabase.from('lesson_plans').select('*').order('subject_code').order('topic_unit'),
      supabase.from('learning_roadmap_progress').select('id, child_id, subject_code, topic_unit, topic_name, topic_index, status').order('subject_code').order('topic_index'),
    ])
    setPlans(plansRes.data || [])
    setTopics(topicsRes.data || [])
    setLoading(false)
  }, [])

  useEffect(() => { setMounted(true); loadData() }, [loadData])

  async function savePlan() {
    if (!editingPlan) return
    setSaving(true)
    const { error } = await supabase.from('lesson_plans').upsert({
      ...editingPlan,
      updated_at: new Date().toISOString(),
      is_auto_generated: false,
    })
    if (!error) {
      setSaved(true)
      setTimeout(() => { setSaved(false); setEditingPlan(null) }, 2000)
      loadData()
    }
    setSaving(false)
  }

  // Group plans by subject
  const grouped: Record<string, LessonPlan[]> = {}
  const filteredPlans = plans.filter(p =>
    (!filterSubject || p.subject_code === filterSubject) &&
    (!filterYear || p.year_group_code === filterYear)
  )
  for (const plan of filteredPlans) {
    if (!grouped[plan.subject_code]) grouped[plan.subject_code] = []
    grouped[plan.subject_code].push(plan)
  }

  // Unique subjects and years
  const subjects = [...new Set(plans.map(p => p.subject_code))]
  const years = [...new Set(plans.map(p => p.year_group_code))].sort()

  const inputCls = 'w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#497296] transition-all bg-white'

  if (!mounted) return null

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>
          Curriculum Manager
        </h1>
        <p className="text-gray-500 text-sm">
          Review and edit lesson plans. Changes you make override auto-generated content.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Lesson Plans', value: plans.length },
          { label: 'Subjects', value: subjects.length },
          { label: 'Auto-Generated', value: plans.filter(p => p.is_auto_generated).length },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: '#062850' }}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex flex-wrap gap-3">
        <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)}
          className={inputCls + ' max-w-48'}>
          <option value="">All Subjects</option>
          {subjects.map(s => <option key={s} value={s}>{SUBJECT_NAMES[s] || s}</option>)}
        </select>
        <select value={filterYear} onChange={e => setFilterYear(e.target.value)}
          className={inputCls + ' max-w-36'}>
          <option value="">All Year Groups</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        {(filterSubject || filterYear) && (
          <Button variant="outline" onClick={() => { setFilterSubject(''); setFilterYear('') }}
            className="rounded-xl text-xs">
            Clear Filters
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#497296' }} />
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([subjectCode, subjectPlans]) => {
            const color = SUBJECT_COLORS[subjectCode] || '#497296'
            const isExpanded = expandedSubjects[subjectCode] !== false

            return (
              <div key={subjectCode} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setExpandedSubjects(prev => ({ ...prev, [subjectCode]: !isExpanded }))}
                  className="w-full flex items-center justify-between px-5 py-4"
                  style={{ backgroundColor: color }}>
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-white" />
                    <p className="font-bold text-white">{SUBJECT_NAMES[subjectCode] || subjectCode}</p>
                    <span className="text-xs text-white opacity-80">{subjectPlans.length} plans</span>
                  </div>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-white" /> : <ChevronRight className="w-4 h-4 text-white" />}
                </button>

                {isExpanded && (
                  <div className="divide-y divide-gray-50">
                    {subjectPlans.map(plan => (
                      <div key={plan.id} className="px-5 py-4 flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400">{plan.topic_unit} • {plan.year_group_code}</p>
                          <p className="font-semibold text-sm" style={{ color: '#062850' }}>{plan.topic_name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor: plan.is_auto_generated ? '#FFF8F0' : '#F0FDF4',
                                color: plan.is_auto_generated ? '#F59E0B' : '#16A34A',
                              }}>
                              {plan.is_auto_generated ? 'Auto-generated' : 'Edited by Principal'}
                            </span>
                            <span className="text-xs text-gray-400">{plan.duration_minutes} mins</span>
                          </div>
                        </div>
                        <Button onClick={() => setEditingPlan({ ...plan })}
                          variant="outline"
                          className="flex items-center gap-1 rounded-xl text-xs px-3">
                          <Edit3 className="w-3 h-3" /> Edit
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Edit modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(6,40,80,0.7)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
              <div>
                <p className="text-xs text-gray-500">{editingPlan.topic_unit} • {editingPlan.year_group_code}</p>
                <h2 className="font-bold text-lg" style={{ color: '#062850' }}>{editingPlan.topic_name}</h2>
              </div>
              <button onClick={() => setEditingPlan(null)} className="p-2 rounded-xl hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Duration (minutes)</label>
                <input type="number" value={editingPlan.duration_minutes}
                  onChange={e => setEditingPlan({ ...editingPlan, duration_minutes: Number(e.target.value) })}
                  className={inputCls} />
              </div>
              {[
                { key: 'starter_activity', label: '🚀 Starter Activity (5 mins)' },
                { key: 'main_teaching', label: '📚 Main Teaching (20 mins)' },
                { key: 'practice_activity', label: '✏️ Practice Activity (15 mins)' },
                { key: 'plenary', label: '🎓 Plenary / Wrap-up (5 mins)' },
                { key: 'differentiation', label: '🎨 Differentiation' },
                { key: 'assessment_criteria', label: '✅ Assessment Criteria' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">{field.label}</label>
                  <textarea rows={3}
                    value={editingPlan[field.key as keyof LessonPlan] as string || ''}
                    onChange={e => setEditingPlan({ ...editingPlan, [field.key]: e.target.value })}
                    className={inputCls + ' resize-none'} />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <Button onClick={savePlan} disabled={saving}
                  className="flex-1 text-white rounded-xl"
                  style={{ backgroundColor: '#062850' }}>
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving...</>
                    : saved ? <><CheckCircle className="w-4 h-4 mr-2" />Saved!</>
                    : <><Save className="w-4 h-4 mr-2" />Save Changes</>}
                </Button>
                <Button variant="outline" onClick={() => setEditingPlan(null)} className="rounded-xl px-6">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
