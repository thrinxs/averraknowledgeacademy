'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Brain,
  GraduationCap,
  BarChart3,
  Video,
  FlaskConical,
  Globe,
  Bell,
  CheckCircle,
  Microscope,
  Calculator,
  Atom,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AcademyPage() {
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [tooltipVisible, setTooltipVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  function handleNotify(e: React.FormEvent) {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
      setEmail('')
    }
  }

  return (
    <main className="min-h-screen bg-white">

      {/* ── HERO ───────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-24 md:py-32"
        style={{ backgroundColor: '#062850' }}
      >
        {/* Background glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ backgroundColor: '#97C3E0' }}
        />

        <div className="relative max-w-4xl mx-auto px-6 text-center">

          {/* Coming Soon badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 text-white text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            Coming Soon
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Averra Academy
          </h1>

          {/* Smarter Than Einstein with tooltip */}
          <div className="relative inline-block mb-6">
            <p
              className="text-xl md:text-2xl font-semibold cursor-help border-b border-dashed border-yellow-400 text-yellow-400"
              onMouseEnter={() => setTooltipVisible(true)}
              onMouseLeave={() => setTooltipVisible(false)}
            >
              Smarter Than Einstein
            </p>

            {tooltipVisible && (
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-80 rounded-xl p-4 text-sm text-white shadow-2xl z-50 text-left"
                style={{ backgroundColor: '#1D4469', border: '1px solid #325E84' }}
              >
                <p className="font-semibold mb-1" style={{ color: '#97C3E0' }}>
                  About "Smarter Than Einstein"
                </p>
                <p className="text-white/80 leading-relaxed">
                  "Smarter Than Einstein" is a book written by Josh Gold, currently under
                  review by two university professors ahead of publication. The Averra
                  Academy learning system is built on its principles.
                </p>
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
                  style={{ backgroundColor: '#1D4469' }}
                />
              </div>
            )}
          </div>

          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-12">
            A digital academic learning ecosystem that helps students truly
            understand their subjects — not just memorise them.
          </p>

          {/* Notify form */}
          {!submitted ? (
            <form
              onSubmit={handleNotify}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/50 transition-all"
              />
              <Button
                type="submit"
                className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: '#497296', color: '#fff' }}
              >
                <Bell className="w-4 h-4 mr-2" />
                Notify Me
              </Button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2 text-green-400 font-medium text-lg">
              <CheckCircle className="w-5 h-5" />
              You're on the list! We'll notify you when we launch.
            </div>
          )}
        </div>
      </section>

      {/* ── WHAT IS AVERRA ACADEMY ──────────────────────── */}
      <section className="py-20 px-6" style={{ backgroundColor: '#F0F6FB' }}>
        <div className="max-w-5xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: '#062850' }}
          >
            A Smarter Way to Truly Understand Your Subjects
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-16">
            Averra Academy is not just another video platform. It is a complete
            academic ecosystem combining curriculum-based teaching, live classes,
            diagnostic learning, and structured progress tracking.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="w-7 h-7" />,
                title: 'Textbook-Based Learning',
                desc: 'Chapter-by-chapter explanations using standard textbooks familiar to students — not random content.',
              },
              {
                icon: <Brain className="w-7 h-7" />,
                title: 'Diagnostic Learning System',
                desc: 'Initial assessment → learning profile → guided path → continuous evaluation. Built on the "Smarter Than Einstein" method.',
              },
              {
                icon: <Video className="w-7 h-7" />,
                title: 'Live Classes & Support',
                desc: 'Real teacher interaction, Q&A sessions, group revision classes, and live homework discussions.',
              },
              {
                icon: <BarChart3 className="w-7 h-7" />,
                title: 'Full Progress Tracking',
                desc: 'Weekly tests, monthly tests, assignments, simulated exams, and detailed performance reports.',
              },
              {
                icon: <GraduationCap className="w-7 h-7" />,
                title: 'Exam Preparation',
                desc: 'Structured prep for WAEC, NECO, JAMB, GCSE, A-Level, SAT, IB, and more international exams.',
              },
              {
                icon: <Globe className="w-7 h-7" />,
                title: 'Built for Students Worldwide',
                desc: 'Designed for secondary school, university, and exam candidates across Africa and beyond.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-6 text-left shadow-sm hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#F0F6FB', color: '#497296' }}
                >
                  {item.icon}
                </div>
                <h3
                  className="font-bold text-lg mb-2"
                  style={{ color: '#062850' }}
                >
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TARGET AUDIENCE ─────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: '#062850' }}
            >
              Who Is Averra Academy For?
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Built for students and learners at every stage, worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                label: 'Secondary School Students',
                color: '#497296',
                items: [
                  'WAEC, NECO, JAMB (Nigeria)',
                  'GCSE, A-Level (UK)',
                  'SAT (United States)',
                  'IB (International)',
                  'Any national exam candidate',
                ],
              },
              {
                label: 'University Students',
                color: '#325E84',
                items: [
                  'Undergraduates',
                  "Master's students",
                  'PhD scholars',
                  'Exam resit candidates',
                  'Students needing extra support',
                ],
              },
              {
                label: 'Parents',
                color: '#1D4469',
                items: [
                  'Track academic progress',
                  'Structured learning support',
                  'Affordable tutoring alternative',
                  'Performance analytics',
                  'Peace of mind',
                ],
              },
            ].map((group) => (
              <div
                key={group.label}
                className="rounded-2xl p-6 text-white"
                style={{ backgroundColor: group.color }}
              >
                <h3 className="font-bold text-xl mb-4">{group.label}</h3>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-white/85 text-sm">
                      <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-white/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXAM SYSTEMS ────────────────────────────────── */}
      <section className="py-20 px-6" style={{ backgroundColor: '#F0F6FB' }}>
        <div className="max-w-5xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: '#062850' }}
          >
            Phase 1 Launch — Science Subjects
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto mb-14">
            We are launching with the four core science subjects for WAEC and
            JAMB candidates. More subjects and university courses will follow.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { icon: <FlaskConical className="w-8 h-8" />, subject: 'Biology' },
              { icon: <Atom className="w-8 h-8" />, subject: 'Chemistry' },
              { icon: <Microscope className="w-8 h-8" />, subject: 'Physics' },
              { icon: <Calculator className="w-8 h-8" />, subject: 'Mathematics' },
            ].map((s) => (
              <div
                key={s.subject}
                className="bg-white rounded-2xl p-6 flex flex-col items-center gap-3 shadow-sm hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#F0F6FB', color: '#062850' }}
                >
                  {s.icon}
                </div>
                <span
                  className="font-bold text-lg"
                  style={{ color: '#062850' }}
                >
                  {s.subject}
                </span>
                <span
                  className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{ backgroundColor: '#F0F6FB', color: '#497296' }}
                >
                  Coming Soon
                </span>
              </div>
            ))}
          </div>

          {/* Subscription tiers preview */}
          <h3
            className="text-2xl font-bold mb-8"
            style={{ color: '#062850' }}
          >
            Subscription Tiers — Preview
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { name: 'Free', price: '₦0', color: '#6B7280', desc: 'Limited access, ad-supported' },
              { name: 'Basic', price: '₦1,500/mo', color: '#497296', desc: 'Full prerecorded lessons' },
              { name: 'Standard', price: '₦4,000/mo', color: '#325E84', desc: 'Lessons + tests + tracking' },
              { name: 'Premium', price: '₦10,000/mo', color: '#1D4469', desc: 'Everything + live classes' },
              { name: 'Elite', price: '₦35,000/mo', color: '#062850', desc: 'Full diagnostic program' },
            ].map((tier) => (
              <div
                key={tier.name}
                className="rounded-2xl p-5 text-white text-center hover:-translate-y-1 transition-all duration-300"
                style={{ backgroundColor: tier.color }}
              >
                <p className="font-bold text-lg mb-1">{tier.name}</p>
                <p className="text-white/90 font-semibold text-sm mb-2">
                  {tier.price}
                </p>
                <p className="text-white/60 text-xs">{tier.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <section
        className="py-20 px-6 text-center"
        style={{ backgroundColor: '#062850' }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Be the First to Know When We Launch
          </h2>
          <p className="text-white/60 text-lg mb-10">
            Join the waitlist and get early access, launch discounts, and
            updates as we build Averra Academy.
          </p>

          {!submitted ? (
            <form
              onSubmit={handleNotify}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/50 transition-all"
              />
              <Button
                type="submit"
                className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: '#497296', color: '#fff' }}
              >
                <Bell className="w-4 h-4 mr-2" />
                Notify Me
              </Button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2 text-green-400 font-medium text-lg">
              <CheckCircle className="w-5 h-5" />
              You're on the list! We'll notify you at launch.
            </div>
          )}

          <p className="text-white/30 text-sm mt-6">
            In the meantime, explore our other services.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Link href="/scholarship">
              <Button
                variant="outline"
                className="rounded-xl border-white/20 text-white hover:bg-white/10 transition-all"
              >
                Scholarship Matching
              </Button>
            </Link>
            <Link href="/skills">
              <Button
                variant="outline"
                className="rounded-xl border-white/20 text-white hover:bg-white/10 transition-all"
              >
                Skills Training
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}