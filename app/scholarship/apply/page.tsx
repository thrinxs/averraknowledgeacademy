import type { Metadata } from 'next'
import { Suspense } from 'react'
import FormShell from '@/components/scholarship/form/FormShell'

export const metadata: Metadata = {
  title: 'Apply for Scholarship Matching | Averra Knowledge Academy',
  description:
    'Fill your profile and get matched with fully funded ' +
    'scholarships across 50+ countries. Takes less than 5 minutes.',
}

export default function ApplyPage() {
  return (
    <div
      className="min-h-screen py-12"
      style={{ backgroundColor: '#F0F6FB' }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="text-center mb-10">
          <h1
            className="text-3xl md:text-4xl font-bold mb-3 leading-tight"
            style={{ color: '#062850' }}
          >
            Start Your Scholarship Journey
          </h1>
          <p className="text-gray-600 text-lg">
            Complete the form below — it takes less than
            5 minutes. Your progress is saved automatically.
          </p>
        </div>

        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div
                className="w-10 h-10 rounded-full border-2 animate-spin mx-auto mb-4"
                style={{ borderColor: '#062850', borderTopColor: 'transparent' }}
              />
              <p className="text-sm" style={{ color: '#497296' }}>
                Loading your form...
              </p>
            </div>
          </div>
        }>
          <FormShell />
        </Suspense>

      </div>
    </div>
  )
}