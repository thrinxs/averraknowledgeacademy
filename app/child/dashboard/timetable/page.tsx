import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import { ExternalLink, Clock } from 'lucide-react'
import { getAgeGroup } from '@/utils/auth'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

const SUBJECT_MAP: Record<string, string> = {
  ENG: 'English Language', MATH: 'Mathematics', SCI: 'Science',
  COMP: 'Computing', HIST: 'History', GEO: 'Geography',
}
const SUBJECT_EMOJIS: Record<string, string> = {
  ENG: '📖', MATH: '🔢', SCI: '🔬', COMP: '💻',
  HIST: '📜', GEO: '🌍', ART: '🎨', MUS: '🎵', PE: '⚽',
}
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

type TimetableEntry = {
  type: 'weekly' | 'oneoff'; day?: string; date?: string
  subject: string; start_time: string; end_time: string
  wat_display?: string; student_display?: string; meet_link?: string
}

export default async function ChildTimetablePage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const admin = getAdminClient()
  const { data: profile } = await admin.from('profiles').select('account_type').eq('id', user.id).single()
  if (profile?.account_type !== 'child') redirect('/dashboard')

  const { data: childRecord } = await admin
    .from('academy_children')
    .select('id, full_name, year_group_label, year_group_code, timetable, timetable_confirmed')
    .eq('child_user_id', user.id)
    .maybeSingle()

  if (!childRecord) redirect('/child/dashboard')

  const isPrimary = getAgeGroup(childRecord.year_group_code || 'Year 1') === 'primary'
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long' })

  let entries: TimetableEntry[] = []
  try { entries = childRecord.timetable ? JSON.parse(childRecord.timetable) : [] } catch {}

  const weeklyEntries = entries.filter(e => e.type === 'weekly')
  const oneoffEntries = entries.filter(e => e.type === 'oneoff')

  // Group weekly by day
  const byDay: Record<string, TimetableEntry[]> = {}
  for (const day of DAYS) {
    const dayEntries = weeklyEntries.filter(e => e.day === day)
    if (dayEntries.length > 0) byDay[day] = dayEntries
  }

  return (
    <div className={`p-4 md:p-6 ${isPrimary ? '' : 'md:p-10'}`}>
      <div className="mb-6">
        <h1 className={`font-bold mb-1 ${isPrimary ? 'text-2xl' : 'text-2xl md:text-3xl'}`} style={{ color: '#062850' }}>
          {isPrimary ? '📅 My Class Schedule' : 'My Timetable'}
        </h1>
        <p className="text-gray-500 text-sm">{childRecord.year_group_label}</p>
      </div>

      {!childRecord.timetable_confirmed ? (
        <div className={`rounded-${isPrimary ? '3xl' : '2xl'} p-6 text-center border-2 border-amber-200`}
          style={{ backgroundColor: '#FFF8F0' }}>
          <div className="text-4xl mb-3">{isPrimary ? '⏳' : ''}</div>
          <p className="font-bold mb-1" style={{ color: '#062850' }}>
            {isPrimary ? 'Your timetable is coming soon!' : 'Timetable pending'}
          </p>
          <p className="text-gray-500 text-sm">
            Your teacher is setting up your class schedule. Check back soon!
          </p>
        </div>
      ) : (
        <div className="space-y-4">

          {/* Today's classes highlighted */}
          {byDay[today] && (
            <div className="rounded-3xl overflow-hidden border-2 border-green-300 mb-6"
              style={{ backgroundColor: '#F0FDF4' }}>
              <div className="px-5 py-3 flex items-center gap-2"
                style={{ backgroundColor: '#16A34A' }}>
                <span className="text-lg">🌟</span>
                <p className="font-bold text-white">Today — {today}</p>
                <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full ml-auto">
                  {byDay[today].length} class{byDay[today].length !== 1 ? 'es' : ''}
                </span>
              </div>
              <div className="p-4 space-y-3">
                {byDay[today].map((entry, i) => (
                  <div key={i} className="flex items-center justify-between bg-white rounded-2xl p-4 gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{SUBJECT_EMOJIS[entry.subject] || '📚'}</span>
                      <div>
                        <p className="font-bold text-sm" style={{ color: '#062850' }}>
                          {SUBJECT_MAP[entry.subject] || entry.subject}
                        </p>
                        <p className="text-xs text-gray-500">{entry.wat_display || `${entry.start_time} – ${entry.end_time}`}</p>
                        {entry.student_display && (
                          <p className="text-xs text-blue-500">{entry.student_display}</p>
                        )}
                      </div>
                    </div>
                    {entry.meet_link && (
                      <a href={entry.meet_link} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 px-4 py-2 rounded-xl text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: '#16A34A' }}>
                        {isPrimary ? '🎥 Join!' : <><ExternalLink className="w-3 h-3" />Join Class</>}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full weekly schedule */}
          <h2 className="font-bold text-lg mb-3" style={{ color: '#062850' }}>
            {isPrimary ? '📆 All My Classes' : 'Weekly Schedule'}
          </h2>
          {Object.entries(byDay).map(([day, dayEntries]) => (
            <div key={day} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 flex items-center justify-between"
                style={{ backgroundColor: day === today ? '#062850' : '#F0F6FB' }}>
                <p className="font-bold text-sm" style={{ color: day === today ? '#ffffff' : '#062850' }}>
                  {isPrimary && day === today ? '⭐ ' : ''}{day}
                  {day === today ? ' (Today)' : ''}
                </p>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: day === today ? '#1D4469' : '#E5E7EB',
                    color: day === today ? '#97C3E0' : '#6B7280',
                  }}>
                  {dayEntries.length} class{dayEntries.length !== 1 ? 'es' : ''}
                </span>
              </div>
              <div className="divide-y divide-gray-50">
                {dayEntries.map((entry, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3 gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{SUBJECT_EMOJIS[entry.subject] || '📚'}</span>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#062850' }}>
                          {SUBJECT_MAP[entry.subject] || entry.subject}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {entry.wat_display || `${entry.start_time} – ${entry.end_time} WAT`}
                        </p>
                        {entry.student_display && (
                          <p className="text-xs text-blue-500">{entry.student_display}</p>
                        )}
                      </div>
                    </div>
                    {entry.meet_link && (
                      <a href={entry.meet_link} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-white text-xs font-semibold flex-shrink-0"
                        style={{ backgroundColor: '#1A73E8' }}>
                        <ExternalLink className="w-3 h-3" />
                        {isPrimary ? 'Join' : 'Google Meet'}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {Object.keys(byDay).length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-4xl mb-2">📅</p>
              <p>No weekly classes set yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
