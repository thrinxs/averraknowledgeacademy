'use client'

import { useState } from 'react'
import StaffSidebar from '@/components/staff/StaffSidebar'
import StaffTopBar from '@/components/staff/StaffTopBar'

interface Props {
  fullName: string
  email: string
  avatarUrl: string | null
  children: React.ReactNode
}

export default function StaffShell({ fullName, email, avatarUrl, children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      <StaffSidebar
        fullName={fullName}
        email={email}
        avatarUrl={avatarUrl}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <StaffTopBar
        fullName={fullName}
        email={email}
        avatarUrl={avatarUrl}
        onMobileMenuToggle={() => setMobileOpen((p) => !p)}
      />
      <main className="flex-1 lg:ml-64 min-h-screen pt-16" style={{ backgroundColor: '#F0F6FB' }}>
        {children}
      </main>
    </div>
  )
}
