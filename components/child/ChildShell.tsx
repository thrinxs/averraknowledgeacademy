'use client'

import { useState } from 'react'
import ChildSidebar from '@/components/child/ChildSidebar'
import ChildTopBar from '@/components/child/ChildTopBar'

interface Props {
  fullName: string
  email: string
  avatarUrl: string | null
  ageGroup: 'primary' | 'secondary'
  yearGroupLabel: string
  childId: string
  enrollmentId: string
  subjects: string[]
  children: React.ReactNode
}

export default function ChildShell({
  fullName, email, avatarUrl, ageGroup,
  yearGroupLabel, childId, enrollmentId, subjects, children,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: ageGroup === 'primary' ? '#F0F6FB' : '#F8FAFC' }}>
      <ChildSidebar
        fullName={fullName}
        avatarUrl={avatarUrl}
        ageGroup={ageGroup}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <ChildTopBar
        fullName={fullName}
        yearGroupLabel={yearGroupLabel}
        avatarUrl={avatarUrl}
        ageGroup={ageGroup}
        onMobileMenuToggle={() => setMobileOpen(p => !p)}
      />
      <main className="flex-1 lg:ml-64 min-h-screen pt-16">
        {children}
      </main>
    </div>
  )
}
