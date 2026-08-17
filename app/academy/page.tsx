import AcademyHero from
  '@/components/academy/AcademyHero'
import SuperCurriculumSection from
  '@/components/academy/SuperCurriculumSection'
import CurriculumExplorer from
  '@/components/academy/CurriculumExplorer'

export const metadata = {
  title:
    'Averra Academy — Smarter Than Einstein | ' +
    'Averra Knowledge Academy',
  description:
    'A global academic tutoring ecosystem combining ' +
    'seven of the world\'s best education systems ' +
    'into one personalised learning plan for your child.',
}

export default function AcademyPage() {
  return (
    <>
      <AcademyHero />
      <SuperCurriculumSection />
      <CurriculumExplorer />
    </>
  )
}