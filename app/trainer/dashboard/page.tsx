import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Users, BookOpen, Calendar, DollarSign, ArrowRight, Clock } from 'lucide-react'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export default async function TrainerDashboardPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/staff-login')

  const admin = getAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('full_name, role, avatar_url, created_at')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile || profile.role !== 'trainer') redirect('/auth/staff-login')

  const firstName = profile.full_name?.split(' ')[0] || 'Trainer'

  // Future: fetch assigned students, earnings, schedule
  // For now show welcome state with clear next steps

  const stats = [
    { label: 'Assigned Students', value: 0, icon: Users, color: '#497296', href: '/trainer/dashboard/students' },
    { label: 'Active Courses', value: 0, icon: BookOpen, color: '#10B981', href: '/trainer/dashboard/courses' },
    { label: 'Classes This Week', value: 0, icon: Calendar, color: '#F59E0B', href: '/trainer/dashboard/schedule' },
    { label: 'Earnings This Month', value: '₦0', icon: DollarSign, color: '#16A34A', href: '/trainer/dashboard/earnings' },
  ]

  return (
    <div className="p-6 md:p-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#062850' }}>
          Welcome back, {firstName}! 👋
        </h1>
        <p className="text-gray-500 text-sm">
          Here is an overview of your teaching activity at Averra Knowledge Academy.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
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

      {/* Welcome state */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Getting started */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-lg mb-4" style={{ color: '#062850' }}>
            Getting Started
          </h2>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Complete your profile', desc: 'Add your photo, bio and teaching experience.', href: '/trainer/dashboard/profile', done: !!profile.avatar_url },
              { step: '2', title: 'Wait for student assignment', desc: 'The admin team will assign learners to you after their enrollment is confirmed.', href: '/trainer/dashboard/students', done: false },
              { step: '3', title: 'Confirm your schedule', desc: 'Once assigned, confirm the timetable that works for you and your students.', href: '/trainer/dashboard/schedule', done: false },
              { step: '4', title: 'Begin teaching', desc: 'Deliver your first class and track student progress from your dashboard.', href: '/trainer/dashboard/courses', done: false },
            ].map((item) => (
              <Link key={item.step} href={item.href}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: item.done ? '#16A34A' : '#497296' }}>
                  {item.done ? '✓' : item.step}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: '#062850' }}>{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 mt-0.5 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Contact + info */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-lg mb-4" style={{ color: '#062850' }}>
              Your Teaching Info
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Role', value: 'Trainer' },
                { label: 'Revenue Share', value: '60% per fixed course / 50% subscription / 65% live session' },
                { label: 'Payout Schedule', value: 'Monthly' },
                { label: 'Member Since', value: new Date(profile.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-start py-2 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-500">{item.label}</span>
                  <span className="text-xs font-semibold text-right max-w-[60%]" style={{ color: '#062850' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ backgroundColor: '#062850' }}>
            <div className="flex items-start gap-3 mb-4">
              <Clock className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white text-sm mb-1">Need Help?</p>
                <p className="text-blue-300 text-xs leading-relaxed">
                  Contact the Averra admin team for any questions about your account, students or schedule.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <a href="https://wa.me/2349033440966" target="_blank" rel="noopener noreferrer"
                className="flex-1 text-center py-2 rounded-xl text-white text-xs font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: '#16A34A' }}>
                WhatsApp
              </a>
              <a href="mailto:info@averraknowledgeacademy.com"
                className="flex-1 text-center py-2 rounded-xl text-white text-xs font-semibold border border-white/20 transition-all hover:bg-white/10">
                Email Us
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
