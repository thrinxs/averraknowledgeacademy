'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Loader2, BookOpen, Star, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Question {
  id: number
  type: 'mcq' | 'written' | 'truefalse'
  question: string
  options?: string[]
  correct_answer: string
  marks: number
}

interface Classwork {
  id: string
  subject_code: string
  topic_name: string
  title: string
  questions: Question[]
  status: string
  score: number | null
  max_score: number
  assigned_date: string
}

interface Child {
  id: string
  full_name: string
}

interface Props {
  childId: string
  childName: string
  yearGroupLabel: string
  subjects: string[]
  classworks: Classwork[]
  date: string
  children: Child[]
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

const SUBJECT_COLORS: Record<string, { bg: string; text: string; emoji: string }> = {
  ENG: { bg: '#EBF4FF', text: '#1D4ED8', emoji: '📖' },
  MATH: { bg: '#F0FDF4', text: '#16A34A', emoji: '🔢' },
  SCI: { bg: '#F5F3FF', text: '#7C3AED', emoji: '🔬' },
  COMP: { bg: '#FFF8F0', text: '#D97706', emoji: '💻' },
  HIST: { bg: '#FEF2F2', text: '#DC2626', emoji: '📜' },
  GEO: { bg: '#F0FDF4', text: '#059669', emoji: '🌍' },
}

function getSubjectStyle(code: string) {
  return SUBJECT_COLORS[code] || { bg: '#F0F6FB', text: '#497296', emoji: '📚' }
}

export default function ClassworkClient({
  childId, childName, yearGroupLabel, subjects, classworks, date, children,
}: Props) {
  const [selectedClasswork, setSelectedClasswork] = useState<Classwork | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ score: number; max: number; percentage: number } | null>(null)
  const [generating, setGenerating] = useState<string | null>(null)
  const [error, setError] = useState('')
  const router = useRouter()

  const today = new Date(date).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  async function generateClasswork(subjectCode: string) {
    setGenerating(subjectCode)
    setError('')
    try {
      const res = await fetch('/api/academy/classwork/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_id: childId, subject_code: subjectCode, date }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate classwork')
    } finally {
      setGenerating(null)
    }
  }

