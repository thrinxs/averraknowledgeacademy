import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Users, BookOpen, Calendar, BarChart3, ArrowRight, AlertCircle } from 'lucide-react'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export default async function PrincipalDashboardPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/staff-login')

  const admin = getAdminClient()
  const { data: profile } = await admin.from('profiles').select('full_name, role, created_at').eq('id', user.id).single()
  if (!profile || profile.role !== 'principal') redirect('/auth/staff-login')

  const firstName = profile.full_name?.split(' ')[0] || 'Principal'

  // Fetch platform-wide stats
  const [studentsRes, tutorsRes, enrollmentsRes, cwRes, testRes, attendanceRes] = await Promise.all([
    admin.from('academy_children').select('id', { count: 'exact', head: true }),
    admin.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'trainer'),
    admin.from('academy_enrollments').select('id', { count: 'exact', head: true }).eq('payment_status', 'paid'),
    admin.from('classwork').select('score, max_score').eq('status', 'submitted'),
    admin.from('tests_exams').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
    admin.from('attendance').select('status').eq('class_date', new Date().toISOString().split('T')[0]),
  ])

  const totalStudents = studentsRes.count || 0
  const totalTutors = tutorsRes.count || 0
  const activeEnrollments = enrollmentsRes.count || 0

  // Average classwork score
  const cwData = cwRes.data || []
  const avgScore = cwData.length > 0
    ? Math.round(cwData.reduce((sum, c) => sum + ((c.score || 0) / (c.max_score || 1)) * 100, 0) / cwData.length)
    : null

  // Today's attendance
  const todayAttendance = attendanceRes.data || []
  const presentToday = todayAttendance.filter(a => a.status === 'present').length
  const absentToday = todayAttendance.filter(a => a.status === 'absent').length

  // Unread notifications for principal
  const { data: notifications } = await admin
    .from('notifications')
    .select('id, title, message, created_at, link')
    .eq('user_id', user.id)
    .eq('is_read', false)
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    { label: 'Active Students', value: totalStudents, icon: Users, color: '#497296', href: '/principal/dashboard/students' },
    { label: 'Tutors', value: totalTutors, icon: Users, color: '#10B981', href: '/principal/dashboard/tutors' },
    { label: 'Active Enrollments', value: activeEnrollments, icon: BookOpen, color: '#062850', href: '/principal/dashboard/students' },
    { label: 'Avg Classwork Score', value: avgScore !== null ? `${avgScore}%` : 'N/A', icon: BarChart3, color: '#F59E0B', href: '/principal/dashboard/results' },
    { label: 'Present Today', value: presentToday, icon: Calendar, color: '#16A34A', href: '/principal/dashboard/attendance' },
    { label: 'Absent Today', value: absentToday, icon: AlertCircle, color: '#DC2626', href: '/principal/dashboard/attendance' },
  ]

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#062850' }}>
          Welcome back, {firstName}! 👋
        </h1>
        <p className="text-gray-500 text-sm">Here is the academic overview for Averra Knowledge Academy.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {stats.map(stat => (
          <Link key={stat.label} href={stat.href}
            className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <p className="text-2xl font-bold mb-0.5" style={{ color: '#062850' }}>{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-lg mb-4" style={{ color: '#062850' }}>
            Alerts & Notifications
          </h2>
          {(!notifications || notifications.length === 0) ? (
            <p className="text-gray-400 text-sm">No new notifications</p>
          ) : (
            <div className="space-y-3">
              {notifications.map(notif => (
                <Link key={notif.id} href={notif.link || '/principal/dashboard'}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                    style={{ backgroundColor: '#F59E0B' }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: '#062850' }}>{notif.title}</p>
                    <p className="text-xs text-gray-500 truncate">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(notif.created_at).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-lg mb-4" style={{ color: '#062850' }}>Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: 'View all students', href: '/principal/dashboard/students', desc: 'Monitor student progress' },
              { label: 'Manage tutors', href: '/principal/dashboard/tutors', desc: 'Assign and review tutors' },
              { label: 'Review curriculum', href: '/principal/dashboard/curriculum', desc: 'Edit lesson plans and topics' },
              { label: 'Manage timetable', href: '/principal/dashboard/timetable', desc: 'Set class schedules' },
              { label: 'View results', href: '/principal/dashboard/results', desc: 'All classwork and test scores' },
            ].map(item => (
              <Link key={item.label} href={item.href}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#062850' }}>{item.label}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
