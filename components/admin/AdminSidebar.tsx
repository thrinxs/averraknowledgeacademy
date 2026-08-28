'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  GraduationCap,
  ShieldCheck,
  Users,
  Tag,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Globe,
  BookOpen,
  School,
  Briefcase,
  ChevronDown,
  UserCog,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface AdminSidebarProps {
  fullName: string
  email: string
  avatarUrl: string | null
}

type NavItem = {
  label: string
  href: string
  icon: React.ElementType
  badge: number
}

type NavSection = {
  title: string
  color: string
  items: NavItem[]
}

export default function AdminSidebar({
  fullName,
  email,
  avatarUrl,
}: AdminSidebarProps) {
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openSections, setOpenSections] = useState<
    Record<string, boolean>
  >({
    Scholarships: true,
    Academy: true,
    Skills: false,
    Careers: false,
    Staff: true,
    Users: true,
    Communications: true,
    Content: false,
  })
  const [pendingVerifications, setPendingVerifications] =
    useState(0)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [pendingAcademy, setPendingAcademy] = useState(0)

  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    const fetchCounts = async () => {
      // Pending scholarship verifications
      const { count: pendingCount } = await supabase
        .from('scholarship_matches')
        .select('*', { count: 'exact', head: true })
        .eq('is_verified', false)
      setPendingVerifications(pendingCount || 0)

      // Unread messages
      const { count: msgCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .is('receiver_id', null)
        .eq('is_read', false)
      setUnreadMessages(msgCount || 0)

      // Pending academy payments
      const { count: academyCount } = await supabase
        .from('academy_enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('payment_status', 'unpaid')
      setPendingAcademy(academyCount || 0)
    }
    fetchCounts()
    const interval = setInterval(fetchCounts, 30000)
    return () => clearInterval(interval)
  }, [mounted])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  function toggleSection(title: string) {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
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
      title: 'Scholarships',
      color: '#3B82F6',
      items: [
        {
          label: 'Applications',
          href: '/admin/dashboard/scholarships',
          icon: GraduationCap,
          badge: 0,
        },
        {
          label: 'Verify Matches',
          href: '/admin/dashboard/verification',
          icon: ShieldCheck,
          badge: pendingVerifications,
        },
        {
          label: 'Promo Codes',
          href: '/admin/dashboard/promos',
          icon: Tag,
          badge: 0,
        },
      ],
    },
    {
      title: 'Academy',
      color: '#10B981',
      items: [
        {
          label: 'Enrollments',
          href: '/admin/dashboard/academy',
          icon: School,
          badge: pendingAcademy,
        },
        {
          label: 'Children Profiles',
          href: '/admin/dashboard/academy/children',
          icon: Users,
          badge: 0,
        },
        {
          label: 'Timetables',
          href: '/admin/dashboard/academy/timetables',
          icon: BookOpen,
          badge: 0,
        },
        {
          label: 'Question Bank',
          href: '/admin/dashboard/academy/questions',
          icon: BookOpen,
          badge: 0,
        },
      ],
    },
    {
      title: 'Skills',
      color: '#F59E0B',
      items: [
        {
          label: 'All Courses',
          href: '/admin/dashboard/skills',
          icon: BookOpen,
          badge: 0,
        },
      ],
    },
    {
      title: 'Careers',
      color: '#8B5CF6',
      items: [
        {
          label: 'Programmes',
          href: '/admin/dashboard/careers',
          icon: Briefcase,
          badge: 0,
        },
      ],
    },
    {
      title: 'Staff',
      color: '#8B5CF6',
      items: [
        {
          label: 'Staff Members',
          href: '/admin/dashboard/staff',
          icon: UserCog,
          badge: 0,
        },
      ],
    },
    {
      title: 'Users',
      color: '#EC4899',
      items: [
        {
          label: 'All Users',
          href: '/admin/dashboard/users',
          icon: Users,
          badge: 0,
        },
      ],
    },
    {
      title: 'Communications',
      color: '#06B6D4',
      items: [
        {
          label: 'Messages',
          href: '/admin/dashboard/messages',
          icon: MessageSquare,
          badge: unreadMessages,
        },
      ],
    },
    {
      title: 'Content',
      color: '#64748B',
      items: [
        {
          label: 'Travel Requirements',
          href: '/admin/dashboard/travel',
          icon: Globe,
          badge: 0,
        },
        {
          label: 'Blog',
          href: '/admin/dashboard/blog',
          icon: BookOpen,
          badge: 0,
        },
      ],
    },
  ]

  const renderNavItem = (item: NavItem) => {
    const isActive =
      item.href === '/admin/dashboard'
        ? pathname === '/admin/dashboard'
        : pathname.startsWith(item.href)

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
            ? '3px solid #DC2626'
            : '3px solid transparent',
        }}
      >
        <item.icon
          className={`w-4 h-4 flex-shrink-0
          ${isActive
            ? 'text-white'
            : 'text-blue-300 group-hover:text-white'
          }`}
        />
        <span className="flex-1 text-sm">
          {item.label}
        </span>
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
            className="w-4 h-4 ml-auto text-blue-300"
          />
        )}
      </Link>
    )
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <Image
            src="/footer-logo.png"
            alt="Averra"
            width={40}
            height={40}
            className="object-contain"
          />
          <div>
            <p className="text-sm font-bold
            text-white leading-tight">
              Averra Admin
            </p>
            <p className="text-xs text-red-300
            leading-tight">
              Knowledge Academy
            </p>
          </div>
        </div>
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
              style={{ backgroundColor: '#DC2626' }}
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

      {/* Overview Link */}
      <div className="px-3 mb-1">
        <Link
          href="/admin/dashboard"
          className={`flex items-center gap-3
          px-4 py-2.5 rounded-xl text-sm
          font-medium transition-all duration-200
          group ${pathname === '/admin/dashboard'
            ? 'text-white'
            : 'text-blue-200 hover:text-white'
          }`}
          style={{
            backgroundColor:
              pathname === '/admin/dashboard'
                ? '#1D4469'
                : 'transparent',
            borderLeft:
              pathname === '/admin/dashboard'
                ? '3px solid #DC2626'
                : '3px solid transparent',
          }}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="flex-1">Overview</span>
          {pathname === '/admin/dashboard' && (
            <ChevronRight
              className="w-4 h-4 ml-auto
              text-blue-300"
            />
          )}
        </Link>
      </div>

      {/* Collapsible Sections */}
      <nav className="flex-1 px-3 space-y-1
      overflow-y-auto pb-4">
        {navSections.map((section) => {
          const isOpen = openSections[section.title]
          const hasActivePage = section.items.some(
            (item) =>
              pathname === item.href ||
              pathname.startsWith(item.href)
          )

          return (
            <div key={section.title}>
              {/* Section Header */}
              <button
                onClick={() =>
                  toggleSection(section.title)
                }
                className="w-full flex items-center
                gap-2 px-4 py-2 text-xs font-bold
                uppercase tracking-wider
                transition-colors hover:text-white"
                style={{
                  color: hasActivePage
                    ? section.color
                    : '#497296',
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full
                  flex-shrink-0"
                  style={{
                    backgroundColor: hasActivePage
                      ? section.color
                      : '#497296',
                  }}
                />
                <span className="flex-1 text-left">
                  {section.title}
                </span>
                {/* Total badge for section */}
                {section.items.reduce(
                  (sum, item) => sum + item.badge,
                  0
                ) > 0 && (
                  <span
                    className="text-xs font-bold
                    px-1.5 py-0.5 rounded-full
                    text-white"
                    style={{
                      backgroundColor: '#DC2626',
                    }}
                  >
                    {section.items.reduce(
                      (sum, item) => sum + item.badge,
                      0
                    )}
                  </span>
                )}
                <ChevronDown
                  className={`w-3 h-3 transition-transform
                  duration-200 flex-shrink-0
                  ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Section Items */}
              {isOpen && (
                <div className="pl-2 space-y-0.5">
                  {section.items.map(renderNavItem)}
                </div>
              )}
            </div>
          )
        })}
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

      {/* Mobile Header */}
      <div
        className="lg:hidden fixed top-0 left-0
        right-0 z-50 flex items-center
        justify-between px-4 h-16"
        style={{ backgroundColor: '#062850' }}
      >
        <div className="flex items-center gap-2">
          <Image
            src="/footer-logo.png"
            alt="Averra"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="text-sm font-bold
          text-white">
            Averra Admin
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white p-2"
        >
          {mobileOpen
            ? <X className="w-6 h-6" />
            : <Menu className="w-6 h-6" />
          }
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40
            bg-black/50"
            onClick={() => setMobileOpen(false)}
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

      <div className="lg:hidden h-16" />
    </>
  )
}