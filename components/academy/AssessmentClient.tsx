'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, AlertCircle, ChevronRight, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const SUBJECT_MAP: Record<string, string> = {
  ENG: 'English Language', MATH: 'Mathematics', SCI: 'Science',
  COMP: 'Computing', HIST: 'History', GEO: 'Geography',
  ART: 'Creative Arts', MUS: 'Music', PE: 'Physical Education',
  NHC: 'Nigerian History & Culture', REL: 'Religious Studies',
  BTECH: 'Basic Technology', BIO: 'Biology', CHEM: 'Chemistry',
  PHY: 'Physics', ECON: 'Economics', GOV: 'Government / Politics',
  ENGLIT: 'English Literature',
}

type Question = {
  id: string
  subject_code: string
  question_type: 'mcq' | 'written'
  question_text: string
  options: string[] | null
  difficulty: string
}

interface Props {
  assessmentId: string
  childName: string
  yearGroupLabel: string
  subjects: string[]
}

export default function AssessmentClient({ assessmentId, childName, yearGroupLabel, subjects }: Props) {
  const [stage, setStage] = useState<'intro' | 'loading' | 'test' | 'submitting'>('intro')
  const [questions, setQuestions] = useState<Question[]>([])
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [error, setError] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  const handleSubmit = useCallback(async (auto = false) => {
    if (timerRef.current) clearInterval(timerRef.current)
    setStage('submitting')
    const formattedResponses = questions.map(q => ({
      question_id: q.id,
      subject_code: q.subject_code,
      response: responses[q.id] || '',
    }))
    try {
      const res = await fetch('/api/academy/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessment_id: assessmentId, responses: formattedResponses, auto_submitted: auto }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push('/dashboard/academy/assessment/results?assessment_id=' + assessmentId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
      setStage('test')
    }
  }, [questions, responses, assessmentId, router])

  useEffect(() => {
    if (stage !== 'test' || timeLeft <= 0) return
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); handleSubmit(true); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [stage, handleSubmit])

  async function startAssessment() {
    setStage('loading'); setError('')
    try {
      const res = await fetch('/api/academy/assessment/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessment_id: assessmentId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setQuestions(data.questions)
      setTimeLeft((data.total_minutes || 30) * 60)
      setStage('test')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assessment')
      setStage('intro')
    }
  }

  const currentQuestion = questions[currentIndex]
  const answeredCount = Object.keys(responses).length
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const timeCritical = timeLeft < 60
  const timeWarning = timeLeft < 300

  if (stage === 'intro') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#F0F6FB' }}>
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6" style={{ backgroundColor: '#062850' }}>
              <h1 className="text-xl font-bold text-white mb-1">Baseline Assessment</h1>
              <p className="text-blue-300 text-sm">{childName} — {yearGroupLabel}</p>
            </div>
            <div className="px-8 py-8">
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
              <div className="space-y-4 mb-8">
                {[
                  { icon: '📚', title: 'Subjects', desc: subjects.map(s => SUBJECT_MAP[s] || s).join(', ') },
                  { icon: '❓', title: 'Questions', desc: '10 questions per subject (7 multiple choice + 3 written)' },
                  { icon: '⏱️', title: 'Time Limit', desc: `${subjects.length * 30} minutes total (30 minutes per subject)` },
                  { icon: '🎯', title: 'Purpose', desc: 'This helps us understand your current level so we can teach you most effectively.' },
                  { icon: '⚠️', title: 'Important', desc: 'You cannot pause or restart once you begin. The assessment auto-submits when time runs out.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: '#F0F6FB' }}>
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#062850' }}>{item.title}</p>
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-3 mb-6 p-4 rounded-xl border-2" style={{ borderColor: '#497296', backgroundColor: '#EBF4FF' }}>
                <input type="checkbox" id="confirm" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5 flex-shrink-0 w-4 h-4 cursor-pointer" />
                <label htmlFor="confirm" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
                  I understand that I cannot pause or restart this assessment, and that it will auto-submit when the timer runs out.
                </label>
              </div>
              <Button onClick={startAssessment} disabled={!confirmed}
                className="w-full py-4 text-white font-bold text-base rounded-xl"
                style={{ backgroundColor: confirmed ? '#062850' : '#9CA3AF' }}>
                Start Assessment
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (stage === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F0F6FB' }}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#497296' }} />
          <p className="text-gray-600 font-medium">Loading your assessment...</p>
        </div>
      </div>
    )
  }

  if (stage === 'submitting') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F0F6FB' }}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#16A34A' }} />
          <p className="text-gray-600 font-medium">Grading your assessment...</p>
        </div>
      </div>
    )
  }

  if (stage === 'test' && currentQuestion) {
    const subjectQuestions = questions.filter(q => q.subject_code === currentQuestion.subject_code)
    const subjectIndex = subjectQuestions.findIndex(q => q.id === currentQuestion.id)

    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0F6FB' }}>
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Question {currentIndex + 1} of {questions.length}</p>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%`, backgroundColor: '#497296' }} />
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg flex-shrink-0"
              style={{
                backgroundColor: timeCritical ? '#FEF2F2' : timeWarning ? '#FFF8F0' : '#F0F6FB',
                color: timeCritical ? '#DC2626' : timeWarning ? '#F59E0B' : '#062850',
              }}>
              <Clock className="w-5 h-5" />
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full text-white" style={{ backgroundColor: '#497296' }}>
              {SUBJECT_MAP[currentQuestion.subject_code] || currentQuestion.subject_code}
            </span>
            <span className="text-xs text-gray-400">Q{subjectIndex + 1} of {subjectQuestions.length}</span>
            <span className="text-xs px-2 py-1 rounded-full capitalize"
              style={{
                backgroundColor: currentQuestion.difficulty === 'easy' ? '#F0FDF4' : currentQuestion.difficulty === 'hard' ? '#FEF2F2' : '#FFF8F0',
                color: currentQuestion.difficulty === 'easy' ? '#16A34A' : currentQuestion.difficulty === 'hard' ? '#DC2626' : '#F59E0B',
              }}>
              {currentQuestion.difficulty}
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
            <p className="text-base font-semibold leading-relaxed mb-6" style={{ color: '#062850' }}>
              {currentQuestion.question_text}
            </p>

            {currentQuestion.question_type === 'mcq' && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  const letter = ['A', 'B', 'C', 'D'][idx]
                  const selected = responses[currentQuestion.id] === option
                  return (
                    <button key={idx} onClick={() => setResponses(prev => ({ ...prev, [currentQuestion.id]: option }))}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all"
                      style={{ borderColor: selected ? '#062850' : '#E5E7EB', backgroundColor: selected ? '#EBF4FF' : '#ffffff' }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ backgroundColor: selected ? '#062850' : '#F0F6FB', color: selected ? '#ffffff' : '#497296' }}>
                        {letter}
                      </div>
                      <span className="text-sm" style={{ color: '#062850' }}>{option}</span>
                      {selected && <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />}
                    </button>
                  )
                })}
              </div>
            )}

            {currentQuestion.question_type === 'written' && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Write your answer below:</p>
                <textarea
                  value={responses[currentQuestion.id] || ''}
                  onChange={(e) => setResponses(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#497296] transition-all resize-none"
                  placeholder="Type your answer here..."
                  style={{ color: '#062850' }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <Button variant="outline" onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0} className="rounded-xl px-6">
              Previous
            </Button>
            <p className="text-xs text-gray-400">{answeredCount} of {questions.length} answered</p>
            {currentIndex < questions.length - 1 ? (
              <Button onClick={() => setCurrentIndex(prev => prev + 1)}
                className="flex items-center gap-2 text-white rounded-xl px-6" style={{ backgroundColor: '#062850' }}>
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={() => handleSubmit(false)}
                className="flex items-center gap-2 text-white rounded-xl px-6" style={{ backgroundColor: '#16A34A' }}>
                <CheckCircle className="w-4 h-4" /> Submit Assessment
              </Button>
            )}
          </div>

          <div className="mt-8 p-4 rounded-xl" style={{ backgroundColor: '#F0F6FB' }}>
            <p className="text-xs font-semibold text-gray-500 mb-3">Question Overview</p>
            <div className="flex flex-wrap gap-2">
              {questions.map((q, idx) => (
                <button key={q.id} onClick={() => setCurrentIndex(idx)}
                  className="w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all"
                  style={{
                    backgroundColor: idx === currentIndex ? '#062850' : responses[q.id] ? '#16A34A' : '#E5E7EB',
                    color: idx === currentIndex || responses[q.id] ? '#ffffff' : '#6B7280',
                  }}>
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}
