import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, GraduationCap } from 'lucide-react'

export default function ScholarshipFinalCTA() {
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

      <div className="relative max-w-4xl mx-auto px-4
      sm:px-6 lg:px-8 text-center">

        {/* Icon */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center
          justify-center mx-auto mb-8 border border-white/20"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        >
          <GraduationCap className="w-10 h-10 text-white" />
        </div>

        {/* Headline */}
        <h2
          className="text-3xl md:text-5xl font-bold
          text-white mb-6 leading-tight"
        >
          Your Scholarship is
          <br />
          <span style={{ color: '#97C3E0' }}>
            Out There — Let Us Find It
          </span>
        </h2>

        {/* Subtext */}
        <p className="text-blue-100 text-lg md:text-xl
        max-w-2xl mx-auto mb-10 leading-relaxed">
          Thousands of fully funded scholarships go unclaimed
          every year because students don&apos;t know they exist
          or don&apos;t know how to apply. Start your search today
          and let Averra do the hard work for you.
        </p>

        {/* CTA Button */}
        <Link href="/scholarship/apply">
          <Button
            size="lg"
            className="bg-white font-semibold
            text-base px-10 py-6 rounded-xl
            shadow-xl transition-all duration-300
            hover:scale-105 hover:shadow-2xl
            active:scale-95 group"
            style={{ color: '#062850' }}
          >
            Start Now — It Takes 5 Minutes
            <ArrowRight
              className="ml-2 h-5 w-5 transition-transform
              duration-300 group-hover:translate-x-1"
            />
          </Button>
        </Link>

        {/* Reassurance */}
        <p className="text-blue-300 text-sm mt-6">
          Fill your profile. Choose your package. Receive your
          matches in under an hour.
        </p>

      </div>
    </section>
  )
}