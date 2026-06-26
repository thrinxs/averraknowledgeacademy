import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Users,
  GraduationCap,
  CheckCircle,
} from 'lucide-react'

export default function EarnWithAverraSection() {
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
            Earn With Us
          </div>
          <h2
            className="text-3xl md:text-5xl font-bold
            mb-4 leading-tight"
            style={{ color: '#062850' }}
          >
            Two Ways to Earn With
            <br />
            <span style={{ color: '#497296' }}>
              Averra Knowledge Academy
            </span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: '#325E84' }}
          >
            Whether you want to refer clients or deliver courses,
            there is a real earning opportunity for you inside
            Averra Knowledge Academy.
          </p>
        </div>

        {/* Two Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2
        gap-8 max-w-5xl mx-auto">

          {/* Affiliate Card */}
          <div
            className="rounded-3xl p-8 md:p-10 border-2
            transition-all duration-300
            hover:-translate-y-1 hover:shadow-xl"
            style={{
              backgroundColor: '#ffffff',
              borderColor: '#97C3E0',
            }}
          >
            {/* Icon */}
            <div
              className="w-16 h-16 rounded-2xl flex
              items-center justify-center mb-6"
              style={{ backgroundColor: '#497296' }}
            >
              <Users className="w-8 h-8 text-white" />
            </div>

            {/* Badge */}
            <div
              className="inline-flex items-center gap-1
              px-3 py-1 rounded-full text-xs font-semibold
              text-white mb-4"
              style={{ backgroundColor: '#497296' }}
            >
              Affiliate Program
            </div>

            <h3
              className="text-2xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              Become an Affiliate
            </h3>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Share your unique referral link or code. Every client
              who signs up and pays through your referral earns you
              a commission — automatically tracked and paid out.
            </p>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {[
                'Get a unique referral link & code',
                'Earn 10% of every payment made',
                'Track all referrals in your dashboard',
                'Get paid every weekend or month-end',
                'No limit on how much you can earn',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2
                  text-gray-700 text-sm"
                >
                  <CheckCircle
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    style={{ color: '#497296' }}
                  />
                  {item}
                </li>
              ))}
            </ul>

            {/* Commission Highlight */}
            <div
              className="rounded-2xl p-4 mb-8 border"
              style={{
                backgroundColor: '#F0F6FB',
                borderColor: '#97C3E0',
              }}
            >
              <div className="text-center">
                <div
                  className="text-4xl font-bold mb-1"
                  style={{ color: '#062850' }}
                >
                  10%
                </div>
                <div
                  className="text-sm"
                  style={{ color: '#325E84' }}
                >
                  Commission on every payment
                </div>
                <div
                  className="text-xs mt-1"
                  style={{ color: '#497296' }}
                >
                  Basic ₦3,000 · Standard ₦5,000 · Premium ₦15,000
                </div>
              </div>
            </div>

            <Link href="/affiliate">
              <Button
                size="lg"
                className="w-full font-semibold text-base
                py-6 rounded-xl transition-all duration-300
                hover:opacity-90 hover:scale-105 group text-white"
                style={{ backgroundColor: '#497296' }}
              >
                Join as Affiliate
                <ArrowRight
                  className="ml-2 h-5 w-5 transition-transform
                  duration-300 group-hover:translate-x-1"
                />
              </Button>
            </Link>
          </div>

          {/* Trainer Card */}
          <div
            className="rounded-3xl p-8 md:p-10 border-2
            transition-all duration-300
            hover:-translate-y-1 hover:shadow-xl"
            style={{
              backgroundColor: '#ffffff',
              borderColor: '#97C3E0',
            }}
          >
            {/* Icon */}
            <div
              className="w-16 h-16 rounded-2xl flex
              items-center justify-center mb-6"
              style={{ backgroundColor: '#325E84' }}
            >
              <GraduationCap className="w-8 h-8 text-white" />
            </div>

            {/* Badge */}
            <div
              className="inline-flex items-center gap-1
              px-3 py-1 rounded-full text-xs font-semibold
              text-white mb-4"
              style={{ backgroundColor: '#325E84' }}
            >
              Trainer Program
            </div>

            <h3
              className="text-2xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              Become a Trainer
            </h3>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Have expertise in typing, computer skills, web design,
              or any other in-demand skill? Join our trainer network,
              deliver structured courses, and earn a competitive share
              of every course and training fee — with full support
              from the Averra team.
            </p>

            {/* Features */}
            <ul className="space-y-3 mb-8">
            {[
                'Deliver courses on your schedule',
                'Earn a competitive share of every course fee',
                'Higher earnings for live training sessions',
                'Access to course materials & resources',
                'Support from the Averra team',
                'Grow your personal training brand',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2
                  text-gray-700 text-sm"
                >
                  <CheckCircle
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    style={{ color: '#325E84' }}
                  />
                  {item}
                </li>
              ))}
            </ul>

            {/* Earnings Highlight */}
            <div
              className="rounded-2xl p-4 mb-8 border"
              style={{
                backgroundColor: '#F0F6FB',
                borderColor: '#97C3E0',
              }}
            >
                              <div className="text-center">
                  <div
                    className="text-2xl font-bold mb-1"
                    style={{ color: '#062850' }}
                  >
                    Competitive
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: '#325E84' }}
                  >
                    Revenue share on every course fee
                  </div>
                  <div
                    className="text-xs mt-1"
                    style={{ color: '#497296' }}
                  >
                    Full details provided when you apply
                  </div>
                </div>
            </div>

            <Link href="/trainer">
              <Button
                size="lg"
                className="w-full font-semibold text-base
                py-6 rounded-xl transition-all duration-300
                hover:opacity-90 hover:scale-105 group text-white"
                style={{ backgroundColor: '#325E84' }}
              >
                Become a Trainer
                <ArrowRight
                  className="ml-2 h-5 w-5 transition-transform
                  duration-300 group-hover:translate-x-1"
                />
              </Button>
            </Link>
          </div>

        </div>

      </div>
    </section>
  )
}