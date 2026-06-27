import type { Metadata } from 'next'
import AboutClient from './AboutClient'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    "Learn about Averra Knowledge Academy — Africa's complete academic success platform combining scholarship matching, skills training, career coaching, and structured learning.",
  keywords: [
    'about Averra Knowledge Academy',
    'African edtech platform',
    'scholarship matching platform Nigeria',
    'academic success platform Africa',
    'online learning Nigeria',
  ],
  alternates: {
    canonical: 'https://www.averraknowledgeacademy.com/about',
  },
  openGraph: {
    title: 'About Us | Averra Knowledge Academy',
    description:
      "Learn about Averra Knowledge Academy — Africa's complete academic success platform combining scholarship matching, skills training, and career coaching.",
    url: 'https://www.averraknowledgeacademy.com/about',
  },
}

export default function AboutPage() {
  return <AboutClient />
}