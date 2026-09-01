'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { User, Settings, LogOut, ChevronDown, Menu } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Props {
  fullName: string
  email: string
  avatarUrl: string | null
  onMobileMenuToggle: () => void
}

export default function StaffTopBar({ fullName, email, avatarUrl, onMobileMenuToggle }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/auth/staff-login'
  }

  const initials = fullName
    ? fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'S'
  const firstName = fullName?.split(' ')[0] || 'Staff'

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 h-16 flex items-center justify-between px-4 md:px-6 border-b border-gray-100 bg-white">
      <button onClick={onMobileMenuToggle}
        className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex-1 lg:flex-none px-2 lg:px-0">
        <span className="lg:hidden text-sm font-bold" style={{ color: '#062850' }}>Averra Staff Portal</span>
      </div>
      <div className="relative" ref={dropdownRef}>
        <button onClick={() => setDropdownOpen((p) => !p)}
          className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors">
          <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ backgroundColor: '#497296' }}>
            {avatarUrl
              ? <Image src={avatarUrl} alt={fullName} width={36} height={36} className="w-full h-full object-cover" />
              : <span>{initials}</span>}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold leading-tight" style={{ color: '#062850' }}>{firstName}</p>
            <p className="text-xs text-gray-400 leading-tight max-w-[140px] truncate">{email}</p>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 hidden md:block transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-gray-100" style={{ backgroundColor: '#F0F6FB' }}>
              <p className="text-sm font-bold truncate" style={{ color: '#062850' }}>{fullName}</p>
              <p className="text-xs text-gray-400 truncate">{email}</p>
            </div>
            <div className="py-1">
              <Link href="/staff/dashboard/profile" onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <User className="w-4 h-4 text-gray-400" /> My Profile
              </Link>
              <Link href="/staff/dashboard/settings" onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4 text-gray-400" /> Settings
              </Link>
              <div className="border-t border-gray-100 mt-1 pt-1">
                <a href="/" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  <span className="text-gray-400">&larr;</span> Back to Website
                </a>
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
