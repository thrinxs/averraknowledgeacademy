import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Clock,
  Award,
  CheckCircle,
  Keyboard,
  Monitor,
  Globe,
  Code,
  Sparkles,
  Server,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Skills Training | Averra Knowledge Academy',
  description:
    'Practical, certificate-based skills training. ' +
    'Master typing, computer skills, website building, ' +
    'web hosting and more. Join the waitlist today.',
}

const courses = [
  {
    icon: Keyboard,
    title: 'Typing Mastery',
    slug: 'typing',
    description:
      'Most jobs and academic tasks today require ' +
      'fast, accurate typing. This course takes you ' +
      'from slow and uncertain to confident and ' +
      'efficient — in just 2 weeks.',
    duration: '2 weeks',
    level: 'Beginner to Intermediate',
    color: '#497296',
    status: 'waitlist',
  },
  {
    icon: Monitor,
    title: 'Basic Practical Computer Skills',
    slug: 'computer',
    description:
      'Designed for anyone with little or no ' +
      'experience using a computer. Get a complete, ' +
      'hands-on training covering Microsoft Word, ' +
      'file management, email, and more.',
    duration: '4 weeks',
    level: 'Beginner',
    color: '#325E84',
    status: 'waitlist',
  },
  {
    icon: Globe,
    title: 'Website Building — No Code',
    slug: 'website-nocode',
    description:
      'Build and launch professional websites ' +
      'without writing a single line of code. ' +
      'Using WordPress, Wix, and Google Sites.',
    duration: '5 weeks',
    level: 'Beginner to Intermediate',
    color: '#062850',
    status: 'waitlist',
  },
  {
    icon: Code,
    title: 'Website Building — With Code',
    slug: 'website-code',
    description:
      'Learn to build websites from the ground ' +
      'up using HTML, CSS, and JavaScript. ' +
      'Understand how the web works and write ' +
      'clean, structured code.',
    duration: '6 weeks',
    level: 'Beginner to Intermediate',
    color: '#1D4469',
    status: 'waitlist',
  },
  {
    icon: Sparkles,
    title: 'Website Building — AI-Powered',
    slug: 'website-ai',
    description:
      'Use the latest AI tools to generate ' +
      'professional website code, design layouts, ' +
      'and deploy real sites faster than ever.',
    duration: '4 weeks',
    level: 'Beginner to Intermediate',
    color: '#325E84',
    status: 'waitlist',
  },
  {
    icon: Server,
    title: 'Web Hosting & Domain Management',
    slug: 'hosting-domains',
    description:
      'Learn everything that happens after a ' +
      'website is built — domain purchase, hosting ' +
      'setup, DNS management, and keeping your ' +
      'site live and running.',
    duration: '2 weeks',
    level: 'Beginner',
    color: '#497296',
    status: 'waitlist',
  },
]

