'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Globe,
  GraduationCap,
  Briefcase,
  Lightbulb,
} from 'lucide-react'

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const stats = [
    { number: '50+', label: 'Countries With Scholarships' },
    { number: '1,000+', label: 'Universities Offering Scholarships' },
    { number: '500+', label: 'Courses Eligible for Scholarships' },
  ]

  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden"
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
          style={{ backgroundColor: '#325E84', animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64
          rounded-full opacity-5 animate-pulse"
          style={{ backgroundColor: '#497296', animationDelay: '2s' }}
        />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 opacity-20 animate-bounce"
          style={{ animationDuration: '3s' }}
        >
          <GraduationCap className="w-12 h-12 text-white" />
        </div>
        <div
          className="absolute top-40 right-20 opacity-20 animate-bounce"
          style={{ animationDuration: '4s' }}
        >
          <Globe className="w-10 h-10 text-white" />
        </div>
        <div
          className="absolute bottom-40 left-20 opacity-20 animate-bounce"
          style={{ animationDuration: '5s' }}
        >
          <Briefcase className="w-8 h-8 text-white" />
        </div>
        <div
          className="absolute bottom-60 right-32 opacity-20 animate-bounce"
          style={{ animationDuration: '3.5s' }}
        >
          <Lightbulb className="w-9 h-9 text-white" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4
      sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2
            px-4 py-2 rounded-full text-sm font-medium
            text-white border border-white/20
            bg-white/10 backdrop-blur-sm mb-8
            transition-all duration-700
            ${isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Academic & Professional Excellence Platform
          </div>

          {/* Main Headline */}
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl
            font-bold text-white leading-tight mb-6
            transition-all duration-700 delay-100
            ${isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
            }`}
          >
            Your Academic, Professional
            <br />
            &amp; Career Success —{' '}
            <span
              className="relative inline-block"
              style={{ color: '#97C3E0' }}
            >
              All In One Place
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
              >
                <path
                  d="M1 9C50 3 150 1 299 9"
                  stroke="#497296"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className={`text-lg md:text-xl text-blue-100
            max-w-3xl mx-auto mb-6 leading-relaxed
            transition-all duration-700 delay-200
            ${isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
            }`}
          >
            Whether you are looking for fully funded scholarships abroad,
            practical skills to advance your career, professional training
            to stand out, or structured academic learning — Averra Knowledge
            Academy brings it all together in one trusted platform.
          </p>

          {/* Services Pill Tags */}
          <div
            className={`flex flex-wrap items-center justify-center
            gap-3 mb-10
            transition-all duration-700 delay-300
            ${isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
            }`}
          >
            {[
              'Fully Funded Scholarships',
              'Practical Skills Training',
              'Career Coaching',
              'Academic Learning',
            ].map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 rounded-full text-sm
                font-medium text-white border border-white/20
                bg-white/10 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center
            justify-center gap-4 mb-16
            transition-all duration-700 delay-400
            ${isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
            }`}
          >
            <Link href="/scholarship">
              <Button
                size="lg"
                className="bg-white font-semibold
                text-base px-8 py-6 rounded-xl
                shadow-xl transition-all duration-300
                hover:scale-105 hover:shadow-2xl
                active:scale-95 group"
                style={{ color: '#062850' }}
              >
                Find My Scholarship
                <ArrowRight
                  className="ml-2 h-5 w-5 transition-transform
                  duration-300 group-hover:translate-x-1"
                />
              </Button>
            </Link>
            <Link href="#services">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/50 text-white
                bg-transparent text-base px-8 py-6 rounded-xl
                backdrop-blur-sm transition-all duration-300
                hover:bg-white/10 hover:border-white
                hover:scale-105"
              >
                Explore Our Services
              </Button>
            </Link>
          </div>

          {/* Stats — realistic scholarship data */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-3
            gap-4 max-w-3xl mx-auto
            transition-all duration-700 delay-500
            ${isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
            }`}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm
                rounded-2xl p-5 border border-white/20
                transition-all duration-300
                hover:bg-white/20 hover:scale-105"
              >
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-blue-200 leading-snug">
                  {stat.label}
                </div>
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