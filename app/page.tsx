import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  GraduationCap,
  BookOpen,
  Briefcase,
  Monitor,
  HandCoins,
  ArrowRight,
  CheckCircle,
  Users,
  Globe,
  Trophy,
  Star,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Averra Knowledge Academy — The Right Knowledge',
  description:
    'Africa\'s complete academic success platform. Scholarship matching, ' +
    'curriculum-based learning, career training, digital skills, and more.',
}

const BRAND = '#062850'
const MID   = '#1D4469'
const LIGHT = '#497296'
const PALE  = '#F0F6FB'

const services = [
  {
    icon:        GraduationCap,
    title:       'Scholarship Matching',
    description: 'We research, match, and verify fully funded scholarships across 50+ countries — personally selected for your profile.',
    href:        '/scholarship',
    cta:         'Find a Scholarship',
    color:       '#062850',
    badge:       'Most Popular',
  },
  {
    icon:        BookOpen,
    title:       'Academy',
    description: 'Curriculum-based video lessons, live classes, tests, assignments, and personalized learning paths for secondary and university students.',
    href:        '/academy',
    cta:         'Start Learning',
    color:       '#1D4469',
    badge:       'Coming Soon',
  },
  {
    icon:        Briefcase,
    title:       'Career Training',
    description: 'Career tests, industrial training, and career switch programmes to help you find and build the right professional path.',
    href:        '/careers',
    cta:         'Explore Careers',
    color:       '#325E84',
    badge:       null,
  },
  {
    icon:        Monitor,
    title:       'Digital Skills',
    description: 'Practical digital skills courses — typing, computer basics, website building, hosting, AI tools, and more.',
    href:        '/skills',
    cta:         'View Courses',
    color:       '#497296',
    badge:       null,
  },
  {
    icon:        HandCoins,
    title:       'Earn With Us',
    description: 'Join our affiliate programme and earn commissions by referring students to Averra Knowledge Academy.',
    href:        '/earn',
    cta:         'Start Earning',
    color:       '#325E84',
    badge:       null,
  },
]

const audiences = [
  {
    icon:  '🎓',
    title: 'Secondary School Students',
    desc:  'SS1–SS3, WAEC, NECO, and JAMB candidates who want structured learning and exam preparation.',
  },
  {
    icon:  '🏛️',
    title: 'University Students',
    desc:  'Students struggling with Mathematics, Sciences, and core university subjects.',
  },
  {
    icon:  '👨‍👩‍👧',
    title: 'Parents',
    desc:  'Parents seeking structured, trackable, and affordable academic support for their children.',
  },
  {
    icon:  '💼',
    title: 'Professionals',
    desc:  'Working adults looking to switch careers, gain digital skills, or pursue funded postgraduate studies.',
  },
]

const stats = [
  { value: '50+',    label: 'Countries Covered',        icon: Globe   },
  { value: '1,000+', label: 'Universities Tracked',     icon: Trophy  },
  { value: '500+',   label: 'Course Fields Eligible',   icon: BookOpen },
  { value: '100%',   label: 'Manual Verification',      icon: Star    },
]

const whyAverra = [
  'Structured curriculum — not random content',
  'Textbook-based teaching students already know',
  'Personally verified scholarship matches',
  'Live classes with real teachers',
  'Diagnostic learning system for weak areas',
  'Full academic ecosystem in one platform',
  'African curriculum focus and local relevance',
  'Career guidance from test to placement',
]

