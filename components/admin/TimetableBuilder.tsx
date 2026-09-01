'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Clock, Calendar, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface TimetableEntry {
  type: 'weekly' | 'oneoff'
  day?: string
  date?: string
  start_time: string
  end_time: string
  subject: string
  meet_link: string
  wat_display: string
  student_display: string
}

interface Props {
  childId: string
  subjects: string[]
  studentTimezone: string
  initialEntries?: TimetableEntry[]
  onChange: (childId: string, entries: TimetableEntry[]) => void
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

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// WAT is UTC+1
const WAT_OFFSET = 60 // minutes

function getTimezoneOffset(tz: string): number {
  try {
    const now = new Date()
    const watDate = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Lagos' }))
    const tzDate = new Date(now.toLocaleString('en-US', { timeZone: tz }))
    return Math.round((tzDate.getTime() - watDate.getTime()) / 60000)
  } catch {
    return 0
  }
}

function convertTime(time24: string, offsetMinutes: number): string {
  if (!time24) return ''
  const [h, m] = time24.split(':').map(Number)
  const totalMinutes = h * 60 + m + offsetMinutes
  const newH = ((Math.floor(totalMinutes / 60) % 24) + 24) % 24
  const newM = ((totalMinutes % 60) + 60) % 60
  const period = newH >= 12 ? 'PM' : 'AM'
  const displayH = newH % 12 || 12
  return `${displayH}:${String(newM).padStart(2, '0')} ${period}`
}

function watDisplay(time24: string): string {
  if (!time24) return ''
  const [h, m] = time24.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const displayH = h % 12 || 12
  return `${displayH}:${String(m).padStart(2, '0')} ${period} WAT`
}

function studentDisplay(time24: string, studentTz: string): string {
  if (!time24 || !studentTz) return ''
  const offset = getTimezoneOffset(studentTz)
  const converted = convertTime(time24, offset)
  const tzLabel = studentTz.replace('_', ' ').split('/').pop() || studentTz
  return `${converted} (${tzLabel})`
}

const EMPTY_ENTRY: TimetableEntry = {
  type: 'weekly',
  day: 'Monday',
  date: '',
  start_time: '16:00',
  end_time: '17:00',
  subject: '',
  meet_link: '',
  wat_display: '',
  student_display: '',
}

export default function TimetableBuilder({
  childId, subjects, studentTimezone, initialEntries, onChange,
}: Props) {
  const [entries, setEntries] = useState<TimetableEntry[]>(
    initialEntries && initialEntries.length > 0 ? initialEntries : []
  )

  useEffect(() => {
    onChange(childId, entries)
  }, [entries])

  function updateEntry(index: number, field: keyof TimetableEntry, value: string) {
    setEntries(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      // Auto-update display strings when time changes
      const e = updated[index]
      if (field === 'start_time' || field === 'end_time') {
        updated[index].wat_display = `${watDisplay(e.start_time)} – ${watDisplay(e.end_time)}`
        updated[index].student_display = studentTimezone
          ? `${studentDisplay(e.start_time, studentTimezone)} – ${studentDisplay(e.end_time, studentTimezone)}`
          : ''
      }
      return updated
    })
  }

  function addEntry() {
    const newEntry = { ...EMPTY_ENTRY, subject: subjects[0] || '' }
    newEntry.wat_display = `${watDisplay(newEntry.start_time)} – ${watDisplay(newEntry.end_time)}`
    newEntry.student_display = studentTimezone
      ? `${studentDisplay(newEntry.start_time, studentTimezone)} – ${studentDisplay(newEntry.end_time, studentTimezone)}`
      : ''
    setEntries(prev => [...prev, newEntry])
  }

  function removeEntry(index: number) {
    setEntries(prev => prev.filter((_, i) => i !== index))
  }

  const inputCls = 'px-2 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#497296] bg-white w-full'