  async function handleSubmit() {
    if (!selectedClasswork) return
    setSubmitting(true)
    setError('')
    try {
      const responses = Object.entries(answers).map(([qId, answer]) => ({
        question_id: Number(qId),
        answer,
      }))
      const res = await fetch('/api/academy/classwork/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classwork_id: selectedClasswork.id, responses }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult({ score: data.score, max: data.max_score, percentage: data.percentage })
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Result screen ─────────────────────────────────────────────────────────
  if (result) {
    const stars = result.percentage >= 80 ? 3 : result.percentage >= 50 ? 2 : 1
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{ backgroundColor: '#F0F6FB' }}>
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="text-6xl mb-4">
              {result.percentage >= 80 ? '🌟' : result.percentage >= 50 ? '😊' : '💪'}
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#062850' }}>
              {result.percentage >= 80 ? 'Amazing work!' : result.percentage >= 50 ? 'Good effort!' : 'Keep practising!'}
            </h2>
            <p className="text-gray-500 mb-6">You scored:</p>

            <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4 border-8"
              style={{
                borderColor: result.percentage >= 80 ? '#16A34A' : result.percentage >= 50 ? '#F59E0B' : '#DC2626',
                backgroundColor: result.percentage >= 80 ? '#F0FDF4' : result.percentage >= 50 ? '#FFF8F0' : '#FEF2F2',
              }}>
              <div>
                <p className="text-3xl font-bold" style={{ color: '#062850' }}>{result.score}</p>
                <p className="text-xs text-gray-500">out of {result.max}</p>
              </div>
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3].map(s => (
                <Star key={s} className="w-8 h-8"
                  fill={s <= stars ? '#F59E0B' : 'none'}
                  stroke={s <= stars ? '#F59E0B' : '#D1D5DB'} />
              ))}
            </div>

            <p className="text-sm text-gray-500 mb-6">
              {result.percentage >= 80
                ? 'Excellent! Your teacher will review your written answers.'
                : result.percentage >= 50
                ? 'Well done! Keep up the good work.'
                : 'Do not worry — keep practising and you will improve!'}
            </p>

            <Button onClick={() => { setSelectedClasswork(null); setResult(null); setAnswers({}) }}
              className="w-full py-3 text-white font-bold rounded-2xl"
              style={{ backgroundColor: '#062850' }}>
              Back to Classwork
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ── Question screen ───────────────────────────────────────────────────────
  if (selectedClasswork) {
    const questions = selectedClasswork.questions || []
    const q = questions[currentQuestion]
    const isLast = currentQuestion >= questions.length - 1
    const answeredAll = questions.every(q => answers[q.id])
    const style = getSubjectStyle(selectedClasswork.subject_code)

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F0F6FB' }}>

        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <button onClick={() => { setSelectedClasswork(null); setAnswers({}) }}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
            <div className="flex-1">
              <p className="text-xs text-gray-500">{SUBJECT_NAMES[selectedClasswork.subject_code]}</p>
              <p className="text-sm font-bold truncate" style={{ color: '#062850' }}>
                {selectedClasswork.topic_name}
              </p>
            </div>
            <span className="text-xs font-semibold text-gray-500">
              {currentQuestion + 1}/{questions.length}
            </span>
          </div>

          {/* Progress dots */}
          <div className="max-w-lg mx-auto flex gap-1.5 mt-2 px-12">
            {questions.map((_, i) => (
              <div key={i} className="flex-1 h-1.5 rounded-full transition-all"
                style={{
                  backgroundColor: i < currentQuestion
                    ? '#16A34A'
                    : i === currentQuestion
                    ? '#062850'
                    : answers[questions[i].id]
                    ? '#86EFAC'
                    : '#E5E7EB',
                }} />
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="max-w-lg mx-auto px-4 py-8">

          {/* Subject badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-6"
            style={{ backgroundColor: style.bg, color: style.text }}>
            <span>{style.emoji}</span>
            <span>Question {currentQuestion + 1}</span>
          </div>

          {/* Question card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
            <p className="text-lg font-semibold leading-relaxed mb-6" style={{ color: '#062850' }}>
              {q.question}
            </p>

            {/* MCQ / True-False options */}
            {(q.type === 'mcq' || q.type === 'truefalse') && q.options && (
              <div className="space-y-3">
                {q.options.map((option, idx) => {
                  const letters = ['A', 'B', 'C', 'D']
                  const isSelected = answers[q.id] === option
                  return (
                    <button key={idx} onClick={() => setAnswers(prev => ({ ...prev, [q.id]: option }))}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all active:scale-98"
                      style={{
                        borderColor: isSelected ? '#062850' : '#E5E7EB',
                        backgroundColor: isSelected ? '#EBF4FF' : '#FAFAFA',
                      }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{
                          backgroundColor: isSelected ? '#062850' : '#F0F6FB',
                          color: isSelected ? '#ffffff' : '#497296',
                        }}>
                        {q.type === 'truefalse' ? option : letters[idx]}
                      </div>
                      <span className="text-sm font-medium" style={{ color: '#062850' }}>{option}</span>
                      {isSelected && <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Written answer */}
            {q.type === 'written' && (
              <div>
                <p className="text-xs text-gray-500 mb-2">✏️ Write your answer here:</p>
                <textarea
                  value={answers[q.id] || ''}
                  onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                  rows={5}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-sm focus:outline-none focus:border-[#062850] transition-all resize-none"
                  placeholder="Type your answer here..."
                  style={{ color: '#062850' }}
                />
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3">
            {currentQuestion > 0 && (
              <Button variant="outline" onClick={() => setCurrentQuestion(prev => prev - 1)}
                className="flex items-center gap-2 rounded-2xl px-6">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            )}

            {!isLast ? (
              <Button onClick={() => setCurrentQuestion(prev => prev + 1)}
                disabled={!answers[q.id]}
                className="flex-1 flex items-center justify-center gap-2 text-white font-bold rounded-2xl py-3"
                style={{ backgroundColor: answers[q.id] ? '#062850' : '#D1D5DB' }}>
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit}
                disabled={!answeredAll || submitting}
                className="flex-1 flex items-center justify-center gap-2 text-white font-bold rounded-2xl py-3"
                style={{ backgroundColor: answeredAll ? '#16A34A' : '#D1D5DB' }}>
                {submitting
                  ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting...</>
                  : <><CheckCircle className="w-4 h-4" />Submit Classwork</>}
              </Button>
            )}
          </div>

          {/* Answer overview dots */}
          <div className="mt-6 flex justify-center gap-2 flex-wrap">
            {questions.map((qItem, i) => (
              <button key={i} onClick={() => setCurrentQuestion(i)}
                className="w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all"
                style={{
                  backgroundColor: i === currentQuestion ? '#062850' : answers[qItem.id] ? '#16A34A' : '#E5E7EB',
                  color: i === currentQuestion || answers[qItem.id] ? '#ffffff' : '#9CA3AF',
                }}>
                {i + 1}
              </button>
            ))}
          </div>

        </div>
      </div>
    )
  }

  // ── Main classwork list ───────────────────────────────────────────────────
  return (
    <div className="p-6 md:p-10">

      {/* Child selector */}
      {children.length > 1 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {children.map(child => (
            <a key={child.id}
              href={`/dashboard/academy/classwork?child_id=${child.id}&date=${date}`}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                backgroundColor: child.id === childId ? '#062850' : '#F0F6FB',
                color: child.id === childId ? '#ffffff' : '#497296',
              }}>
              {child.full_name}
            </a>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#062850' }}>
          📚 Today's Classwork
        </h1>
        <p className="text-gray-500 text-sm">
          {childName} — {yearGroupLabel} — {today}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Classwork cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {subjects.map(subjectCode => {
          const cw = classworks.find(c => c.subject_code === subjectCode)
          const style = getSubjectStyle(subjectCode)
          const isCompleted = cw?.status === 'submitted'
          const percentage = cw && cw.max_score > 0
            ? Math.round(((cw.score || 0) / cw.max_score) * 100)
            : null

          return (
            <div key={subjectCode}
              className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm transition-all hover:shadow-md">

              {/* Card header */}
              <div className="p-5" style={{ backgroundColor: style.bg }}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{style.emoji}</span>
                  <div>
                    <p className="font-bold" style={{ color: style.text }}>
                      {SUBJECT_NAMES[subjectCode] || subjectCode}
                    </p>
                    {cw && (
                      <p className="text-xs mt-0.5" style={{ color: style.text, opacity: 0.7 }}>
                        {cw.topic_name}
                      </p>
                    )}
                  </div>
                  {isCompleted && (
                    <div className="ml-auto">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5">
                {!cw ? (
                  /* No classwork yet */
                  <div className="text-center py-4">
                    <BookOpen className="w-8 h-8 mx-auto mb-2" style={{ color: '#D1D5DB' }} />
                    <p className="text-sm text-gray-400 mb-4">No classwork yet</p>
                    <Button onClick={() => generateClasswork(subjectCode)}
                      disabled={generating === subjectCode}
                      className="w-full text-white rounded-2xl py-2.5"
                      style={{ backgroundColor: style.text }}>
                      {generating === subjectCode
                        ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Generating...</>
                        : '✨ Generate Classwork'}
                    </Button>
                  </div>
                ) : isCompleted ? (
                  /* Completed */
                  <div className="text-center py-2">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      {[1, 2, 3].map(s => {
                        const stars = percentage && percentage >= 80 ? 3 : percentage && percentage >= 50 ? 2 : 1
                        return (
                          <Star key={s} className="w-6 h-6"
                            fill={s <= stars ? '#F59E0B' : 'none'}
                            stroke={s <= stars ? '#F59E0B' : '#D1D5DB'} />
                        )
                      })}
                    </div>
                    <p className="text-2xl font-bold mb-1" style={{ color: '#062850' }}>
                      {cw.score}/{cw.max_score}
                    </p>
                    <p className="text-sm text-gray-500">{percentage}% — Well done!</p>
                  </div>
                ) : (
                  /* Ready to start */
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-semibold">{cw.questions?.length || 0}</span> questions
                    </p>
                    <p className="text-xs text-gray-400 mb-4">{cw.title}</p>
                    <Button onClick={() => { setSelectedClasswork(cw); setCurrentQuestion(0); setAnswers({}) }}
                      className="w-full text-white font-bold rounded-2xl py-3"
                      style={{ backgroundColor: style.text }}>
                      Start Classwork →
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Motivational message */}
      <div className="rounded-3xl p-6 text-center" style={{ backgroundColor: '#062850' }}>
        <p className="text-2xl mb-2">🎯</p>
        <p className="text-white font-bold mb-1">Keep it up, {childName.split(' ')[0]}!</p>
        <p className="text-blue-300 text-sm">Complete your classwork every day to become a star student.</p>
      </div>

    </div>
  )
}
