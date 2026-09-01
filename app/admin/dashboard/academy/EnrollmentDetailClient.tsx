'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Loader2, AlertCircle, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ConfirmPaymentModal from '@/components/admin/ConfirmPaymentModal'
import TimetableBuilder, { TimetableEntry } from '@/components/admin/TimetableBuilder'

interface Trainer { id: string; full_name: string; email: string }
interface Child {
  id: string; full_name: string; year_group_label: string
  subjects: string[]; assigned_trainer_id: string | null
  assigned_trainer_name: string | null; timezone: string | null
  timetable: string | null; timetable_confirmed: boolean
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

function parseExistingTimetable(timetable: string | null): TimetableEntry[] {
  if (!timetable) return []
  try {
    const parsed = JSON.parse(timetable)
    if (Array.isArray(parsed)) return parsed as TimetableEntry[]
    return []
  } catch {
    return []
  }
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
  const [timetableEntries, setTimetableEntries] = useState<Record<string, TimetableEntry[]>>(
    Object.fromEntries(children.map(c => [c.id, parseExistingTimetable(c.timetable)]))
  )
  const router = useRouter()

  function handleTimetableChange(childId: string, entries: TimetableEntry[]) {
    setTimetableEntries(prev => ({ ...prev, [childId]: entries }))
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
    const entries = timetableEntries[childId] || []
    if (entries.length === 0) { setError('Please add at least one class entry'); return }
    setSavingTimetable(childId); setError('')
    try {
      const res = await fetch('/api/academy/timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          child_id: childId,
          enrollment_id: enrollmentId,
          timetable: JSON.stringify(entries),
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

      {/* Class type */}
      <div className="p-3 rounded-xl text-xs" style={{ backgroundColor: '#EBF4FF' }}>
        <span className="font-semibold" style={{ color: '#062850' }}>Class Type: </span>
        <span style={{ color: '#497296' }}>
          {classType === 'private' ? '👤 Private (1-on-1)' : '👥 General Class'}
        </span>
      </div>

      {/* Schedule from enrolment */}
      {scheduleNotes && (
        <div className="p-3 rounded-xl text-xs border border-gray-100" style={{ backgroundColor: '#F0F6FB' }}>
          <p className="font-semibold text-gray-600 mb-1">📋 Schedule Preferences (from enrolment):</p>
          <p className="text-gray-600 leading-relaxed">{scheduleNotes}</p>
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
            const isConfirmed = child.timetable_confirmed || timetableSuccess[child.id]
            const isEditing = editingTimetable[child.id]
            const existingEntries = parseExistingTimetable(child.timetable)
            const studentTz = child.timezone || 'Africa/Lagos'

            return (
              <div key={child.id} className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 flex items-center justify-between"
                  style={{ backgroundColor: '#062850' }}>
                  <p className="font-bold text-white text-sm">{child.full_name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-300">{child.year_group_label}</span>
                    {studentTz && studentTz !== 'Africa/Lagos' && (
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: '#1D4469', color: '#97C3E0' }}>
                        {studentTz.split('/').pop()?.replace('_', ' ')}
                      </span>
                    )}
                  </div>
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

                  {/* Trainer assignment */}
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
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Timetable
                        {studentTz && (
                          <span className="font-normal text-gray-400 ml-1">
                            (WAT + {studentTz.split('/').pop()?.replace('_', ' ')} shown)
                          </span>
                        )}
                      </p>
                      {isConfirmed && !isEditing && (
                        <button onClick={() => setEditingTimetable(prev => ({ ...prev, [child.id]: true }))}
                          className="text-xs text-blue-600 hover:text-blue-800 transition-colors font-medium">
                          ✏️ Edit
                        </button>
                      )}
                    </div>

                    {isConfirmed && !isEditing ? (
                      /* Show confirmed timetable */
                      <div className="space-y-2">
                        {existingEntries.map((entry, idx) => (
                          <div key={idx} className="p-3 rounded-xl border border-green-100"
                            style={{ backgroundColor: '#F0FDF4' }}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="text-xs font-bold text-green-800">
                                  {entry.type === 'weekly' ? `Every ${entry.day}` : entry.date}
                                  {' — '}{SUBJECT_MAP[entry.subject] || entry.subject}
                                </p>
                                <p className="text-xs text-orange-700 mt-0.5">
                                  🇳🇬 {entry.wat_display || `${entry.start_time} – ${entry.end_time} WAT`}
                                </p>
                                {entry.student_display && studentTz !== 'Africa/Lagos' && (
                                  <p className="text-xs text-blue-700 mt-0.5">
                                    🌍 {entry.student_display}
                                  </p>
                                )}
                              </div>
                              {entry.meet_link && (
                                <a href={entry.meet_link} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg text-white font-medium flex-shrink-0"
                                  style={{ backgroundColor: '#1A73E8' }}>
                                  Join Class
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* TimetableBuilder */
                      <div>
                        <TimetableBuilder
                          childId={child.id}
                          subjects={child.subjects}
                          studentTimezone={studentTz}
                          initialEntries={
                            timetableEntries[child.id]?.length > 0
                              ? timetableEntries[child.id]
                              : existingEntries
                          }
                          onChange={handleTimetableChange}
                        />
                        <div className="flex gap-2 mt-3">
                          <Button onClick={() => handleSaveTimetable(child.id)}
                            disabled={savingTimetable === child.id}
                            className="flex-1 text-white rounded-xl text-xs py-2.5"
                            style={{ backgroundColor: '#497296' }}>
                            {savingTimetable === child.id
                              ? <><Loader2 className="w-3 h-3 animate-spin mr-1" />Saving & Notifying...</>
                              : <><Calendar className="w-3 h-3 mr-1 inline" />Confirm Timetable & Notify Parent</>}
                          </Button>
                          {isEditing && (
                            <Button variant="outline" onClick={() => setEditingTimetable(prev => ({ ...prev, [child.id]: false }))}
                              className="rounded-xl text-xs px-4">
                              Cancel
                            </Button>
                          )}
                        </div>
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
