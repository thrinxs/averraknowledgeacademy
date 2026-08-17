'use client'

import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'

const sources = [
  {
    code: 'GB',
    flag: '🇬🇧',
    country: 'England',
    contribution:
      'Subject structure, literacy progression, numeracy framework and examination pathways',
    color: '#062850',
  },
  {
    code: 'JP',
    flag: '🇯🇵',
    country: 'Japan',
    contribution:
      'Discipline, foundational mastery and structured learning — never advance until truly understood',
    color: '#1D4469',
  },
  {
    code: 'EE',
    flag: '🇪🇪',
    country: 'Estonia',
    contribution:
      'Digital competence from age 7, coding across subjects and strong academic outcomes',
    color: '#325E84',
  },
  {
    code: 'CA',
    flag: '🇨🇦',
    country: 'Canada',
    contribution:
      'Competency-based and student-centred approaches — what can your child DO?',
    color: '#497296',
  },
  {
    code: 'NG',
    flag: '🇳🇬',
    country: 'Nigeria',
    contribution:
      'Local context, Nigerian history, culture, civic knowledge and Nigerian examination preparation',
    color: '#033B6A',
  },
  {
    code: 'SG',
    flag: '🇸🇬',
    country: 'Singapore',
    contribution:
      'World #1 academic methods and the famous Singapore Maths bar model approach',
    color: '#062850',
  },
  {
    code: 'FI',
    flag: '🇫🇮',
    country: 'Finland',
    contribution:
      'Creativity, curiosity and the philosophy of understanding deeply — not testing repeatedly',
    color: '#1D4469',
  },
]

export default function SuperCurriculumSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section className="py-24 bg-white" id="curriculum">
      <div className="max-w-7xl mx-auto px-4
      sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2
            px-4 py-2 rounded-full text-sm
            font-medium text-white mb-4"
            style={{ backgroundColor: '#497296' }}
          >
            ✨ Our Unique Approach
          </div>
          <h2
            className="text-3xl md:text-5xl font-bold
            mb-6 leading-tight"
            style={{ color: '#062850' }}
          >
            What is the
            <br />
            <span style={{ color: '#497296' }}>
              Averra Super Curriculum?
            </span>
          </h2>
          <p className="text-gray-600 text-lg
          max-w-3xl mx-auto leading-relaxed">
            Your child does not follow just one curriculum.
            They follow the best of{' '}
            <strong>seven of the world&apos;s most
            respected education systems</strong> — fused
            into one coherent, personalised learning plan.
          </p>
        </div>

        {/* The 7 Sources */}
        <div className="grid grid-cols-1 md:grid-cols-2
        lg:grid-cols-3 gap-6 mb-16">
          {sources.map((source, index) => (
            <div
              key={source.code}
              className="relative bg-white rounded-2xl p-6
              border border-gray-100 shadow-sm
              transition-all duration-300
              hover:shadow-xl hover:-translate-y-2 group"
            >
              {/* Number */}
              <div
                className="absolute -top-3 -right-3
                w-8 h-8 rounded-full flex items-center
                justify-center text-white text-xs
                font-bold shadow-md"
                style={{ backgroundColor: source.color }}
              >
                {index + 1}
              </div>

              {/* Flag + Country */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">
                  {source.flag}
                </span>
                <div>
                  <h3
                    className="font-bold text-lg"
                    style={{ color: '#062850' }}
                  >
                    {source.country}
                  </h3>
                </div>
              </div>

              {/* Contribution */}
              <p className="text-gray-600 text-sm
              leading-relaxed">
                {source.contribution}
              </p>
            </div>
          ))}

          {/* The Fusion Card */}
          <div
            className="relative rounded-2xl p-6
            border-2 shadow-lg
            transition-all duration-300
            hover:shadow-xl hover:-translate-y-2
            flex flex-col justify-center"
            style={{
              borderColor: '#497296',
              background: `linear-gradient(135deg,
                #062850 0%, #1D4469 100%)`,
            }}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="font-bold text-xl
              text-white mb-3">
                Averra Super Curriculum
              </h3>
              <p className="text-blue-200 text-sm
              leading-relaxed mb-4">
                All seven systems fused into ONE
                coherent learning plan — personalised
                to your child&apos;s needs, country
                and academic level.
              </p>
              <div
                className="inline-block px-4 py-2
                rounded-full text-xs font-bold
                text-white"
                style={{ backgroundColor: '#497296' }}
              >
                + Your Child&apos;s Assessment
              </div>
            </div>
          </div>
        </div>

        {/* How The Fusion Works */}
        <div
          className="rounded-3xl p-8 md:p-12"
          style={{ backgroundColor: '#F0F6FB' }}
        >
          <h3
            className="text-2xl md:text-3xl font-bold
            text-center mb-10"
            style={{ color: '#062850' }}
          >
            How The Fusion Works
          </h3>

          <div className="flex flex-col md:flex-row
          items-center justify-center gap-4">
            {[
              {
                emoji: '🌍',
                label: 'Local Curriculum',
                sub: 'Your child\'s country',
              },
              {
                emoji: '🇳🇬',
                label: 'Nigerian NERDC',
                sub: 'Heritage curriculum',
              },
              {
                emoji: '🇸🇬🇯🇵🇪🇪🇨🇦🇫🇮',
                label: '5 World Systems',
                sub: 'Best methods globally',
              },
              {
                emoji: '🧠',
                label: 'Child\'s Assessment',
                sub: 'Individual needs',
              },
            ].map((item, index) => (
              <div
                key={item.label}
                className="flex items-center gap-4"
              >
                <div
                  className="bg-white rounded-2xl p-4
                  text-center shadow-sm border
                  border-gray-100 w-40"
                >
                  <div className="text-2xl mb-1">
                    {item.emoji}
                  </div>
                  <div
                    className="font-semibold text-sm"
                    style={{ color: '#062850' }}
                  >
                    {item.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.sub}
                  </div>
                </div>
                {index < 3 && (
                  <ArrowRight
                    className="hidden md:block
                    w-6 h-6 flex-shrink-0"
                    style={{ color: '#497296' }}
                  />
                )}
              </div>
            ))}

            {/* Equals */}
            <div className="flex items-center gap-4">
              <ArrowRight
                className="hidden md:block w-6 h-6
                flex-shrink-0"
                style={{ color: '#497296' }}
              />
              <div
                className="rounded-2xl p-4 text-center
                w-44 shadow-lg"
                style={{ backgroundColor: '#062850' }}
              >
                <div className="text-2xl mb-1">✨</div>
                <div className="font-bold text-sm
                text-white">
                  Averra Super Curriculum
                </div>
                <div className="text-xs
                text-blue-300">
                  One powerful plan
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}