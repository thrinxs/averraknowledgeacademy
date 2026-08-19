'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function AcademyHero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #062850 0%, #1D4469 40%, #325E84 70%, #497296 100%)',
      }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10 animate-pulse"
        style={{ backgroundColor: '#497296' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10 animate-pulse"
        style={{ backgroundColor: '#325E84', animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full opacity-5 animate-pulse"
        style={{ backgroundColor: '#97C3E0', animationDelay: '2s' }} />
      </div>

      {/* Floating icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { emoji: '📚', top: '15%', left: '8%', delay: '0s', size: 'text-4xl' },
          { emoji: '🎓', top: '25%', right: '10%', delay: '1s', size: 'text-5xl' },
          { emoji: '🌍', bottom: '30%', left: '12%', delay: '2s', size: 'text-3xl' },
          { emoji: '✏️', top: '60%', right: '8%', delay: '0.5s', size: 'text-4xl' },
          { emoji: '🏆', bottom: '20%', right: '20%', delay: '1.5s', size: 'text-3xl' },
          { emoji: '💡', top: '40%', left: '5%', delay: '2.5s', size: 'text-3xl' },
        ].map((item, i) => (
          <div
            key={i}
            className={`absolute opacity-20 animate-bounce ${item.size}`}
            style={{
              top: item.top,
              bottom: item.bottom,
              left: item.left,
              right: item.right,
              animationDelay: item.delay,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          >
            {item.emoji}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
          text-sm font-semibold text-white border border-white/20
          bg-white/10 backdrop-blur-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            🎓 Junior Academy Now Enrolling — Limited Spaces
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold
          text-white leading-tight mb-6">
            Education for{' '}
            <span className="relative inline-block" style={{ color: '#97C3E0' }}>
              Every Stage
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M1 9C50 3 150 1 299 9" stroke="#497296" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>
            <br />
            of Life.
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-6 leading-relaxed">
            From a child&apos;s first school years to adult professional excellence —
            Averra Academy is a global learning ecosystem that meets every learner
            exactly where they are, and takes them far beyond where they expect to go.
          </p>

          {/* Smarter Than Einstein */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full
          mb-10 border border-white/30 bg-white/10 backdrop-blur-sm">
            <span className="text-yellow-300 text-xl">✨</span>
            <span className="text-white font-semibold text-sm md:text-base italic">
              Smarter Than Einstein
            </span>
            <span className="text-blue-200 text-sm">
              — Understand. Don&apos;t Memorise.
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center
          justify-center gap-4 mb-16">
            <Link href="#divisions">
              <Button size="lg" className="bg-white font-bold text-base
              px-10 py-6 rounded-2xl shadow-xl transition-all duration-300
              hover:scale-105 hover:shadow-2xl active:scale-95 group"
              style={{ color: '#062850' }}>
                Explore All Divisions
                <ArrowRight className="ml-2 h-5 w-5 transition-transform
                duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/academy/enroll">
              <Button size="lg" variant="outline"
              className="border-2 border-white/50 text-white
              bg-transparent text-base px-10 py-6 rounded-2xl
              backdrop-blur-sm transition-all duration-300
              hover:bg-white/10 hover:border-white hover:scale-105">
                Enrol Now
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { number: '6', label: 'Academy Divisions', icon: '🏛️' },
              { number: '7', label: 'World Curricula Fused', icon: '🌍' },
              { number: 'All', label: 'Ages & Stages', icon: '👥' },
              { number: '2', label: 'Class Formats', icon: '📚' },
            ].map((stat) => (
              <div key={stat.label}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4
              border border-white/20 transition-all duration-300
              hover:bg-white/20 hover:scale-105">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-xs md:text-sm text-blue-200">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full">
          <path d="M0 80L60 74C120 68 240 56 360 50C480 44 600 44 720 47C840
          50 960 56 1080 59C1200 62 1320 62 1380 62L1440 62V80H1380C1320 80
          1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80
          120 80 60 80H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  )
}
