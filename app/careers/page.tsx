import type { Metadata } from 'next'
import CareersClient from './CareersClient'

export const metadata: Metadata = {
  title: 'Career Training & Coaching Programmes',
  description:
    'Explore career options, gain real industrial training experience, or switch careers with Averra Knowledge Academy. Three structured programmes: Career Test, Industrial Training, and Career Switch.',
  keywords: [
    'career training Nigeria',
    'industrial training Nigeria',
    'career switch programme',
    'career coaching Nigeria',
    'career test Nigeria',
    'professional development Nigeria',
    'career change programme Africa',
    'career exploration programme',
  ],
  alternates: {
    canonical: 'https://www.averraknowledgeacademy.com/careers',
  },
  openGraph: {
    title: 'Career Training & Coaching | Averra Knowledge Academy',
    description:
      'Three structured career programmes — Career Test, Industrial Training, and Career Switch — to help you build the career you actually want.',
    url: 'https://www.averraknowledgeacademy.com/careers',
  },
}

export default function CareersPage() {
  return <CareersClient />
}