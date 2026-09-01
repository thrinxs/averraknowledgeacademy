'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CheckCircle, Loader2, AlertCircle,
  Calendar, User, ExternalLink, Edit3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import ConfirmPaymentModal from '@/components/admin/ConfirmPaymentModal'

interface Trainer { id: string; full_name: string; email: string }
interface Child {
  id: string; full_name: string; year_group_label: string
  subjects: string[]; assigned_trainer_id: string | null
  assigned_trainer_name: string | null
  timetable: string | null; timetable_confirmed: boolean
}

interface TimetableDay {
  day: string; time: string; subject: string; meet_link: string
}

interface Props {
  enrollmentId: string; billingAmount: number; currency: string
  parentEmail: string; isPaid: boolean; trainers: Trainer[]
  children: Child[]; classType: string; scheduleNotes: string
}

const SUBJECT_MAP: Record<string, string> = {
  ENG: 'English Language', MATH: 'Mathematics', SCI: 'Science',
  COMP: 'Computing', HIST: 'History', GEO: 'Geography',
  ART: 'Creative Arts', MUS: 'Music', PE: 'Physical Education',
  NHC: 'Nigerian History & Culture', REL: 'Religious Studies',
  BTECH: 'Basic Technology', BIO: 'Biology', CHEM: 'Chemistry',
  PHY: 'Physics', ECON: 'Economics', GOV: 'Government / Politics',
  ENGLIT: 'English Literature',
}

// Parse notes field to extract days and time
function parseScheduleNotes(notes: string): { days: string[]; time: string } {
  const daysMatch = notes.match(/Days?:\s*([^.]+)/i)
  const timeMatch = notes.match(/Time:\s*([^.]+)/i)
  const days = daysMatch
    ? daysMatch[1].split(',').map(d => d.trim()).filter(Boolean)
    : []
  const time = timeMatch ? timeMatch[1].trim() : ''
  return { days, time }
}

// Build default timetable rows from schedule notes
function buildDefaultTimetable(
  notes: string,
  subjects: string[]
): TimetableDay[] {
  const { days, time } = parseScheduleNotes(notes)
  if (days.length === 0) return []
  return days.map((day, i) => ({
    day,
    time,
    subject: subjects[i % subjects.length] || '',
    meet_link: '',
  }))
}

