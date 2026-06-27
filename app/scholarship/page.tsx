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
    'Get matched with fully funded scholarships worldwide. ' +
    'Averra Knowledge Academy researches, matches, verifies, ' +
    'and prepares you to win scholarships across 50+ countries.',
  keywords: [
    'scholarship matching',
    'scholarship search',
    'fully funded scholarships',
    'study abroad scholarships',
    'scholarship search Nigeria',
    'find scholarships',
    'scholarship application support',
  ],
  alternates: {
    canonical: 'https://www.averraknowledgeacademy.com/scholarship',
  },
  openGraph: {
    title: 'Scholarship Matching Service | Averra Knowledge Academy',
    description:
      'Get matched with fully funded scholarships across 50+ countries. Personally researched and verified for your profile.',
    url: 'https://www.averraknowledgeacademy.com/scholarship',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scholarship Matching Service | Averra Knowledge Academy',
    description:
      'Get matched with fully funded scholarships across 50+ countries. Personally researched and verified for your profile.',
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