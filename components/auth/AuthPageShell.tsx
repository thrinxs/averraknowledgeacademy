import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { GraduationCap, ShieldCheck, Globe } from 'lucide-react'

interface AuthPageShellProps {
  title: string
  description: string
  children: ReactNode
  footerText: string
  footerLinkText: string
  footerLinkHref: string
}

export default function AuthPageShell({
  title,
  description,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthPageShellProps) {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: '#F0F6FB' }}
    >
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left Brand Panel */}
        <div
          className="hidden lg:flex flex-col justify-between
          p-10 xl:p-14 text-white relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg,
              #062850 0%,
              #1D4469 50%,
              #325E84 100%)`,
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute -top-28 -right-28 w-72 h-72
              rounded-full opacity-10"
              style={{ backgroundColor: '#97C3E0' }}
            />
            <div
              className="absolute -bottom-24 -left-24 w-64 h-64
              rounded-full opacity-10"
              style={{ backgroundColor: '#497296' }}
            />
          </div>

          <div className="relative">
            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <Image
                src="/logo.png"
                alt="Averra Knowledge Academy Logo"
                width={96}
                height={96}
                className="object-contain w-16 h-16
                xl:w-20 xl:h-20"
                priority
              />
              <div>
                <div className="text-lg xl:text-xl font-bold leading-tight">
                  Averra Knowledge Academy
                </div>
                <div className="text-sm text-blue-200">
                  Academic Success Platform
                </div>
              </div>
            </Link>
          </div>

          <div className="relative max-w-lg">
            <p
              className="inline-flex items-center gap-2
              px-4 py-2 rounded-full text-sm font-medium
              border border-white/20 bg-white/10
              backdrop-blur-sm mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-green-400" />
              Trusted platform for scholarships, skills, and careers
            </p>

            <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-5">
              Your Future,
              <br />
              <span style={{ color: '#97C3E0' }}>
                Starts Here
              </span>
            </h2>

            <p className="text-blue-100 text-lg leading-relaxed mb-8">
              Access scholarship support, practical skills
              training, career development, and structured
              academic growth — all in one place.
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: GraduationCap,
                  title: 'Scholarship Matching',
                  text: 'Get matched with verified scholarship opportunities.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Trusted Support',
                  text: 'Professional guidance through every stage of your journey.',
                },
                {
                  icon: Globe,
                  title: 'Global Opportunities',
                  text: 'Built for students and professionals around the world.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4"
                >
                  <div
                    className="w-11 h-11 rounded-xl
                    flex items-center justify-center
                    flex-shrink-0"
                    style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                  >
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="text-sm text-blue-200">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative text-sm text-blue-300">
            © {new Date().getFullYear()} Averra Knowledge Academy
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">

            {/* Mobile Brand */}
            <div className="lg:hidden mb-8 text-center">
              <Link
                href="/"
                className="inline-flex flex-col items-center"
              >
                <Image
                  src="/logo.png"
                  alt="Averra Knowledge Academy Logo"
                  width={96}
                  height={96}
                  className="object-contain w-16 h-16 mb-3"
                  priority
                />
                <span
                  className="text-lg font-bold"
                  style={{ color: '#062850' }}
                >
                  Averra Knowledge Academy
                </span>
              </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10">
              <div className="mb-8 text-center">
                <h1
                  className="text-3xl font-bold mb-3"
                  style={{ color: '#062850' }}
                >
                  {title}
                </h1>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {description}
                </p>
              </div>

              {children}

              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500">
                  {footerText}{' '}
                  <Link
                    href={footerLinkHref}
                    className="font-semibold hover:opacity-80 transition-opacity"
                    style={{ color: '#497296' }}
                  >
                    {footerLinkText}
                  </Link>
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-[#062850] transition-colors"
              >
                ← Back to homepage
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}