'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, CheckCircle, AlertCircle, ChevronRight, Loader2, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Question {
  id: number; type: 'mcq' | 'written' | 'truefalse'
  question: string; options?: string[]; correct_answer: string; marks: number
}

interface Props {
  testId: string; title: string; type: string
  durationMinutes: number; questions: Question[]; maxScore: number
}

export default function TestTakingClient({
  testId, title, type, durationMinutes, questions, maxScore,
}: Props) {
  const [stage, setStage] = useState<'intro' | 'test' | 'submitting' | 'result'>('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60)
  const [result, setResult] = useState<{ score: number; max: number; percentage: number; level: string } | null>(null)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = useCallback(async (auto = false) => {
    setStage('submitting')
    const responses = questions.map(q => ({
      question_id: q.id,
      answer: answers[q.id] || '',
    }))
    try {
      const res = await fetch('/api/academy/tests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test_id: testId, responses, auto_submitted: auto }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult({ score: data.score, max: data.max_score, percentage: data.percentage, level: data.level_result })
      setStage('result')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
      setStage('test')
    }
  }, [questions, answers, testId])

  useEffect(() => {
    if (stage !== 'test') return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); handleSubmit(true); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [stage, handleSubmit])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const timeCritical = timeLeft < 60
  const timeWarning = timeLeft < 300
  const q = questions[currentQ]
  const isLast = currentQ >= questions.length - 1
  const answeredCount = Object.keys(answers).length

  if (stage === 'intro') return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#F0F6FB' }}>
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6" style={{ backgroundColor: '#062850' }}>
            <h1 className="text-xl font-bold text-white mb-1">{title}</h1>
            <span className="text-xs px-2 py-1 rounded-full font-semibold text-white capitalize"
              style={{ backgroundColor: type === 'monthly_test' ? '#F59E0B' : '#DC2626' }}>
              {type === 'monthly_test' ? 'Monthly Test' : 'Quarterly Exam'}
            </span>
          </div>
          <div className="px-8 py-8">
            <div className="space-y-4 mb-8">
              {[
                { icon: '❓', label: 'Questions', value: `${questions.length} questions` },
                { icon: '⏱️', label: 'Time Limit', value: `${durationMinutes} minutes` },
                { icon: '🏆', label: 'Total Marks', value: `${maxScore} marks` },
                { icon: '⚠️', label: 'Important', value: 'The test auto-submits when time runs out' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: '#F0F6FB' }}>
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#062850' }}>{item.label}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={() => setStage('test')}
              className="w-full py-4 text-white font-bold text-base rounded-xl"
              style={{ backgroundColor: '#062850' }}>
              Begin Test
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  if (stage === 'submitting') return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F0F6FB' }}>
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#062850' }} />
        <p className="text-gray-600 font-medium">Grading your test...</p>
      </div>
    </div>
  )

  if (stage === 'result' && result) {
    const stars = result.percentage >= 70 ? 3 : result.percentage >= 40 ? 2 : 1
    const levelColor = result.level === 'advanced' ? '#16A34A' : result.level === 'intermediate' ? '#497296' : '#F59E0B'
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#F0F6FB' }}>
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="text-5xl mb-4">{result.percentage >= 70 ? '🏆' : result.percentage >= 40 ? '📈' : '💪'}</div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#062850' }}>Test Complete!</h2>
            <div className="flex justify-center gap-2 mb-4">
              {[1,2,3].map(s => <Star key={s} className="w-7 h-7" fill={s <= stars ? '#F59E0B' : 'none'} stroke={s <= stars ? '#F59E0B' : '#D1D5DB'} />)}
            </div>
            <p className="text-4xl font-bold mb-1" style={{ color: '#062850' }}>{result.score}/{result.max}</p>
            <p className="text-xl font-bold mb-3" style={{ color: levelColor }}>{result.percentage}%</p>
            <p className="text-sm font-semibold capitalize px-4 py-2 rounded-full inline-block mb-6"
              style={{ backgroundColor: `${levelColor}15`, color: levelColor }}>
              {result.level}
            </p>
            <Button onClick={() => router.push('/dashboard/academy/tests')}
              className="w-full py-3 text-white font-bold rounded-xl" style={{ backgroundColor: '#062850' }}>
              Back to Tests
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (stage === 'test' && q) return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0F6FB' }}>
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Question {currentQ + 1} of {questions.length}</p>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all"
                style={{ width: `${((currentQ + 1) / questions.length) * 100}%`, backgroundColor: '#062850' }} />
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg flex-shrink-0"
            style={{
              backgroundColor: timeCritical ? '#FEF2F2' : timeWarning ? '#FFF8F0' : '#F0F6FB',
              color: timeCritical ? '#DC2626' : timeWarning ? '#F59E0B' : '#062850',
            }}>
            <Clock className="w-5 h-5" />
            {String(minutes).padStart(2,'0')}:{String(seconds).padStart(2,'0')}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
          <p className="text-base font-semibold leading-relaxed mb-6" style={{ color: '#062850' }}>
            {q.question}
          </p>

          {(q.type === 'mcq' || q.type === 'truefalse') && q.options && (
            <div className="space-y-3">
              {q.options.map((opt, idx) => {
                const letters = ['A','B','C','D']
                const isSelected = answers[q.id] === opt
                return (
                  <button key={idx} onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all"
                    style={{ borderColor: isSelected ? '#062850' : '#E5E7EB', backgroundColor: isSelected ? '#EBF4FF' : '#FAFAFA' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: isSelected ? '#062850' : '#F0F6FB', color: isSelected ? '#ffffff' : '#497296' }}>
                      {q.type === 'truefalse' ? opt[0] : letters[idx]}
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#062850' }}>{opt}</span>
                    {isSelected && <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />}
                  </button>
                )
              })}
            </div>
          )}

          {q.type === 'written' && (
            <textarea value={answers[q.id] || ''} onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
              rows={5} placeholder="Write your answer here..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-[#062850] transition-all resize-none"
              style={{ color: '#062850' }} />
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <Button variant="outline" onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))}
            disabled={currentQ === 0} className="rounded-xl px-6">Back</Button>
          <p className="text-xs text-gray-400">{answeredCount}/{questions.length} answered</p>
          {!isLast ? (
            <Button onClick={() => setCurrentQ(prev => prev + 1)}
              className="flex items-center gap-2 text-white rounded-xl px-6" style={{ backgroundColor: '#062850' }}>
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={() => handleSubmit(false)}
              className="flex items-center gap-2 text-white rounded-xl px-6" style={{ backgroundColor: '#16A34A' }}>
              <CheckCircle className="w-4 h-4" /> Submit Test
            </Button>
          )}
        </div>

        {/* Answer grid */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {questions.map((_, i) => (
            <button key={i} onClick={() => setCurrentQ(i)}
              className="w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all"
              style={{
                backgroundColor: i === currentQ ? '#062850' : answers[questions[i].id] ? '#16A34A' : '#E5E7EB',
                color: i === currentQ || answers[questions[i].id] ? '#ffffff' : '#6B7280',
              }}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return null
}
