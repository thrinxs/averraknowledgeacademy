import CurriculumExplorer from '@/components/academy/CurriculumExplorer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Explore the Curriculum | Averra Academy',
  description: 'Explore the Averra Super Curriculum — a fusion of seven of the world\'s best education systems into one personalised learning plan.',
}

export default function CurriculumPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <div
        className="py-16 px-4 text-center"
        style={{
          background: 'linear-gradient(135deg, #062850 0%, #1D4469 50%, #325E84 100%)',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <Link
            href="/academy"
            className="inline-flex items-center gap-2 text-blue-300
            hover:text-white transition-colors mb-8 text-sm group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200
            group-hover:-translate-x-1" />
            Back to Academy
          </Link>

          <div className="text-5xl mb-6">📚</div>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            The Averra Super Curriculum
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto leading-relaxed">
            A fusion of seven of the world&apos;s best education systems —
            personalised to every learner, at every stage, in every country.
          </p>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path d="M0 60L60 54C120 48 240 36 360 30C480 24 600 24 720 27C840
            30 960 36 1080 39C1200 42 1320 42 1380 42L1440 42V60H1380C1320 60
            1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60
            120 60 60 60H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Curriculum Explorer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <CurriculumExplorer />
      </div>

    </div>
  )
}
