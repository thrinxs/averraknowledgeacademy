import type { Metadata } from 'next'
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
      <div className="max-w-3xl mx-auto px-4
      sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="text-center mb-10">
          <h1
            className="text-3xl md:text-4xl font-bold
            mb-3 leading-tight"
            style={{ color: '#062850' }}
          >
            Start Your Scholarship Journey
          </h1>
          <p className="text-gray-600 text-lg">
            Complete the form below — it takes less than
            5 minutes. Your progress is saved automatically.
          </p>
        </div>

        <FormShell />

      </div>
    </div>
  )
}