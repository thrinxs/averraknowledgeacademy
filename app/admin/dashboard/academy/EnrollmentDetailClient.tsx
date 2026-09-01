'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Loader2, AlertCircle, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ConfirmPaymentModal from '@/components/admin/ConfirmPaymentModal'

interface Trainer {
  id: string
  full_name: string
  email: string
}

interface Child {
  id: string
  full_name: string
  year_group_label: string
  subjects: string[]
  assigned_trainer_id: string | null
  assigned_trainer_name: string | null
  timetable: Record<string, string> | null
  timetable_confirmed: boolean
}

interface Props {
  enrollmentId: string
  billingAmount: number
  currency: string
  parentEmail: string
  isPaid: boolean
  trainers: Trainer[]
  children: Child[]
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

export default function EnrollmentDetailClient({
  enrollmentId, billingAmount, currency, parentEmail, isPaid, trainers, children,
}: Props) {
  const [showModal, setShowModal] = useState(false)
  const [assigningChild, setAssigningChild] = useState<string | null>(null)
  const [selectedTrainer, setSelectedTrainer] = useState<Record<string, string>>({})
  const [assignSuccess, setAssignSuccess] = useState<Record<string, string>>({})
  const [assignError, setAssignError] = useState('')
  const [timetableText, setTimetableText] = useState<Record<string, string>>({})
  const [savingTimetable, setSavingTimetable] = useState<string | null>(null)
  const [timetableSuccess, setTimetableSuccess] = useState<Record<string, boolean>>({})
  const router = useRouter()

  async function handleAssignTrainer(childId: string) {
    const trainerId = selectedTrainer[childId]
    if (!trainerId) { setAssignError('Please select a trainer first'); return }
    setAssigningChild(childId)
    setAssignError('')
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
      setAssignError(err instanceof Error ? err.message : 'Failed to assign trainer')
    } finally {
      setAssigningChild(null)
    }
  }

  async function handleSaveTimetable(childId: string) {
    const text = timetableText[childId]
    if (!text?.trim()) { setAssignError('Please enter timetable details'); return }
    setSavingTimetable(childId)
    setAssignError('')
    try {
      const res = await fetch('/api/academy/timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          child_id: childId,
          enrollment_id: enrollmentId,
          timetable: text,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setTimetableSuccess(prev => ({ ...prev, [childId]: true }))
      router.refresh()
    } catch (err) {
      setAssignError(err instanceof Error ? err.message : 'Failed to save timetable')
    } finally {
      setSavingTimetable(null)
    }
  }

  return (
    <div className="space-y-4">

      {/* Payment section */}
      {!isPaid ? (
        <>
          <button
            onClick={() => setShowModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#16A34A' }}
          >
            <CheckCircle className="w-4 h-4" />
            Confirm Payment Received
          </button>
          {showModal && (
            <ConfirmPaymentModal
              enrollmentId={enrollmentId}
              billingAmount={billingAmount}
              currency={currency}
              parentEmail={parentEmail}
              onClose={() => setShowModal(false)}
            />
          )}
        </>
      ) : (
        <div className="p-3 rounded-xl text-sm text-green-700 bg-green-50 text-center font-semibold">
          ✅ Payment Confirmed
        </div>
      )}

      {/* Trainer assignment + timetable per child */}
      {isPaid && children.length > 0 && (
        <div className="space-y-4 mt-2">
          <h3 className="font-bold text-sm" style={{ color: '#062850' }}>
            Learner Management
          </h3>

          {assignError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-xs">{assignError}</p>
            </div>
          )}

          {children.map((child) => (
            <div key={child.id} className="rounded-xl border border-gray-100 overflow-hidden">

              {/* Child header */}
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

                {/* Trainer assignment */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                    <User className="w-3 h-3" /> Assigned Trainer
                  </p>
                  {child.assigned_trainer_name || assignSuccess[child.id] ? (
                    <div className="flex items-center gap-2 p-2 rounded-xl"
                      style={{ backgroundColor: '#F0FDF4' }}>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <p className="text-sm font-semibold text-green-700">
                        {assignSuccess[child.id] || child.assigned_trainer_name}
                      </p>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <select
                        value={selectedTrainer[child.id] || ''}
                        onChange={(e) => setSelectedTrainer(prev => ({ ...prev, [child.id]: e.target.value }))}
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#497296]"
                      >
                        <option value="">Select a trainer...</option>
                        {trainers.map(t => (
                          <option key={t.id} value={t.id}>{t.full_name} ({t.email})</option>
                        ))}
                      </select>
                      <Button
                        onClick={() => handleAssignTrainer(child.id)}
                        disabled={assigningChild === child.id || !selectedTrainer[child.id]}
                        className="text-white rounded-xl px-4 text-xs"
                        style={{ backgroundColor: '#062850' }}
                      >
                        {assigningChild === child.id
                          ? <Loader2 className="w-3 h-3 animate-spin" />
                          : 'Assign'}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Timetable */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Timetable
                  </p>
                  {child.timetable_confirmed || timetableSuccess[child.id] ? (
                    <div className="p-3 rounded-xl" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                      <p className="text-xs font-semibold text-green-700 mb-1">✅ Timetable Confirmed</p>
                      <pre className="text-xs text-green-800 whitespace-pre-wrap">
                        {typeof child.timetable === 'string' ? child.timetable : JSON.stringify(child.timetable, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <textarea
                        value={timetableText[child.id] || ''}
                        onChange={(e) => setTimetableText(prev => ({ ...prev, [child.id]: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#497296] resize-none"
                        placeholder={`e.g.
Monday: 4pm - 5pm (English)
Wednesday: 4pm - 5pm (Mathematics)
Saturday: 10am - 11am (Revision)`}
                      />
                      <Button
                        onClick={() => handleSaveTimetable(child.id)}
                        disabled={savingTimetable === child.id}
                        className="w-full text-white rounded-xl text-xs py-2"
                        style={{ backgroundColor: '#497296' }}
                      >
                        {savingTimetable === child.id
                          ? <><Loader2 className="w-3 h-3 animate-spin mr-1" />Saving & Notifying Parent...</>
                          : <><Calendar className="w-3 h-3 mr-1 inline" />Confirm Timetable & Notify Parent</>}
                      </Button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
