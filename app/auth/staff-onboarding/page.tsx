import { Suspense } from 'react'
import type { Metadata } from 'next'
import StaffOnboardingForm from '@/components/auth/StaffOnboardingForm'

export const metadata: Metadata = {
  title: 'Staff Onboarding | Averra Knowledge Academy',
}

export default function StaffOnboardingPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: '#F0F6FB' }}
    >
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#062850' }}>
            Complete Your Staff Account
          </h1>
          <p className="text-gray-500 text-sm">
            Set up your security credentials to activate your account.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: '#062850', borderTopColor: 'transparent' }} />
            </div>
          }>
            <StaffOnboardingForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
