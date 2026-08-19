'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AcademyHero from '@/components/academy/AcademyHero'
import SuperCurriculumSection from '@/components/academy/SuperCurriculumSection'
import CurriculumExplorer from '@/components/academy/CurriculumExplorer'

function JuniorIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      <rect x="6" y="10" width="36" height="28" rx="4" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
      <path d="M14 10V6a2 2 0 012-2h16a2 2 0 012 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M24 20v8M20 24h8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="24" cy="24" r="7" stroke="currentColor" strokeWidth="2"/>
      <path d="M6 16h36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function UniversityIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      <path d="M24 4L4 14l20 10 20-10L24 4z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M12 19v12M36 19v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 31h8M32 31h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 44h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <rect x="16" y="31" width="16" height="13" rx="1" stroke="currentColor" strokeWidth="2"/>
      <path d="M44 14v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="44" cy="24" r="2" fill="currentColor"/>
    </svg>
  )
}

function AdultIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="14" r="8" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 42c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M32 28l4 4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function LanguageIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="18" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
      <path d="M24 6c0 0-8 6-8 18s8 18 8 18M24 6c0 0 8 6 8 18s-8 18-8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M6 24h36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 16h32M8 32h32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3"/>
    </svg>
  )
}

function TeacherIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      <rect x="4" y="8" width="32" height="24" rx="3" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
      <path d="M14 36l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 42v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 18h16M12 24h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="38" cy="12" r="7" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2"/>
      <path d="M35 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ProfessionalIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      <rect x="6" y="18" width="36" height="24" rx="3" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
      <path d="M16 18v-4a8 8 0 1116 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="24" cy="30" r="4" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2"/>
      <path d="M6 26h36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M22 30h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

const DIVISIONS = [
  {
    slug: 'junior',
    name: 'Junior Academy',
    tagline: 'Ages 5 – 18',
    subtitle: 'Primary & Secondary',
    description: 'Structured academic tutoring for primary and secondary school learners — powered by the Averra Super Curriculum.',
    status: 'active',
    bgColor: '#062850',
    accentColor: '#97C3E0',
    lightBg: '#EBF4FF',
    Icon: JuniorIcon,
    highlights: [
      'Primary 1 through Senior Secondary',
      'WAEC, GCSE, A-Level preparation',
      'Averra Super Curriculum (7 world systems)',
      'Private & General classes',
    ],
    cta: 'Enrol Now',
  },
  {
    slug: 'university',
    name: 'University Academy',
    tagline: 'Undergraduate · Masters · PhD',
    subtitle: 'Higher Education Support',
    description: 'Specialised academic support for university students. From module coaching to dissertation guidance.',
    status: 'coming_soon',
    bgColor: '#325E84',
    accentColor: '#97C3E0',
    lightBg: '#EBF4FF',
    Icon: UniversityIcon,
    highlights: [
      'Subject-specific module support',
      'Dissertation & thesis guidance',
      'Research methodology coaching',
      'IELTS & TOEFL preparation',
    ],
    cta: 'Join Waitlist',
  },
  {
    slug: 'adult',
    name: 'Adult Education',
    tagline: 'All Ages Welcome',
    subtitle: 'Lifelong Learning',
    description: 'It is never too late to learn. Education for adults at every stage — whether returning or starting fresh.',
    status: 'coming_soon',
    bgColor: '#065F46',
    accentColor: '#6EE7B7',
    lightBg: '#ECFDF5',
    Icon: AdultIcon,
    highlights: [
      'Foundational literacy & numeracy',
      'Mature student programmes',
      'Digital literacy for adults',
      'Refresher courses for returners',
    ],
    cta: 'Join Waitlist',
  },
  {
    slug: 'languages',
    name: 'Language Academy',
    tagline: 'Global · Cultural · Immersive',
    subtitle: 'World Languages & Culture',
    description: "Learn any of the world's major languages with expert tutors who understand language, culture and accent.",
    status: 'coming_soon',
    bgColor: '#0369A1',
    accentColor: '#7DD3FC',
    lightBg: '#E0F2FE',
    Icon: LanguageIcon,
    highlights: [
      'English, French, Spanish, German & more',
      'Yoruba, Hausa, Igbo preservation',
      'Culture & accent coaching',
      'IELTS, DELF, Goethe certification',
    ],
    cta: 'Join Waitlist',
  },
  {
    slug: 'teachers',
    name: 'Educators Academy',
    tagline: 'For Teaching Professionals',
    subtitle: 'Professional Development',
    description: 'Professional development and knowledge refresher programmes for teachers at all levels and subjects.',
    status: 'coming_soon',
    bgColor: '#6D28D9',
    accentColor: '#C4B5FD',
    lightBg: '#F5F3FF',
    Icon: TeacherIcon,
    highlights: [
      'Subject knowledge refresher',
      'Modern teaching methodology',
      'Curriculum updates (Nigerian, UK, IB)',
      'Leadership in education',
    ],
    cta: 'Join Waitlist',
  },
  {
    slug: 'professional',
    name: 'Professional Academy',
    tagline: 'For Working Professionals',
    subtitle: 'Industry Excellence',
    description: 'Industry knowledge refreshers, professional certification preparation and leadership development.',
    status: 'coming_soon',
    bgColor: '#B45309',
    accentColor: '#FDE68A',
    lightBg: '#FFFBEB',
    Icon: ProfessionalIcon,
    highlights: [
      'Professional certification prep',
      'Industry knowledge refreshers',
      'Management & leadership training',
      'Business communication skills',
    ],
    cta: 'Join Waitlist',
  },
]