const plans = [
  {
    name:     'Basic',
    price:    '₦1,500',
    period:   '/month',
    desc:     'Full access to prerecorded lessons and subject library.',
    features: ['All prerecorded lessons', 'Subject library access', 'Notes and summaries'],
    cta:      'Get Started',
    featured: false,
  },
  {
    name:     'Standard',
    price:    '₦4,000',
    period:   '/month',
    desc:     'Everything in Basic plus tests, assignments, and progress tracking.',
    features: ['Everything in Basic', 'Tests and quizzes', 'Assignments', 'Progress tracking', 'Monthly reports'],
    cta:      'Get Started',
    featured: true,
  },
  {
    name:     'Premium Live',
    price:    '₦10,000',
    period:   '/month',
    desc:     'Everything in Standard plus live classes and teacher support.',
    features: ['Everything in Standard', 'Live classes', 'Live Q&A sessions', 'Teacher support', 'Group revision classes'],
    cta:      'Get Started',
    featured: false,
  },
  {
    name:     'Elite Diagnostic',
    price:    '₦35,000',
    period:   '/month',
    desc:     'Full diagnostic assessment and personalized academic coaching.',
    features: ['Everything in Premium', 'Full diagnostic assessment', 'Personalized learning plan', '"Smarter Than Einstein" system', 'Advanced performance tracking'],
    cta:      'Get Started',
    featured: false,
  },
]

