import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/sonner'
import Script from 'next/script'

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
    "Africa's complete academic success platform. Scholarship matching, online learning, digital skills, career training, and structured academic support for students and professionals.",
  keywords: [
    'online learning platform Nigeria',
    'scholarship matching Nigeria',
    'scholarship search',
    'fully funded scholarships',
    'study abroad scholarships',
    'digital skills training Nigeria',
    'career training Nigeria',
    'academic support Nigeria',
    'Nigeria edtech',
    'WAEC preparation',
    'JAMB preparation',
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
      "Africa's complete academic success platform. Scholarship matching, online learning, digital skills, and career training.",
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Averra Knowledge Academy — The Right Knowledge',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Averra Knowledge Academy | The Right Knowledge',
    description:
      "Africa's complete academic success platform. Scholarship matching, online learning, digital skills, and career training.",
    images: ['/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'Averra Knowledge Academy',
              url: 'https://www.averraknowledgeacademy.com',
              logo: 'https://www.averraknowledgeacademy.com/logo.png',
              description:
                "Africa's complete academic success platform offering scholarship matching, online learning, digital skills training, and career coaching.",
              address: {
                '@type': 'PostalAddress',
                streetAddress: '26 Elekahia Road, off Stadium Road',
                addressLocality: 'Port Harcourt',
                addressRegion: 'Rivers State',
                addressCountry: 'NG',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+234-903-344-0966',
                contactType: 'customer service',
                email: 'info@averraknowledgeacademy.com',
              },
              sameAs: [
                'https://www.facebook.com/averraknowledgeacademy',
                'https://www.instagram.com/averraknowledgeacademy',
                'https://www.linkedin.com/company/averraknowledgeacademy',
              ],
              offers: [
                {
                  '@type': 'Offer',
                  name: 'Scholarship Matching',
                  url: 'https://www.averraknowledgeacademy.com/scholarship',
                },
                {
                  '@type': 'Offer',
                  name: 'Career Training & Coaching',
                  url: 'https://www.averraknowledgeacademy.com/careers',
                },
                {
                  '@type': 'Offer',
                  name: 'Digital Skills Training',
                  url: 'https://www.averraknowledgeacademy.com/skills',
                },
              ],
            }),
          }}
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}