export default function AcademyPage() {
  const [mounted, setMounted] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <>
      <AcademyHero />

      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5
              rounded-full text-sm font-semibold text-white mb-5 shadow-lg"
              style={{ backgroundColor: '#062850' }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              One Academy. Six Divisions.
            </div>

            <h2 className="text-4xl md:text-6xl font-bold mb-5 leading-tight"
            style={{ color: '#062850' }}>
              Every Stage
              <br />
              <span className="relative inline-block" style={{ color: '#497296' }}>
                of Life.
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M1 5C40 1 100 0 199 5" stroke="#497296" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            </h2>

            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
              From your child&apos;s first school years to your own professional
              peak — Averra Academy is with you at every step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {DIVISIONS.map((division, index) => {
              const isHovered = hoveredIndex === index
              const isActive = division.status === 'active'

              return (
                <Link
                  key={division.slug}
                  href={`/academy/${division.slug}`}
                  className="group relative rounded-3xl overflow-hidden
                  cursor-pointer transition-all duration-500"
                  style={{
                    transform: isHovered
                      ? 'translateY(-8px) scale(1.01)'
                      : 'translateY(0) scale(1)',
                    boxShadow: isHovered
                      ? `0 30px 60px -15px ${division.bgColor}40`
                      : '0 4px 20px rgba(0,0,0,0.06)',
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${division.bgColor}08 0%, ${division.bgColor}15 100%)`,
                      opacity: isHovered ? 1 : 0,
                    }}
                  />
                  <div
                    className="absolute inset-0 rounded-3xl border-2 transition-all duration-500"
                    style={{ borderColor: isHovered ? division.bgColor : '#F3F4F6' }}
                  />

                  <div className="relative p-7">
                    <div className="flex items-start justify-between mb-5">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center
                        justify-center transition-all duration-500 flex-shrink-0"
                        style={{
                          backgroundColor: isHovered ? division.bgColor : division.lightBg,
                          transform: isHovered
                            ? 'scale(1.1) rotate(-3deg)'
                            : 'scale(1) rotate(0)',
                        }}
                      >
                        <division.Icon
                          className="w-9 h-9 transition-all duration-500"
                          style={{ color: isHovered ? division.accentColor : division.bgColor }}
                        />
                      </div>

                      {isActive ? (
                        <div
                          className="flex items-center gap-1.5 px-3 py-1.5
                          rounded-full text-xs font-bold text-white shadow-sm"
                          style={{ backgroundColor: '#16A34A' }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          Enrolling Now
                        </div>
                      ) : (
                        <div
                          className="px-3 py-1.5 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: division.lightBg, color: division.bgColor }}
                        >
                          Coming Soon
                        </div>
                      )}
                    </div>

                    <h3
                      className="font-bold text-xl mb-1 transition-colors duration-300"
                      style={{ color: isHovered ? division.bgColor : '#062850' }}
                    >
                      {division.name}
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1"
                    style={{ color: '#9CA3AF' }}>
                      {division.tagline}
                    </p>
                    <p className="text-xs font-semibold mb-4"
                    style={{ color: division.bgColor }}>
                      {division.subtitle}
                    </p>
                    <p className="text-gray-500 text-sm leading-relaxed mb-5">
                      {division.description}
                    </p>

                    <ul className="space-y-2 mb-6">
                      {division.highlights.map((highlight, hi) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-2.5 text-xs
                          text-gray-600 transition-all duration-300"
                          style={{
                            transitionDelay: isHovered ? `${hi * 50}ms` : '0ms',
                            transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                          }}
                        >
                          <CheckCircle
                            className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                            style={{ color: division.bgColor }}
                          />
                          {highlight}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div
                        className="flex items-center gap-2 text-sm font-bold transition-all duration-300"
                        style={{ color: division.bgColor }}
                      >
                        {division.cta}
                        <ArrowRight
                          className="w-4 h-4 transition-transform duration-300"
                          style={{ transform: isHovered ? 'translateX(4px)' : 'translateX(0)' }}
                        />
                      </div>
                      <div
                        className="w-8 h-8 rounded-full flex items-center
                        justify-center transition-all duration-500"
                        style={{ backgroundColor: isHovered ? division.bgColor : division.lightBg }}
                      >
                        <ArrowRight
                          className="w-3.5 h-3.5 transition-all duration-300"
                          style={{
                            color: isHovered ? 'white' : division.bgColor,
                            transform: isHovered ? 'rotate(-45deg)' : 'rotate(0)',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          <div
            className="relative rounded-3xl p-10 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #062850 0%, #1D4469 50%, #325E84 100%)' }}
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
            style={{ backgroundColor: '#97C3E0' }} />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-10"
            style={{ backgroundColor: '#497296' }} />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5
                rounded-full text-xs font-bold text-white bg-white/10 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Junior Academy — Now Open
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Ready to get started?
                </h3>
                <p className="text-blue-300 text-sm max-w-md">
                  Enrol your child in Junior Academy today. The process takes
                  5 minutes and classes begin within 48 hours.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <Link href="/academy/enroll">
                  <Button size="lg" className="bg-white font-bold px-8 py-5
                  rounded-2xl shadow-xl transition-all duration-300
                  hover:scale-105 hover:shadow-2xl active:scale-95 group"
                  style={{ color: '#062850' }}>
                    Start Enrolment
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform
                    duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/academy/junior">
                  <Button size="lg" variant="outline"
                  className="border-2 border-white/40 text-white bg-transparent
                  px-8 py-5 rounded-2xl hover:bg-white/10 hover:border-white
                  transition-all duration-300 hover:scale-105">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      <SuperCurriculumSection />
      <CurriculumExplorer />
    </>
  )
}
