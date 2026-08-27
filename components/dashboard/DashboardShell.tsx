'use client'

import { useState } from 'react'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardTopBar from '@/components/dashboard/DashboardTopBar'

interface Props {
  fullName: string
  email: string
  avatarUrl: string | null
  children: React.ReactNode
}

export default function DashboardShell({
  fullName,
  email,
  avatarUrl,
  children,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen">

      <DashboardSidebar
        fullName={fullName}
        email={email}
        avatarUrl={avatarUrl}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <DashboardTopBar
        fullName={fullName}
        email={email}
        avatarUrl={avatarUrl}
        onMobileMenuToggle={() => setMobileOpen((p) => !p)}
      />

      <main
        className="flex-1 lg:ml-64 min-h-screen pt-16"
        style={{ backgroundColor: '#F0F6FB' }}
      >
        {children}
      </main>

    </div>
  )
}
