import type { Metadata } from 'next'
import AcademyClient from './AcademyClient'

export const metadata: Metadata = {
  title: 'Averra Academy — Online Learning Platform',
  description:
    'Averra Academy is a coming-soon digital learning ecosystem built on the Smarter Than Einstein method. Curriculum-based lessons, live classes, diagnostic assessments, and progress tracking for WAEC, NECO, JAMB, and university students.',
  keywords: [
    'online learning platform Nigeria',
    'WAEC preparation platform',
    'JAMB preparation online',
    'NECO study platform',
    'biology lessons online Nigeria',
    'chemistry lessons Nigeria',
    'mathematics lessons Nigeria',
    'physics lessons Nigeria',
    'digital academy Nigeria',
    'Smarter Than Einstein',
  ],
  alternates: {
    canonical: 'https://www.averraknowledgeacademy.com/academy',
  },
  openGraph: {
    title: 'Averra Academy | Online Learning Platform',
    description:
      'Curriculum-based video lessons, live classes, diagnostic assessments, and structured academic progress tracking for students across Africa.',
    url: 'https://www.averraknowledgeacademy.com/academy',
  },
}

export default function AcademyPage() {
  return <AcademyClient />
}