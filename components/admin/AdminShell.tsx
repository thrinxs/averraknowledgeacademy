'use client'

import { useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopBar from '@/components/admin/AdminTopBar'

interface Props {
  fullName: string
  email: string
  avatarUrl: string | null
  children: React.ReactNode
}

export default function AdminShell({
  fullName,
  email,
  avatarUrl,
  children,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      <AdminSidebar
        fullName={fullName}
        email={email}
        avatarUrl={avatarUrl}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <AdminTopBar
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
