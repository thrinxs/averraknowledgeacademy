'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Bell, CheckCircle, ArrowRight } from 'lucide-react'

interface DivisionProps {
  division: {
    name: string
    tagline: string
    description: string
    target_audience: string
    age_range: string
    emoji: string
    color: string
    features: string[]
  }
}

export default function ComingSoonDivision({ division }: DivisionProps) {
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0F6FB' }}>

      <div className="relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #062850 0%, #1D4469 60%, #325E84 100%)' }}>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full
          opacity-10 animate-pulse" style={{ backgroundColor: division.color, animationDuration: '4s' }} />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full
          opacity-10 animate-pulse" style={{ backgroundColor: '#497296', animationDuration: '6s' }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <Link href="/academy" className="inline-flex items-center gap-2
          text-blue-300 hover:text-white transition-all duration-200 mb-10
          text-sm group">
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Back to All Divisions
          </Link>

          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5
            rounded-full text-sm font-bold text-white bg-white/10
            border border-white/20 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              Coming Soon — Join the Waitlist
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-5 leading-tight">
            {division.name}
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-6" style={{ color: '#97C3E0' }}>
            {division.tagline}
          </p>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            {division.description}
          </p>

          <div className="max-w-lg mx-auto bg-white/10 backdrop-blur-md
          rounded-3xl p-8 border border-white/20 shadow-2xl">
            {!submitted ? (
              <>
                <div className="flex items-center justify-center gap-2
                text-white font-bold text-lg mb-2">
                  <Bell className="w-5 h-5" />
                  Be First to Know
                </div>
                <p className="text-blue-300 text-sm mb-5 text-center">
                  Get notified the moment we launch. No spam — just one email.
                </p>
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="flex-1 px-4 py-3.5 rounded-2xl text-sm
                    text-gray-800 focus:outline-none focus:ring-2
                    focus:ring-white/50 bg-white placeholder-gray-400"
                  />
                  <button
                    onClick={() => { if (email) setSubmitted(true) }}
                    className="px-5 py-3.5 rounded-2xl text-sm font-bold
                    text-white transition-all duration-200 hover:scale-105
                    active:scale-95 whitespace-nowrap"
                    style={{ backgroundColor: '#497296' }}
                  >
                    Notify Me
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-full flex items-center
                justify-center mx-auto mb-3" style={{ backgroundColor: '#16A34A' }}>
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <p className="text-white font-bold text-lg mb-1">You&apos;re on the list!</p>
                <p className="text-blue-300 text-sm">
                  We&apos;ll notify you the moment this division launches.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path d="M0 80L60 74C120 68 240 56 360 50C480 44 600 44 720 47C840
            50 960 56 1080 59C1200 62 1320 62 1380 62L1440 62V80H1380C1320 80
            1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80
            120 80 60 80H0Z" fill="#F0F6FB"/>
          </svg>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">

          <div className="bg-white rounded-3xl p-8 border border-gray-100
          shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center
            mb-5 text-2xl" style={{ backgroundColor: '#F0F6FB' }}>👥</div>
            <h2 className="font-bold text-xl mb-3" style={{ color: '#062850' }}>
              Who Is This For?
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-5">
              {division.target_audience}
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2
            rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: '#497296' }}>
              📅 Age range: {division.age_range}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-100
          shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center
            mb-5 text-2xl" style={{ backgroundColor: '#F0F6FB' }}>📋</div>
            <h2 className="font-bold text-xl mb-4" style={{ color: '#062850' }}>
              What It Will Cover
            </h2>
            <ul className="space-y-2.5">
              {division.features.map((feature, i) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-gray-600">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center
                  flex-shrink-0 mt-0.5 text-xs font-bold text-white"
                  style={{ backgroundColor: '#062850' }}>
                    {i + 1}
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative rounded-3xl p-10 text-center mb-16 overflow-hidden"
        style={{ backgroundColor: '#062850' }}>
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-10"
          style={{ backgroundColor: '#97C3E0' }} />
          <div className="relative">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-white mb-3">
              Powered by the Averra Super Curriculum
            </h3>
            <p className="text-blue-300 text-sm max-w-xl mx-auto leading-relaxed">
              Like all Averra Academy divisions, this programme will be built on our
              unique fusion of seven of the world&apos;s best education systems —
              personalised to every learner.
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="font-semibold mb-2" style={{ color: '#062850' }}>
            Explore what&apos;s available now:
          </p>
          <p className="text-gray-500 text-sm mb-6">
            While this division is in development, our Junior Academy is fully open.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/academy/junior">
              <Button className="text-white font-bold px-8 py-3.5 rounded-2xl
              transition-all hover:scale-105 shadow-lg group"
              style={{ backgroundColor: '#062850' }}>
                🏫 Explore Junior Academy
                <ArrowRight className="ml-2 w-4 h-4 transition-transform
                duration-200 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/academy">
              <Button variant="outline" className="px-8 py-3.5 rounded-2xl
              border-2 transition-all hover:scale-105"
              style={{ borderColor: '#062850' }}>
                View All Divisions
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
