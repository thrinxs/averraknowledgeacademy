'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AcademyHero from '@/components/academy/AcademyHero'
import SmarterTooltip from '@/components/ui/SmarterTooltip'

function JuniorIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 48 48" fill="none">
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
    <svg className={className} style={style} viewBox="0 0 48 48" fill="none">
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
    <svg className={className} style={style} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="14" r="8" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 42c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M32 28l4 4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function LanguageIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="18" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
      <path d="M24 6c0 0-8 6-8 18s8 18 8 18M24 6c0 0 8 6 8 18s-8 18-8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M6 24h36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 16h32M8 32h32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3"/>
    </svg>
  )
}

function TeacherIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 48 48" fill="none">
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
    <svg className={className} style={style} viewBox="0 0 48 48" fill="none">
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
    subtitle: 'School Years 1 Through to Final Year',
    description: 'Expert academic tutoring for school-age learners worldwide — from their very first year of school through to their final secondary school examinations.',
    status: 'active',
    bgColor: '#062850',
    accentColor: '#97C3E0',
    lightBg: '#EBF4FF',
    Icon: JuniorIcon,
    highlights: [
      'All school years globally supported',
      'National & international exam preparation',
      'Averra Super Curriculum (7 world systems)',
      'Private & General class formats',
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

const WHY_CHOOSE = [
  {
    emoji: '✨',
    title: 'Averra Super Curriculum',
    desc: 'Every learner follows a fusion of seven of the world\'s best education systems — England, Japan, Estonia, Canada, Nigeria, Singapore and Finland — combined into one powerful, personalised plan. No other platform offers this.',
    color: '#062850',
  },
  {
    emoji: '👤',
    title: 'Truly Personalised Learning',
    desc: 'Every learner begins with a baseline diagnostic assessment. We identify strengths, weaknesses and learning gaps — then build a curriculum path specific to them. Not a one-size-fits-all approach.',
    color: '#325E84',
  },
  {
    emoji: '🌍',
    title: 'Global Yet Local',
    desc: 'We serve learners in Nigeria and around the world. Nigerian learners pay in Naira. International learners pay in Pounds. Our Super Curriculum includes Nigerian heritage and international standards together.',
    color: '#497296',
  },
  {
    emoji: '👩‍🏫',
    title: 'Expert, Dedicated Teachers',
    desc: 'Every Averra teacher is carefully selected, trained in our methodology and dedicated to results. Private class learners receive a dedicated teacher. General class learners are grouped by level for consistency.',
    color: '#062850',
  },
  {
    emoji: '📊',
    title: 'Full Progress Tracking',
    desc: 'Parents and learners have access to a live dashboard showing attendance, topics covered, test scores, teacher feedback and progress over time. Full academic reports provided every term.',
    color: '#325E84',
  },
  {
    emoji: '📅',
    title: 'Flexible Scheduling',
    desc: 'Choose your preferred days and time of day. Morning, afternoon or evening slots available. Classes delivered online — accessible from anywhere in the world with a stable connection.',
    color: '#497296',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Choose Your Division',
    desc: 'Select the Academy division that best matches your stage of life — from Junior Academy for children to Professional Academy for working adults.',
    icon: '🏛️',
  },
  {
    step: '02',
    title: 'Explore Your Curriculum',
    desc: 'Use our interactive Curriculum Explorer to see exactly what your learner will study — including how the Averra Super Curriculum compares to your local curriculum.',
    icon: '📚',
  },
  {
    step: '03',
    title: 'Enrol in Minutes',
    desc: 'Complete our simple enrolment form. Tell us about your learner, choose your subjects, class type and schedule preferences.',
    icon: '✍️',
  },
  {
    step: '04',
    title: 'Begin Within 48 Hours',
    desc: 'Once enrolment is confirmed and payment received, we set your timetable and your first class begins within 48 hours.',
    icon: '🚀',
  },
]

export default function AcademyPage() {
  const [mounted, setMounted] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [libraryEmail, setLibraryEmail] = useState('')
  const [librarySubmitted, setLibrarySubmitted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <>
      {/* ══════════════════════════════════════ */}
      {/* 1. HERO                               */}
      {/* ══════════════════════════════════════ */}
      <AcademyHero />

      {/* ══════════════════════════════════════ */}
      {/* 2. SIX DIVISIONS                      */}
      {/* ══════════════════════════════════════ */}
      <section id="divisions" className="py-24 bg-white overflow-hidden">
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

          {/* Enrol CTA */}
          <div
            className="relative rounded-3xl p-10 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #062850 0%, #1D4469 50%, #325E84 100%)' }}
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
            style={{ backgroundColor: '#97C3E0' }} />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-10"
            style={{ backgroundColor: '#497296' }} />
            <div className="relative flex flex-col md:flex-row items-center
            justify-between gap-6">
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
                  Enrol in Junior Academy today. The process takes 5 minutes
                  and classes begin within 48 hours.
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

      {/* ══════════════════════════════════════ */}
      {/* 3. LIBRARY                            */}
      {/* ══════════════════════════════════════ */}
      <section className="py-24 overflow-hidden"
      style={{ backgroundColor: '#F0F6FB' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5
              rounded-full text-sm font-semibold text-white mb-5"
              style={{ backgroundColor: '#062850' }}
            >
              📖 Averra Library
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4"
            style={{ color: '#062850' }}>
              The Averra Library
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Access thousands of textbooks and educational resources.
              Buy physical books, purchase eBooks, or rent eBooks —
              all curated for learners at every level.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                icon: '📦',
                title: 'Buy Physical Books',
                desc: 'Order original textbooks and educational books delivered to your door. Covering all levels from primary to university — curated by our academic team.',
                tag: 'Ships Worldwide',
                tagBg: '#062850',
                features: [
                  'Primary to university textbooks',
                  'Nigerian and international curricula',
                  'Worldwide delivery',
                  'Verified original editions',
                ],
              },
              {
                icon: '📱',
                title: 'Buy eBooks',
                desc: 'Purchase digital editions of textbooks and study materials instantly. Read on any device — phone, tablet or computer. No delivery wait.',
                tag: 'Instant Access',
                tagBg: '#16A34A',
                features: [
                  'Instant download after purchase',
                  'Read on any device',
                  'Searchable & annotatable',
                  'Lifetime access',
                ],
              },
              {
                icon: '📅',
                title: 'Rent eBooks',
                desc: 'Rent eBooks for a term, semester or academic year. Perfect for subjects you only need temporarily — save up to 80% compared to buying.',
                tag: 'Save Up to 80%',
                tagBg: '#D97706',
                features: [
                  'Term or annual rental options',
                  'Same full eBook experience',
                  'Renew if needed',
                  'Affordable for every family',
                ],
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group bg-white rounded-3xl overflow-hidden
                border border-gray-100 shadow-sm transition-all duration-300
                hover:shadow-xl hover:-translate-y-2"
              >
                {/* Card Header */}
                <div
                  className="px-7 py-5 flex items-center gap-4"
                  style={{ backgroundColor: '#062850' }}
                >
                  <span className="text-4xl">{item.icon}</span>
                  <div>
                    <h3 className="font-bold text-white text-lg">
                      {item.title}
                    </h3>
                    <span
                      className="text-xs px-2.5 py-1 rounded-full
                      font-bold text-white mt-1 inline-block"
                      style={{ backgroundColor: item.tagBg }}
                    >
                      {item.tag}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-7">
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">
                    {item.desc}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {item.features.map((feature) => (
                      <li key={feature}
                      className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0"
                        style={{ color: '#497296' }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div
                    className="flex items-center gap-2 text-sm font-bold
                    transition-all duration-200"
                    style={{ color: '#497296' }}
                  >
                    <span>Coming Soon</span>
                    <div
                      className="px-2 py-0.5 rounded-full text-xs
                      font-bold text-white"
                      style={{ backgroundColor: '#497296' }}
                    >
                      Launching 2026
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Library Waitlist */}
          <div
            className="rounded-3xl p-8 flex flex-col md:flex-row items-center
            justify-between gap-6"
            style={{ backgroundColor: '#062850' }}
          >
            <div className="flex items-start gap-4">
              <span className="text-4xl flex-shrink-0">📚</span>
              <div>
                <p className="font-bold text-white text-xl mb-1">
                  Be notified when the Library launches
                </p>
                <p className="text-blue-300 text-sm">
                  We are curating a world-class collection of textbooks and
                  educational resources for learners at every level.
                </p>
              </div>
            </div>
            {!librarySubmitted ? (
              <div className="flex gap-2 flex-shrink-0 w-full md:w-auto">
                <input
                  type="email"
                  value={libraryEmail}
                  onChange={(e) => setLibraryEmail(e.target.value)}
                  placeholder="Your email address"
                  className="px-4 py-3 rounded-xl text-sm text-gray-800
                  focus:outline-none flex-1 md:w-56"
                />
                <button
                  onClick={() => { if (libraryEmail) setLibrarySubmitted(true) }}
                  className="px-5 py-3 rounded-xl text-sm font-bold
                  text-white transition-all hover:opacity-90 whitespace-nowrap
                  hover:scale-105"
                  style={{ backgroundColor: '#497296' }}
                >
                  Notify Me
                </button>
              </div>
            ) : (
              <div
                className="flex items-center gap-3 px-5 py-3
                rounded-xl flex-shrink-0"
                style={{ backgroundColor: '#16A34A' }}
              >
                <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                <span className="text-white text-sm font-semibold">
                  You&apos;re on the list!
                </span>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════ */}
      {/* 4. WHY CHOOSE AVERRA ACADEMY          */}
      {/* ══════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5
              rounded-full text-sm font-semibold text-white mb-5"
              style={{ backgroundColor: '#497296' }}
            >
              🏆 Why Averra Academy?
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4"
            style={{ color: '#062850' }}>
              A Different Kind of Academy
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Averra Academy was built on a simple but powerful belief —
              every learner deserves to truly understand what they study,
              not just memorise it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_CHOOSE.map((item, index) => (
              <div
                key={item.title}
                className="group relative bg-white rounded-3xl p-7
                border border-gray-100 shadow-sm transition-all duration-300
                hover:shadow-xl hover:-translate-y-1 overflow-hidden"
              >
                {/* Decorative corner */}
                <div
                  className="absolute top-0 right-0 w-24 h-24
                  rounded-bl-full opacity-5 transition-opacity
                  duration-300 group-hover:opacity-10"
                  style={{ backgroundColor: item.color }}
                />

                <div
                  className="w-14 h-14 rounded-2xl flex items-center
                  justify-center text-2xl mb-5 transition-all duration-300
                  group-hover:scale-110"
                  style={{ backgroundColor: `${item.color}12` }}
                >
                  {item.emoji}
                </div>

                <h3 className="font-bold text-lg mb-3"
                style={{ color: '#062850' }}>
                  {item.title}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 h-1 w-0
                  transition-all duration-500 rounded-b-3xl
                  group-hover:w-full"
                  style={{ backgroundColor: item.color }}
                />
              </div>
            ))}
          </div>

          {/* Smarter Than Einstein Quote */}
          <div
            className="mt-12 rounded-3xl p-10 text-center relative overflow-hidden"
            style={{ backgroundColor: '#062850' }}
          >
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-10"
            style={{ backgroundColor: '#97C3E0' }} />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full opacity-10"
            style={{ backgroundColor: '#497296' }} />
            <div className="relative">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 italic">
                &ldquo;Smarter Than Einstein&rdquo;
              </h3>
              <p className="text-blue-300 text-base max-w-2xl mx-auto leading-relaxed mb-2">
                This is the philosophy that drives everything we do at Averra Academy.
                It is the name of a book written by our founder — a belief that
                every human being has the capacity for extraordinary understanding
                when taught the right way.
              </p>
              <p className="text-blue-400 text-sm font-semibold">
                Understand. Don&apos;t Memorise.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════ */}
      {/* 5. HOW IT WORKS                       */}
      {/* ══════════════════════════════════════ */}
      <section className="py-24" style={{ backgroundColor: '#F0F6FB' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5
              rounded-full text-sm font-semibold text-white mb-5"
              style={{ backgroundColor: '#062850' }}
            >
              ⚡ Simple Process
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4"
            style={{ color: '#062850' }}>
              How It Works
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Getting started with Averra Academy is simple.
              From enrolment to first class in four easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {HOW_IT_WORKS.map((item, index) => (
              <div key={item.step} className="relative">

                {/* Connector line */}
                {index < HOW_IT_WORKS.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-10
                    left-full w-full h-0.5 z-0 -translate-x-6"
                    style={{
                      background: 'linear-gradient(to right, #062850, #49729620)',
                    }}
                  />
                )}

                <div
                  className="relative bg-white rounded-3xl p-7
                  border border-gray-100 shadow-sm transition-all
                  duration-300 hover:shadow-xl hover:-translate-y-1 z-10"
                >
                  {/* Step number */}
                  <div
                    className="absolute -top-4 -right-4 w-10 h-10
                    rounded-full flex items-center justify-center
                    text-white font-bold text-sm shadow-lg"
                    style={{ backgroundColor: '#062850' }}
                  >
                    {item.step}
                  </div>

                  <div className="text-4xl mb-4">{item.icon}</div>

                  <h3 className="font-bold text-lg mb-3"
                  style={{ color: '#062850' }}>
                    {item.title}
                  </h3>

                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* How it works CTA */}
          <div className="text-center">
            <Link href="/academy/enroll">
              <Button size="lg" className="text-white font-bold
              px-12 py-6 rounded-2xl shadow-lg transition-all
              hover:scale-105 hover:shadow-xl group"
              style={{ backgroundColor: '#062850' }}>
                Start Your Enrolment Now
                <ArrowRight className="ml-2 w-5 h-5 transition-transform
                duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <p className="text-gray-400 text-sm mt-3">
              Takes 5 minutes · First class within 48 hours
            </p>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════ */}
      {/* 6. FINAL CTA                          */}
      {/* ══════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <div
            className="relative rounded-3xl p-14 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #062850 0%, #1D4469 50%, #325E84 100%)' }}
          >
            {/* Decorative elements */}
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-10"
            style={{ backgroundColor: '#97C3E0' }} />
            <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full opacity-10"
            style={{ backgroundColor: '#497296' }} />

            <div className="relative">
              <div className="text-6xl mb-6">🎓</div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
                Your Academic Journey
                <br />
                Starts Here.
              </h2>
              <p className="text-blue-200 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                Whether you are a parent enrolling your child, a student
                seeking support, a professional investing in your growth,
                or an adult beginning a new chapter — Averra Academy
                has a division built for you.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/academy/enroll">
                  <Button size="lg" className="bg-white font-bold
                  px-10 py-6 rounded-2xl shadow-xl transition-all
                  duration-300 hover:scale-105 hover:shadow-2xl
                  active:scale-95 group"
                  style={{ color: '#062850' }}>
                    Start Enrolment
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform
                    duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="#divisions">
                  <Button size="lg" variant="outline"
                  className="border-2 border-white/40 text-white
                  bg-transparent px-10 py-6 rounded-2xl
                  hover:bg-white/10 hover:border-white
                  transition-all duration-300 hover:scale-105">
                    Explore All Divisions
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap justify-center gap-6 mt-10">
                {[
                  '✓ No registration fee',
                  '✓ First class within 48 hours',
                  '✓ Nigerian & international pricing',
                  '✓ Cancel anytime',
                ].map((point) => (
                  <span key={point} className="text-blue-300 text-sm font-medium">
                    {point}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
