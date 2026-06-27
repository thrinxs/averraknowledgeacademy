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
  metadataBase: new URL('https://www.averraknowledgeacademy.com'),
  title: {
    default: 'Averra Knowledge Academy | The Right Knowledge',
    template: '%s | Averra Knowledge Academy',
  },
  description:
    'Africa’s complete academic success platform. Scholarship matching, online learning, digital skills, career training, and structured academic support.',
  keywords: [
    'online learning platform',
    'scholarship matching',
    'scholarship search',
    'fully funded scholarships',
    'study abroad',
    'digital skills training',
    'career training',
    'academic support',
    'Nigeria edtech',
    'Averra Knowledge Academy',
  ],
  authors: [{ name: 'Averra Knowledge Academy' }],
  creator: 'Averra Knowledge Academy',
  publisher: 'Averra Knowledge Academy',
  applicationName: 'Averra Knowledge Academy',
  alternates: {
    canonical: 'https://www.averraknowledgeacademy.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://www.averraknowledgeacademy.com',
    siteName: 'Averra Knowledge Academy',
    title: 'Averra Knowledge Academy | The Right Knowledge',
    description:
      'Africa’s complete academic success platform. Scholarship matching, online learning, digital skills, and career training.',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Averra Knowledge Academy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Averra Knowledge Academy | The Right Knowledge',
    description:
      'Africa’s complete academic success platform. Scholarship matching, online learning, digital skills, and career training.',
    images: ['/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
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