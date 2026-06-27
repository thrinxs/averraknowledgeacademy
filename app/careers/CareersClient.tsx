'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Briefcase,
  Clock,
  CheckCircle,
  ArrowRight,
  Users,
  Target,
  TrendingUp,
  Star,
  Globe,
  BookOpen,
  Mic,
  MapPin,
  Home,
  Languages,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Phone,
  MessageCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const faqs = [
  {
    q: 'Who is the Career Test designed for?',
    a: 'The Career Test is designed for anyone who is unsure of which career path to pursue, wants to explore what a specific career actually involves, or wants to make a more informed decision before committing to a field. It is especially useful for fresh graduates, students nearing graduation, and professionals feeling stuck.',
  },
  {
    q: 'Who is the Industrial Training programme for?',
    a: 'Industrial Training is for applicants who have already completed some level of training or education in their field and now need real practical experience. It bridges the gap between academic knowledge and workplace readiness.',
  },
  {
    q: 'What does Career Switch involve?',
    a: 'Career Switch is a structured 6-month programme that equips professionals from one career with the skills, experience, and guidance needed to transition into a completely different field. The programme accounts for the specific laws, requirements, and expectations of the new career.',
  },
  {
    q: 'Can I combine more than one programme?',
    a: 'Yes. For example, you could complete the Career Test first to confirm your direction, then proceed to Industrial Training or Career Switch. Our team will advise the best path based on your goals.',
  },
  {
    q: 'Are the programmes available online or in person?',
    a: 'Programme delivery varies based on the specific career and requirements. Contact us to discuss the delivery format most suitable for your chosen field.',
  },
  {
    q: 'What add-ons are available?',
    a: 'We offer a range of career add-ons including adult lessons, language and accent training, culture training, logistics support, physical tours, and accommodation assistance — particularly useful for career switches that involve relocation or international transitions.',
  },
  {
    q: 'How do I get started?',
    a: 'Contact us via email, phone, or WhatsApp to discuss your career goals. Our team will recommend the most suitable programme and guide you through the next steps.',
  },
  {
    q: 'Are payment plans available?',
    a: 'Contact our team to discuss payment options. We are committed to making our programmes as accessible as possible.',
  },
]

