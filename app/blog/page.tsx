// app/blog/page.tsx
// ✅ Server Component — no 'use client', renders statically

import Link from 'next/link'
import {
  BookOpen,
  Globe,
  GraduationCap,
  BarChart3,
  TrendingUp,
  MapPin,
  Layers,
  ArrowRight,
  Newspaper,
  Database,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import NotifyForm from '@/components/blog/NotifyForm'

// ─── Static data ──────────────────────────────────────────────────────────────

const STAT_CARDS = [
  {
    icon: <Globe className="w-5 h-5" />,
    value: '50+',
    label: 'Countries Covered',
    color: '#062850',
  },
  {
    icon: <BookOpen className="w-5 h-5" />,
    value: '100+',
    label: 'Fields of Study',
    color: '#325E84',
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    value: '500+',
    label: 'Scholarships Tracked',
    color: '#497296',
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    value: 'Weekly',
    label: 'Database Updates',
    color: '#1D4469',
  },
] as const

const COUNTRY_TAGS = [
  'United Kingdom',
  'Germany',
  'Australia',
  'Canada',
  'United States',
  'South Korea',
  'Japan',
  'Netherlands',
]

const FIELD_TAGS = [
  'STEM',
  'Medicine',
  'Law',
  'Business',
  'Arts & Humanities',
  'Agriculture',
  'Peace Studies',
  'Computer Science',
]

const LEVEL_TAGS = [
  'Undergraduate',
  "Master's",
  'PhD',
  'Postdoctoral',
  'LLM',
  'Fellowship',
  'Short Course',
]

const TYPE_TAGS = [
  'Fully Funded',
  'Partially Funded',
  'Tuition Only',
  'Stipend Only',
  'No IELTS Required',
  'Women Only',
  'Government Scholarships',
]

const STAT_CATEGORIES = [
  {
    icon: <MapPin className="w-5 h-5 text-white" />,
    iconBg: '#062850',
    title: 'Scholarships by Country',
    description:
      'Explore how many scholarships are available in each destination country — from the UK and Germany to Australia and South Korea.',
    tags: COUNTRY_TAGS,
  },
  {
    icon: <BookOpen className="w-5 h-5 text-white" />,
    iconBg: '#325E84',
    title: 'Scholarships by Field',
    description:
      'Find scholarships available in your specific field — from STEM and Medicine to Law, Business, Arts, and Agriculture.',
    tags: FIELD_TAGS,
  },
  {
    icon: <GraduationCap className="w-5 h-5 text-white" />,
    iconBg: '#497296',
    title: 'Scholarships by Degree Level',
    description:
      "Whether you're applying for an undergraduate degree, a master's, a PhD, or a postdoctoral fellowship — see what's available at your level.",
    tags: LEVEL_TAGS,
  },
  {
    icon: <Layers className="w-5 h-5 text-white" />,
    iconBg: '#1D4469',
    title: 'Scholarships by Type',
    description:
      'Browse fully funded, partially funded, tuition-only, and stipend-only scholarships — filter by exactly what covers your needs.',
    tags: TYPE_TAGS,
  },
]

const ARTICLE_GROUPS = [
  {
    category: 'Scholarship Guides',
    color: '#062850',
    articles: [
      'How to Find Fully Funded Scholarships in 2026',
      'Top 10 Countries for International Students',
      'How to Write a Scholarship SOP That Gets Noticed',
      'What Scholarship Committees Really Look For',
    ],
  },
  {
    category: 'Study Abroad Tips',
    color: '#325E84',
    articles: [
      'How to Choose the Right Country for Your Career Goals',
      'Study in Germany: A Complete Guide for Africans',
      'IELTS vs TOEFL — Which Should You Take?',
      'How to Get a Student Visa Step by Step',
    ],
  },
  {
    category: 'Career & Skills',
    color: '#497296',
    articles: [
      'Top Skills Employers Are Looking for in 2026',
      'How to Switch Careers Successfully',
      'Building a CV That Stands Out Internationally',
      'How Certifications Can Boost Your Salary',
    ],
  },
]

// ─── Tag chip ─────────────────────────────────────────────────────────────────

function Tag({ label }: { label: string }) {
  return (
    <span
      className="text-xs px-3 py-1 rounded-full font-medium"
      style={{ backgroundColor: '#E2EEF7', color: '#325E84' }}
    >
      {label}
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-24 md:py-32"
        style={{ backgroundColor: '#062850' }}
      >
        {/* Background glows */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ backgroundColor: '#97C3E0' }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-5 blur-3xl pointer-events-none"
          style={{ backgroundColor: '#97C3E0' }}
        />

        <div className="relative max-w-4xl mx-auto px-6 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 text-white text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            Coming Soon
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Averra Blog &{' '}
            <span style={{ color: '#97C3E0' }}>Scholarship Insights</span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-12">
            A resource hub combining expert scholarship guidance, live statistics
            from our scholarship database, and practical advice for students and
            professionals worldwide.
          </p>

          {/* ✅ Each form is its own isolated client component */}
          <NotifyForm placeholder="Enter your email address" />
        </div>
      </section>

      {/* ── TWO PILLARS ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ backgroundColor: '#F0F6FB' }}>
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: '#062850' }}
            >
              Two Things In One Place
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              The Averra Blog is not just articles. It combines expert editorial
              content with live data pulled directly from our scholarship database.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Pillar 1 — Editorial Blog */}
            <div
              className="rounded-2xl p-8 text-white"
              style={{ backgroundColor: '#062850' }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                style={{ backgroundColor: '#1D4469' }}
              >
                <Newspaper className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Editorial Blog</h3>
              <p className="text-white/70 leading-relaxed mb-6">
                Expert-written articles, guides, and advice covering scholarships,
                study abroad, career development, skills training, and academic
                success.
              </p>
              <ul className="space-y-3">
                {[
                  'How to write a winning SOP',
                  'Countries with the easiest scholarship processes',
                  'How to boost your scholarship profile',
                  'Career switch success stories',
                  'Study abroad on a budget',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-white/70 text-sm"
                  >
                    <ArrowRight
                      className="w-4 h-4 mt-0.5 shrink-0"
                      style={{ color: '#97C3E0' }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pillar 2 — Statistics Pages */}
            <div
              className="rounded-2xl p-8 text-white"
              style={{ backgroundColor: '#325E84' }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                style={{ backgroundColor: '#497296' }}
              >
                <Database className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">
                Live Scholarship Statistics
              </h3>
              <p className="text-white/70 leading-relaxed mb-6">
                Auto-generated statistics pages driven directly from our
                scholarship database — always up to date, no manual editing
                required.
              </p>
              <ul className="space-y-3">
                {[
                  'Scholarships by country',
                  'Scholarships by field of study',
                  'Scholarships by degree level',
                  'Fully funded vs partial scholarships',
                  'Scholarships with no IELTS requirement',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-white/70 text-sm"
                  >
                    <ArrowRight className="w-4 h-4 mt-0.5 shrink-0 text-white/50" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATISTICS PREVIEW CARDS ──────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: '#062850' }}
            >
              Scholarship Statistics — Coming Soon
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              These pages will be auto-generated from our live scholarship
              database and updated automatically as new scholarships are added.
            </p>
          </div>

          {/* Category grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {STAT_CATEGORIES.map((cat) => (
              <div
                key={cat.title}
                className="rounded-2xl p-6 border hover:-translate-y-1 transition-all duration-300"
                style={{ borderColor: '#E2EEF7', backgroundColor: '#F0F6FB' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: cat.iconBg }}
                  >
                    {cat.icon}
                  </div>
                  <h3 className="font-bold text-lg" style={{ color: '#062850' }}>
                    {cat.title}
                  </h3>
                </div>
                <p className="text-gray-500 text-sm mb-4">{cat.description}</p>
                <div className="flex flex-wrap gap-2">
                  {cat.tags.map((tag) => (
                    <Tag key={tag} label={tag} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STAT_CARDS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-5 text-center text-white hover:-translate-y-1 transition-all duration-300"
                style={{ backgroundColor: stat.color }}
              >
                <div className="flex justify-center mb-2 opacity-70">
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-white/60 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT TO EXPECT ────────────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ backgroundColor: '#F0F6FB' }}>
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: '#062850' }}
            >
              What to Expect When We Launch
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Here&apos;s a preview of the content categories we&apos;re building.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ARTICLE_GROUPS.map((group) => (
              <div
                key={group.category}
                className="rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className="px-6 py-4 text-white font-bold text-lg"
                  style={{ backgroundColor: group.color }}
                >
                  {group.category}
                </div>
                <div className="bg-white p-6 space-y-3">
                  {group.articles.map((article) => (
                    <div
                      key={article}
                      className="flex items-start gap-2 text-sm text-gray-600 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <ArrowRight
                        className="w-4 h-4 mt-0.5 shrink-0"
                        style={{ color: '#497296' }}
                      />
                      {article}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section
        className="py-20 px-6 text-center"
        style={{ backgroundColor: '#062850' }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get Notified When We Go Live
          </h2>
          <p className="text-white/60 text-lg mb-10">
            Be the first to access our scholarship statistics, expert guides,
            and study abroad resources.
          </p>

          {/* ✅ Independent instance — has its own state, won't sync with hero form */}
          <NotifyForm placeholder="Your email address" />

          <p className="text-white/30 text-sm mt-8 mb-6">
            Ready to find your scholarship now?
          </p>

          <Link href="/scholarship/apply">
            <Button
              className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: '#497296', color: '#fff' }}
            >
              Get My Scholarship Matches
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

    </main>
  )
}