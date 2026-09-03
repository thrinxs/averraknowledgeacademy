'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Props {
  fullName: string
  avatarUrl: string | null
  ageGroup: 'primary' | 'secondary'
  mobileOpen: boolean
  onMobileClose: () => void
}

// Primary nav — big emojis, simple words
const PRIMARY_NAV = [
  { label: 'Home', href: '/child/dashboard', emoji: '🏠' },
  { label: 'My Classes', href: '/child/dashboard/timetable', emoji: '📅' },
  { label: 'Classwork', href: '/child/dashboard/classwork', emoji: '✏️' },
  { label: 'Homework', href: '/child/dashboard/homework', emoji: '📝' },
  { label: 'My Progress', href: '/child/dashboard/roadmap', emoji: '🌟' },
  { label: 'My Results', href: '/child/dashboard/results', emoji: '🏆' },
]

// Secondary nav — more standard labels
const SECONDARY_NAV = [
  { label: 'Dashboard', href: '/child/dashboard', emoji: '🏠' },
  { label: 'Timetable', href: '/child/dashboard/timetable', emoji: '📅' },
  { label: 'Classwork', href: '/child/dashboard/classwork', emoji: '✏️' },
  { label: 'Homework', href: '/child/dashboard/homework', emoji: '📝' },
  { label: 'Learning Roadmap', href: '/child/dashboard/roadmap', emoji: '📚' },
  { label: 'Results', href: '/child/dashboard/results', emoji: '📊' },
]

export default function ChildSidebar({ fullName, avatarUrl, ageGroup, mobileOpen, onMobileClose }: Props) {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const isPrimary = ageGroup === 'primary'
  const navItems = isPrimary ? PRIMARY_NAV : SECONDARY_NAV

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { onMobileClose() }, [pathname])

  const firstName = fullName?.split(' ')[0] || 'Student'
  const initials = fullName?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'S'

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  if (!mounted) return null

  // Primary colours — bright and fun
  const sidebarBg = isPrimary ? '#062850' : '#062850'
  const activeBg = isPrimary ? '#1D4469' : '#1D4469'

  const sidebarContent = (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="p-6 pb-4">
        <Link href="/child/dashboard" className="flex items-center gap-3">
          <Image src="/footer-logo.png" alt="Averra" width={36} height={36} className="object-contain" />
          <div>
            <p className="text-sm font-bold text-white leading-tight">
              {isPrimary ? 'Averra Academy' : 'Averra Academy'}
            </p>
            <p className="text-xs leading-tight" style={{ color: '#97C3E0' }}>
              {isPrimary ? '🌟 Learning is fun!' : 'Knowledge Academy'}
            </p>
          </div>
        </Link>
      </div>

      {/* Child avatar + greeting */}
      <div className="mx-4 mb-4 p-4 rounded-2xl text-center" style={{ backgroundColor: '#1D4469' }}>
        <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center text-xl font-bold text-white mx-auto mb-2"
          style={{ backgroundColor: isPrimary ? '#F59E0B' : '#497296' }}>
          {avatarUrl
            ? <Image src={avatarUrl} alt={fullName} width={64} height={64} className="w-full h-full object-cover" />
            : <span>{isPrimary ? '😊' : initials}</span>}
        </div>
        <p className="text-sm font-bold text-white">
          {isPrimary ? `Hi, ${firstName}! 👋` : firstName}
        </p>
        <p className="text-xs mt-0.5" style={{ color: '#97C3E0' }}>
          {isPrimary ? 'Ready to learn today?' : 'Welcome back'}
        </p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto pb-4">
        {navItems.map(item => {
          const isActive = item.href === '/child/dashboard'
            ? pathname === '/child/dashboard'
            : pathname.startsWith(item.href)

          if (isPrimary) {
            return (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200"
                style={{
                  backgroundColor: isActive ? activeBg : 'transparent',
                  color: isActive ? '#ffffff' : '#93C5FD',
                  border: isActive ? '2px solid #97C3E0' : '2px solid transparent',
                }}>
                <span className="text-2xl">{item.emoji}</span>
                <span>{item.label}</span>
              </Link>
            )
          }

          return (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: isActive ? activeBg : 'transparent',
                borderLeft: isActive ? '3px solid #97C3E0' : '3px solid transparent',
                color: isActive ? '#ffffff' : '#93C5FD',
              }}>
              <span>{item.emoji}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t" style={{ borderColor: '#1D4469' }}>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-blue-200 hover:text-red-300 hover:bg-red-500/10 transition-all">
          <LogOut className="w-4 h-4" />
          {isPrimary ? 'Log Out ��' : 'Log Out'}
        </button>
      </div>

    </div>
  )

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:z-50"
        style={{ backgroundColor: sidebarBg }}>
        {sidebarContent}
      </aside>
      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={onMobileClose} />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 flex flex-col"
            style={{ backgroundColor: sidebarBg }}>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  )
}
