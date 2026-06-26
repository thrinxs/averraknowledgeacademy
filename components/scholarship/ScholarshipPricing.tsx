import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight } from 'lucide-react'

export default function ScholarshipPricing() {
  const packages = [
    {
      name: 'Basic',
      price: '₦30,000',
      color: '#497296',
      popular: false,
      description:
        'For applicants who want their scholarship matches ' +
        'delivered with full eligibility details.',
      features: [
        '5 Scholarship Matches',
        'Detailed Match Report',
        'Country & Deadline Info',
        'Eligibility Breakdown',
      ],
      href: '/scholarship/apply?package=basic',
    },
    {
      name: 'Standard',
      price: '₦50,000',
      color: '#325E84',
      popular: true,
      description:
        'For applicants who want their matches plus hands-on ' +
        'help preparing their application documents.',
      features: [
        '5 Scholarship Matches',
        'Detailed Match Report',
        'SOP Review & Modification',
        'CV Review & Modification',
        'Application Guidance',
      ],
      href: '/scholarship/apply?package=standard',
    },
    {
      name: 'Premium',
      price: '₦150,000',
      color: '#062850',
      popular: false,
      description:
        'For applicants who want the full service — from matches ' +
        'to coaching, interview preparation, and priority support.',
      features: [
        '5 Scholarship Matches',
        'Everything in Standard',
        'Profile Boosting Coaching',
        'Interview Preparation',
        'WhatsApp Advisor Access',
        'Priority Support',
      ],
      href: '/scholarship/apply?package=premium',
    },
  ]

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4
      sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center gap-2
            px-4 py-2 rounded-full text-sm font-medium
            text-white mb-4"
            style={{ backgroundColor: '#497296' }}
          >
            Pricing
          </div>
          <h2
            className="text-3xl md:text-5xl font-bold
            mb-4 leading-tight"
            style={{ color: '#062850' }}
          >
            Choose the Right
            <br />
            <span style={{ color: '#497296' }}>
              Level of Support
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl
          mx-auto">
            All three packages include exactly 5 personally
            matched and manually verified scholarships.
            The difference is how much support and preparation
            you receive alongside your matches.
          </p>
        </div>

        {/* Important note */}
        <div
          className="max-w-2xl mx-auto mb-12 rounded-2xl
          p-4 text-center text-sm font-medium border"
          style={{
            backgroundColor: '#F0F6FB',
            borderColor: '#97C3E0',
            color: '#325E84',
          }}
        >
          Every package gets exactly 5 matches — you are paying
          for the level of guidance and preparation that comes
          with them.
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3
        gap-8 mb-12">
          {packages.map((pkg) => (
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
              {/* Popular Badge */}
              {pkg.popular && (
                <div
                  className="absolute -top-4 left-1/2
                  -translate-x-1/2 px-4 py-1.5
                  rounded-full text-white text-sm
                  font-semibold whitespace-nowrap"
                  style={{ backgroundColor: '#325E84' }}
                >
                  ⭐ Most Popular
                </div>
              )}

              {/* Package Name */}
              <h3
                className="text-xl font-bold mb-1"
                style={{ color: pkg.color }}
              >
                {pkg.name}
              </h3>

              {/* Description */}
              <p className="text-gray-500 text-sm mb-4
              leading-relaxed">
                {pkg.description}
              </p>

              {/* Price */}
              <div
                className="text-4xl font-bold mb-6"
                style={{ color: '#062850' }}
              >
                {pkg.price}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2
                    text-gray-600 text-sm"
                  >
                    <CheckCircle
                      className="w-5 h-5 flex-shrink-0
                      mt-0.5"
                      style={{ color: pkg.color }}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href={pkg.href}>
                <Button
                  className="w-full text-white font-semibold
                  transition-all duration-300
                  hover:opacity-90 hover:scale-105 group"
                  style={{ backgroundColor: pkg.color }}
                >
                  Choose {pkg.name}
                  <ArrowRight
                    className="ml-2 h-4 w-4 transition-transform
                    duration-300 group-hover:translate-x-1"
                  />
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Upgrade Note */}
        <p className="text-center text-gray-500 text-sm">
          Already paid and want to upgrade your package?{' '}
          <a
            href="mailto:info@averraknowledgeacademy.com"
            className="font-medium underline
            underline-offset-4 transition-colors
            hover:text-[#062850]"
            style={{ color: '#497296' }}
          >
            Contact us
          </a>{' '}
          and we will take care of it.
        </p>

      </div>
    </section>
  )
}