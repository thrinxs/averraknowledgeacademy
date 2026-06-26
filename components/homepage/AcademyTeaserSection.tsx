'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  BookOpen,
  Brain,
  Video,
  TestTube,
  Target,
  Sparkles,
  Info,
} from 'lucide-react'

export default function AcademyTeaserSection() {
  const [tooltipVisible, setTooltipVisible] = useState(false)

  const features = [
    {
      icon: BookOpen,
      title: 'Curriculum-Based',
      desc: 'Structured lessons aligned with national and international exam syllabuses worldwide.',
    },
    {
      icon: Video,
      title: 'Live Classes',
      desc: 'Interactive sessions with expert teachers for real-time learning and Q&A.',
    },
    {
      icon: TestTube,
      title: 'Tests & Exams',
      desc: 'Weekly tests, CBT practice, full mock exams and performance tracking.',
    },
    {
      icon: Brain,
      title: 'Diagnostic System',
      desc: 'Personalised learning paths built on the Smarter Than Einstein learning strategy.',
    },
  ]

  const audience = [
    { label: 'High School', sub: 'Students' },
    { label: 'National &', sub: 'Exam Candidates' },
    { label: 'University Entry', sub: 'Candidates' },
    { label: 'Undergraduates', sub: 'Students' },
    { label: "Master's", sub: 'Students' },
    { label: 'PhD', sub: 'Scholars' },
  ]

  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg,
          #062850 0%,
          #1D4469 50%,
          #325E84 100%)`,
      }}
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-96 h-96
          rounded-full opacity-10"
          style={{ backgroundColor: '#97C3E0' }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96
          rounded-full opacity-10"
          style={{ backgroundColor: '#497296' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4
      sm:px-6 lg:px-8">

        {/* Coming Soon Badge */}
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center gap-2
            px-4 py-2 rounded-full text-sm font-bold
            text-white border border-white/30
            bg-white/10 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4" />
            COMING SOON
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-5xl lg:text-6xl
            font-bold text-white mb-4 leading-tight"
          >
            Introducing
            <br />
            <span style={{ color: '#97C3E0' }}>
              Averra Academy
            </span>
          </h2>

          <p className="text-blue-100 text-lg md:text-xl
          max-w-3xl mx-auto leading-relaxed mb-4">
            The smarter way to truly understand your subjects.
          </p>

          <p className="text-blue-200 text-base max-w-3xl mx-auto leading-relaxed">
            A complete digital academic learning system for high school
            students, exam candidates, undergraduates, Master&apos;s
            students, and PhD scholars worldwide — whether you are
            preparing for WAEC, NECO, JAMB, GCSEs, A-Levels, SATs,
            or any national or international examination. Built on the{' '}

            {/* Smarter Than Einstein with tooltip */}
            <span className="relative inline-block">
              <button
                className="font-bold text-white underline
                decoration-dotted underline-offset-4
                cursor-help inline-flex items-center gap-1
                transition-colors duration-200
                hover:text-[#97C3E0]"
                onMouseEnter={() => setTooltipVisible(true)}
                onMouseLeave={() => setTooltipVisible(false)}
                onFocus={() => setTooltipVisible(true)}
                onBlur={() => setTooltipVisible(false)}
                aria-describedby="ste-tooltip"
              >
                Smarter Than Einstein
                <Info className="w-4 h-4 opacity-70" />
              </button>

              {/* Tooltip */}
              {tooltipVisible && (
                <span
                  id="ste-tooltip"
                  role="tooltip"
                  className="absolute bottom-full left-1/2
                  -translate-x-1/2 mb-3 z-50
                  w-72 rounded-xl p-4 text-sm text-left
                  leading-relaxed shadow-2xl
                  pointer-events-none"
                  style={{ backgroundColor: '#062850', border: '1px solid rgba(151,195,224,0.2)' }}
                >
                  <span
                    className="block font-bold mb-1"
                    style={{ color: '#97C3E0' }}
                  >
                    Smarter Than Einstein
                  </span>
                  <span className="text-blue-200 block mb-2">
                    A book written by{' '}
                    <span className="text-white font-semibold">Josh Gold</span>,
                    currently under review by two university professors
                    ahead of publication. The Averra Academy learning
                    system is built on its principles.
                  </span>
                  <a
                    href="https://www.drjoshtherapycentre.com.ng/library"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1
                    text-xs font-medium pointer-events-auto
                    hover:underline"
                    style={{ color: '#97C3E0' }}
                  >
                    View other books by the author
                    <ArrowRight className="w-3 h-3" />
                  </a>

                  {/* Tooltip Arrow */}
                  <span
                    className="absolute top-full left-1/2
                    -translate-x-1/2 w-0 h-0"
                    style={{
                      borderLeft: '8px solid transparent',
                      borderRight: '8px solid transparent',
                      borderTop: '8px solid #062850',
                    }}
                  />
                </span>
              )}
            </span>
            {' '}learning strategy.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2
        lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white/10 backdrop-blur-sm
              rounded-2xl p-6 border border-white/20
              transition-all duration-300
              hover:bg-white/20 hover:-translate-y-2"
            >
              <div
                className="w-12 h-12 rounded-xl flex
                items-center justify-center mb-4"
                style={{ backgroundColor: '#497296' }}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-bold mb-2">
                {feature.title}
              </h3>
              <p className="text-blue-200 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Target Audience */}
        <div
          className="rounded-3xl p-8 mb-12 border border-white/10"
          style={{ backgroundColor: 'rgba(6, 40, 80, 0.5)' }}
        >
          <h3 className="text-white text-xl font-bold mb-6
          text-center flex items-center justify-center gap-2">
            <Target className="w-6 h-6" />
            Built For
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3
          lg:grid-cols-6 gap-4 text-center">
            {audience.map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-4"
                style={{ backgroundColor: 'rgba(151, 195, 224, 0.1)' }}
              >
                <div
                  className="text-base font-bold mb-1 leading-tight"
                  style={{ color: '#97C3E0' }}
                >
                  {item.label}
                </div>
                <div className="text-blue-200 text-xs">
                  {item.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exams Note */}
        <p className="text-center text-blue-300 text-sm mb-10">
          Supporting national and international examinations including
          WAEC · NECO · JAMB · GCSEs · A-Levels · SATs · IB and more.
        </p>

        {/* CTA */}
        <div className="text-center">
          <p className="text-blue-200 text-sm mb-6">
            Be the first to know when Averra Academy launches.
          </p>
          <Link href="/academy">
            <Button
              size="lg"
              className="bg-white font-semibold
              text-base px-8 py-6 rounded-xl
              shadow-xl transition-all duration-300
              hover:scale-105 hover:shadow-2xl
              active:scale-95 group"
              style={{ color: '#062850' }}
            >
              Join the Waitlist
              <ArrowRight
                className="ml-2 h-5 w-5 transition-transform
                duration-300 group-hover:translate-x-1"
              />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  )
}