export default function HomePage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section
        className="relative pt-32 pb-28 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${BRAND} 0%, ${MID} 50%, #325E84 100%)`,
        }}
      >
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-10 animate-pulse"
            style={{ backgroundColor: LIGHT }}
          />
          <div
            className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-10 animate-pulse"
            style={{ backgroundColor: '#325E84', animationDelay: '1s' }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white border border-white/20 bg-white/10 backdrop-blur-sm mb-8">
            <Star className="w-4 h-4" />
            Africa's Complete Academic Success Platform
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            The Right Knowledge.
            <br />
            <span style={{ color: '#97C3E0' }}>The Right Future.</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-12 leading-relaxed">
            Averra Knowledge Academy combines scholarship matching, curriculum-based
            learning, career training, and digital skills — everything you need to
            succeed academically and professionally.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/scholarship">
              <Button
                size="lg"
                className="bg-white font-semibold text-base px-8 py-6 rounded-xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 group"
                style={{ color: BRAND }}
              >
                Find a Scholarship
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/academy">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/50 text-white bg-transparent text-base px-8 py-6 rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white hover:scale-105"
              >
                Start Learning
                <BookOpen className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              >
                <stat.icon className="w-6 h-6 text-blue-300 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-blue-200 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 80L60 74C120 68 240 56 360 50C480 44 600 44 720 47C840 50 960 56 1080 59C1200 62 1320 62 1380 62L1440 62V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white mb-4"
              style={{ backgroundColor: LIGHT }}
            >
              What We Offer
            </div>
            <h2
              className="text-3xl md:text-5xl font-bold mb-4 leading-tight"
              style={{ color: BRAND }}
            >
              Everything You Need
              <br />
              <span style={{ color: LIGHT }}>In One Platform</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From finding fully funded scholarships to building real skills and
              career pathways — Averra gives you the tools to move forward.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <div
                key={service.title}
                className={`relative flex flex-col p-8 rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${i === 0 ? 'lg:col-span-2' : ''}`}
              >
                {service.badge && (
                  <span
                    className="absolute top-6 right-6 text-xs font-bold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: service.color }}
                  >
                    {service.badge}
                  </span>
                )}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${service.color}15` }}
                >
                  <service.icon className="w-7 h-7" style={{ color: service.color }} />
                </div>
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: BRAND }}
                >
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-6">
                  {service.description}
                </p>
                <Link href={service.href}>
                  <Button
                    className="w-full font-semibold text-white transition-all duration-300 hover:opacity-90 hover:scale-[1.02]"
                    style={{ backgroundColor: service.color }}
                  >
                    {service.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO WE SERVE ──────────────────────────────────────────── */}
      <section className="py-24" style={{ backgroundColor: PALE }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white mb-4"
              style={{ backgroundColor: LIGHT }}
            >
              <Users className="w-4 h-4" />
              Who We Serve
            </div>
            <h2
              className="text-3xl md:text-5xl font-bold mb-4 leading-tight"
              style={{ color: BRAND }}
            >
              Built for Students,
              <br />
              <span style={{ color: LIGHT }}>Parents & Professionals</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {audiences.map((a) => (
              <div
                key={a.title}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{a.icon}</div>
                <h3
                  className="text-lg font-bold mb-3"
                  style={{ color: BRAND }}
                >
                  {a.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY AVERRA ────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white mb-6"
                style={{ backgroundColor: LIGHT }}
              >
                Why Choose Averra
              </div>
              <h2
                className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
                style={{ color: BRAND }}
              >
                Not Just Another
                <br />
                <span style={{ color: LIGHT }}>Education Platform</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Averra is a complete guided academic success system. Our real value
                is not just information — it is understanding, structure,
                accountability, and genuine improvement.
              </p>
              <Link href="/scholarship">
                <Button
                  size="lg"
                  className="font-semibold text-white px-8 py-6 rounded-xl transition-all duration-300 hover:opacity-90 hover:scale-105"
                  style={{ backgroundColor: BRAND }}
                >
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {whyAverra.map((point) => (
                <div
                  key={point}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${BRAND}15` }}
                  >
                    <CheckCircle className="w-5 h-5" style={{ color: BRAND }} />
                  </div>
                  <span className="text-gray-700 font-medium text-sm">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ACADEMY PRICING ───────────────────────────────────────── */}
      <section className="py-24" style={{ backgroundColor: PALE }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white mb-4"
              style={{ backgroundColor: LIGHT }}
            >
              Academy Pricing
            </div>
            <h2
              className="text-3xl md:text-5xl font-bold mb-4 leading-tight"
              style={{ color: BRAND }}
            >
              Affordable Plans for
              <br />
              <span style={{ color: LIGHT }}>Every Student</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Start free, upgrade when you're ready. All plans include access to
              our structured curriculum and learning system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                  plan.featured
                    ? 'shadow-2xl scale-[1.02] text-white'
                    : 'bg-white border border-gray-100 shadow-sm hover:shadow-lg'
                }`}
                style={plan.featured ? { background: `linear-gradient(135deg, ${BRAND} 0%, ${MID} 100%)` } : {}}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: plan.featured ? '#fff' : BRAND }}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span
                    className="text-3xl font-bold"
                    style={{ color: plan.featured ? '#fff' : BRAND }}
                  >
                    {plan.price}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: plan.featured ? '#97C3E0' : '#6b7280' }}
                  >
                    {plan.period}
                  </span>
                </div>
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: plan.featured ? '#97C3E0' : '#6b7280' }}
                >
                  {plan.desc}
                </p>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: plan.featured ? '#97C3E0' : BRAND }}
                      />
                      <span style={{ color: plan.featured ? '#e0f0ff' : '#374151' }}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href="/academy">
                  <Button
                    className="w-full font-semibold transition-all duration-300 hover:scale-[1.02]"
                    style={
                      plan.featured
                        ? { backgroundColor: '#fff', color: BRAND }
                        : { backgroundColor: BRAND, color: '#fff' }
                    }
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────── */}
      <section
        className="py-24 text-center"
        style={{ background: `linear-gradient(135deg, ${BRAND} 0%, ${MID} 100%)` }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Take the
            <br />
            <span style={{ color: '#97C3E0' }}>Right Step Forward?</span>
          </h2>
          <p className="text-blue-100 text-lg mb-10 leading-relaxed">
            Join thousands of students and professionals who are using Averra
            Knowledge Academy to learn better, grow faster, and achieve more.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/scholarship">
              <Button
                size="lg"
                className="bg-white font-semibold text-base px-8 py-6 rounded-xl shadow-xl transition-all duration-300 hover:scale-105 group"
                style={{ color: BRAND }}
              >
                Find a Scholarship
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/academy">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/50 text-white bg-transparent text-base px-8 py-6 rounded-xl transition-all duration-300 hover:bg-white/10 hover:border-white hover:scale-105"
              >
                Start Learning
                <BookOpen className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}