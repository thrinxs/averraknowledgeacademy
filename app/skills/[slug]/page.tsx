import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Clock,
  Award,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Keyboard,
  Monitor,
  Globe,
  Code,
  Sparkles,
  Server,
  Users,
  BookOpen,
  Target,
} from 'lucide-react'
import WaitlistForm from
  '@/components/skills/WaitlistForm'

const courses: Record<string, any> = {
  typing: {
    icon: Keyboard,
    title: 'Typing Mastery',
    tagline: 'From slow to professional in 2 weeks',
    description:
      'Most jobs and academic tasks today require ' +
      'fast, accurate typing. This course takes you ' +
      'from slow and uncertain to confident and ' +
      'efficient — improving your speed, accuracy, ' +
      'and overall productivity.',
    duration: '2 weeks',
    level: 'Beginner to Intermediate',
    color: '#497296',
    whoIsItFor: [
      'Professionals who want to work faster',
      'Students who type slowly during exams',
      'Anyone starting a new office job',
      'Freelancers who want to deliver work faster',
    ],
    whatYouWillLearn: [
      'Correct finger placement and typing posture',
      'Home row technique for maximum efficiency',
      'Building speed through structured practice',
      'Accuracy exercises to reduce errors',
      'Typing numbers, symbols, and punctuation',
      'Professional typing habits for the workplace',
    ],
    curriculum: [
      {
        week: 'Week 1',
        topics: [
          'Introduction to proper typing posture',
          'Home row keys mastery',
          'Top row and bottom row practice',
          'Building muscle memory',
        ],
      },
      {
        week: 'Week 2',
        topics: [
          'Speed building exercises',
          'Numbers and symbols',
          'Accuracy drills',
          'Final assessment and certification',
        ],
      },
    ],
  },
  computer: {
    icon: Monitor,
    title: 'Basic Practical Computer Skills',
    tagline: 'Everything you need to use a computer confidently',
    description:
      'Designed for anyone with little or no ' +
      'experience using a computer. This course ' +
      'gives you a complete, hands-on training — ' +
      'from understanding how a computer works to ' +
      'using essential software like Microsoft Word ' +
      'for typing, formatting documents, managing ' +
      'files, and handling everyday computer tasks ' +
      'with confidence.',
    duration: '4 weeks',
    level: 'Beginner',
    color: '#325E84',
    whoIsItFor: [
      'People who have never used a computer',
      'Those who want to improve basic computer skills',
      'Job seekers who need computer literacy',
      'Older adults learning to use technology',
    ],
    whatYouWillLearn: [
      'How a computer works — hardware and software',
      'Windows/Mac operating system navigation',
      'Microsoft Word — typing and formatting documents',
      'Microsoft Excel — basic spreadsheets',
      'Email setup and management',
      'File and folder management',
      'Internet browsing and online safety',
      'Printing, scanning, and basic troubleshooting',
    ],
    curriculum: [
      {
        week: 'Week 1',
        topics: [
          'Introduction to computers and hardware',
          'Operating system basics',
          'Mouse and keyboard fundamentals',
          'File and folder management',
        ],
      },
      {
        week: 'Week 2',
        topics: [
          'Microsoft Word — creating documents',
          'Formatting text and paragraphs',
          'Saving, printing, and sharing documents',
          'Introduction to Microsoft Excel',
        ],
      },
      {
        week: 'Week 3',
        topics: [
          'Email setup and management',
          'Internet browsing',
          'Online safety and security basics',
          'Google Docs and Drive overview',
        ],
      },
      {
        week: 'Week 4',
        topics: [
          'Practical exercises and real tasks',
          'Introduction to presentations',
          'Basic troubleshooting',
          'Final assessment and certification',
        ],
      },
    ],
  },
  'website-nocode': {
    icon: Globe,
    title: 'Website Building — No Code',
    tagline: 'Build professional websites without writing code',
    description:
      'Build and launch professional websites ' +
      'without writing a single line of code. ' +
      'Using modern no-code platforms like ' +
      'WordPress, Wix, and Google Sites, you will ' +
      'create real websites for businesses, personal ' +
      'brands, or freelance clients.',
    duration: '5 weeks',
    level: 'Beginner to Intermediate',
    color: '#062850',
    whoIsItFor: [
      'Small business owners who need a website',
      'Freelancers who want to offer web services',
      'Individuals building a personal brand',
      'Anyone who wants to launch online without coding',
    ],
    whatYouWillLearn: [
      'Introduction to websites and how they work',
      'Building with WordPress (self-hosted)',
      'Building with Wix (drag and drop)',
      'Building with Google Sites (simple and free)',
      'Choosing the right platform for each project',
      'Adding pages, images, and content',
      'Making websites mobile-friendly',
      'Publishing and sharing your website',
    ],
    curriculum: [
      {
        week: 'Week 1',
        topics: [
          'How websites work — domains and hosting',
          'Introduction to no-code platforms',
          'Getting started with Wix',
          'Building your first page',
        ],
      },
      {
        week: 'Week 2',
        topics: [
          'Wix advanced features',
          'Adding contact forms and galleries',
          'Introduction to WordPress',
          'WordPress themes and plugins',
        ],
      },
      {
        week: 'Week 3',
        topics: [
          'Building a full website with WordPress',
          'Pages, menus, and navigation',
          'Introduction to Google Sites',
          'Comparing all three platforms',
        ],
      },
      {
        week: 'Week 4',
        topics: [
          'SEO basics for no-code websites',
          'Mobile responsiveness',
          'Connecting a custom domain',
          'Publishing and going live',
        ],
      },
      {
        week: 'Week 5',
        topics: [
          'Building a complete project from scratch',
          'Client website simulation',
          'Final review and feedback',
          'Assessment and certification',
        ],
      },
    ],
  },
  'website-code': {
    icon: Code,
    title: 'Website Building — With Code',
    tagline: 'Build websites from scratch using real code',
    description:
      'Learn to build websites from the ground up ' +
      'using HTML, CSS, and JavaScript. Understand ' +
      'how the web works and write clean, structured ' +
      'code that brings your designs to life.',
    duration: '6 weeks',
    level: 'Beginner to Intermediate',
    color: '#1D4469',
    whoIsItFor: [
      'Aspiring web developers',
      'Designers who want to code their designs',
      'Anyone who wants to understand how websites work',
      'Those who want a foundation for advanced development',
    ],
    whatYouWillLearn: [
      'HTML — structuring web pages',
      'CSS — styling and layout',
      'Responsive design with CSS Flexbox and Grid',
      'JavaScript fundamentals',
      'Adding interactivity to web pages',
      'Using a code editor (VS Code)',
      'Version control basics with Git',
      'Deploying a website for free',
    ],
    curriculum: [
      {
        week: 'Week 1',
        topics: [
          'Introduction to HTML',
          'Building your first web page',
          'HTML tags, headings, links, images',
          'Page structure and semantics',
        ],
      },
      {
        week: 'Week 2',
        topics: [
          'Introduction to CSS',
          'Colors, fonts, and spacing',
          'Box model and layout basics',
          'Styling your first website',
        ],
      },
      {
        week: 'Week 3',
        topics: [
          'Flexbox layout',
          'CSS Grid',
          'Responsive design and media queries',
          'Mobile-first design principles',
        ],
      },
      {
        week: 'Week 4',
        topics: [
          'Introduction to JavaScript',
          'Variables, functions, and events',
          'DOM manipulation basics',
          'Making pages interactive',
        ],
      },
      {
        week: 'Week 5',
        topics: [
          'Building a complete multi-page website',
          'Navigation, forms, and animations',
          'Introduction to Git and GitHub',
          'Deploying with GitHub Pages',
        ],
      },
      {
        week: 'Week 6',
        topics: [
          'Final project — build from scratch',
          'Code review and feedback',
          'Portfolio preparation',
          'Assessment and certification',
        ],
      },
    ],
  },
  'website-ai': {
    icon: Sparkles,
    title: 'Website Building — AI-Powered',
    tagline: 'Use AI to build professional websites faster',
    description:
      'Use the latest AI tools to generate ' +
      'professional website code, design layouts, ' +
      'and deploy real sites faster than ever. ' +
      'Perfect for those who want to harness the ' +
      'power of AI to build and launch websites ' +
      'efficiently.',
    duration: '4 weeks',
    level: 'Beginner to Intermediate',
    color: '#325E84',
    whoIsItFor: [
      'Entrepreneurs who want websites fast',
      'Freelancers who want to deliver projects faster',
      'Developers who want to use AI as a tool',
      'Non-technical founders building MVPs',
    ],
    whatYouWillLearn: [
      'Introduction to AI website builders',
      'Using ChatGPT and Claude to generate code',
      'AI-powered design tools (Framer, Durable, etc.)',
      'Prompting AI effectively for web development',
      'Editing and customising AI-generated code',
      'Deploying AI-built websites',
      'Quality-checking and fixing AI output',
      'Building full projects with AI assistance',
    ],
    curriculum: [
      {
        week: 'Week 1',
        topics: [
          'Introduction to AI in web development',
          'AI website builders overview',
          'Getting started with Framer AI',
          'Building your first AI website',
        ],
      },
      {
        week: 'Week 2',
        topics: [
          'Using ChatGPT to generate HTML/CSS',
          'Prompting strategies for web code',
          'Editing and customising AI output',
          'Combining AI tools effectively',
        ],
      },
      {
        week: 'Week 3',
        topics: [
          'AI for images and design assets',
          'Content generation with AI',
          'Building complete landing pages',
          'Quality checking AI-generated sites',
        ],
      },
      {
        week: 'Week 4',
        topics: [
          'Final project — AI-built website',
          'Deployment and going live',
          'Review and feedback',
          'Assessment and certification',
        ],
      },
    ],
  },
  'hosting-domains': {
    icon: Server,
    title: 'Web Hosting & Domain Management',
    tagline: 'Keep your website live and running properly',
    description:
      'Learn everything that happens after a ' +
      'website is built — how to purchase a domain ' +
      'name, set up web hosting, connect your domain, ' +
      'manage DNS settings, renew and transfer ' +
      'domains, and keep your website live and ' +
      'running properly.',
    duration: '2 weeks',
    level: 'Beginner',
    color: '#497296',
    whoIsItFor: [
      'Website owners who manage their own hosting',
      'Freelancers who handle client websites',
      'Business owners launching online',
      'Anyone confused by domains and DNS',
    ],
    whatYouWillLearn: [
      'What is web hosting and how it works',
      'Types of hosting — shared, VPS, cloud',
      'Choosing the right hosting provider',
      'Purchasing and registering a domain name',
      'Connecting a domain to hosting',
      'DNS records explained (A, CNAME, MX, TXT)',
      'SSL certificates and HTTPS setup',
      'Domain renewal, transfer, and management',
    ],
    curriculum: [
      {
        week: 'Week 1',
        topics: [
          'Understanding web hosting',
          'Types of hosting and providers',
          'Purchasing a domain name',
          'Connecting domain to hosting',
        ],
      },
      {
        week: 'Week 2',
        topics: [
          'DNS records — A, CNAME, MX, TXT',
          'SSL certificate setup',
          'Email hosting setup',
          'Domain management and renewal',
        ],
      },
    ],
  },
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params
  const course = courses[slug]
  if (!course) {
    return { title: 'Course Not Found' }
  }
  return {
    title: `${course.title} | Averra Knowledge Academy`,
    description: course.description,
  }
}

