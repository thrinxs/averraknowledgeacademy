import ComingSoonDivision from '@/components/academy/ComingSoonDivision'
export const metadata = { title: 'Averra Professional Academy | Averra Knowledge Academy' }
export default function ProfessionalAcademyPage() {
  return (
    <ComingSoonDivision division={{
      name: 'Averra Professional Academy',
      tagline: 'Invest in Your Professional Excellence.',
      description: 'Industry knowledge refreshers, professional certification preparation and management training for working professionals across all sectors.',
      target_audience: 'Working professionals across all industries who need to refresh technical knowledge, prepare for professional certifications, or develop management and leadership skills.',
      age_range: '21+',
      emoji: '💼',
      color: '#B45309',
      features: [
        'Professional certification preparation (ACCA, CFA, PMP)',
        'Medical and legal knowledge refreshers',
        'Accounting and finance refresher programmes',
        'Management and leadership development',
        'Project management training',
        'Business communication and presentation skills',
        'Data analysis for professionals',
        'Human resources and people management',
      ],
    }} />
  )
}
