import type { Metadata } from 'next'
import { Suspense } from 'react'
import StaffLoginForm from '@/components/auth/StaffLoginForm'

export const metadata: Metadata = {
  title: 'Staff Login | Averra Knowledge Academy',
}

export default function StaffLoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: '#062850' }}
    >
      <div className="w-full max-w-md">

        {/* Logo + title */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white"
            style={{ backgroundColor: '#1D4469' }}
          >
            A
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Staff Portal
          </h1>
          <p className="text-blue-300 text-sm">
            Averra Knowledge Academy
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: '#062850', borderTopColor: 'transparent' }} />
            </div>
          }>
            <StaffLoginForm />
          </Suspense>
        </div>

        <p className="text-center text-blue-400 text-xs mt-6">
          Not a staff member?{' '}
          <a href="/auth/login" className="text-blue-200 hover:text-white underline transition-colors">
            Return to main login
          </a>
        </p>

      </div>
    </div>
  )
}
