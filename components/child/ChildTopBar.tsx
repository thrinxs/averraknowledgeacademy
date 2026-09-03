'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { LogOut, Menu, ChevronDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Props {
  fullName: string
  yearGroupLabel: string
  avatarUrl: string | null
  ageGroup: 'primary' | 'secondary'
  onMobileMenuToggle: () => void
}

export default function ChildTopBar({
  fullName, yearGroupLabel, avatarUrl, ageGroup, onMobileMenuToggle,
}: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const isPrimary = ageGroup === 'primary'

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const firstName = fullName?.split(' ')[0] || 'Student'
  const initials = fullName?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'S'

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 h-16 flex items-center justify-between px-4 md:px-6 border-b border-gray-100 bg-white">

      {/* Mobile hamburger */}
      <button onClick={onMobileMenuToggle}
        className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
        <Menu className="w-5 h-5" />
      </button>

      {/* Center greeting (primary) or title (secondary) */}
      <div className="flex-1 lg:flex-none px-2 lg:px-0">
        {isPrimary ? (
          <div className="flex items-center gap-2">
            <span className="text-lg">📚</span>
            <span className="text-sm font-bold hidden sm:block" style={{ color: '#062850' }}>
              {new Date().toLocaleDateString('en-GB', { weekday: 'long' })}'s Learning
            </span>
            <span className="text-sm font-bold sm:hidden" style={{ color: '#062850' }}>
              Averra Academy
            </span>
          </div>
        ) : (
          <span className="text-sm font-bold" style={{ color: '#062850' }}>
            {yearGroupLabel} — Averra Academy
          </span>
        )}
      </div>

      {/* Avatar dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button onClick={() => setDropdownOpen(p => !p)}
          className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors">
          <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ backgroundColor: isPrimary ? '#F59E0B' : '#497296' }}>
            {avatarUrl
              ? <Image src={avatarUrl} alt={fullName} width={36} height={36} className="w-full h-full object-cover" />
              : isPrimary ? <span>😊</span> : <span>{initials}</span>}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold leading-tight" style={{ color: '#062850' }}>
              {isPrimary ? firstName : fullName}
            </p>
            <p className="text-xs leading-tight text-gray-400">{yearGroupLabel}</p>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 hidden md:block transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-gray-100" style={{ backgroundColor: '#F0F6FB' }}>
              <p className="text-sm font-bold truncate" style={{ color: '#062850' }}>{fullName}</p>
              <p className="text-xs text-gray-400">{yearGroupLabel}</p>
            </div>
            <div className="py-1">
              <button
                onClick={async () => { await supabase.auth.signOut(); window.location.href = '/auth/login' }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                <LogOut className="w-4 h-4" />
                {isPrimary ? 'Log Out 👋' : 'Log Out'}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
