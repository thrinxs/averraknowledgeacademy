import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
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

export default async function ChildDashboardPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const admin = getAdminClient()

  const { data: profile } = await admin
    .from('profiles')
    .select('full_name, account_type')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.account_type !== 'child') redirect('/dashboard')

  const { data: childRecord } = await admin
    .from('academy_children')
    .select('id, full_name, year_group_code, year_group_label, subjects, timetable, enrollment_id')
    .eq('child_user_id', user.id)
    .maybeSingle()

  const today = new Date().toISOString().split('T')[0]
  const dayName = new Date().toLocaleDateString('en-GB', { weekday: 'long' })
  const childId = childRecord?.id || ''
  const ageGroup = getAgeGroup(childRecord?.year_group_code || 'Year 1')
  const isPrimary = ageGroup === 'primary'
  const firstName = (childRecord?.full_name || profile?.full_name || 'Friend').split(' ')[0]

  // Get today's classwork and homework
  const [cwRes, hwRes, roadmapRes] = await Promise.all([
    childId ? admin.from('classwork').select('id, subject_code, topic_name, status, score, max_score').eq('child_id', childId).eq('assigned_date', today) : { data: [] },
    childId ? admin.from('homework').select('id, subject_code, topic_name, status, score, max_score').eq('child_id', childId).eq('assigned_date', today) : { data: [] },
    childId ? admin.from('learning_roadmap_progress').select('subject_code, status').eq('child_id', childId).eq('status', 'completed') : { data: [] },
  ])

  const classworks = cwRes.data || []
  const homeworks = hwRes.data || []
  const completedTopics = roadmapRes.data || []

  // Parse timetable for today
  let todayClasses: { day: string; time: string; start_time: string; end_time: string; subject: string; meet_link: string; wat_display: string }[] = []
  try {
    const timetable = childRecord?.timetable ? JSON.parse(childRecord.timetable) : []
    todayClasses = timetable.filter((e: { type: string; day: string; date: string }) =>
      e.type === 'weekly' ? e.day === dayName : e.date === today
    )
  } catch {}

  const cwDone = classworks.filter(c => c.status === 'submitted').length
  const hwDone = homeworks.filter(h => h.status === 'submitted').length
  const totalTopics = completedTopics.length

  if (isPrimary) {
    // ── PRIMARY UI — Big, colourful, emoji-heavy ──────────────────────────
    return (
      <div className="p-4 md:p-6" style={{ backgroundColor: '#F0F6FB' }}>

        {/* Big greeting */}
        <div className="mb-6 p-6 rounded-3xl text-center"
          style={{ background: 'linear-gradient(135deg, #062850 0%, #497296 100%)' }}>
          <div className="text-5xl mb-3">
            {new Date().getHours() < 12 ? '🌅' : new Date().getHours() < 17 ? '☀️' : '��'}
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 17 ? 'Good Afternoon' : 'Good Evening'}, {firstName}!
          </h1>
          <p className="text-blue-200 text-sm">Today is {dayName} 🎉</p>
          <p className="text-blue-300 text-xs mt-1">{childRecord?.year_group_label}</p>
        </div>

        {/* Today's stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { emoji: '✏️', label: 'Classwork', value: `${cwDone}/${classworks.length || (childRecord?.subjects?.length || 0)}`, color: '#EBF4FF', text: '#1D4ED8' },
            { emoji: '📝', label: 'Homework', value: `${hwDone}/${homeworks.length || (childRecord?.subjects?.length || 0)}`, color: '#F0FDF4', text: '#16A34A' },
            { emoji: '🌟', label: 'Topics Done', value: totalTopics, color: '#FFF8F0', text: '#F59E0B' },
          ].map(stat => (
            <div key={stat.label} className="rounded-2xl p-4 text-center border-2"
              style={{ backgroundColor: stat.color, borderColor: stat.text + '30' }}>
              <div className="text-3xl mb-1">{stat.emoji}</div>
              <p className="text-2xl font-bold" style={{ color: stat.text }}>{stat.value}</p>
              <p className="text-xs font-semibold" style={{ color: stat.text }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Today's classes */}
        {todayClasses.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: '#062850' }}>
              📅 Today's Classes
            </h2>
            <div className="space-y-3">
              {todayClasses.map((cls, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border-2 border-blue-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{SUBJECT_EMOJIS[cls.subject] || '📚'}</span>
                    <div>
                      <p className="font-bold text-sm" style={{ color: '#062850' }}>
                        {SUBJECT_MAP[cls.subject] || cls.subject}
                      </p>
                      <p className="text-xs text-gray-500">{cls.wat_display || `${cls.start_time} – ${cls.end_time}`}</p>
                    </div>
                  </div>
                  {cls.meet_link && (
                    <a href={cls.meet_link} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 px-4 py-2 rounded-xl text-white text-xs font-bold animate-pulse"
                      style={{ backgroundColor: '#16A34A' }}>
                      🎥 Join!
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Big action cards */}
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: '#062850' }}>
          🎯 What to do today:
        </h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { emoji: '✏️', label: 'Do Classwork', href: '/child/dashboard/classwork', color: '#1D4ED8', bg: '#EBF4FF', done: cwDone >= (childRecord?.subjects?.length || 1) },
            { emoji: '📝', label: 'Do Homework', href: '/child/dashboard/homework', color: '#16A34A', bg: '#F0FDF4', done: hwDone >= (childRecord?.subjects?.length || 1) },
            { emoji: '📅', label: 'My Classes', href: '/child/dashboard/timetable', color: '#F59E0B', bg: '#FFF8F0', done: false },
            { emoji: '🌟', label: 'My Progress', href: '/child/dashboard/roadmap', color: '#8B5CF6', bg: '#F5F3FF', done: false },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="rounded-3xl p-5 text-center border-2 transition-all hover:scale-105 active:scale-95 relative overflow-hidden"
              style={{ backgroundColor: item.bg, borderColor: item.color + '40' }}>
              {item.done && (
                <div className="absolute top-2 right-2">
                  <span className="text-lg">✅</span>
                </div>
              )}
              <div className="text-4xl mb-2">{item.emoji}</div>
              <p className="font-bold text-sm" style={{ color: item.color }}>{item.label}</p>
            </Link>
          ))}
        </div>

        {/* Subjects */}
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: '#062850' }}>
          📚 My Subjects
        </h2>
        <div className="flex flex-wrap gap-3 mb-6">
          {(childRecord?.subjects || []).map((s: string) => (
            <div key={s} className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-gray-100">
              <span className="text-xl">{SUBJECT_EMOJIS[s] || '📚'}</span>
              <span className="text-sm font-semibold" style={{ color: '#062850' }}>
                {SUBJECT_MAP[s] || s}
              </span>
            </div>
          ))}
        </div>

        {/* Motivational message */}
        <div className="rounded-3xl p-5 text-center"
          style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)' }}>
          <p className="text-3xl mb-2">⭐</p>
          <p className="text-white font-bold">Keep it up, {firstName}!</p>
          <p className="text-yellow-100 text-sm">Every lesson makes you smarter!</p>
        </div>

      </div>
    )
  }

  // ── SECONDARY UI — Standard but no billing ────────────────────────────
  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#062850' }}>
          Welcome back, {firstName}!
        </h1>
        <p className="text-gray-500 text-sm">
          {childRecord?.year_group_label} • {dayName}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Classwork', value: `${cwDone}/${classworks.length || 0}`, color: '#497296', emoji: '✏️' },
          { label: 'Homework', value: `${hwDone}/${homeworks.length || 0}`, color: '#16A34A', emoji: '📝' },
          { label: 'Topics Completed', value: totalTopics, color: '#F59E0B', emoji: '🌟' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <div className="text-2xl mb-1">{stat.emoji}</div>
            <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Today's classes */}
      {todayClasses.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-bold text-lg mb-4" style={{ color: '#062850' }}>📅 Today's Classes</h2>
          <div className="space-y-3">
            {todayClasses.map((cls, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: '#F0F6FB' }}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{SUBJECT_EMOJIS[cls.subject] || '📚'}</span>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#062850' }}>
                      {SUBJECT_MAP[cls.subject] || cls.subject}
                    </p>
                    <p className="text-xs text-gray-500">{cls.wat_display || `${cls.start_time} – ${cls.end_time}`}</p>
                  </div>
                </div>
                {cls.meet_link && (
                  <a href={cls.meet_link} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-4 py-2 rounded-xl text-white text-xs font-semibold"
                    style={{ backgroundColor: '#16A34A' }}>
                    🎥 Join Class
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { emoji: '✏️', label: 'Classwork', href: '/child/dashboard/classwork' },
          { emoji: '📝', label: 'Homework', href: '/child/dashboard/homework' },
          { emoji: '📚', label: 'Learning Roadmap', href: '/child/dashboard/roadmap' },
          { emoji: '📊', label: 'My Results', href: '/child/dashboard/results' },
        ].map(item => (
          <Link key={item.href} href={item.href}
            className="bg-white rounded-2xl border border-gray-100 p-5 text-center hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="text-3xl mb-2">{item.emoji}</div>
            <p className="text-sm font-semibold" style={{ color: '#062850' }}>{item.label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
