'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)

    const checkUser = async () => {
      const { data: { session } } =
        await supabase.auth.getSession()
      setUser(session?.user || null)
    }

    checkUser()

    const { data: authListener } =
      supabase.auth.onAuthStateChange(
        (_event: AuthChangeEvent, session: Session | null) => {
          setUser(session?.user || null)
        }
      )

    return () => authListener.subscription.unsubscribe()
  }, [])

  if (!mounted) return null

  // Don't show navbar on dashboard pages
  const isDashboard =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin/dashboard') ||
    pathname.startsWith('/staff/dashboard') ||
    pathname.startsWith('/affiliate/dashboard') ||
    pathname.startsWith('/trainer/dashboard')

  if (isDashboard) return null

  const navItems = [
    { label: 'Scholarships', href: '/scholarship' },
    { label: 'Skills',       href: '/skills' },
    { label: 'Careers',      href: '/careers' },
    { label: 'Academy',      href: '/academy' },
    { label: 'Earn With Us', href: '/earn' },
    { label: 'Blog',         href: '/blog' },
    { label: 'About',        href: '/about' },
  ]

  const loginHref = `/auth/login?from=${encodeURIComponent(pathname)}`

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group flex-shrink-0"
          >
            <div className="transition-transform duration-300 group-hover:scale-110 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Averra Knowledge Academy Logo"
                width={200}
                height={200}
                className="object-contain w-30 h-30 sm:w-34 sm:h-34"
                priority
              />
            </div>
            <span
              className="font-bold tracking-tight text-sm sm:text-base md:text-lg lg:text-xl leading-tight"
              style={{ color: '#062850' }}
            >
              Averra Knowledge
              <br className="sm:hidden" />
              <span className="sm:ml-1">Academy</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden xl:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`relative font-medium text-sm transition-colors duration-200 group whitespace-nowrap
                  ${pathname === item.href || pathname.startsWith(item.href + '/')
                    ? 'text-[#062850]'
                    : 'text-gray-600 hover:text-[#062850]'
                  }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300
                    ${pathname === item.href || pathname.startsWith(item.href + '/')
                      ? 'w-full'
                      : 'w-0 group-hover:w-full'
                    }`}
                  style={{ backgroundColor: '#062850' }}
                />
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden xl:flex items-center gap-3 flex-shrink-0">
            {user ? (
              <Link href="/dashboard">
                <Button
                  className="font-medium text-sm text-white transition-all duration-300 hover:opacity-90 hover:scale-105 active:scale-95 shadow-md"
                  style={{ backgroundColor: '#062850' }}
                >
                  My Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href={loginHref}>
                  <Button
                    variant="ghost"
                    className="font-medium text-sm transition-all duration-200 hover:bg-blue-50"
                    style={{ color: '#062850' }}
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/scholarship">
                  <Button
                    className="font-medium text-sm text-white transition-all duration-300 hover:opacity-90 hover:scale-105 active:scale-95 shadow-md"
                    style={{ backgroundColor: '#062850' }}
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Hamburger Button */}
          <button
            className="xl:hidden relative w-8 h-8 flex flex-col justify-center items-center gap-1.5 focus:outline-none flex-shrink-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-6 rounded-full transition-all duration-300 ease-in-out
                ${isMenuOpen ? 'rotate-45 translate-y-2' : 'rotate-0 translate-y-0'}`}
              style={{ backgroundColor: '#062850' }}
            />
            <span
              className={`block h-0.5 w-6 rounded-full transition-all duration-300 ease-in-out
                ${isMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'}`}
              style={{ backgroundColor: '#062850' }}
            />
            <span
              className={`block h-0.5 w-6 rounded-full transition-all duration-300 ease-in-out
                ${isMenuOpen ? '-rotate-45 -translate-y-2' : 'rotate-0 translate-y-0'}`}
              style={{ backgroundColor: '#062850' }}
            />
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`xl:hidden overflow-hidden transition-all duration-500 ease-in-out
          ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="bg-white border-t border-gray-100 px-4 py-4 space-y-1">

          {navItems.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-blue-50 hover:text-[#062850] hover:translate-x-1
                ${pathname === item.href || pathname.startsWith(item.href + '/')
                  ? 'text-[#062850] bg-blue-50'
                  : 'text-gray-600'
                }
                ${isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
              style={{ transitionDelay: `${index * 50}ms` }}
              onClick={() => setIsMenuOpen(false)}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: '#062850' }}
              />
              {item.label}
            </Link>
          ))}

          {/* Mobile Auth Buttons */}
          <div className="flex flex-col gap-2 pt-3 border-t border-gray-100 mt-3">
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button
                  className="w-full font-medium text-white transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: '#062850' }}
                >
                  My Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link
                  href={loginHref}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button
                    variant="outline"
                    className="w-full font-medium hover:bg-blue-50 transition-all duration-200"
                    style={{ borderColor: '#062850', color: '#062850' }}
                  >
                    Login
                  </Button>
                </Link>
                <Link
                  href="/scholarship"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button
                    className="w-full font-medium text-white transition-all duration-200 hover:opacity-90"
                    style={{ backgroundColor: '#062850' }}
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  )
}