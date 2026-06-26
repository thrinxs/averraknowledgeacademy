import Link from 'next/link'
import {
  GraduationCap,
  Briefcase,
  Lightbulb,
  BookOpen,
  ArrowRight,
} from 'lucide-react'

export default function ServicesOverviewSection() {
  const services = [
    {
      icon: GraduationCap,
      title: 'Scholarships',
      tagline: 'Study Abroad',
      description:
        'Get matched with fully funded scholarships worldwide. ' +
        'We research, match, and prepare you to apply with ' +
        'confidence and win.',
      href: '/scholarship',
      cta: 'Find My Scholarship',
      color: '#062850',
      status: 'live',
    },
    {
      icon: Lightbulb,
      title: 'Skills',
      tagline: 'Practical Trainings',
      description:
        'Master in-demand skills — typing, computer literacy, ' +
        'web design, digital skills, crafts and more. ' +
        'Every course includes a certificate.',
      href: '/skills',
      cta: 'Browse Skills',
      color: '#1D4469',
      status: 'live',
    },
    {
      icon: Briefcase,
      title: 'Careers (CTC)',
      tagline: 'Career Trainings & Coaching',
      description:
        'Career tests, industrial training, and career switch ' +
        'programs to help you discover, build, or transition ' +
        'into the right professional path.',
      href: '/careers',
      cta: 'View Programs',
      color: '#325E84',
      status: 'live',
    },
    {
      icon: BookOpen,
      title: 'Averra Academy',
      tagline: 'Smarter Than Einstein',
      description:
        'Structured curriculum-based learning for high school ' +
        'students, exam candidates, undergraduates, and ' +
        'postgraduate scholars worldwide.',
      href: '/academy',
      cta: 'Learn More',
      color: '#497296',
      status: 'coming-soon',
    },
  ]

  return (
    <section id="services" className="py-24 bg-white">
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
            Our Services
          </div>
          <h2
            className="text-3xl md:text-5xl font-bold
            mb-4 leading-tight"
            style={{ color: '#062850' }}
          >
            Four Services. One Platform.
            <br />
            <span style={{ color: '#497296' }}>
              One Goal.
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Built for students and professionals around the world
            who are ready to learn, grow, and achieve more than
            they thought possible.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2
        lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="group"
            >
              <div
                className="relative h-full bg-white rounded-2xl
                p-8 border-2 border-gray-100
                transition-all duration-300
                hover:shadow-xl hover:-translate-y-2
                hover:border-transparent overflow-hidden"
              >
                {/* Coming Soon Badge */}
                {service.status === 'coming-soon' && (
                  <div
                    className="absolute top-4 right-4
                    px-3 py-1 rounded-full text-xs
                    font-bold text-white"
                    style={{ backgroundColor: '#497296' }}
                  >
                    Coming Soon
                  </div>
                )}

                {/* Top Color Bar */}
                <div
                  className="absolute top-0 left-0 right-0
                  h-1 transition-all duration-300
                  group-hover:h-2"
                  style={{ backgroundColor: service.color }}
                />

                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-xl flex
                  items-center justify-center mb-6
                  transition-transform duration-300
                  group-hover:scale-110"
                  style={{ backgroundColor: `${service.color}15` }}
                >
                  <service.icon
                    className="w-7 h-7"
                    style={{ color: service.color }}
                  />
                </div>

                {/* Tagline */}
                <div
                  className="text-xs font-semibold
                  uppercase tracking-wider mb-2"
                  style={{ color: service.color }}
                >
                  {service.tagline}
                </div>

                {/* Title */}
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: '#062850' }}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm
                leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* CTA */}
                <div
                  className="inline-flex items-center gap-2
                  text-sm font-semibold
                  transition-all duration-300
                  group-hover:gap-3"
                  style={{ color: service.color }}
                >
                  {service.cta}
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}