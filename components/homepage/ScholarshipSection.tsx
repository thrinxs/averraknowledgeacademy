'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Search,
  CheckCircle,
  Trophy,
  ArrowRight,
  Globe,
  BookOpen,
  University,
  GraduationCap,
} from 'lucide-react'

export default function ScholarshipSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4
      sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2
            px-4 py-2 rounded-full text-sm font-medium
            text-white mb-4"
            style={{ backgroundColor: '#497296' }}
          >
            <GraduationCap className="w-4 h-4" />
            Scholarship Service
          </div>
          <h2
            className="text-3xl md:text-5xl font-bold
            mb-4 leading-tight"
            style={{ color: '#062850' }}
          >
            Your Dream Scholarship —
            <br />
            <span style={{ color: '#497296' }}>
              Found &amp; Secured
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Thousands of fully funded scholarships exist worldwide —
            but most people don&apos;t know they exist, don&apos;t know
            where to find them, and don&apos;t know how to apply.
            Tell us your profile and preferences — we research,
            match, verify, and prepare you to win the right ones.
          </p>
        </div>

        {/* How It Works Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3
        gap-8 mb-16">
          {[
            {
              icon: Search,
              step: '01',
              title: 'We Research',
              description:
                'We search across 50+ countries, thousands of ' +
                'universities, and hundreds of scholarship programs ' +
                'to find opportunities that match your exact ' +
                'academic profile.',
              color: '#497296',
            },
            {
              icon: CheckCircle,
              step: '02',
              title: 'We Match & Verify',
              description:
                'Your 5 best scholarships — personally matched to ' +
                'your profile, preferences, and eligibility, then ' +
                'manually verified by our team before delivery.',
              color: '#325E84',
            },
            {
              icon: Trophy,
              step: '03',
              title: 'We Prepare You',
              description:
                'From essays and CVs to application strategy and ' +
                'interview coaching — we give you the guidance you ' +
                'need to submit strong, competitive applications.',
              color: '#062850',
            },
          ].map((item, index) => (
            <div
              key={item.step}
              className="relative bg-white rounded-2xl p-8
              shadow-sm border border-gray-100
              transition-all duration-300
              hover:shadow-xl hover:-translate-y-2 group"
            >
              {/* Step Number */}
              <div
                className="absolute -top-4 -right-4
                w-12 h-12 rounded-full flex items-center
                justify-center text-white font-bold text-sm
                shadow-lg"
                style={{ backgroundColor: item.color }}
              >
                {item.step}
              </div>

              {/* Icon */}
              <div
                className="w-16 h-16 rounded-2xl flex
                items-center justify-center mb-6
                transition-transform duration-300
                group-hover:scale-110"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <item.icon
                  className="w-8 h-8"
                  style={{ color: item.color }}
                />
              </div>

              <h3
                className="text-xl font-bold mb-3"
                style={{ color: '#062850' }}
              >
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>

              {/* Connector Arrow */}
              {index < 2 && (
                <div className="hidden md:block absolute
                -right-4 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight
                    className="w-8 h-8"
                    style={{ color: '#497296' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3
        gap-6 mb-16">
          {[
            {
              name: 'Basic',
              price: '₦30,000',
              color: '#497296',
              features: [
                '5 Scholarship Matches',
                'Detailed Match Report',
                'Country & Deadline Info',
                'Eligibility Breakdown',
              ],
              popular: false,
            },
            {
              name: 'Standard',
              price: '₦50,000',
              color: '#325E84',
              features: [
                '5 Scholarship Matches',
                'Detailed Match Report',
                'SOP Review & Modification',
                'CV Review & Modification',
                'Application Guidance',
              ],
              popular: true,
            },
            {
              name: 'Premium',
              price: '₦150,000',
              color: '#062850',
              features: [
                '5 Scholarship Matches',
                'Everything in Standard',
                'Profile Boosting Coaching',
                'Interview Preparation',
                'WhatsApp Advisor Access',
                'Priority Support',
              ],
              popular: false,
            },
          ].map((pkg) => (
            <div
              key={pkg.name}
              className={`relative bg-white rounded-2xl p-8
              border-2 transition-all duration-300
              hover:shadow-xl hover:-translate-y-1
              ${pkg.popular
                ? 'border-[#325E84] shadow-lg'
                : 'border-gray-100'
              }`}
            >
              {pkg.popular && (
                <div
                  className="absolute -top-4 left-1/2
                  -translate-x-1/2 px-4 py-1.5 rounded-full
                  text-white text-sm font-semibold"
                  style={{ backgroundColor: '#325E84' }}
                >
                  ⭐ Most Popular
                </div>
              )}

              <h3
                className="text-xl font-bold mb-2"
                style={{ color: pkg.color }}
              >
                {pkg.name}
              </h3>
              <div
                className="text-3xl font-bold mb-6"
                style={{ color: '#062850' }}
              >
                {pkg.price}
              </div>

              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2
                    text-gray-600 text-sm"
                  >
                    <CheckCircle
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                      style={{ color: pkg.color }}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/scholarship">
                <Button
                  className="w-full text-white font-medium
                  transition-all duration-300
                  hover:opacity-90 hover:scale-105"
                  style={{ backgroundColor: pkg.color }}
                >
                  Choose {pkg.name}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div
          className="grid grid-cols-1 md:grid-cols-3
          gap-6 rounded-3xl p-8"
          style={{ backgroundColor: '#062850' }}
        >
          {[
            {
              icon: Globe,
              value: '50+',
              label: 'Countries With Scholarships',
            },
            {
              icon: University,
              value: '1,000+',
              label: 'Universities Offering Scholarships',
            },
            {
              icon: BookOpen,
              value: '500+',
              label: 'Courses Eligible for Scholarships',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 text-white"
            >
              <div
                className="w-14 h-14 rounded-xl flex
                items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#1D4469' }}
              >
                <stat.icon
                  className="w-7 h-7"
                  style={{ color: '#497296' }}
                />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {stat.value}
                </div>
                <div className="text-blue-300 text-sm">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/scholarship">
            <Button
              size="lg"
              className="text-white font-semibold
              px-10 py-6 text-base rounded-xl
              shadow-lg transition-all duration-300
              hover:opacity-90 hover:scale-105
              hover:shadow-xl group"
              style={{ backgroundColor: '#062850' }}
            >
              Start Your Scholarship Journey
              <ArrowRight
                className="ml-2 h-5 w-5 transition-transform
                duration-300 group-hover:translate-x-1"
              />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  )
}