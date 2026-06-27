import type { Metadata } from 'next'
import ScholarshipPageHero from '@/components/scholarship/ScholarshipPageHero'
import WhatIsThisService from '@/components/scholarship/WhatIsThisService'
import HowItWorksDetailed from '@/components/scholarship/HowItWorksDetailed'
import ScholarshipPricing from '@/components/scholarship/ScholarshipPricing'
import WhatYouWillReceive from '@/components/scholarship/WhatYouWillReceive'
import ScholarshipFAQ from '@/components/scholarship/ScholarshipFAQ'
import ScholarshipFinalCTA from '@/components/scholarship/ScholarshipFinalCTA'

export const metadata: Metadata = {
  title: 'Scholarship Matching Service',
  description:
    'Get matched with 5 fully funded scholarships tailored to your academic profile. Averra Knowledge Academy researches, matches, verifies, and prepares you to apply across 50+ countries worldwide.',
  keywords: [
    'scholarship matching Nigeria',
    'fully funded scholarships',
    'scholarship search Africa',
    'study abroad scholarships',
    'scholarship for Nigerians',
    'international scholarships Africa',
    'scholarship application support',
    'find scholarships Nigeria',
    'scholarship matching service',
    'funded scholarships 2025',
  ],
  alternates: {
    canonical: 'https://www.averraknowledgeacademy.com/scholarship',
  },
  openGraph: {
    title: 'Scholarship Matching Service | Averra Knowledge Academy',
    description:
      'Get matched with 5 fully funded scholarships tailored to your profile across 50+ countries. Personally researched and verified by our team.',
    url: 'https://www.averraknowledgeacademy.com/scholarship',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scholarship Matching Service | Averra Knowledge Academy',
    description:
      'Get matched with 5 fully funded scholarships tailored to your profile across 50+ countries. Personally researched and verified by our team.',
  },
}

export default function ScholarshipPage() {
  return (
    <>
      <ScholarshipPageHero />
      <WhatIsThisService />
      <HowItWorksDetailed />
      <ScholarshipPricing />
      <WhatYouWillReceive />
      <ScholarshipFAQ />
      <ScholarshipFinalCTA />
    </>
  )
}