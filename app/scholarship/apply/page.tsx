import type { Metadata } from 'next'
import ScholarshipPageHero from '@/components/scholarship/ScholarshipPageHero'
import WhatIsThisService from '@/components/scholarship/WhatIsThisService'
import HowItWorksDetailed from '@/components/scholarship/HowItWorksDetailed'
import ScholarshipPricing from '@/components/scholarship/ScholarshipPricing'
import WhatYouWillReceive from '@/components/scholarship/WhatYouWillReceive'
import ScholarshipFAQ from '@/components/scholarship/ScholarshipFAQ'
import ScholarshipFinalCTA from '@/components/scholarship/ScholarshipFinalCTA'

export const metadata: Metadata = {
  title: 'Scholarship Matching Service | Averra Knowledge Academy',
  description:
    'Get matched with fully funded scholarships worldwide. ' +
    'Averra Knowledge Academy researches, matches, verifies, ' +
    'and prepares you to win scholarships across 50+ countries.',
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