  return (
    <div className="space-y-3">

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-orange-400" />
          WAT = Nigerian Time (UTC+1)
        </span>
        {studentTimezone && (
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            Student local time shown automatically
          </span>
        )}
      </div>

      {entries.length === 0 && (
        <div className="p-4 rounded-xl text-center border border-dashed border-gray-200">
          <p className="text-xs text-gray-400">No timetable entries yet. Click Add Class below.</p>
        </div>
      )}

      {entries.map((entry, i) => (
        <div key={i} className="p-4 rounded-xl border border-gray-100 space-y-3"
          style={{ backgroundColor: '#FAFAFA' }}>

          {/* Row 1 — Type selector */}
          <div className="flex items-center gap-3">
            <div className="flex rounded-xl overflow-hidden border border-gray-200">
              {(['weekly', 'oneoff'] as const).map(t => (
                <button key={t} type="button"
                  onClick={() => updateEntry(i, 'type', t)}
                  className="px-3 py-1.5 text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: entry.type === t ? '#062850' : '#ffffff',
                    color: entry.type === t ? '#ffffff' : '#6B7280',
                  }}>
                  {t === 'weekly' ? '🔁 Weekly' : '📅 One-off'}
                </button>
              ))}
            </div>
            <button onClick={() => removeEntry(i)}
              className="ml-auto text-red-400 hover:text-red-600 transition-colors p-1">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Row 2 — Day or Date */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                {entry.type === 'weekly' ? '📅 Day' : '📅 Date'}
              </label>
              {entry.type === 'weekly' ? (
                <select value={entry.day || ''} onChange={(e) => updateEntry(i, 'day', e.target.value)}
                  className={inputCls}>
                  {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              ) : (
                <input type="date" value={entry.date || ''} onChange={(e) => updateEntry(i, 'date', e.target.value)}
                  className={inputCls} min={new Date().toISOString().split('T')[0]} />
              )}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Subject</label>
              <select value={entry.subject} onChange={(e) => updateEntry(i, 'subject', e.target.value)}
                className={inputCls}>
                <option value="">Select subject</option>
                {subjects.map(s => <option key={s} value={s}>{SUBJECT_MAP[s] || s}</option>)}
              </select>
            </div>
          </div>

          {/* Row 3 — Time (WAT) */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                <Clock className="w-3 h-3 inline mr-1" />
                Start Time (WAT / Nigerian)
              </label>
              <input type="time" value={entry.start_time} onChange={(e) => updateEntry(i, 'start_time', e.target.value)}
                className={inputCls} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                <Clock className="w-3 h-3 inline mr-1" />
                End Time (WAT / Nigerian)
              </label>
              <input type="time" value={entry.end_time} onChange={(e) => updateEntry(i, 'end_time', e.target.value)}
                className={inputCls} />
            </div>
          </div>

          {/* Timezone display */}
          {entry.start_time && entry.end_time && (
            <div className="grid grid-cols-1 gap-1">
              <div className="flex items-center gap-2 p-2 rounded-lg"
                style={{ backgroundColor: '#FFF8F0', border: '1px solid #FCD34D' }}>
                <div className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                <p className="text-xs font-semibold text-orange-800">
                  Nigeria (WAT): {watDisplay(entry.start_time)} – {watDisplay(entry.end_time)}
                </p>
              </div>
              {studentTimezone && studentTimezone !== 'Africa/Lagos' && (
                <div className="flex items-center gap-2 p-2 rounded-lg"
                  style={{ backgroundColor: '#EBF4FF', border: '1px solid #BFDBFE' }}>
                  <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                  <p className="text-xs font-semibold text-blue-800">
                    Student local: {studentDisplay(entry.start_time, studentTimezone)} – {studentDisplay(entry.end_time, studentTimezone)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Row 4 — Google Meet link */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              <ExternalLink className="w-3 h-3 inline mr-1" />
              Google Meet Link
            </label>
            <input type="url" value={entry.meet_link} onChange={(e) => updateEntry(i, 'meet_link', e.target.value)}
              className={inputCls} placeholder="https://meet.google.com/xxx-xxxx-xxx" />
            {entry.meet_link && (
              <a href={entry.meet_link} target="_blank" rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline mt-1 inline-flex items-center gap-1">
                <ExternalLink className="w-3 h-3" /> Test link
              </a>
            )}
          </div>

        </div>
      ))}

      <Button type="button" variant="outline" onClick={addEntry}
        className="w-full flex items-center justify-center gap-2 rounded-xl text-xs py-2.5 border-dashed">
        <Plus className="w-3.5 h-3.5" /> Add Class
      </Button>

    </div>
  )
}