export default async function CoursePage({
  params,
}: Props) {
  const { slug } = await params
  const course = courses[slug]

  if (!course) notFound()

  const Icon = course.icon

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
            w-96 h-96 rounded-full opacity-10"
            style={{ backgroundColor: '#497296' }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto
        px-4 sm:px-6 lg:px-8">
          <Link
            href="/skills"
            className="inline-flex items-center
            gap-2 text-blue-200 hover:text-white
            transition-colors text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Courses
          </Link>

          <div className="flex items-start gap-6">
            <div
              className="w-16 h-16 rounded-2xl
              flex items-center justify-center
              flex-shrink-0"
              style={{
                backgroundColor:
                  'rgba(255,255,255,0.15)',
              }}
            >
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <p
                className="text-sm font-medium
                mb-2"
                style={{ color: '#97C3E0' }}
              >
                Skills Training
              </p>
              <h1 className="text-3xl md:text-4xl
              lg:text-5xl font-bold text-white
              leading-tight mb-3">
                {course.title}
              </h1>
              <p className="text-blue-200 text-lg">
                {course.tagline}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-8">
            {[
              {
                icon: Clock,
                text: course.duration,
              },
              {
                icon: Award,
                text: course.level,
              },
              {
                icon: CheckCircle,
                text: 'Certificate Included',
              },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center
                gap-2 px-4 py-2 rounded-full
                border border-white/20
                bg-white/10 backdrop-blur-sm
                text-white text-sm"
              >
                <item.icon className="w-4 h-4" />
                {item.text}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0
        right-0">
          <svg viewBox="0 0 1440 80" fill="none"
          className="w-full">
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

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4
        sm:px-6 lg:px-8">
          <div className="grid grid-cols-1
          lg:grid-cols-3 gap-10">

            {/* Main Content */}
            <div className="lg:col-span-2
            space-y-10">

              {/* About */}
              <div>
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: '#062850' }}
                >
                  About This Course
                </h2>
                <p className="text-gray-600
                leading-relaxed text-base">
                  {course.description}
                </p>
              </div>

              {/* Who Is It For */}
              <div>
                <h2
                  className="text-2xl font-bold mb-4
                  flex items-center gap-2"
                  style={{ color: '#062850' }}
                >
                  <Users
                    className="w-6 h-6"
                    style={{ color: '#497296' }}
                  />
                  Who Is This For?
                </h2>
                <div className="space-y-3">
                  {course.whoIsItFor.map(
                    (item: string) => (
                      <div
                        key={item}
                        className="flex items-start
                        gap-3"
                      >
                        <CheckCircle
                          className="w-5 h-5
                          flex-shrink-0 mt-0.5"
                          style={{
                            color: '#16A34A',
                          }}
                        />
                        <p className="text-gray-600
                        text-sm">
                          {item}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* What You Will Learn */}
              <div>
                <h2
                  className="text-2xl font-bold mb-4
                  flex items-center gap-2"
                  style={{ color: '#062850' }}
                >
                  <Target
                    className="w-6 h-6"
                    style={{ color: '#497296' }}
                  />
                  What You Will Learn
                </h2>
                <div className="grid grid-cols-1
                sm:grid-cols-2 gap-3">
                  {course.whatYouWillLearn.map(
                    (item: string) => (
                      <div
                        key={item}
                        className="flex items-start
                        gap-2 p-3 rounded-xl"
                        style={{
                          backgroundColor: '#F0F6FB',
                        }}
                      >
                        <CheckCircle
                          className="w-4 h-4
                          flex-shrink-0 mt-0.5"
                          style={{
                            color: '#497296',
                          }}
                        />
                        <p className="text-gray-700
                        text-sm">
                          {item}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Curriculum */}
              <div>
                <h2
                  className="text-2xl font-bold mb-4
                  flex items-center gap-2"
                  style={{ color: '#062850' }}
                >
                  <BookOpen
                    className="w-6 h-6"
                    style={{ color: '#497296' }}
                  />
                  Course Curriculum
                </h2>
                <div className="space-y-4">
                  {course.curriculum.map(
                    (
                      week: {
                        week: string
                        topics: string[]
                      },
                      i: number
                    ) => (
                      <div
                        key={i}
                        className="rounded-2xl
                        border border-gray-100 p-5"
                      >
                        <h3
                          className="font-bold mb-3"
                          style={{
                            color: '#062850',
                          }}
                        >
                          {week.week}
                        </h3>
                        <div className="space-y-2">
                          {week.topics.map(
                            (topic: string) => (
                              <div
                                key={topic}
                                className="flex
                                items-center gap-2
                                text-sm text-gray-600"
                              >
                                <div
                                  className="w-1.5
                                  h-1.5 rounded-full
                                  flex-shrink-0"
                                  style={{
                                    backgroundColor:
                                      course.color,
                                  }}
                                />
                                {topic}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <WaitlistForm
                  courseName={course.title}
                  courseSlug={slug}
                  color={course.color}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Other Courses */}
      <section
        className="py-16 border-t border-gray-100"
      >
        <div className="max-w-4xl mx-auto px-4
        sm:px-6 lg:px-8 text-center">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: '#062850' }}
          >
            Explore Other Courses
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            We have 6 courses covering the most
            important digital skills for the modern
            workplace.
          </p>
          <Link href="/skills">
            <Button
              className="text-white font-semibold
              px-8 py-5 rounded-xl transition-all
              duration-300 hover:opacity-90
              hover:scale-105"
              style={{ backgroundColor: '#062850' }}
            >
              View All Courses
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  )
}