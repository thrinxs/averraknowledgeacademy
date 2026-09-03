'use client'

import { useState, useEffect, useCallback } from 'react'
import { Star, Loader2, Plus, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Child { id: string; full_name: string; year_group_label: string; subjects: string[] }

const SUBJECT_MAP: Record<string, string> = {
  ENG: 'English Language', MATH: 'Mathematics', SCI: 'Science',
  COMP: 'Computing', HIST: 'History', GEO: 'Geography',
}

export default function TrainerTestsPage() {
  const [mounted, setMounted] = useState(false)
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState<string | null>(null)
  const [generated, setGenerated] = useState<string[]>([])
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    const res = await fetch('/api/academy/students')
    if (res.ok) {
      const data = await res.json()
      setChildren(data.children || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => { setMounted(true); loadData() }, [loadData])

  async function generateTest(childId: string, subjectCode: string, type: 'monthly_test' | 'quarterly_exam') {
    const key = `${childId}-${subjectCode}-${type}`
    setGenerating(key); setError('')
    try {
      const res = await fetch('/api/academy/tests/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_id: childId, subject_code: subjectCode, type }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setGenerated(prev => [...prev, key])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate test')
    } finally { setGenerating(null) }
  }

  if (!mounted || loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#497296' }} />
    </div>
  )

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>Tests & Exams</h1>
        <p className="text-gray-500 text-sm">Generate monthly tests and quarterly exams for your students.</p>
      </div>

      {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      {children.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Star className="w-10 h-10 mx-auto mb-3" style={{ color: '#D1D5DB' }} />
          <p className="text-gray-500">No students assigned yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {children.map(child => (
            <div key={child.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4" style={{ backgroundColor: '#062850' }}>
                <p className="font-bold text-white">{child.full_name}</p>
                <p className="text-blue-300 text-xs">{child.year_group_label}</p>
              </div>
              <div className="p-5">
                {child.subjects.map(subject => (
                  <div key={subject} className="mb-4 last:mb-0">
                    <p className="text-sm font-semibold mb-3" style={{ color: '#062850' }}>
                      {SUBJECT_MAP[subject] || subject}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { type: 'monthly_test' as const, label: 'Monthly Test', desc: '20 questions • 30 mins', color: '#F59E0B' },
                        { type: 'quarterly_exam' as const, label: 'Quarterly Exam', desc: '40 questions • 60 mins', color: '#DC2626' },
                      ].map(item => {
                        const key = `${child.id}-${subject}-${item.type}`
                        const isDone = generated.includes(key)
                        return (
                          <div key={item.type} className="p-4 rounded-xl border border-gray-100" style={{ backgroundColor: '#FAFAFA' }}>
                            <p className="text-xs font-bold mb-0.5" style={{ color: item.color }}>{item.label}</p>
                            <p className="text-xs text-gray-400 mb-3">{item.desc}</p>
                            {isDone ? (
                              <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                                <CheckCircle className="w-3 h-3" /> Generated!
                              </div>
                            ) : (
                              <Button onClick={() => generateTest(child.id, subject, item.type)}
                                disabled={generating === key}
                                className="w-full text-white rounded-xl text-xs py-2"
                                style={{ backgroundColor: item.color }}>
                                {generating === key
                                  ? <><Loader2 className="w-3 h-3 animate-spin mr-1" />Generating...</>
                                  : <><Plus className="w-3 h-3 mr-1" />Generate</>}
                              </Button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
