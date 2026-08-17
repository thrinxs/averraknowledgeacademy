'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  GraduationCap,
  Globe,
  BookOpen,
  Users,
  Star,
} from 'lucide-react'

export default function AcademyHero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section
      className="relative min-h-[90vh] flex items-center
      overflow-hidden"
      style={{
        background: `linear-gradient(135deg,
          #062850 0%,
          #1D4469 40%,
          #325E84 70%,
          #497296 100%)`,
      }}
    >
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-96 h-96
          rounded-full opacity-10 animate-pulse"
          style={{ backgroundColor: '#497296' }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96
          rounded-full opacity-10 animate-pulse"
          style={{
            backgroundColor: '#325E84',
            animationDelay: '1s',
          }}
        />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden
      pointer-events-none">
        <div
          className="absolute top-20 left-10 opacity-20
          animate-bounce"
          style={{ animationDuration: '3s' }}
        >
          <GraduationCap className="w-12 h-12 text-white" />
        </div>
        <div
          className="absolute top-40 right-20 opacity-20
          animate-bounce"
          style={{ animationDuration: '4s' }}
        >
          <Globe className="w-10 h-10 text-white" />
        </div>
        <div
          className="absolute bottom-40 left-20 opacity-20
          animate-bounce"
          style={{ animationDuration: '5s' }}
        >
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <div
          className="absolute bottom-20 right-32 opacity-20
          animate-bounce"
          style={{ animationDuration: '3.5s' }}
        >
          <Star className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4
      sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2
            px-4 py-2 rounded-full text-sm font-medium
            text-white border border-white/20
            bg-white/10 backdrop-blur-sm mb-6"
          >
            <span className="w-2 h-2 rounded-full
            bg-green-400 animate-pulse" />
            🎓 Now Enrolling — Limited Spaces Available
          </div>

          {/* Main Headline */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl
            font-bold text-white leading-tight mb-4"
          >
            Your Child Deserves to
            <br />
            <span style={{ color: '#97C3E0' }}>
              Truly Understand
            </span>
            <br />
            What They Learn
          </h1>

          {/* Subheadline */}
          <p
            className="text-base md:text-xl
            text-blue-100 max-w-3xl mx-auto
            mb-4 leading-relaxed"
          >
            Not just memorise it.
          </p>

          {/* Smarter Than Einstein */}
          <div
            className="inline-flex items-center gap-2
            px-6 py-3 rounded-full mb-8
            border border-white/30 bg-white/10"
          >
            <span className="text-yellow-300 text-lg">
              ✨
            </span>
            <span className="text-white font-semibold
            text-sm md:text-base italic">
              Smarter Than Einstein
            </span>
            <span className="text-blue-200 text-sm">
              — Understand. Don&apos;t Memorise.
            </span>
          </div>

          {/* Description */}
          <p
            className="text-blue-100 max-w-2xl
            mx-auto mb-10 leading-relaxed"
          >
            Averra Academy is a global academic tutoring
            ecosystem that combines your child&apos;s local
            curriculum with the world&apos;s seven best
            education systems — fused into one powerful,
            personalised learning plan.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row
            items-center justify-center gap-4 mb-16"
          >
            <Link href="/academy/enroll">
              <Button
                size="lg"
                className="bg-white font-semibold
                text-base px-8 py-6 rounded-xl
                shadow-xl transition-all duration-300
                hover:scale-105 hover:shadow-2xl
                active:scale-95 group"
                style={{ color: '#062850' }}
              >
                Start My Enrolment
                <ArrowRight
                  className="ml-2 h-5 w-5 transition-transform
                  duration-300 group-hover:translate-x-1"
                />
              </Button>
            </Link>
            <Link href="#curriculum">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/50
                text-white bg-transparent text-base
                px-8 py-6 rounded-xl backdrop-blur-sm
                transition-all duration-300
                hover:bg-white/10 hover:border-white
                hover:scale-105"
              >
                See The Curriculum
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div
            className="grid grid-cols-2 md:grid-cols-4
            gap-4 max-w-3xl mx-auto"
          >
            {[
              {
                icon: GraduationCap,
                text: 'Primary to University',
              },
              {
                icon: Globe,
                text: '7 World Curricula Fused',
              },
              {
                icon: Users,
                text: 'Private & Group Classes',
              },
              {
                icon: BookOpen,
                text: 'Progress Reports',
              },
            ].map((item) => (
              <div
                key={item.text}
                className="bg-white/10 backdrop-blur-sm
                rounded-2xl p-4 border border-white/20
                transition-all duration-300
                hover:bg-white/20 hover:scale-105"
              >
                <item.icon
                  className="w-6 h-6 text-white
                  mx-auto mb-2"
                />
                <p className="text-xs md:text-sm
                text-blue-100 text-center">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 80L60 74C120 68 240 56 360 50C480
            44 600 44 720 47C840 50 960 56 1080
            59C1200 62 1320 62 1380 62L1440 62V80H1380
            C1320 80 1200 80 1080 80C960 80 840 80 720
            80C600 80 480 80 360 80C240 80 120 80 60
            80H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}