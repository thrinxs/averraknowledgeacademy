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
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface SidebarProps {
  fullName: string
  email: string
  avatarUrl: string | null
}

export default function DashboardSidebar({
  fullName,
  email,
  avatarUrl,
}: SidebarProps) {
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [unreadNotifs, setUnreadNotifs] =
    useState(0)
  const [unreadMessages, setUnreadMessages] =
    useState(0)

  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch unread counts
  useEffect(() => {
    if (!mounted) return

    const fetchCounts = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

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
    }

    fetchCounts()

    // Subscribe to real-time notification changes
    const notifSubscription = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
        },
        () => {
          fetchCounts()
        }
      )
      .subscribe()

    return () => {
      notifSubscription.unsubscribe()
    }
  }, [mounted])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

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

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      badge: 0,
    },
    {
      label: 'My Scholarship',
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
  ]

  const sidebarContent = (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="p-6 pb-4">
        <Link
          href="/"
          className="flex items-center gap-3"
        >
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
        className="mx-4 mb-6 p-3 rounded-xl"
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
            <p className="text-xs text-blue-300
            truncate">
              {email}
            </p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' &&
              pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3
              px-4 py-3 rounded-xl text-sm
              font-medium transition-all duration-200
              group ${
                isActive
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
              <span className="flex-1">
                {item.label}
              </span>

              {/* Unread badge */}
              {item.badge > 0 && (
                <span
                  className="flex items-center
                  justify-center w-5 h-5 rounded-full
                  text-xs font-bold text-white
                  flex-shrink-0"
                  style={{
                    backgroundColor: '#DC2626',
                  }}
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
        })}
      </nav>

      {/* Bottom Section */}
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
          <ChevronRight className="w-4 h-4
          rotate-180" />
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
        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <Image
            src="/footer-logo.png"
            alt="Averra"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="text-sm font-bold
          text-white">
            Averra
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Mobile notification badge */}
          {unreadNotifs > 0 && (
            <Link href="/dashboard/notifications">
              <div className="relative">
                <Bell className="w-5 h-5
                text-blue-200" />
                <span
                  className="absolute -top-1 -right-1
                  w-4 h-4 rounded-full text-xs
                  font-bold text-white flex items-center
                  justify-center"
                  style={{ backgroundColor: '#DC2626' }}
                >
                  {unreadNotifs > 9
                    ? '9+'
                    : unreadNotifs}
                </span>
              </div>
            </Link>
          )}

          <button
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
            className="text-white p-2"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
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

      {/* Mobile spacer */}
      <div className="lg:hidden h-20" />
    </>
  )
}