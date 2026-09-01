import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Users, School, MessageSquare, ArrowRight, Clock } from 'lucide-react'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export default async function StaffDashboardPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/staff-login')

  const admin = getAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('full_name, role, avatar_url, created_at')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile || profile.role !== 'staff') redirect('/auth/staff-login')

  const firstName = profile.full_name?.split(' ')[0] || 'Staff'

  // Fetch pending academy enrollments for staff to manage
  const { count: pendingEnrollments } = await admin
    .from('academy_enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('payment_status', 'unpaid')

  const { count: activeEnrollments } = await admin
    .from('academy_enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('payment_status', 'paid')

  const { count: totalStudents } = await admin
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'student')

  const stats = [
    { label: 'Total Students', value: totalStudents || 0, icon: Users, color: '#497296', href: '/staff/dashboard/students' },
    { label: 'Active Enrollments', value: activeEnrollments || 0, icon: School, color: '#16A34A', href: '/staff/dashboard/enrollments' },
    { label: 'Pending Payment', value: pendingEnrollments || 0, icon: Clock, color: '#F59E0B', href: '/staff/dashboard/enrollments' },
    { label: 'Messages', value: 0, icon: MessageSquare, color: '#8B5CF6', href: '/staff/dashboard/messages' },
  ]

  return (
    <div className="p-6 md:p-10">

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#062850' }}>
          Welcome back, {firstName}! 👋
        </h1>
        <p className="text-gray-500 text-sm">
          Here is an overview of your activity at Averra Knowledge Academy.
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

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-lg mb-4" style={{ color: '#062850' }}>Quick Actions</h2>
          <div className="space-y-3">
            {[
              { title: 'View all enrollments', desc: 'Manage academy enrollments and payment status', href: '/staff/dashboard/enrollments' },
              { title: 'View all students', desc: 'Browse student profiles and progress', href: '/staff/dashboard/students' },
              { title: 'Messages', desc: 'Communicate with parents and students', href: '/staff/dashboard/messages' },
              { title: 'Update your profile', desc: 'Keep your staff profile up to date', href: '/staff/dashboard/profile' },
            ].map((item) => (
              <Link key={item.title} href={item.href}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: '#062850' }}>{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 mt-0.5 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ backgroundColor: '#062850' }}>
          <p className="font-bold text-white text-lg mb-1">Need Help?</p>
          <p className="text-blue-300 text-sm mb-4 leading-relaxed">
            Contact the Averra admin team for any questions about your role, access or responsibilities.
          </p>
          <div className="flex gap-3">
            <a href="https://wa.me/2349033440966" target="_blank" rel="noopener noreferrer"
              className="flex-1 text-center py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: '#16A34A' }}>
              WhatsApp
            </a>
            <a href="mailto:info@averraknowledgeacademy.com"
              className="flex-1 text-center py-2.5 rounded-xl text-white text-sm font-semibold border border-white/20 transition-all hover:bg-white/10">
              Email Us
            </a>
          </div>
        </div>
      </div>

    </div>
  )
}
