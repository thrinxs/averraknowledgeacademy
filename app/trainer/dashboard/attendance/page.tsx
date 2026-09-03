'use client'

import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, XCircle, Clock, Loader2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Child {
  id: string
  full_name: string
  year_group_label: string
  subjects: string[]
  enrollment_id: string
}

interface AttendanceRecord {
  child_id: string
  subject_code: string
  status: string
}

const SUBJECT_MAP: Record<string, string> = {
  ENG: 'English Language', MATH: 'Mathematics', SCI: 'Science',
  COMP: 'Computing', HIST: 'History', GEO: 'Geography',
  ART: 'Creative Arts', MUS: 'Music', PE: 'Physical Education',
}

export default function TrainerAttendancePage() {
  const [mounted, setMounted] = useState(false)
  const [children, setChildren] = useState<Child[]>([])
  const [attendance, setAttendance] = useState<Record<string, Record<string, string>>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const today = new Date().toISOString().split('T')[0]
  const todayDisplay = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  const loadData = useCallback(async () => {
    try {
      const [childrenRes, attendanceRes] = await Promise.all([
        fetch('/api/academy/students?role=trainer'),
        fetch(`/api/academy/attendance?date=${today}`),
      ])
      const childrenData = await childrenRes.json()
      const attendanceData = await attendanceRes.json()

      setChildren(childrenData.children || [])

      // Build attendance map
      const map: Record<string, Record<string, string>> = {}
      for (const rec of attendanceData.attendance || []) {
        if (!map[rec.child_id]) map[rec.child_id] = {}
        map[rec.child_id][rec.subject_code] = rec.status
      }
      setAttendance(map)
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }, [today])

  useEffect(() => { setMounted(true); loadData() }, [loadData])

  async function markAttendance(child: Child, subjectCode: string, status: string) {
    const key = `${child.id}-${subjectCode}`
    setSaving(key)
    try {
      await fetch('/api/academy/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          child_id: child.id,
          enrollment_id: child.enrollment_id,
          subject_code: subjectCode,
          status,
          class_date: today,
        }),
      })
      setAttendance(prev => ({
        ...prev,
        [child.id]: { ...(prev[child.id] || {}), [subjectCode]: status },
      }))
      setSaved(prev => [...prev, key])
      setTimeout(() => setSaved(prev => prev.filter(k => k !== key)), 2000)
    } catch (err) {
      console.error('Failed to mark attendance:', err)
    } finally {
      setSaving(null)
    }
  }

  if (!mounted || loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#497296' }} />
    </div>
  )

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#062850' }}>
          Attendance
        </h1>
        <p className="text-gray-500 text-sm">{todayDisplay}</p>
      </div>

      {children.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Users className="w-10 h-10 mx-auto mb-3" style={{ color: '#D1D5DB' }} />
          <p className="text-gray-500">No students assigned yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {children.map(child => (
            <div key={child.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between"
                style={{ backgroundColor: '#062850' }}>
                <div>
                  <p className="font-bold text-white">{child.full_name}</p>
                  <p className="text-blue-300 text-xs">{child.year_group_label}</p>
                </div>
              </div>
              <div className="p-5 space-y-3">
                {(child.subjects || []).map(subjectCode => {
                  const key = `${child.id}-${subjectCode}`
                  const currentStatus = attendance[child.id]?.[subjectCode]
                  const isSaving = saving === key
                  const isSaved = saved.includes(key)

                  return (
                    <div key={subjectCode} className="flex items-center justify-between gap-4 p-3 rounded-xl"
                      style={{ backgroundColor: '#F0F6FB' }}>
                      <p className="text-sm font-semibold" style={{ color: '#062850' }}>
                        {SUBJECT_MAP[subjectCode] || subjectCode}
                      </p>
                      <div className="flex items-center gap-2">
                        {isSaved && <CheckCircle className="w-4 h-4 text-green-500" />}
                        {(['present', 'late', 'absent'] as const).map(status => (
                          <button key={status}
                            onClick={() => markAttendance(child, subjectCode, status)}
                            disabled={isSaving}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                            style={{
                              backgroundColor: currentStatus === status
                                ? status === 'present' ? '#16A34A'
                                : status === 'late' ? '#F59E0B' : '#DC2626'
                                : '#ffffff',
                              color: currentStatus === status ? '#ffffff' : '#6B7280',
                              border: `1px solid ${currentStatus === status
                                ? status === 'present' ? '#16A34A'
                                : status === 'late' ? '#F59E0B' : '#DC2626'
                                : '#E5E7EB'}`,
                            }}>
                            {isSaving ? <Loader2 className="w-3 h-3 animate-spin" />
                              : status === 'present' ? <><CheckCircle className="w-3 h-3" />Present</>
                              : status === 'late' ? <><Clock className="w-3 h-3" />Late</>
                              : <><XCircle className="w-3 h-3" />Absent</>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
