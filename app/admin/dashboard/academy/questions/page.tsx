'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Plus, Trash2, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SUBJECT_MAP: Record<string, string> = {
  ENG: 'English Language', MATH: 'Mathematics', SCI: 'Science',
  COMP: 'Computing', HIST: 'History', GEO: 'Geography',
  ART: 'Creative Arts', MUS: 'Music', PE: 'Physical Education',
  NHC: 'Nigerian History & Culture', REL: 'Religious Studies',
  BTECH: 'Basic Technology', BIO: 'Biology', CHEM: 'Chemistry',
  PHY: 'Physics', ECON: 'Economics', GOV: 'Government / Politics',
  ENGLIT: 'English Literature',
}

const YEAR_GROUPS = [
  'Y1','Y2','Y3','Y4','Y5','Y6','Y7','Y8','Y9','Y10','Y11','Y12','Y13',
  'SS1','SS2','SS3','P1','P2','P3','P4','P5','P6',
]

type Question = {
  id: string
  subject_code: string
  year_group_code: string
  question_type: string
  question_text: string
  options: string[] | null
  correct_answer: string
  keywords: string[] | null
  difficulty: string
  is_active: boolean
}

const inputCls = 'w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#497296] transition-all'

const EMPTY_FORM = {
  subject_code: '',
  year_group_code: '',
  question_type: 'mcq' as 'mcq' | 'written',
  question_text: '',
  option_a: '', option_b: '', option_c: '', option_d: '',
  correct_answer: '',
  keywords: '',
  difficulty: 'medium',
}

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [filterSubject, setFilterSubject] = useState('')
  const [filterYear, setFilterYear] = useState('')
  const [filterType, setFilterType] = useState('')

  const loadQuestions = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('assessment_questions').select('*').order('created_at', { ascending: false })
    if (filterSubject) query = query.eq('subject_code', filterSubject)
    if (filterYear) query = query.eq('year_group_code', filterYear)
    if (filterType) query = query.eq('question_type', filterType)
    const { data } = await query
    setQuestions(data || [])
    setLoading(false)
  }, [filterSubject, filterYear, filterType])

  useEffect(() => { loadQuestions() }, [loadQuestions])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setError(''); setSaving(true)
    const options = form.question_type === 'mcq'
      ? [form.option_a, form.option_b, form.option_c, form.option_d].filter(Boolean)
      : null
    const keywords = form.question_type === 'written' && form.keywords
      ? form.keywords.split(',').map(k => k.trim()).filter(Boolean)
      : null
    const { error: saveError } = await supabase.from('assessment_questions').insert({
      subject_code: form.subject_code,
      year_group_code: form.year_group_code,
      question_type: form.question_type,
      question_text: form.question_text,
      options, correct_answer: form.correct_answer,
      keywords, difficulty: form.difficulty, is_active: true,
    })
    if (saveError) { setError(saveError.message) }
    else {
      setSuccess('Question added successfully')
      setForm(EMPTY_FORM); setShowForm(false); loadQuestions()
      setTimeout(() => setSuccess(''), 3000)
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this question?')) return
    await supabase.from('assessment_questions').delete().eq('id', id)
    loadQuestions()
  }

  async function handleToggleActive(id: string, current: boolean) {
    await supabase.from('assessment_questions').update({ is_active: !current }).eq('id', id)
    loadQuestions()
  }

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>Assessment Question Bank</h1>
          <p className="text-gray-500 text-sm">Add and manage questions for learner baseline assessments.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 text-white rounded-xl" style={{ backgroundColor: '#062850' }}>
          <Plus className="w-4 h-4" /> Add Question
        </Button>
      </div>

      {success && (
        <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <p className="text-green-700 text-sm">{success}</p>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-bold text-lg mb-5" style={{ color: '#062850' }}>New Question</h2>
          <form onSubmit={handleSave} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Subject *</label>
                <select value={form.subject_code} onChange={(e) => setForm({...form, subject_code: e.target.value})} className={inputCls} required>
                  <option value="">Select subject</option>
                  {Object.entries(SUBJECT_MAP).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Year Group *</label>
                <select value={form.year_group_code} onChange={(e) => setForm({...form, year_group_code: e.target.value})} className={inputCls} required>
                  <option value="">Select year</option>
                  {YEAR_GROUPS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Type *</label>
                <select value={form.question_type} onChange={(e) => setForm({...form, question_type: e.target.value as 'mcq' | 'written', correct_answer: '', option_a: '', option_b: '', option_c: '', option_d: ''})} className={inputCls}>
                  <option value="mcq">Multiple Choice (MCQ)</option>
                  <option value="written">Written Answer</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Difficulty *</label>
                <select value={form.difficulty} onChange={(e) => setForm({...form, difficulty: e.target.value})} className={inputCls}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Question Text *</label>
              <textarea value={form.question_text} onChange={(e) => setForm({...form, question_text: e.target.value})} rows={3} className={inputCls + ' resize-none'} placeholder="Enter the question..." required />
            </div>
            {form.question_type === 'mcq' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['a','b','c','d'].map((letter) => (
                    <div key={letter}>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Option {letter.toUpperCase()} *</label>
                      <input value={(form as Record<string, string>)[`option_${letter}`]} onChange={(e) => setForm({...form, [`option_${letter}`]: e.target.value})} className={inputCls} placeholder={`Option ${letter.toUpperCase()}`} required />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Correct Answer *</label>
                  <select value={form.correct_answer} onChange={(e) => setForm({...form, correct_answer: e.target.value})} className={inputCls} required>
                    <option value="">Select correct option</option>
                    {form.option_a && <option value={form.option_a}>A: {form.option_a}</option>}
                    {form.option_b && <option value={form.option_b}>B: {form.option_b}</option>}
                    {form.option_c && <option value={form.option_c}>C: {form.option_c}</option>}
                    {form.option_d && <option value={form.option_d}>D: {form.option_d}</option>}
                  </select>
                </div>
              </>
            )}
            {form.question_type === 'written' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Model Answer *</label>
                  <textarea value={form.correct_answer} onChange={(e) => setForm({...form, correct_answer: e.target.value})} rows={2} className={inputCls + ' resize-none'} placeholder="The expected correct answer..." required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Keywords <span className="text-gray-400 font-normal">(comma separated)</span></label>
                  <input value={form.keywords} onChange={(e) => setForm({...form, keywords: e.target.value})} className={inputCls} placeholder="e.g. photosynthesis, sunlight, chlorophyll, glucose" />
                </div>
              </>
            )}
            <div className="flex gap-3">
              <Button type="submit" disabled={saving} className="flex items-center gap-2 text-white rounded-xl px-8" style={{ backgroundColor: '#062850' }}>
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><Plus className="w-4 h-4" />Add Question</>}
              </Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setError('') }} className="rounded-xl">Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex flex-wrap gap-4">
        <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className={inputCls + ' max-w-48'}>
          <option value="">All Subjects</option>
          {Object.entries(SUBJECT_MAP).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className={inputCls + ' max-w-36'}>
          <option value="">All Year Groups</option>
          {YEAR_GROUPS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={inputCls + ' max-w-36'}>
          <option value="">All Types</option>
          <option value="mcq">MCQ</option>
          <option value="written">Written</option>
        </select>
        <Button onClick={loadQuestions} variant="outline" className="rounded-xl">Apply Filters</Button>
        <p className="text-sm text-gray-500 flex items-center ml-auto">{questions.length} question{questions.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#497296' }} />
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No questions yet. Add your first question above.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {questions.map((q) => (
              <div key={q.id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs font-bold px-2 py-1 rounded-full text-white" style={{ backgroundColor: '#497296' }}>{SUBJECT_MAP[q.subject_code] || q.subject_code}</span>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">{q.year_group_code}</span>
                      <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: q.question_type === 'mcq' ? '#EBF4FF' : '#F0FDF4', color: q.question_type === 'mcq' ? '#497296' : '#16A34A' }}>{q.question_type === 'mcq' ? 'MCQ' : 'Written'}</span>
                      <span className="text-xs capitalize px-2 py-1 rounded-full" style={{ backgroundColor: q.difficulty === 'easy' ? '#F0FDF4' : q.difficulty === 'hard' ? '#FEF2F2' : '#FFF8F0', color: q.difficulty === 'easy' ? '#16A34A' : q.difficulty === 'hard' ? '#DC2626' : '#F59E0B' }}>{q.difficulty}</span>
                      {!q.is_active && <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-400">Inactive</span>}
                    </div>
                    <p className="text-sm font-medium leading-relaxed" style={{ color: '#062850' }}>{q.question_text}</p>
                    {q.question_type === 'mcq' && q.options && (
                      <p className="text-xs text-gray-400 mt-1">Options: {(q.options as string[]).join(' | ')} → Correct: <strong>{q.correct_answer}</strong></p>
                    )}
                    {q.question_type === 'written' && q.keywords && (
                      <p className="text-xs text-gray-400 mt-1">Keywords: {(q.keywords as string[]).join(', ')}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => handleToggleActive(q.id, q.is_active)} className="text-xs px-3 py-1.5 rounded-xl border transition-colors"
                      style={{ borderColor: q.is_active ? '#16A34A' : '#D1D5DB', color: q.is_active ? '#16A34A' : '#9CA3AF' }}>
                      {q.is_active ? 'Active' : 'Inactive'}
                    </button>
                    <button onClick={() => handleDelete(q.id)} className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
