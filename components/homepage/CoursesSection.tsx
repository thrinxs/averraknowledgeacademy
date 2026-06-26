'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Clock,
  Award,
  Monitor,
  Keyboard,
  Globe,
  Code,
  Sparkles,
  Server,
  Lightbulb,
} from 'lucide-react'

export default function CoursesSection() {
  const courses = [
    {
      icon: Keyboard,
      title: 'Typing Mastery',
      description:
        'Most jobs and academic tasks today require fast, accurate ' +
        'typing. This course takes you from slow and uncertain to ' +
        'confident and efficient — improving your speed, accuracy, ' +
        'and overall productivity in just 2 weeks.',
      duration: '2 weeks',
      level: 'Beginner to Intermediate',
      color: '#497296',
      href: '/skills/typing',
    },
    {
      icon: Monitor,
      title: 'Basic Practical Computer Skills',
      description:
        'Designed for anyone with little or no experience using a ' +
        'computer. You will receive a complete, hands-on training ' +
        'covering how a computer works, how to navigate it, and how ' +
        'to use essential software including Microsoft Word for typing ' +
        'and formatting documents, managing files, sending emails, ' +
        'and handling everyday computer tasks with confidence.',
      duration: '4 weeks',
      level: 'Beginner',
      color: '#325E84',
      href: '/skills/computer',
    },
    {
      icon: Globe,
      title: 'Website Building — No Code',
      description:
        'Build and launch professional websites without writing a ' +
        'single line of code. Using modern no-code platforms like ' +
        'WordPress, Wix, and Google Sites, you will create real ' +
        'websites for businesses, personal brands, or freelance clients.',
      duration: '5 weeks',
      level: 'Beginner to Intermediate',
      color: '#062850',
      href: '/skills/website-nocode',
    },
    {
      icon: Code,
      title: 'Website Building — With Code',
      description:
        'Learn to build websites from the ground up using HTML, CSS, ' +
        'and JavaScript. Understand how the web works and write clean, ' +
        'structured code that brings your designs to life.',
      duration: '6 weeks',
      level: 'Beginner to Intermediate',
      color: '#1D4469',
      href: '/skills/website-code',
    },
    {
      icon: Sparkles,
      title: 'Website Building — AI-Powered',
      description:
        'Use the latest AI tools to generate professional website ' +
        'code, design layouts, and deploy real sites faster than ever. ' +
        'Perfect for those who want to harness the power of AI to ' +
        'build and launch websites efficiently.',
      duration: '4 weeks',
      level: 'Beginner to Intermediate',
      color: '#325E84',
      href: '/skills/website-ai',
    },
    {
      icon: Server,
      title: 'Web Hosting & Domain Management',
      description:
        'Learn everything that happens after a website is built — ' +
        'how to purchase a domain name, set up web hosting, connect ' +
        'your domain, manage DNS settings, renew and transfer domains, ' +
        'and keep your website live and running properly.',
      duration: '2 weeks',
      level: 'Beginner',
      color: '#497296',
      href: '/skills/hosting-domains',
    },
  ]

  return (
    <section className="py-24 bg-white">
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
            <Lightbulb className="w-4 h-4" />
            Practical Skills Trainings
          </div>
          <h2
            className="text-3xl md:text-5xl font-bold
            mb-4 leading-tight"
            style={{ color: '#062850' }}
          >
            Build Skills That
            <br />
            <span style={{ color: '#497296' }}>
              Strengthen Your Career
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Practical, industry-relevant courses designed to help you
            improve, grow your knowledge, secure your current position,
            or prepare for the next opportunity. Every course includes
            a certificate of completion.
          </p>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2
        lg:grid-cols-3 gap-8 mb-12">
          {courses.map((course) => (
            <div
              key={course.title}
              className="bg-white rounded-2xl border
              border-gray-100 shadow-sm overflow-hidden
              transition-all duration-300
              hover:shadow-xl hover:-translate-y-2 group"
            >
              <div
                className="h-2 w-full"
                style={{ backgroundColor: course.color }}
              />

              <div className="p-8">
                <div
                  className="w-14 h-14 rounded-xl flex
                  items-center justify-center mb-6
                  transition-transform duration-300
                  group-hover:scale-110"
                  style={{ backgroundColor: `${course.color}15` }}
                >
                  <course.icon
                    className="w-7 h-7"
                    style={{ color: course.color }}
                  />
                </div>

                <h3
                  className="text-xl font-bold mb-3 leading-snug"
                  style={{ color: '#062850' }}
                >
                  {course.title}
                </h3>

                <p className="text-gray-600 text-sm
                leading-relaxed mb-6">
                  {course.description}
                </p>

                <div className="flex flex-col gap-2 mb-8">
                  <div className="flex items-center gap-2
                  text-sm text-gray-500">
                    <Clock
                      className="w-4 h-4"
                      style={{ color: course.color }}
                    />
                    <span>Duration: {course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2
                  text-sm text-gray-500">
                    <Award
                      className="w-4 h-4"
                      style={{ color: course.color }}
                    />
                    <span>Level: {course.level}</span>
                  </div>
                  <div
                    className="flex items-center gap-2
                    text-sm font-medium"
                    style={{ color: course.color }}
                  >
                    <Award className="w-4 h-4" />
                    <span>Certificate of Completion</span>
                  </div>
                </div>

                <Link href={course.href}>
                  <Button
                    className="w-full text-white font-medium
                    transition-all duration-300
                    hover:opacity-90 hover:scale-105 group"
                    style={{ backgroundColor: course.color }}
                  >
                    Learn More
                    <ArrowRight
                      className="ml-2 h-4 w-4 transition-transform
                      duration-300 group-hover:translate-x-1"
                    />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-4">
            More skills coming soon — Digital Marketing, Crafts,
            High-Demand Professional Courses &amp; more.
          </p>
          <Link href="/skills">
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
              View All Skills
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