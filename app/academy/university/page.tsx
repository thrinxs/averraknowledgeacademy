import ComingSoonDivision from '@/components/academy/ComingSoonDivision'
export const metadata = { title: 'Averra University Academy | Averra Knowledge Academy' }
export default function UniversityAcademyPage() {
  return (
    <ComingSoonDivision division={{
      name: 'Averra University Academy',
      tagline: 'Academic Excellence at the Highest Level',
      description: 'Specialised academic support for undergraduate, Masters and PhD students. From subject modules to dissertation guidance, we help you achieve your highest potential.',
      target_audience: 'Undergraduate, Masters and PhD students who need structured academic support, research guidance, assignment help, or exam preparation at university level.',
      age_range: '18+',
      emoji: '🎓',
      color: '#325E84',
      features: [
        'Subject-specific module support',
        'Dissertation and thesis guidance',
        'Research methodology coaching',
        'Assignment and exam preparation',
        'Academic writing development',
        'IELTS and TOEFL preparation',
        'University interview preparation',
        'Postgraduate application support',
      ],
    }} />
  )
}