export default function SkillsPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section
        className="relative pt-32 pb-24
        overflow-hidden"
        style={{
          background: `linear-gradient(135deg,
            #062850 0%,
            #1D4469 50%,
            #325E84 100%)`,
        }}
      >
        <div className="absolute inset-0
        overflow-hidden">
          <div
            className="absolute -top-40 -right-40
            w-96 h-96 rounded-full opacity-10
            animate-pulse"
            style={{ backgroundColor: '#497296' }}
          />
          <div
            className="absolute -bottom-40 -left-40
            w-96 h-96 rounded-full opacity-10
            animate-pulse"
            style={{
              backgroundColor: '#325E84',
              animationDelay: '1s',
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto
        px-4 sm:px-6 lg:px-8 text-center">
          <div
            className="inline-flex items-center
            gap-2 px-4 py-2 rounded-full text-sm
            font-medium text-white border
            border-white/20 bg-white/10
            backdrop-blur-sm mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Practical Skills Trainings
          </div>

          <h1 className="text-4xl md:text-5xl
          lg:text-6xl font-bold text-white
          leading-tight mb-6">
            Build Skills That
            <br />
            <span style={{ color: '#97C3E0' }}>
              Strengthen Your Career
            </span>
          </h1>

          <p className="text-lg md:text-xl
          text-blue-100 max-w-2xl mx-auto mb-10
          leading-relaxed">
            Practical, industry-relevant courses
            designed to help you improve, grow your
            knowledge, secure your current position,
            or prepare for the next opportunity.
            Every course includes a certificate of
            completion.
          </p>

          <div
            className="inline-flex items-center
            gap-2 px-5 py-3 rounded-full border
            border-white/20 bg-white/10
            backdrop-blur-sm text-white text-sm
            font-medium"
          >
            <span className="w-2 h-2 rounded-full
            bg-yellow-400 animate-pulse" />
            Courses launching soon — join the
            waitlist to be notified
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0
        right-0">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            className="w-full"
          >
            <path
              d="M0 80L60 74C120 68 240 56 360
              50C480 44 600 44 720 47C840 50 960
              56 1080 59C1200 62 1320 62 1380
              62L1440 62V80H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4
        sm:px-6 lg:px-8">

          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl
              font-bold mb-4"
              style={{ color: '#062850' }}
            >
              Our Courses
            </h2>
            <p className="text-gray-600 text-lg
            max-w-2xl mx-auto">
              Six practical courses designed to
              give you real, usable skills. Join the
              waitlist for any course and we will
              notify you when enrollment opens.
            </p>
          </div>

          <div className="grid grid-cols-1
          md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course.slug}
                className="bg-white rounded-2xl
                border border-gray-100 shadow-sm
                overflow-hidden transition-all
                duration-300 hover:shadow-xl
                hover:-translate-y-2 group"
              >
                <div
                  className="h-2 w-full"
                  style={{
                    backgroundColor: course.color,
                  }}
                />
                <div className="p-8">
                  <div
                    className="w-14 h-14 rounded-xl
                    flex items-center justify-center
                    mb-6 transition-transform
                    duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor:
                        `${course.color}15`,
                    }}
                  >
                    <course.icon
                      className="w-7 h-7"
                      style={{
                        color: course.color,
                      }}
                    />
                  </div>

                  <h3
                    className="text-xl font-bold
                    mb-3 leading-snug"
                    style={{ color: '#062850' }}
                  >
                    {course.title}
                  </h3>

                  <p className="text-gray-600
                  text-sm leading-relaxed mb-6">
                    {course.description}
                  </p>

                  <div className="flex flex-col
                  gap-2 mb-8">
                    <div className="flex items-center
                    gap-2 text-sm text-gray-500">
                      <Clock
                        className="w-4 h-4"
                        style={{
                          color: course.color,
                        }}
                      />
                      <span>
                        Duration: {course.duration}
                      </span>
                    </div>
                    <div className="flex items-center
                    gap-2 text-sm text-gray-500">
                      <Award
                        className="w-4 h-4"
                        style={{
                          color: course.color,
                        }}
                      />
                      <span>
                        Level: {course.level}
                      </span>
                    </div>
                    <div
                      className="flex items-center
                      gap-2 text-sm font-medium"
                      style={{ color: course.color }}
                    >
                      <CheckCircle
                        className="w-4 h-4"
                      />
                      <span>
                        Certificate of Completion
                      </span>
                    </div>
                  </div>

                  <Link href={`/skills/${course.slug}`}>
                    <Button
                      className="w-full text-white
                      font-medium transition-all
                      duration-300 hover:opacity-90
                      hover:scale-105 group"
                      style={{
                        backgroundColor:
                          course.color,
                      }}
                    >
                      Learn More
                      <ArrowRight
                        className="ml-2 h-4 w-4
                        transition-transform
                        duration-300
                        group-hover:translate-x-1"
                      />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500
          text-sm mt-12">
            More skills coming soon — Digital
            Marketing, Crafts, High-Demand
            Professional Courses & more.
          </p>
        </div>
      </section>

      {/* Why Skills Section */}
      <section
        className="py-24"
        style={{ backgroundColor: '#F0F6FB' }}
      >
        <div className="max-w-5xl mx-auto px-4
        sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl
              font-bold mb-4"
              style={{ color: '#062850' }}
            >
              Why Learn With Averra?
            </h2>
          </div>
          <div className="grid grid-cols-1
          md:grid-cols-3 gap-8">
            {[
              {
                title: 'Practical & Hands-On',
                description:
                  'Every course is built around ' +
                  'real tasks you will actually do ' +
                  'in the workplace — not just theory.',
                color: '#497296',
              },
              {
                title: 'Certificate Included',
                description:
                  'Every course comes with a ' +
                  'certificate of completion you ' +
                  'can add to your CV and LinkedIn.',
                color: '#325E84',
              },
              {
                title: 'Structured Learning',
                description:
                  'Step-by-step lessons designed ' +
                  'for beginners. No experience ' +
                  'needed to get started.',
                color: '#062850',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-8
                border border-gray-100 text-center
                transition-all duration-300
                hover:shadow-lg hover:-translate-y-1"
              >
                <div
                  className="w-12 h-12 rounded-full
                  flex items-center justify-center
                  mx-auto mb-4"
                  style={{
                    backgroundColor:
                      `${item.color}15`,
                  }}
                >
                  <CheckCircle
                    className="w-6 h-6"
                    style={{ color: item.color }}
                  />
                </div>
                <h3
                  className="font-bold text-lg mb-2"
                  style={{ color: '#062850' }}
                >
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm
                leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}