'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Globe,
  GraduationCap,
  Briefcase,
  BookOpen,
  Target,
  Eye,
  Heart,
  Users,
  Mail,
  Phone,
  MessageCircle,
  ArrowRight,
  CheckCircle,
  Lightbulb,
  Shield,
  TrendingUp,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-white">

      {/* ── HERO ───────────────────────────────────────── */}
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

        <div className="relative max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* Left — Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 text-white text-sm font-medium mb-8">
                <Heart className="w-4 h-4" style={{ color: '#97C3E0' }} />
                About Us
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                We Are{' '}
                <span style={{ color: '#97C3E0' }}>
                  Averra Knowledge Academy
                </span>
              </h1>

              <p className="text-white/70 text-lg leading-relaxed mb-8">
                Africa's complete academic success platform — combining
                scholarship matching, practical skills training, career
                coaching, and structured academic learning under one roof,
                for students and professionals worldwide.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/scholarship">
                  <Button
                    className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                    style={{ backgroundColor: '#497296', color: '#fff' }}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <a href="#contact">
                  <Button
                    variant="outline"
                    className="px-6 py-3 rounded-xl font-semibold border-white/20 text-white hover:bg-white/10 transition-all duration-300"
                  >
                    Contact Us
                  </Button>
                </a>
              </div>
            </div>

            {/* Right — Logo */}
            <div className="flex justify-center md:justify-end">
              <div
                className="w-56 h-56 rounded-3xl flex items-center justify-center p-6"
                style={{ backgroundColor: '#1D4469' }}
              >
                <Image
                  src="/logo.png"
                  alt="Averra Knowledge Academy"
                  width={180}
                  height={180}
                  className="object-contain"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── QUICK STATS ─────────────────────────────────── */}
      <section
        className="py-12 px-6"
        style={{ backgroundColor: '#F0F6FB' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '50+',    label: 'Countries Covered',       color: '#062850' },
              { value: '1,000+', label: 'Universities in Database', color: '#325E84' },
              { value: '4',      label: 'Core Services',           color: '#497296' },
              { value: '100%',   label: 'Commitment to Students',  color: '#1D4469' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-6 text-center text-white hover:-translate-y-1 transition-all duration-300"
                style={{ backgroundColor: stat.color }}
              >
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-white/60 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: '#062850' }}
            >
              What Drives Us
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Every decision we make is guided by a clear mission and a
              vision for what academic success should look like worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Mission */}
            <div
              className="rounded-2xl p-8 text-white"
              style={{ backgroundColor: '#062850' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: '#1D4469' }}
              >
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Our Mission</h3>
              <p className="text-white/70 leading-relaxed text-sm">
                To build one of the most effective digital academic success
                platforms by combining scholarship matching, skills training,
                career coaching, and structured academic learning — making
                quality education and opportunity accessible to students and
                professionals everywhere.
              </p>
            </div>

            {/* Vision */}
            <div
              className="rounded-2xl p-8 text-white"
              style={{ backgroundColor: '#325E84' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: '#497296' }}
              >
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Our Vision</h3>
              <p className="text-white/70 leading-relaxed text-sm">
                A world where every student and professional — regardless of
                location or background — has access to the tools, guidance,
                and opportunities needed to achieve academic and career
                success without limits.
              </p>
            </div>

            {/* Values */}
            <div
              className="rounded-2xl p-8 text-white"
              style={{ backgroundColor: '#497296' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: '#325E84' }}
              >
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Our Values</h3>
              <ul className="space-y-2">
                {[
                  'Accessibility for all',
                  'Honesty and transparency',
                  'Quality over quantity',
                  'Student-first thinking',
                  'Continuous improvement',
                ].map((value) => (
                  <li
                    key={value}
                    className="flex items-center gap-2 text-white/80 text-sm"
                  >
                    <CheckCircle className="w-4 h-4 shrink-0 text-white/50" />
                    {value}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ── OUR STORY ───────────────────────────────────── */}
      <section
        className="py-20 px-6"
        style={{ backgroundColor: '#F0F6FB' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

            {/* Left — Story */}
            <div>
              <h2
                className="text-3xl md:text-4xl font-bold mb-6"
                style={{ color: '#062850' }}
              >
                Why We Built Averra
              </h2>

              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Every year, thousands of talented students miss out on
                  life-changing scholarships — not because they aren't
                  qualified, but because they don't know where to look, how
                  to apply, or how to present their profile effectively.
                </p>
                <p>
                  At the same time, many professionals struggle to gain the
                  practical skills and career experience that employers
                  actually want — not because opportunities don't exist, but
                  because the right guidance is hard to find and often
                  expensive.
                </p>
                <p>
                  Averra Knowledge Academy was built to solve both problems.
                  One platform. One brand. Multiple services — all working
                  together to take students and professionals from where they
                  are to where they want to be.
                </p>
                <p>
                  We are not just a website. We are a complete academic
                  success system built with real care for the people who use
                  it.
                </p>
              </div>
            </div>

            {/* Right — Why us bullets */}
            <div className="space-y-4">
              {[
                {
                  icon: <Shield className="w-5 h-5" />,
                  title: 'Verified Scholarship Data',
                  desc: 'Every scholarship in our database is manually reviewed by our team before being matched to users.',
                  color: '#062850',
                },
                {
                  icon: <Users className="w-5 h-5" />,
                  title: 'Human + Algorithm Matching',
                  desc: 'Our system combines intelligent matching algorithms with manual admin verification for accuracy.',
                  color: '#325E84',
                },
                {
                  icon: <Globe className="w-5 h-5" />,
                  title: 'Truly Global Platform',
                  desc: 'Built for students and professionals worldwide — not exclusively for Africa, even though that is our heart.',
                  color: '#497296',
                },
                {
                  icon: <TrendingUp className="w-5 h-5" />,
                  title: 'Always Growing',
                  desc: 'Our scholarship database is updated every week and new services are added as we grow.',
                  color: '#1D4469',
                },
                {
                  icon: <Star className="w-5 h-5" />,
                  title: 'One Brand, Four Services',
                  desc: 'Scholarships, Skills, Careers, and Academy — all under one roof so you never need to go elsewhere.',
                  color: '#033B6A',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h4
                      className="font-bold mb-1"
                      style={{ color: '#062850' }}
                    >
                      {item.title}
                    </h4>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── FOUR SERVICES ───────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: '#062850' }}
            >
              Our Four Core Services
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Four services. One platform. One goal — your success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Scholarships */}
            <div
              className="rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300"
              style={{ backgroundColor: '#062850' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: '#1D4469' }}
              >
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xl font-bold text-white">
                  Scholarship Matching
                </h3>
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 font-medium">
                  Live
                </span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-5">
                We match students with the 5 best scholarship opportunities
                worldwide based on their academic profile, preferred
                countries, field of study, and degree level. Every match is
                manually verified by our team.
              </p>
              <Link href="/scholarship">
                <Button
                  className="text-sm px-5 py-2 rounded-xl transition-all hover:scale-105"
                  style={{ backgroundColor: '#497296', color: '#fff' }}
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Skills */}
            <div
              className="rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300"
              style={{ backgroundColor: '#325E84' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: '#497296' }}
              >
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xl font-bold text-white">
                  Skills Training
                </h3>
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 font-medium">
                  Live
                </span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-5">
                Practical, certificate-based skills courses covering typing,
                computer skills, website building, web hosting, and more.
                New courses added regularly based on market demand.
              </p>
              <Link href="/skills">
                <Button
                  className="text-sm px-5 py-2 rounded-xl transition-all hover:scale-105"
                  style={{ backgroundColor: '#062850', color: '#fff' }}
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Careers */}
            <div
              className="rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300"
              style={{ backgroundColor: '#497296' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: '#325E84' }}
              >
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xl font-bold text-white">
                  Career Trainings & Coaching
                </h3>
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 font-medium">
                  Live
                </span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-5">
                Career exploration, industrial training, and career switch
                programs designed to give professionals the real-world
                experience and guidance needed to thrive in their chosen
                field.
              </p>
              <Link href="/careers">
                <Button
                  className="text-sm px-5 py-2 rounded-xl transition-all hover:scale-105"
                  style={{ backgroundColor: '#062850', color: '#fff' }}
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Academy */}
            <div
              className="rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300"
              style={{ backgroundColor: '#1D4469' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: '#325E84' }}
              >
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xl font-bold text-white">
                  Averra Academy
                </h3>
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 font-medium">
                  Coming Soon
                </span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-5">
                A complete digital learning ecosystem built on the
                "Smarter Than Einstein" method — combining curriculum-based
                video lessons, live classes, diagnostic assessments, and
                structured academic progress tracking for students worldwide.
              </p>
              <Link href="/academy">
                <Button
                  className="text-sm px-5 py-2 rounded-xl transition-all hover:scale-105"
                  style={{ backgroundColor: '#497296', color: '#fff' }}
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────── */}
      <section
        id="contact"
        className="py-20 px-6"
        style={{ backgroundColor: '#F0F6FB' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: '#062850' }}
            >
              Get In Touch
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Have a question, partnership inquiry, or just want to say hello?
              We would love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">

            {/* Email */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:-translate-y-1 transition-all duration-300">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ backgroundColor: '#F0F6FB' }}
              >
                <Mail className="w-7 h-7" style={{ color: '#062850' }} />
              </div>
              <h3
                className="font-bold text-lg mb-2"
                style={{ color: '#062850' }}
              >
                Email Us
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Send us an email and we'll respond within 24 hours.
              </p>
              <a
                href="mailto:info@averraknowledgeacademy.com"
                className="font-semibold text-sm transition-colors hover:underline"
                style={{ color: '#497296' }}
              >
                info@averraknowledgeacademy.com
              </a>
            </div>

            {/* Phone */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:-translate-y-1 transition-all duration-300">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ backgroundColor: '#F0F6FB' }}
              >
                <Phone className="w-7 h-7" style={{ color: '#325E84' }} />
              </div>
              <h3
                className="font-bold text-lg mb-2"
                style={{ color: '#062850' }}
              >
                Call Us
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Speak directly with our team during business hours.
              </p>
              <a
                href="tel:+2349033440966"
                className="font-semibold text-sm transition-colors hover:underline"
                style={{ color: '#497296' }}
              >
                +234 903 344 0966
              </a>
            </div>

            {/* WhatsApp */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:-translate-y-1 transition-all duration-300">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ backgroundColor: '#F0F6FB' }}
              >
                <MessageCircle
                  className="w-7 h-7"
                  style={{ color: '#497296' }}
                />
              </div>
              <h3
                className="font-bold text-lg mb-2"
                style={{ color: '#062850' }}
              >
                WhatsApp Us
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Chat with us directly on WhatsApp for quick responses.
              </p>
              <a
                href="https://wa.me/2349033440966"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-sm transition-colors hover:underline"
                style={{ color: '#497296' }}
              >
                +234 903 344 0966
              </a>
            </div>

          </div>

          {/* Social links */}
          <div className="text-center">
            <p
              className="font-semibold mb-6"
              style={{ color: '#062850' }}
            >
              Follow Us
            </p>
            <div className="flex justify-center gap-4 flex-wrap">

              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 hover:scale-110"
                style={{ borderColor: '#497296', color: '#497296' }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 hover:scale-110"
                style={{ borderColor: '#497296', color: '#497296' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="#"
                aria-label="Twitter"
                className="w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 hover:scale-110"
                style={{ borderColor: '#497296', color: '#497296' }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 hover:scale-110"
                style={{ borderColor: '#497296', color: '#497296' }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="#"
                aria-label="TikTok"
                className="w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 hover:scale-110"
                style={{ borderColor: '#497296', color: '#497296' }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="#"
                aria-label="YouTube"
                className="w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 hover:scale-110"
                style={{ borderColor: '#497296', color: '#497296' }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
                </svg>
              </a>

            </div>
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
            Ready to Start Your Journey?
          </h2>
          <p className="text-white/60 text-lg mb-10">
            Join thousands of students and professionals using Averra
            Knowledge Academy to unlock opportunities worldwide.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/scholarship">
              <Button
                className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: '#497296', color: '#fff' }}
              >
                Find My Scholarship
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/skills">
              <Button
                variant="outline"
                className="px-8 py-3 rounded-xl font-semibold border-white/20 text-white hover:bg-white/10 transition-all duration-300"
              >
                Explore Skills Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}