export default function CareersClient() {
  const [mounted, setMounted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  function toggleFaq(index: number) {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <main className="min-h-screen bg-white">

      {/* ── HERO ───────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-24 md:py-32"
        style={{ backgroundColor: '#062850' }}
      >
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

            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 text-white text-sm font-medium mb-8">
                <Briefcase className="w-4 h-4" style={{ color: '#97C3E0' }} />
                Career Trainings & Coaching
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Build the Career You{' '}
                <span style={{ color: '#97C3E0' }}>
                  Actually Want
                </span>
              </h1>

              <p className="text-white/70 text-lg leading-relaxed mb-10">
                Whether you are exploring career options, gaining practical
                experience, or switching fields entirely — our Career
                Trainings and Coaching programmes give you the structure,
                guidance, and real-world exposure to move forward with
                confidence.
              </p>

              <div className="flex flex-wrap gap-4">
                <a href="#programmes">
                  <Button
                    className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                    style={{ backgroundColor: '#497296', color: '#fff' }}
                  >
                    View Programmes
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
                <a
                  href="https://wa.me/2349033440966"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="px-8 py-3 rounded-xl font-semibold border-white/20 text-white hover:bg-white/10 transition-all duration-300"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Talk to Us
                  </Button>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '3',    label: 'Core Programmes',       color: '#1D4469' },
                { value: '6 mo', label: 'Longest Programme',     color: '#325E84' },
                { value: '100%', label: 'Hands-On Focus',        color: '#497296' },
                { value: '1:1',  label: 'Personalised Coaching', color: '#033B6A' },
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
        </div>
      </section>

      {/* ── WHAT IS CTC ─────────────────────────────────── */}
      <section
        className="py-20 px-6"
        style={{ backgroundColor: '#F0F6FB' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

            <div>
              <h2
                className="text-3xl md:text-4xl font-bold mb-6"
                style={{ color: '#062850' }}
              >
                Career Trainings & Coaching (CTC)
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Knowing what you want to do with your career is one
                  thing. Getting the exposure, experience, and skills to
                  actually do it is another.
                </p>
                <p>
                  The Averra CTC programmes are designed to bridge that
                  gap — helping you explore careers, gain real practical
                  experience, and successfully switch fields when you are
                  ready for a change.
                </p>
                <p>
                  Each programme is structured, guided by experienced
                  professionals, and tailored to your specific goals and
                  the realities of your chosen field.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon:  <Target className="w-5 h-5" />,
                  title: 'Career Exploration',
                  desc:  'Gain real exposure to careers before committing — understand what the work actually involves.',
                  color: '#062850',
                },
                {
                  icon:  <Briefcase className="w-5 h-5" />,
                  title: 'Practical Experience',
                  desc:  'Go beyond theory with hands-on industrial training that employers actually value.',
                  color: '#325E84',
                },
                {
                  icon:  <TrendingUp className="w-5 h-5" />,
                  title: 'Career Transition',
                  desc:  'Switch fields with a structured programme that covers the skills, laws, and expectations of your new career.',
                  color: '#497296',
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
                    <h4 className="font-bold mb-1" style={{ color: '#062850' }}>
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

      {/* ── THREE PROGRAMMES ────────────────────────────── */}
      <section id="programmes" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: '#062850' }}
            >
              Our Three Core Programmes
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Choose the programme that matches where you are in your
              career journey. Each is structured, guided, and built
              around real outcomes.
            </p>
          </div>

          <div className="space-y-8">

            {/* ── Programme 1 — Career Test ── */}
            <div
              id="career-test"
              className="rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 transition-all duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div
                  className="p-8 flex flex-col justify-between"
                  style={{ backgroundColor: '#062850' }}
                >
                  <div>
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                      style={{ backgroundColor: '#1D4469' }}
                    >
                      <Target className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Career Test
                    </h3>
                    <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
                      <Clock className="w-4 h-4" />
                      2 weeks
                    </div>
                  </div>
                  <div>
                    <p className="text-4xl font-bold mb-1" style={{ color: '#97C3E0' }}>
                      ₦150,000
                    </p>
                    <p className="text-white/40 text-sm">One-time payment</p>
                  </div>
                </div>

                <div className="md:col-span-2 p-8" style={{ backgroundColor: '#F0F6FB' }}>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    The Career Test helps you gain real exposure to a specific career —
                    understanding what the work actually involves, what it takes to succeed,
                    and whether it is the right fit for you. Designed to help you choose a
                    career you will love and be efficient in, before committing fully.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {[
                      'Exposure to real career environments',
                      'Understand daily responsibilities',
                      'Identify your natural strengths',
                      'Make an informed career decision',
                      'Guided by industry professionals',
                      'Structured 2-week immersion',
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#497296' }} />
                        {item}
                      </div>
                    ))}
                  </div>

                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white mb-6"
                    style={{ backgroundColor: '#062850' }}
                  >
                    <Users className="w-4 h-4" />
                    Best for: Students, fresh graduates, and anyone exploring career options
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <a href="https://wa.me/2349033440966" target="_blank" rel="noopener noreferrer">
                      <Button
                        className="px-6 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                        style={{ backgroundColor: '#062850', color: '#fff' }}
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </a>
                    <a href="mailto:info@averraknowledgeacademy.com">
                      <Button
                        variant="outline"
                        className="px-6 py-2 rounded-xl font-semibold transition-all"
                        style={{ borderColor: '#497296', color: '#497296' }}
                      >
                        Ask a Question
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Programme 2 — Industrial Training ── */}
            <div
              id="industrial-training"
              className="rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 transition-all duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div
                  className="p-8 flex flex-col justify-between"
                  style={{ backgroundColor: '#325E84' }}
                >
                  <div>
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                      style={{ backgroundColor: '#497296' }}
                    >
                      <Briefcase className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Industrial Training
                    </h3>
                    <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
                      <Clock className="w-4 h-4" />
                      3 months
                    </div>
                  </div>
                  <div>
                    <p className="text-4xl font-bold mb-1" style={{ color: '#97C3E0' }}>
                      ₦350,000
                    </p>
                    <p className="text-white/40 text-sm">One-time payment</p>
                  </div>
                </div>

                <div className="md:col-span-2 p-8" style={{ backgroundColor: '#F0F6FB' }}>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Industrial Training bridges the gap between academic knowledge and
                    real-world professional practice. For applicants who have undergone
                    training or graduated and now need genuine practical experience in their
                    field — the kind employers and clients actually look for.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {[
                      'Real workplace environment exposure',
                      'Supervised practical experience',
                      'Field-specific skill development',
                      'Professional mentorship',
                      'Build an employable track record',
                      'Structured 3-month programme',
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#497296' }} />
                        {item}
                      </div>
                    ))}
                  </div>

                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white mb-6"
                    style={{ backgroundColor: '#325E84' }}
                  >
                    <GraduationCap className="w-4 h-4" />
                    Best for: Graduates and trained professionals seeking practical experience
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <a href="https://wa.me/2349033440966" target="_blank" rel="noopener noreferrer">
                      <Button
                        className="px-6 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                        style={{ backgroundColor: '#325E84', color: '#fff' }}
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </a>
                    <a href="mailto:info@averraknowledgeacademy.com">
                      <Button
                        variant="outline"
                        className="px-6 py-2 rounded-xl font-semibold transition-all"
                        style={{ borderColor: '#497296', color: '#497296' }}
                      >
                        Ask a Question
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Programme 3 — Career Switch ── */}
            <div
              id="career-switch"
              className="rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 transition-all duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div
                  className="p-8 flex flex-col justify-between"
                  style={{ backgroundColor: '#497296' }}
                >
                  <div>
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                      style={{ backgroundColor: '#325E84' }}
                    >
                      <TrendingUp className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Career Switch
                    </h3>
                    <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
                      <Clock className="w-4 h-4" />
                      6 months
                    </div>
                  </div>
                  <div>
                    <p className="text-4xl font-bold mb-1" style={{ color: '#97C3E0' }}>
                      ₦500,000
                    </p>
                    <p className="text-white/40 text-sm">One-time payment</p>
                  </div>
                </div>

                <div className="md:col-span-2 p-8" style={{ backgroundColor: '#F0F6FB' }}>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Career Switch is a comprehensive 6-month programme for professionals
                    from one career who want to transition into a completely different field.
                    We equip you with the skills, practical experience, and understanding of
                    the specific laws and requirements of your new career — so you can make
                    the switch confidently and successfully.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {[
                      'Field-specific skills training',
                      'Practical transition experience',
                      'Legal and regulatory guidance',
                      'Professional network building',
                      'Personalised transition roadmap',
                      'Structured 6-month programme',
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#497296' }} />
                        {item}
                      </div>
                    ))}
                  </div>

                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white mb-6"
                    style={{ backgroundColor: '#497296' }}
                  >
                    <Star className="w-4 h-4" />
                    Best for: Professionals ready to transition to a completely new career field
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <a href="https://wa.me/2349033440966" target="_blank" rel="noopener noreferrer">
                      <Button
                        className="px-6 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                        style={{ backgroundColor: '#497296', color: '#fff' }}
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </a>
                    <a href="mailto:info@averraknowledgeacademy.com">
                      <Button
                        variant="outline"
                        className="px-6 py-2 rounded-xl font-semibold transition-all"
                        style={{ borderColor: '#497296', color: '#497296' }}
                      >
                        Ask a Question
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ────────────────────────────── */}
      <section className="py-20 px-6" style={{ backgroundColor: '#F0F6FB' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: '#062850' }}
            >
              Which Programme Is Right for You?
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              A quick comparison to help you choose the right starting point.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#062850' }}>
                  <th className="text-left text-white/60 font-medium px-6 py-4">Feature</th>
                  <th className="text-center text-white font-bold px-6 py-4" style={{ backgroundColor: '#062850' }}>Career Test</th>
                  <th className="text-center text-white font-bold px-6 py-4" style={{ backgroundColor: '#325E84' }}>Industrial Training</th>
                  <th className="text-center text-white font-bold px-6 py-4" style={{ backgroundColor: '#497296' }}>Career Switch</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Price',                   test: '₦150,000',              industrial: '₦350,000',           careerSwitch: '₦500,000' },
                  { feature: 'Duration',                test: '2 weeks',               industrial: '3 months',           careerSwitch: '6 months' },
                  { feature: 'Primary goal',            test: 'Career exploration',    industrial: 'Practical experience', careerSwitch: 'Full career transition' },
                  { feature: 'Best for',                test: 'Students & fresh grads', industrial: 'Trained graduates',  careerSwitch: 'Working professionals' },
                  { feature: 'Skills training',         test: 'Basic exposure',        industrial: 'Field-specific',     careerSwitch: 'Comprehensive' },
                  { feature: 'Mentorship included',     test: '✅ Yes',                industrial: '✅ Yes',             careerSwitch: '✅ Yes' },
                  { feature: 'Personalised roadmap',    test: '—',                     industrial: '—',                  careerSwitch: '✅ Yes' },
                  { feature: 'Legal/regulatory guidance', test: '—',                   industrial: '—',                  careerSwitch: '✅ Yes' },
                ].map((row, i) => (
                  <tr key={row.feature} style={{ backgroundColor: i % 2 === 0 ? '#F0F6FB' : '#fff' }}>
                    <td className="px-6 py-4 font-medium" style={{ color: '#062850' }}>{row.feature}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{row.test}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{row.industrial}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{row.careerSwitch}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── ADD-ONS ─────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: '#062850' }}
            >
              Career Add-Ons
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Complement your programme with practical support designed to make
              your career transition or development smoother.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon:  <BookOpen className="w-6 h-6" />,
                title: 'Adult Lessons',
                desc:  'Targeted academic and professional lessons for adults who need to refresh or upgrade specific knowledge areas relevant to their career.',
                color: '#062850',
              },
              {
                icon:  <Languages className="w-6 h-6" />,
                title: 'Language, Accent & Culture Training',
                desc:  'Prepare for careers or environments that require communication in a different language, accent adjustment, or cultural awareness.',
                color: '#1D4469',
              },
              {
                icon:  <Globe className="w-6 h-6" />,
                title: 'Logistics Support',
                desc:  'Practical assistance with the logistical aspects of career transitions — particularly for moves that involve relocating to a new city or country.',
                color: '#325E84',
              },
              {
                icon:  <MapPin className="w-6 h-6" />,
                title: 'Physical Tours',
                desc:  'Guided tours of relevant professional environments, workplaces, and institutions to help you understand the real context of your chosen career.',
                color: '#497296',
              },
              {
                icon:  <Home className="w-6 h-6" />,
                title: 'Accommodation Assistance',
                desc:  'Support in finding suitable accommodation for career transitions that require you to be in a specific location for training or work.',
                color: '#033B6A',
              },
              {
                icon:  <Mic className="w-6 h-6" />,
                title: 'Career Coaching Sessions',
                desc:  'One-on-one coaching sessions with experienced career professionals to help you navigate decisions, challenges, and opportunities in your career journey.',
                color: '#062850',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-6 shadow-sm border hover:-translate-y-1 transition-all duration-300"
                style={{ borderColor: '#E2EEF7' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white"
                  style={{ backgroundColor: item.color }}
                >
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: '#062850' }}>
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-400 text-sm mt-8">
            Add-on pricing and availability depends on your programme and specific needs.{' '}
            <a
              href="mailto:info@averraknowledgeacademy.com"
              className="underline hover:text-gray-600 transition-colors"
            >
              Contact us to discuss.
            </a>
          </p>
        </div>
      </section>

      {/* ── WHY AVERRA CTC ──────────────────────────────── */}
      <section className="py-20 px-6" style={{ backgroundColor: '#F0F6FB' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: '#062850' }}
            >
              Why Choose Averra CTC?
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Our programmes are built around real outcomes — not just participation certificates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon:  <Target className="w-6 h-6" />,
                title: 'Outcome-Focused',
                desc:  'Every programme is designed with a clear outcome — career clarity, workplace readiness, or a successful field transition. We measure success by your progress, not just your attendance.',
                color: '#062850',
              },
              {
                icon:  <Users className="w-6 h-6" />,
                title: 'Guided by Professionals',
                desc:  'You are not going through a template. Our programmes are guided by experienced professionals who understand the realities of the careers and industries you are entering.',
                color: '#325E84',
              },
              {
                icon:  <Star className="w-6 h-6" />,
                title: 'Personalised to You',
                desc:  'Your background, goals, and target career all influence how your programme is structured. This is not a one-size-fits-all approach.',
                color: '#497296',
              },
              {
                icon:  <Globe className="w-6 h-6" />,
                title: 'Global Awareness',
                desc:  'Whether your career goals are local or international, our programmes account for the specific standards, laws, and expectations of your chosen field and location.',
                color: '#1D4469',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-7 shadow-sm hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white"
                  style={{ backgroundColor: item.color }}
                >
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: '#062850' }}>
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: '#062850' }}
            >
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 text-lg">
              Everything you need to know about our Career Trainings & Coaching programmes.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl overflow-hidden shadow-sm border"
                style={{ borderColor: '#E2EEF7' }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left bg-white transition-colors hover:bg-gray-50"
                >
                  <span className="font-semibold pr-4" style={{ color: '#062850' }}>
                    {faq.q}
                  </span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 shrink-0" style={{ color: '#497296' }} />
                  ) : (
                    <ChevronDown className="w-5 h-5 shrink-0" style={{ color: '#497296' }} />
                  )}
                </button>

                {openFaq === index && (
                  <div className="px-6 pb-5 bg-white">
                    <p className="text-gray-500 leading-relaxed text-sm">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT + CTA ───────────────────────────────── */}
      <section className="py-20 px-6" style={{ backgroundColor: '#062850' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Take the Next Step in Your Career?
              </h2>
              <p className="text-white/60 text-lg mb-8 leading-relaxed">
                Contact our team to discuss which programme is right for you. We will
                help you choose the best path based on your current situation and career goals.
              </p>

              <div className="flex flex-wrap gap-4">
                <a href="https://wa.me/2349033440966" target="_blank" rel="noopener noreferrer">
                  <Button
                    className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                    style={{ backgroundColor: '#497296', color: '#fff' }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp Us Now
                  </Button>
                </a>
                <a href="mailto:info@averraknowledgeacademy.com">
                  <Button
                    variant="outline"
                    className="px-8 py-3 rounded-xl font-semibold border-white/20 text-white hover:bg-white/10 transition-all duration-300"
                  >
                    Send an Email
                  </Button>
                </a>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon:  <MessageCircle className="w-5 h-5" />,
                  label: 'WhatsApp',
                  value: '+234 903 344 0966',
                  href:  'https://wa.me/2349033440966',
                  color: '#1D4469',
                },
                {
                  icon:  <Phone className="w-5 h-5" />,
                  label: 'Phone',
                  value: '+234 903 344 0966',
                  href:  'tel:+2349033440966',
                  color: '#325E84',
                },
                {
                  icon:  <BookOpen className="w-5 h-5" />,
                  label: 'Email',
                  value: 'info@averraknowledgeacademy.com',
                  href:  'mailto:info@averraknowledgeacademy.com',
                  color: '#497296',
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-4 rounded-2xl p-5 text-white hover:-translate-y-0.5 hover:brightness-110 transition-all duration-300"
                  style={{ backgroundColor: item.color }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-white/50 text-xs mb-0.5">{item.label}</p>
                    <p className="font-semibold text-sm">{item.value}</p>
                  </div>
                </a>
              ))}

              <div
                className="rounded-2xl p-5 text-center"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <p className="text-white/40 text-sm">Not sure which programme to pick?</p>
                <p className="text-white/70 text-sm font-medium mt-1">
                  Message us and we will advise you — free of charge.
                </p>
              </div>
            </div>

          </div>

          <div
            className="mt-16 pt-10 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
          >
            <p className="text-white/40 text-sm text-center mb-6">
              Explore our other services
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/scholarship">
                <Button variant="outline" className="rounded-xl border-white/20 text-white hover:bg-white/10 transition-all">
                  Scholarship Matching
                </Button>
              </Link>
              <Link href="/skills">
                <Button variant="outline" className="rounded-xl border-white/20 text-white hover:bg-white/10 transition-all">
                  Skills Training
                </Button>
              </Link>
              <Link href="/earn">
                <Button variant="outline" className="rounded-xl border-white/20 text-white hover:bg-white/10 transition-all">
                  Earn With Us
                </Button>
              </Link>
              <Link href="/academy">
                <Button variant="outline" className="rounded-xl border-white/20 text-white hover:bg-white/10 transition-all">
                  Averra Academy
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>

    </main>
  )
}