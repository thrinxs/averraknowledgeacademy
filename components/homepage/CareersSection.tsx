import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Compass,
  Building2,
  Repeat,
  Briefcase,
  Clock,
} from 'lucide-react'

export default function CareersSection() {
  const programs = [
    {
      icon: Compass,
      name: 'Career Test',
      purpose:
        'Not sure which career is right for you? This 2-week program ' +
        'gives you structured exposure to different career paths — so ' +
        'you can choose a career you will love, excel in, and commit ' +
        'to with clarity and confidence.',
      duration: '2 weeks',
      price: '₦150,000',
      color: '#497296',
    },
    {
      icon: Building2,
      name: 'Industrial Training',
      purpose:
        'Bridge the gap between education and the workplace. Gain ' +
        '3 months of structured, hands-on industry experience in your ' +
        'field — the kind of practical exposure that employers and ' +
        'industries actually value.',
      duration: '3 months',
      price: '₦350,000',
      color: '#325E84',
    },
    {
      icon: Repeat,
      name: 'Career Switch',
      purpose:
        'Already working but in the wrong field? This 6-month program ' +
        'equips you with the skills, practical experience, and industry ' +
        'knowledge you need to transition into a new career with real ' +
        'confidence.',
      duration: '6 months',
      price: '₦500,000',
      color: '#062850',
    },
  ]

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
            <Briefcase className="w-4 h-4" />
            Career Trainings &amp; Coaching
          </div>
          <h2
            className="text-3xl md:text-5xl font-bold
            mb-4 leading-tight"
            style={{ color: '#062850' }}
          >
            Discover, Build &amp; Switch
            <br />
            <span style={{ color: '#497296' }}>
              Into Your Dream Career
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Whether you are unsure what career fits you, need real
            hands-on industry experience, or want to switch fields
            completely — we have a structured program for you.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((program) => (
            <div
              key={program.name}
              className="relative bg-white rounded-2xl p-8
              border border-gray-100 shadow-sm
              transition-all duration-300
              hover:shadow-xl hover:-translate-y-2 group"
            >
              {/* Icon */}
              <div
                className="w-16 h-16 rounded-2xl flex
                items-center justify-center mb-6
                transition-transform duration-300
                group-hover:scale-110"
                style={{ backgroundColor: `${program.color}15` }}
              >
                <program.icon
                  className="w-8 h-8"
                  style={{ color: program.color }}
                />
              </div>

              {/* Name */}
              <h3
                className="text-2xl font-bold mb-3"
                style={{ color: '#062850' }}
              >
                {program.name}
              </h3>

              {/* Purpose */}
              <p className="text-gray-600 text-sm
              leading-relaxed mb-6">
                {program.purpose}
              </p>

              {/* Duration */}
              <div className="flex items-center gap-4
              mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-2
                text-sm text-gray-600">
                  <Clock
                    className="w-4 h-4"
                    style={{ color: program.color }}
                  />
                  <span>{program.duration}</span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="text-xs uppercase
                tracking-wider text-gray-500 mb-1">
                  Starting From
                </div>
                <div
                  className="text-3xl font-bold"
                  style={{ color: program.color }}
                >
                  {program.price}
                </div>
              </div>

              {/* CTA */}
              <Link href="/careers">
                <Button
                  className="w-full text-white font-medium
                  transition-all duration-300
                  hover:opacity-90 hover:scale-105 group"
                  style={{ backgroundColor: program.color }}
                >
                  Learn More
                  <ArrowRight
                    className="ml-2 h-4 w-4 transition-transform
                    duration-300 group-hover:translate-x-1"
                  />
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link href="/careers">
            <Button
              size="lg"
              variant="outline"
              className="font-semibold px-8 py-6
              text-base rounded-xl transition-all duration-300
              hover:scale-105 group"
              style={{
                borderColor: '#062850',
                color: '#062850',
              }}
            >
              View All Career Programs
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