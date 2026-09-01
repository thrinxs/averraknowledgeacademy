'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  GraduationCap,
  Trophy,
  Bell,
  MessageSquare,
  User,
  Settings,
  LogOut,
  ChevronRight,
  BookOpen,
  Briefcase,
  School,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface SidebarProps {
  fullName: string
  email: string
  avatarUrl: string | null
  mobileOpen?: boolean
  onMobileClose?: () => void
}

type NavSection = {
  title: string
  items: NavItem[]
}

type NavItem = {
  label: string
  href: string
  icon: React.ElementType
  badge: number
}

export default function DashboardSidebar({
  fullName,
  email,
  avatarUrl,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const [mounted, setMounted] = useState(false)
  const [unreadNotifs, setUnreadNotifs] = useState(0)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [hasAcademy, setHasAcademy] = useState(false)
  const [hasScholarship, setHasScholarship] = useState(false)

  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchData = async () => {
      const { data: { user } } =
        await supabase.auth.getUser()
      if (!user) return

      // Unread notifications
      const { count: notifCount } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false)
      setUnreadNotifs(notifCount || 0)

      // Unread messages
      const { count: msgCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('is_read', false)
      setUnreadMessages(msgCount || 0)

      // Check if user has academy enrollment
      const { data: academyData } = await supabase
        .from('academy_enrollments')
        .select('id')
        .eq('parent_id', user.id)
        .maybeSingle()
      setHasAcademy(!!academyData)

      // Check if user has scholarship application
      const { data: scholarshipData } = await supabase
        .from('scholarship_preferences')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()
      setHasScholarship(!!scholarshipData)
    }

    fetchData()

    const notifSub = supabase
      .channel('dashboard-notifs')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
      }, fetchData)
      .subscribe()

    return () => { notifSub.unsubscribe() }
  }, [mounted])


  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (!mounted) return null

  const navSections: NavSection[] = [
    {
      title: '',
      items: [
        {
          label: 'Dashboard',
          href: '/dashboard',
          icon: LayoutDashboard,
          badge: 0,
        },
      ],
    },
    {
      title: 'Scholarships',
      items: [
        {
          label: 'My Application',
          href: '/dashboard/scholarship',
          icon: GraduationCap,
          badge: 0,
        },
        {
          label: 'My Matches',
          href: '/dashboard/matches',
          icon: Trophy,
          badge: 0,
        },
      ],
    },
    {
      title: 'Academy',
      items: [
        {
          label: 'My Enrollment',
          href: '/dashboard/academy',
          icon: School,
          badge: 0,
        },
        {
          label: 'Learning Roadmap',
          href: '/dashboard/academy/roadmap',
          icon: BookOpen,
          badge: 0,
        },
      ],
    },
    {
      title: 'Skills',
      items: [
        {
          label: 'My Courses',
          href: '/dashboard/courses',
          icon: BookOpen,
          badge: 0,
        },
      ],
    },
    {
      title: 'Careers',
      items: [
        {
          label: 'My Programme',
          href: '/dashboard/careers',
          icon: Briefcase,
          badge: 0,
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          label: 'Notifications',
          href: '/dashboard/notifications',
          icon: Bell,
          badge: unreadNotifs,
        },
        {
          label: 'Messages',
          href: '/dashboard/messages',
          icon: MessageSquare,
          badge: unreadMessages,
        },
        {
          label: 'Profile',
          href: '/dashboard/profile',
          icon: User,
          badge: 0,
        },
        {
          label: 'Settings',
          href: '/dashboard/settings',
          icon: Settings,
          badge: 0,
        },
      ],
    },
  ]

  const renderNavItem = (item: NavItem) => {
    const isActive =
      pathname === item.href ||
      (item.href !== '/dashboard' &&
        pathname.startsWith(item.href))

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-3
        px-4 py-2.5 rounded-xl text-sm
        font-medium transition-all duration-200
        group ${isActive
          ? 'text-white'
          : 'text-blue-200 hover:text-white'
        }`}
        style={{
          backgroundColor: isActive
            ? '#1D4469'
            : 'transparent',
          borderLeft: isActive
            ? '3px solid #97C3E0'
            : '3px solid transparent',
        }}
      >
        <item.icon
          className={`w-5 h-5 flex-shrink-0
          ${isActive
            ? 'text-white'
            : 'text-blue-300 group-hover:text-white'
          }`}
        />
        <span className="flex-1">{item.label}</span>
        {item.badge > 0 && (
          <span
            className="flex items-center
            justify-center w-5 h-5 rounded-full
            text-xs font-bold text-white flex-shrink-0"
            style={{ backgroundColor: '#DC2626' }}
          >
            {item.badge > 9 ? '9+' : item.badge}
          </span>
        )}
        {isActive && item.badge === 0 && (
          <ChevronRight
            className="w-4 h-4 ml-auto
            text-blue-300"
          />
        )}
      </Link>
    )
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="p-6 pb-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/footer-logo.png"
            alt="Averra Knowledge Academy"
            width={40}
            height={40}
            className="object-contain"
          />
          <div>
            <p className="text-sm font-bold
            text-white leading-tight">
              Averra Knowledge
            </p>
            <p className="text-xs text-blue-300
            leading-tight">
              Academy
            </p>
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div
        className="mx-4 mb-4 p-3 rounded-xl"
        style={{ backgroundColor: '#1D4469' }}
      >
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={fullName}
              width={36}
              height={36}
              className="rounded-full object-cover
              flex-shrink-0"
            />
          ) : (
            <div
              className="w-9 h-9 rounded-full flex
              items-center justify-center text-xs
              font-bold text-white flex-shrink-0"
              style={{ backgroundColor: '#497296' }}
            >
              {initials}
            </div>
          )}
          <div className="overflow-hidden">
            <p className="text-sm font-semibold
            text-white truncate">
              {fullName}
            </p>
            <p className="text-xs text-blue-300 truncate">
              {email}
            </p>
          </div>
        </div>
      </div>

      {/* Nav Sections */}
      <nav className="flex-1 px-3 space-y-1
      overflow-y-auto pb-4">
        {navSections.map((section) => (
          <div key={section.title || 'main'}>
            {section.title && (
              <p
                className="px-4 pt-4 pb-1.5 text-xs
                font-bold uppercase tracking-wider"
                style={{ color: '#497296' }}
              >
                {section.title}
              </p>
            )}
            {section.items.map(renderNavItem)}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div
        className="p-4 border-t"
        style={{ borderColor: '#1D4469' }}
      >
        <a
          href="/"
          className="flex items-center gap-3
          px-4 py-2.5 rounded-xl text-sm
          text-blue-200 hover:text-white
          transition-colors mb-2"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to Website
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3
          px-4 py-2.5 rounded-xl text-sm
          text-blue-200 hover:text-red-300
          hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>

    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex lg:flex-col
        lg:fixed lg:inset-y-0 lg:left-0
        lg:w-64 lg:z-50"
        style={{ backgroundColor: '#062850' }}
      >
        {sidebarContent}
      </aside>


      {/* Mobile Overlay */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40
            bg-black/50"
            onClick={() => onMobileClose?.()}
          />
          <aside
            className="lg:hidden fixed inset-y-0
            left-0 z-50 w-64 flex flex-col"
            style={{ backgroundColor: '#062850' }}
          >
            {sidebarContent}
          </aside>
        </>
      )}

    </>
  )
}