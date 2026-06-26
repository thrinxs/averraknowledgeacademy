'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)

  const testimonials = [
    {
      name: 'Ibrahim Khalid',
      role: 'MSc Engineering — Germany 🇩🇪',
      content:
        'I had no idea where to start with scholarship applications. ' +
        'Averra found the DAAD scholarship for me, helped me rewrite ' +
        'my SOP from scratch, and coached me through the entire process. ' +
        'I am now fully funded in Germany!',
      rating: 5,
      initials: 'IK',
      color: '#497296',
    },
    {
      name: 'Chioma Adeyemi',
      role: 'MSc International Development — UK 🇬🇧',
      content:
        'Averra matched me with the Chevening Scholarship and helped ' +
        'me craft essays that truly reflected my story. The premium ' +
        'package was worth every kobo. I got my visa last month!',
      rating: 5,
      initials: 'CA',
      color: '#325E84',
    },
    {
      name: 'Amaka Okonkwo',
      role: 'MBA — Canada 🇨🇦',
      content:
        'The team at Averra went above and beyond. They not only found ' +
        'scholarships I qualified for but also helped me boost my profile ' +
        'with relevant certifications and volunteer experience. Highly recommend!',
      rating: 5,
      initials: 'AO',
      color: '#062850',
    },
    {
      name: 'Bello Umar',
      role: 'MSc Computer Science — Turkey 🇹🇷',
      content:
        'I was skeptical at first but the Standard package exceeded my ' +
        'expectations. They reviewed my CV and SOP, gave detailed feedback, ' +
        'and guided me through the application. Got the Türkiye Burslari ' +
        'scholarship on my first try!',
      rating: 5,
      initials: 'BU',
      color: '#1D4469',
    },
  ]

  const prev = () =>
    setCurrent((c) =>
      c === 0 ? testimonials.length - 1 : c - 1
    )

  const next = () =>
    setCurrent((c) =>
      c === testimonials.length - 1 ? 0 : c + 1
    )

  const t = testimonials[current]

  return (
    <section
      className="py-24"
      style={{ backgroundColor: '#F0F6FB' }}
    >
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
            <Star className="w-4 h-4 fill-white" />
            Success Stories
          </div>
          <h2
            className="text-3xl md:text-5xl font-bold
            mb-4 leading-tight"
            style={{ color: '#062850' }}
          >
            Students Who Made It
            <br />
            <span style={{ color: '#497296' }}>
              With Averra&apos;s Help
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl
          mx-auto">
            Real students. Real scholarships. Real results.
            Here&apos;s what our clients say about their experience.
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <div
            className="bg-white rounded-3xl p-8 md:p-12
            shadow-lg border border-gray-100
            transition-all duration-500"
          >
            {/* Stars */}
            <div className="flex items-center gap-1 mb-6">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-yellow-400
                  text-yellow-400"
                />
              ))}
            </div>

            {/* Quote */}
            <blockquote
              className="text-lg md:text-xl text-gray-700
              leading-relaxed mb-8 italic"
            >
              &ldquo;{t.content}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex
                items-center justify-center text-white
                font-bold text-lg flex-shrink-0"
                style={{ backgroundColor: t.color }}
              >
                {t.initials}
              </div>
              <div>
                <div
                  className="font-bold text-lg"
                  style={{ color: '#062850' }}
                >
                  {t.name}
                </div>
                <div className="text-gray-500 text-sm">
                  {t.role}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between
          mt-8">

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="transition-all duration-300
                  rounded-full"
                  style={{
                    width: i === current ? '24px' : '8px',
                    height: '8px',
                    backgroundColor:
                      i === current ? '#497296' : '#CBD5E1',
                  }}
                />
              ))}
            </div>

            {/* Arrow Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={prev}
                className="w-12 h-12 rounded-full border-2
                flex items-center justify-center
                transition-all duration-300
                hover:scale-110"
                style={{
                  borderColor: '#497296',
                  color: '#497296',
                }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="w-12 h-12 rounded-full
                flex items-center justify-center text-white
                transition-all duration-300
                hover:scale-110 hover:opacity-90"
                style={{ backgroundColor: '#497296' }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>

        {/* Bottom Trust Note */}
        <p className="text-center text-gray-500 text-sm mt-12">
          Join 500+ students who have already started their
          scholarship journey with Averra Knowledge Academy.
        </p>

      </div>
    </section>
  )
}