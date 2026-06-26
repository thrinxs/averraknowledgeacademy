import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/sonner'

const geist = Geist({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Averra Knowledge Academy — Find Your Scholarship',
  description:
    'We research, match and prepare you for fully funded ' +
    'scholarships to study abroad. Expert scholarship ' +
    'matching and application support.',
  keywords:
    'scholarships, study abroad, fully funded scholarships, ' +
    'Nigeria scholarships, international scholarships',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}