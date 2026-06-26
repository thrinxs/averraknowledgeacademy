import {
    GraduationCap,
    Globe,
    FileCheck,
    HeartHandshake,
  } from 'lucide-react'
  
  export default function WhatIsThisService() {
    const points = [
      {
        icon: Globe,
        title: 'For Applicants Worldwide',
        description:
          'Whether you are in Nigeria, Ghana, Kenya, South Africa, ' +
          'or anywhere else in the world — this service is open to ' +
          'anyone who wants to study abroad on a fully funded scholarship.',
        color: '#497296',
      },
      {
        icon: GraduationCap,
        title: 'For Any Level of Study',
        description:
          'Undergraduate, Master\'s, PhD, short courses, and ' +
          'professional programmes. We match scholarships to your ' +
          'current academic level and preferred degree.',
        color: '#325E84',
      },
      {
        icon: FileCheck,
        title: 'Personally Matched & Verified',
        description:
          'We do not send you a generic list. Every match is ' +
          'personally selected for your profile, preferences, and ' +
          'eligibility — then manually reviewed by our team ' +
          'before delivery.',
        color: '#1D4469',
      },
      {
        icon: HeartHandshake,
        title: 'Support Based on Your Package',
        description:
          'Depending on the package you choose, we can also help ' +
          'you write your SOP, review your CV, coach you for ' +
          'interviews, and guide you through the full application ' +
          'process.',
        color: '#062850',
      },
    ]
  
    return (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4
        sm:px-6 lg:px-8">
  
          {/* Header */}
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2
              px-4 py-2 rounded-full text-sm font-medium
              text-white mb-4"
              style={{ backgroundColor: '#497296' }}
            >
              What Is This Service?
            </div>
            <h2
              className="text-3xl md:text-5xl font-bold
              mb-4 leading-tight"
              style={{ color: '#062850' }}
            >
              A Complete Scholarship
              <br />
              <span style={{ color: '#497296' }}>
                Research & Matching Service
              </span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl
            mx-auto">
              Most people spend months searching for scholarships
              and still apply to the wrong ones. Our service does
              the hard work for you — so you apply to scholarships
              you actually qualify for.
            </p>
          </div>
  
          {/* Points Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2
          gap-8">
            {points.map((point) => (
              <div
                key={point.title}
                className="flex gap-6 p-8 rounded-2xl
                border border-gray-100 bg-white shadow-sm
                transition-all duration-300
                hover:shadow-lg hover:-translate-y-1"
              >
                <div
                  className="w-14 h-14 rounded-xl flex
                  items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${point.color}15` }}
                >
                  <point.icon
                    className="w-7 h-7"
                    style={{ color: point.color }}
                  />
                </div>
                <div>
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ color: '#062850' }}
                  >
                    {point.title}
                  </h3>
                  <p className="text-gray-600 text-sm
                  leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
  
          {/* Note about country flexibility */}
          <div
            className="mt-12 rounded-2xl p-6 border
            flex items-start gap-4"
            style={{
              backgroundColor: '#F0F6FB',
              borderColor: '#97C3E0',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center
              justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: '#497296' }}
            >
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <p
                className="font-semibold mb-1"
                style={{ color: '#062850' }}
              >
                What if my preferred countries have no available matches?
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                If scholarships in your preferred countries are not
                available or do not match your academic profile, we will
                find and provide verified matches in other suitable
                countries — so you always receive 5 quality options.
              </p>
            </div>
          </div>
  
        </div>
      </section>
    )
  }