export default function EnrollmentDetailClient({
  enrollmentId, billingAmount, currency, parentEmail,
  isPaid, trainers, children, classType, scheduleNotes,
}: Props) {
  const [showModal, setShowModal] = useState(false)
  const [assigningChild, setAssigningChild] = useState<string | null>(null)
  const [selectedTrainer, setSelectedTrainer] = useState<Record<string, string>>({})
  const [assignSuccess, setAssignSuccess] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [savingTimetable, setSavingTimetable] = useState<string | null>(null)
  const [timetableSuccess, setTimetableSuccess] = useState<Record<string, boolean>>({})
  const [editingTimetable, setEditingTimetable] = useState<Record<string, boolean>>({})

  // Timetable rows per child
  const [timetableRows, setTimetableRows] = useState<Record<string, TimetableDay[]>>(
    Object.fromEntries(
      children.map(c => [
        c.id,
        c.timetable
          ? (typeof c.timetable === 'string'
              ? (() => { try { return JSON.parse(c.timetable) } catch { return buildDefaultTimetable(scheduleNotes, c.subjects) } })()
              : c.timetable as TimetableDay[])
          : buildDefaultTimetable(scheduleNotes, c.subjects),
      ])
    )
  )

  const router = useRouter()

  function updateRow(childId: string, index: number, field: keyof TimetableDay, value: string) {
    setTimetableRows(prev => {
      const rows = [...(prev[childId] || [])]
      rows[index] = { ...rows[index], [field]: value }
      return { ...prev, [childId]: rows }
    })
  }

  function addRow(childId: string) {
    setTimetableRows(prev => ({
      ...prev,
      [childId]: [...(prev[childId] || []), { day: '', time: '', subject: '', meet_link: '' }],
    }))
  }

  function removeRow(childId: string, index: number) {
    setTimetableRows(prev => ({
      ...prev,
      [childId]: (prev[childId] || []).filter((_, i) => i !== index),
    }))
  }

  async function handleAssignTrainer(childId: string) {
    const trainerId = selectedTrainer[childId]
    if (!trainerId) { setError('Please select a trainer first'); return }
    setAssigningChild(childId); setError('')
    try {
      const res = await fetch('/api/academy/assign-trainer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_id: childId, trainer_id: trainerId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAssignSuccess(prev => ({ ...prev, [childId]: data.trainer_name }))
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign trainer')
    } finally { setAssigningChild(null) }
  }

  async function handleSaveTimetable(childId: string) {
    const rows = timetableRows[childId] || []
    if (rows.length === 0) { setError('Please add at least one timetable entry'); return }
    setSavingTimetable(childId); setError('')
    try {
      const res = await fetch('/api/academy/timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          child_id: childId,
          enrollment_id: enrollmentId,
          timetable: JSON.stringify(rows),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setTimetableSuccess(prev => ({ ...prev, [childId]: true }))
      setEditingTimetable(prev => ({ ...prev, [childId]: false }))
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save timetable')
    } finally { setSavingTimetable(null) }
  }

  const inputCls = 'px-2 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#497296]'

  return (
    <div className="space-y-4">

      {/* Payment */}
      {!isPaid ? (
        <>
          <button onClick={() => setShowModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#16A34A' }}>
            <CheckCircle className="w-4 h-4" /> Confirm Payment Received
          </button>
          {showModal && (
            <ConfirmPaymentModal enrollmentId={enrollmentId} billingAmount={billingAmount}
              currency={currency} parentEmail={parentEmail} onClose={() => setShowModal(false)} />
          )}
        </>
      ) : (
        <div className="p-3 rounded-xl text-sm text-green-700 bg-green-50 text-center font-semibold">
          ✅ Payment Confirmed
        </div>
      )}

      {/* Class type info */}
      {classType && (
        <div className="p-3 rounded-xl text-xs" style={{ backgroundColor: '#EBF4FF' }}>
          <span className="font-semibold" style={{ color: '#062850' }}>Class Type: </span>
          <span style={{ color: '#497296' }}>
            {classType === 'private' ? '👤 Private (1-on-1)' : '👥 General Class'}
          </span>
        </div>
      )}

      {/* Schedule from enrolment */}
      {scheduleNotes && (
        <div className="p-3 rounded-xl text-xs border border-gray-100" style={{ backgroundColor: '#F0F6FB' }}>
          <p className="font-semibold text-gray-600 mb-1">📅 Schedule Preferences (from enrolment):</p>
          <p className="text-gray-600">{scheduleNotes}</p>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-xs">{error}</p>
        </div>
      )}

      {/* Learner management */}
      {isPaid && children.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold text-sm" style={{ color: '#062850' }}>Learner Management</h3>

          {children.map((child) => {
            const rows = timetableRows[child.id] || []
            const isConfirmed = child.timetable_confirmed || timetableSuccess[child.id]
            const isEditing = editingTimetable[child.id]

            return (
              <div key={child.id} className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 flex items-center justify-between"
                  style={{ backgroundColor: '#062850' }}>
                  <p className="font-bold text-white text-sm">{child.full_name}</p>
                  <span className="text-xs text-blue-300">{child.year_group_label}</span>
                </div>

                <div className="p-4 space-y-4">

                  {/* Subjects */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Subjects:</p>
                    <div className="flex flex-wrap gap-1">
                      {child.subjects.map(s => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                          style={{ backgroundColor: '#497296' }}>
                          {SUBJECT_MAP[s] || s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Trainer */}
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                      <User className="w-3 h-3" /> Assigned Trainer
                    </p>
                    {child.assigned_trainer_name || assignSuccess[child.id] ? (
                      <div className="flex items-center gap-2 p-2 rounded-xl" style={{ backgroundColor: '#F0FDF4' }}>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <p className="text-sm font-semibold text-green-700">
                          {assignSuccess[child.id] || child.assigned_trainer_name}
                        </p>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <select value={selectedTrainer[child.id] || ''}
                          onChange={(e) => setSelectedTrainer(prev => ({ ...prev, [child.id]: e.target.value }))}
                          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#497296]">
                          <option value="">Select a trainer...</option>
                          {trainers.map(t => (
                            <option key={t.id} value={t.id}>{t.full_name} ({t.email})</option>
                          ))}
                        </select>
                        <Button onClick={() => handleAssignTrainer(child.id)}
                          disabled={assigningChild === child.id || !selectedTrainer[child.id]}
                          className="text-white rounded-xl px-4 text-xs" style={{ backgroundColor: '#062850' }}>
                          {assigningChild === child.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Assign'}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Timetable */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Timetable
                      </p>
                      {isConfirmed && !isEditing && (
                        <button onClick={() => setEditingTimetable(prev => ({ ...prev, [child.id]: true }))}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors">
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                      )}
                    </div>

                    {isConfirmed && !isEditing ? (
                      /* Show confirmed timetable */
                      <div className="space-y-2">
                        {rows.map((row, i) => (
                          <div key={i} className="p-3 rounded-xl border border-green-100"
                            style={{ backgroundColor: '#F0FDF4' }}>
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <p className="text-xs font-bold text-green-800">
                                  {row.day} — {row.time}
                                </p>
                                <p className="text-xs text-green-700">
                                  {SUBJECT_MAP[row.subject] || row.subject}
                                </p>
                              </div>
                              {row.meet_link && (
                                <a href={row.meet_link} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg text-white font-medium flex-shrink-0"
                                  style={{ backgroundColor: '#1A73E8' }}>
                                  <ExternalLink className="w-3 h-3" /> Meet
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Edit timetable */
                      <div className="space-y-2">
                        {classType === 'private' && scheduleNotes && rows.length > 0 && (
                          <div className="p-2 rounded-xl text-xs" style={{ backgroundColor: '#EBF4FF' }}>
                            <p className="text-blue-700">
                              Pre-filled from enrolment preferences. Add Google Meet links and confirm.
                            </p>
                          </div>
                        )}

                        {/* Column headers */}
                        <div className="grid grid-cols-12 gap-1 px-1">
                          <p className="col-span-3 text-xs text-gray-400">Day</p>
                          <p className="col-span-3 text-xs text-gray-400">Time</p>
                          <p className="col-span-3 text-xs text-gray-400">Subject</p>
                          <p className="col-span-2 text-xs text-gray-400">Meet Link</p>
                          <p className="col-span-1"></p>
                        </div>

                        {rows.map((row, i) => (
                          <div key={i} className="grid grid-cols-12 gap-1 items-center">
                            <input value={row.day} onChange={(e) => updateRow(child.id, i, 'day', e.target.value)}
                              className={inputCls + ' col-span-3'} placeholder="Monday" />
                            <input value={row.time} onChange={(e) => updateRow(child.id, i, 'time', e.target.value)}
                              className={inputCls + ' col-span-3'} placeholder="4pm-5pm" />
                            <select value={row.subject} onChange={(e) => updateRow(child.id, i, 'subject', e.target.value)}
                              className={inputCls + ' col-span-3'}>
                              <option value="">Subject</option>
                              {child.subjects.map(s => (
                                <option key={s} value={s}>{SUBJECT_MAP[s] || s}</option>
                              ))}
                            </select>
                            <input value={row.meet_link} onChange={(e) => updateRow(child.id, i, 'meet_link', e.target.value)}
                              className={inputCls + ' col-span-2'} placeholder="meet.google.com/..." />
                            <button onClick={() => removeRow(child.id, i)}
                              className="col-span-1 text-red-400 hover:text-red-600 text-xs text-center">
                              ✕
                            </button>
                          </div>
                        ))}

                        <div className="flex gap-2 pt-1">
                          <button onClick={() => addRow(child.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                            + Add row
                          </button>
                        </div>

                        <Button onClick={() => handleSaveTimetable(child.id)}
                          disabled={savingTimetable === child.id}
                          className="w-full text-white rounded-xl text-xs py-2 mt-2"
                          style={{ backgroundColor: '#497296' }}>
                          {savingTimetable === child.id
                            ? <><Loader2 className="w-3 h-3 animate-spin mr-1" />Saving & Notifying Parent...</>
                            : <><Calendar className="w-3 h-3 mr-1 inline" />Confirm Timetable & Notify Parent</>}
                        </Button>

                        {isEditing && (
                          <button onClick={() => setEditingTimetable(prev => ({ ...prev, [child.id]: false }))}
                            className="w-full text-xs text-gray-400 hover:text-gray-600 mt-1">
                            Cancel
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
