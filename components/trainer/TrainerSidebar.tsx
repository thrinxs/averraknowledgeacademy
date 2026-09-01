'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  DollarSign,
  User,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Props {
  fullName: string
  email: string
  avatarUrl: string | null
  mobileOpen: boolean
  onMobileClose: () => void
}

const NAV_ITEMS = [
  { label: 'Dashboard',         href: '/trainer/dashboard',             icon: LayoutDashboard },
  { label: 'My Students',       href: '/trainer/dashboard/students',    icon: Users },
  { label: 'Learning Roadmap',  href: '/trainer/dashboard/roadmap',     icon: BookOpen },
  { label: 'Classwork',         href: '/trainer/dashboard/classwork',  icon: BookOpen },
  { label: 'Assessments',       href: '/trainer/dashboard/assessments', icon: BookOpen },
  { label: 'My Courses',        href: '/trainer/dashboard/courses',     icon: BookOpen },
  { label: 'Schedule',          href: '/trainer/dashboard/schedule',    icon: Calendar },
  { label: 'Earnings',          href: '/trainer/dashboard/earnings',    icon: DollarSign },
  { label: 'My Profile',        href: '/trainer/dashboard/profile',     icon: User },
  { label: 'Settings',          href: '/trainer/dashboard/settings',    icon: Settings },
]

export default function TrainerSidebar({
  fullName,
  email,
  avatarUrl,
  mobileOpen,
  onMobileClose,
}: Props) {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { onMobileClose() }, [pathname])

  const initials = fullName
    ? fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'T'

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/auth/staff-login'
  }

  if (!mounted) return null

  const sidebarContent = (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="p-6 pb-4">
        <Link href="/trainer/dashboard" className="flex items-center gap-3">
          <Image src="/footer-logo.png" alt="Averra" width={36} height={36} className="object-contain" />
          <div>
            <p className="text-sm font-bold text-white leading-tight">Averra Trainer</p>
            <p className="text-xs text-blue-300 leading-tight">Knowledge Academy</p>
          </div>
        </Link>
      </div>

      {/* User info */}
      <div className="mx-4 mb-4 p-3 rounded-xl" style={{ backgroundColor: '#1D4469' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ backgroundColor: '#497296' }}>
            {avatarUrl
              ? <Image src={avatarUrl} alt={fullName} width={36} height={36} className="w-full h-full object-cover" />
              : <span>{initials}</span>}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{fullName}</p>
            <p className="text-xs text-blue-300 truncate">{email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto pb-4">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/trainer/dashboard'
            ? pathname === '/trainer/dashboard'
            : pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
              style={{
                backgroundColor: isActive ? '#1D4469' : 'transparent',
                borderLeft: isActive ? '3px solid #97C3E0' : '3px solid transparent',
                color: isActive ? '#ffffff' : '#93C5FD',
              }}>
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 text-blue-300" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t" style={{ borderColor: '#1D4469' }}>
        <a href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-blue-200 hover:text-white transition-colors mb-2">
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to Website
        </a>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-blue-200 hover:text-red-300 hover:bg-red-500/10 transition-all">
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>

    </div>
  )

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:z-50"
        style={{ backgroundColor: '#062850' }}>
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={onMobileClose} />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 flex flex-col"
            style={{ backgroundColor: '#062850' }}>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  )
}
