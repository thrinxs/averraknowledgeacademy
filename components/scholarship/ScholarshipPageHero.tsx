import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  GraduationCap,
  ChevronDown,
} from 'lucide-react'

export default function ScholarshipPageHero() {
  return (
    <section
      className="relative pt-32 pb-24 overflow-hidden"
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

      <div className="relative max-w-7xl mx-auto px-4
      sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2
            px-4 py-2 rounded-full text-sm font-medium
            text-white border border-white/20
            bg-white/10 backdrop-blur-sm mb-8"
          >
            <GraduationCap className="w-4 h-4" />
            Scholarship Matching Service
          </div>

          {/* Headline */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl
            font-bold text-white leading-tight mb-6"
          >
            Find the Right
            <br />
            <span style={{ color: '#97C3E0' }}>
              Fully Funded Scholarship
            </span>
            <br />
            For Your Profile
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-blue-100
          max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop searching alone. We research thousands of
            scholarships across 50+ countries, match the best
            ones to your exact profile, verify them, and
            prepare you to apply with confidence.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row
          items-center justify-center gap-4 mb-12">
            <Link href="/scholarship/apply">
              <Button
                size="lg"
                className="bg-white font-semibold
                text-base px-8 py-6 rounded-xl
                shadow-xl transition-all duration-300
                hover:scale-105 hover:shadow-2xl
                active:scale-95 group"
                style={{ color: '#062850' }}
              >
                Get Started
                <ArrowRight
                  className="ml-2 h-5 w-5 transition-transform
                  duration-300 group-hover:translate-x-1"
                />
              </Button>
            </Link>
            <a href="#pricing">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/50 text-white
                bg-transparent text-base px-8 py-6 rounded-xl
                backdrop-blur-sm transition-all duration-300
                hover:bg-white/10 hover:border-white
                hover:scale-105"
              >
                See Pricing
                <ChevronDown className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center
          justify-center gap-6 text-blue-200 text-sm">
            {[
              '50+ Countries Covered',
              '1,000+ Universities Tracked',
              '500+ Eligible Course Fields',
              'Manual Verification Included',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full
                  bg-green-400"
                />
                {item}
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
            d="M0 80L60 74C120 68 240 56 360 50C480 44
            600 44 720 47C840 50 960 56 1080 59C1200 62
            1320 62 1380 62L1440 62V80H1380C1320 80 1200
            80 1080 80C960 80 840 80 720 80C600 80 480 80
            360 80C240 80 120 80 60 80H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}