'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Send,
} from 'lucide-react'

const BRAND = '#062850'
const MID   = '#1D4469'
const LIGHT = '#497296'
const PALE  = '#F0F6FB'

const SUBJECTS = [
  'Scholarship Matching Enquiry',
  'Academy / Learning Platform',
  'Career Training Programme',
  'Digital Skills Course',
  'Affiliate / Earn With Us',
  'Technical Support',
  'Partnership Enquiry',
  'General Enquiry',
]

const socials = [
    {
      label: 'Facebook',
      href: '#',
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      ),
    },
    {
      label: 'Instagram',
      href: '#',
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: '#',
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      label: 'YouTube',
      href: '#',
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
  ]

export default function ContactClient() {
  const [form, setForm]       = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)

  function handleChange(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error('Please fill in all required fields.')
      return
    }
    setLoading(true)
    try {
      const res  = await fetch('/api/contact/send', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send.')
      setSent(true)
      toast.success('Message sent! We will get back to you within 24 hours.')
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* ── HERO ────────────────────────────────────────────────── */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${BRAND} 0%, ${MID} 100%)` }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10 animate-pulse"
            style={{ backgroundColor: LIGHT }}
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white border border-white/20 bg-white/10 backdrop-blur-sm mb-8"
          >
            <Mail className="w-4 h-4" />
            Get In Touch
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            We Would Love to
            <br />
            <span style={{ color: '#97C3E0' }}>Hear From You</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
            Whether you have a question about scholarships, our academy, career
            programmes, or anything else — our team is ready to help.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 0C1440 0 1080 60 720 60C360 60 0 0 0 0L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── CONTACT GRID ─────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* ── Left — Contact Info ── */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2
                  className="text-2xl md:text-3xl font-bold mb-3"
                  style={{ color: BRAND }}
                >
                  Contact Information
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Reach us through any of the channels below or
                  fill in the form and we will respond within 24 hours.
                </p>
              </div>

              {/* Info cards */}
              <div className="space-y-4">
                {/* Email */}
                <a
                  href="mailto:info@averraknowledgeacademy.com"
                  className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                    style={{ backgroundColor: `${BRAND}15` }}
                  >
                    <Mail className="w-6 h-6" style={{ color: BRAND }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Email</p>
                    <p className="font-semibold text-sm break-all" style={{ color: BRAND }}>
                      info@averraknowledgeacademy.com
                    </p>
                    <p className="text-xs text-gray-500 mt-1">We reply within 24 hours</p>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href="tel:+2349033440966"
                  className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${MID}15` }}
                  >
                    <Phone className="w-6 h-6" style={{ color: MID }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Phone</p>
                    <p className="font-semibold text-sm" style={{ color: BRAND }}>+234 903 344 0966</p>
                    <p className="text-xs text-gray-500 mt-1">Monday – Saturday, 9am – 6pm</p>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/2349033440966"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#25D36615' }}
                  >
                    <MessageCircle className="w-6 h-6" style={{ color: '#25D366' }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">WhatsApp</p>
                    <p className="font-semibold text-sm" style={{ color: BRAND }}>+234 903 344 0966</p>
                    <p className="text-xs text-gray-500 mt-1">Chat with us directly</p>
                  </div>
                </a>

                {/* Address */}
                <div className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${LIGHT}15` }}
                  >
                    <MapPin className="w-6 h-6" style={{ color: LIGHT }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Office Address</p>
                    <p className="font-semibold text-sm leading-relaxed" style={{ color: BRAND }}>
                      No. 26 Elekahia Road,
                      <br />
                      Off Stadium Road,
                      <br />
                      Port Harcourt, Rivers State,
                      <br />
                      Nigeria.
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${BRAND}15` }}
                  >
                    <Clock className="w-6 h-6" style={{ color: BRAND }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Office Hours</p>
                    <p className="font-semibold text-sm" style={{ color: BRAND }}>Monday – Friday: 9:00 AM – 6:00 PM</p>
                    <p className="text-sm text-gray-600 mt-1">Saturday: 10:00 AM – 4:00 PM</p>
                    <p className="text-sm text-gray-500 mt-1">Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <p
                  className="text-sm font-bold uppercase tracking-wider mb-4"
                  style={{ color: BRAND }}
                >
                  Follow Us
                </p>
                <div className="flex items-center gap-3">
                {socials.map((s) => (
  <Link
    key={s.label}
    href={s.href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={s.label}
    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center transition-all duration-200 hover:scale-110 text-gray-400 hover:text-white"
    onMouseEnter={e => {
      ;(e.currentTarget as HTMLElement).style.backgroundColor = BRAND
      ;(e.currentTarget as HTMLElement).style.borderColor = BRAND
      ;(e.currentTarget as HTMLElement).style.color = '#fff'
    }}
    onMouseLeave={e => {
      ;(e.currentTarget as HTMLElement).style.backgroundColor = ''
      ;(e.currentTarget as HTMLElement).style.borderColor = ''
      ;(e.currentTarget as HTMLElement).style.color = ''
    }}
  >
    {s.svg}
  </Link>
))}
                </div>
              </div>
            </div>

            {/* ── Right — Contact Form ── */}
            <div className="lg:col-span-3">
              <div
                className="rounded-2xl p-8 md:p-10 border border-gray-100 shadow-sm"
                style={{ backgroundColor: PALE }}
              >
                {sent ? (
                  /* Success State */
                  <div className="text-center py-16">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                      style={{ backgroundColor: `${BRAND}15` }}
                    >
                      <Send className="w-10 h-10" style={{ color: BRAND }} />
                    </div>
                    <h3
                      className="text-2xl font-bold mb-3"
                      style={{ color: BRAND }}
                    >
                      Message Sent!
                    </h3>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      Thank you for reaching out. We have received your message
                      and will get back to you within 24 hours. Check your email
                      for a confirmation.
                    </p>
                    <Button
                      onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }}
                      className="font-semibold text-white px-8"
                      style={{ backgroundColor: BRAND }}
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  /* Form */
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <h2
                        className="text-2xl font-bold mb-2"
                        style={{ color: BRAND }}
                      >
                        Send Us a Message
                      </h2>
                      <p className="text-gray-600 text-sm">
                        Fill in the form below and we will get back to you within 24 hours.
                      </p>
                    </div>

                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-sm font-semibold mb-2"
                          style={{ color: BRAND }}
                        >
                          Full Name *
                        </label>
                        <Input
                          type="text"
                          value={form.name}
                          onChange={e => handleChange('name', e.target.value)}
                          placeholder="Your full name"
                          required
                          className="h-12 bg-white rounded-xl"
                        />
                      </div>
                      <div>
                        <label
                          className="block text-sm font-semibold mb-2"
                          style={{ color: BRAND }}
                        >
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          value={form.email}
                          onChange={e => handleChange('email', e.target.value)}
                          placeholder="you@example.com"
                          required
                          className="h-12 bg-white rounded-xl"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ color: BRAND }}
                      >
                        Phone Number
                        <span className="text-gray-400 font-normal ml-1">(optional)</span>
                      </label>
                      <Input
                        type="tel"
                        value={form.phone}
                        onChange={e => handleChange('phone', e.target.value)}
                        placeholder="+234 000 000 0000"
                        className="h-12 bg-white rounded-xl"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ color: BRAND }}
                      >
                        Subject *
                      </label>
                      <select
                        value={form.subject}
                        onChange={e => handleChange('subject', e.target.value)}
                        required
                        className="h-12 w-full rounded-xl border border-input bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 transition-colors"
                        style={{ color: form.subject ? '#111' : '#9ca3af' }}
                      >
                        <option value="" disabled>Select a subject...</option>
                        {SUBJECTS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ color: BRAND }}
                      >
                        Message *
                      </label>
                      <Textarea
                        value={form.message}
                        onChange={e => handleChange('message', e.target.value)}
                        placeholder="Write your message here..."
                        required
                        rows={6}
                        className="bg-white rounded-xl resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 font-semibold text-white text-base rounded-xl transition-all duration-300 hover:opacity-90 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ backgroundColor: BRAND }}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Send Message
                        </span>
                      )}
                    </Button>

                    <p className="text-center text-xs text-gray-400">
                      By submitting this form you agree to our{' '}
                      <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAP PLACEHOLDER ──────────────────────────────────────── */}
      <section className="pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
            style={{ height: '400px', backgroundColor: PALE }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.5!2d7.0134!3d4.8156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sElekahia+Road%2C+Port+Harcourt!5e0!3m2!1sen!2sng!4v1"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Averra Knowledge Academy Location"
            />
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────── */}
      <section
        className="py-20 text-center"
        style={{ background: `linear-gradient(135deg, ${BRAND} 0%, ${MID} 100%)` }}
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Not sure where to start?
          </h2>
          <p className="text-blue-100 mb-8">
            Chat with us on WhatsApp and we will point you in the right direction.
          </p>
          <a
            href="https://wa.me/2349033440966"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="bg-white font-semibold px-8 py-6 rounded-xl shadow-xl transition-all duration-300 hover:scale-105"
              style={{ color: BRAND }}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Chat on WhatsApp
            </Button>
          </a>
        </div>
      </section>
    </>
  )
}