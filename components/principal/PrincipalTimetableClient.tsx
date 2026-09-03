'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, CheckCircle, Loader2, Edit3, User, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import TimetableBuilder, { TimetableEntry } from '@/components/admin/TimetableBuilder'

interface Child {
  id: string; full_name: string; year_group_label: string
  subjects: string[]; assigned_trainer_id: string | null
  assigned_trainer_name: string | null; timezone?: string
  timetable: string | null; timetable_confirmed: boolean
}

interface Trainer { id: string; full_name: string; email: string }
interface ClassSlot { id: string; name: string; days: string[]; start_time: string; end_time: string; meet_link: string }

const SUBJECT_MAP: Record<string, string> = {
  ENG: 'English Language', MATH: 'Mathematics', SCI: 'Science',
  COMP: 'Computing', HIST: 'History', GEO: 'Geography',
}

export default function PrincipalTimetableClient({
  children, trainers, classSlots,
}: { children: Child[]; trainers: Trainer[]; classSlots: ClassSlot[] }) {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedTrainer, setSelectedTrainer] = useState('')
  const [assigningTrainer, setAssigningTrainer] = useState(false)
  const router = useRouter()

  function openChild(child: Child) {
    setSelectedChild(child)
    setSelectedTrainer(child.assigned_trainer_id || '')
    setError('')
    setSuccess('')
    try {
      const existing = child.timetable ? JSON.parse(child.timetable) : []
      setTimetableEntries(Array.isArray(existing) ? existing : [])
    } catch { setTimetableEntries([]) }
  }

  async function assignTrainer() {
    if (!selectedChild || !selectedTrainer) return
    setAssigningTrainer(true)
    const res = await fetch('/api/academy/assign-trainer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ child_id: selectedChild.id, trainer_id: selectedTrainer }),
    })
    if (res.ok) {
      setSuccess('Tutor assigned!')
      router.refresh()
    } else {
      setError('Failed to assign tutor')
    }
    setAssigningTrainer(false)
  }

  async function saveTimetable() {
    if (!selectedChild || timetableEntries.length === 0) { setError('Add at least one class'); return }
    setSaving(true); setError('')
    const res = await fetch('/api/academy/timetable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        child_id: selectedChild.id,
        enrollment_id: '',
        timetable: JSON.stringify(timetableEntries),
      }),
    })
    if (res.ok) {
      setSuccess('Timetable saved and parent notified!')
      setSelectedChild(null)
      router.refresh()
    } else {
      setError('Failed to save timetable')
    }
    setSaving(false)
  }

  if (selectedChild) {
    return (
      <div className="p-6 md:p-10">
        <button onClick={() => setSelectedChild(null)}
          className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1">
          ← Back to all students
        </button>
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#062850' }}>{selectedChild.full_name}</h1>
        <p className="text-gray-500 text-sm mb-6">{selectedChild.year_group_label}</p>

        {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
        {success && <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4" />{success}</div>}

        {/* Tutor assignment */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: '#062850' }}>
            <User className="w-5 h-5" style={{ color: '#497296' }} /> Assigned Tutor
          </h2>
          {selectedChild.assigned_trainer_name ? (
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#F0FDF4' }}>
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="font-semibold text-green-700">{selectedChild.assigned_trainer_name}</p>
            </div>
          ) : (
            <div className="flex gap-3">
              <select value={selectedTrainer} onChange={e => setSelectedTrainer(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#497296]">
                <option value="">Select a tutor...</option>
                {trainers.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
              </select>
              <Button onClick={assignTrainer} disabled={assigningTrainer || !selectedTrainer}
                className="text-white rounded-xl px-6" style={{ backgroundColor: '#062850' }}>
                {assigningTrainer ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Assign'}
              </Button>
            </div>
          )}
        </div>

        {/* General class slots */}
        {classSlots.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: '#062850' }}>
              <Calendar className="w-5 h-5" style={{ color: '#497296' }} /> General Class Slots
            </h2>
            <p className="text-xs text-gray-500 mb-3">Pre-defined general class schedules:</p>
            <div className="space-y-2">
              {classSlots.map(slot => (
                <div key={slot.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100"
                  style={{ backgroundColor: '#F0F6FB' }}>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#062850' }}>{slot.name}</p>
                    <p className="text-xs text-gray-500">{slot.days.join(', ')} at {slot.start_time} – {slot.end_time} WAT</p>
                  </div>
                  {slot.meet_link && (
                    <a href={slot.meet_link} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                      <ExternalLink className="w-3 h-3" /> Meet Link
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timetable builder */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: '#062850' }}>
            <Calendar className="w-5 h-5" style={{ color: '#497296' }} /> Custom Timetable
          </h2>
          <TimetableBuilder
            childId={selectedChild.id}
            subjects={selectedChild.subjects}
            studentTimezone={selectedChild.timezone || 'Africa/Lagos'}
            initialEntries={timetableEntries}
            onChange={(_, entries) => setTimetableEntries(entries)}
          />
          <div className="mt-4">
            <Button onClick={saveTimetable} disabled={saving}
              className="w-full text-white rounded-xl py-3" style={{ backgroundColor: '#497296' }}>
              {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving...</> : <><Calendar className="w-4 h-4 mr-2" />Save & Notify Parent</>}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>Timetable Manager</h1>
        <p className="text-gray-500 text-sm">Manage timetables for all students. Click a student to edit.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold" style={{ color: '#062850' }}>All Students ({children.length})</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {children.map(child => {
            let entries: TimetableEntry[] = []
            try { entries = child.timetable ? JSON.parse(child.timetable) : [] } catch {}

            return (
              <div key={child.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: '#062850' }}>{child.full_name}</p>
                  <p className="text-xs text-gray-500">{child.year_group_label}</p>
                  <p className="text-xs text-gray-400">{child.assigned_trainer_name || 'No tutor assigned'}</p>
                  {entries.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {entries.slice(0, 2).map((e, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: '#EBF4FF', color: '#497296' }}>
                          {e.type === 'weekly' ? `Every ${e.day}` : e.date}
                        </span>
                      ))}
                      {entries.length > 2 && <span className="text-xs text-gray-400">+{entries.length - 2} more</span>}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {child.timetable_confirmed && <CheckCircle className="w-4 h-4 text-green-500" />}
                  <Button onClick={() => openChild(child)} variant="outline"
                    className="flex items-center gap-1 rounded-xl text-xs px-3">
                    <Edit3 className="w-3 h-3" /> Manage
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
