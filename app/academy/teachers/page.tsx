import ComingSoonDivision from '@/components/academy/ComingSoonDivision'
export const metadata = { title: 'Averra Educators Academy | Averra Knowledge Academy' }
export default function TeachersAcademyPage() {
  return (
    <ComingSoonDivision division={{
      name: 'Averra Educators Academy',
      tagline: 'Better Teachers Create Better Students.',
      description: 'A dedicated professional development and knowledge refresher programme for teachers at all levels and across all subjects. Stay current, sharpen your skills, and become a more effective educator.',
      target_audience: 'Qualified teachers, trainee teachers and educational professionals who want to refresh subject knowledge, update teaching methods, or develop professionally.',
      age_range: '18+',
      emoji: '👩‍🏫',
      color: '#6D28D9',
      features: [
        'Teaching methodology updates and modern approaches',
        'Subject-specific knowledge deepening',
        'Curriculum knowledge refresher (Nigerian, UK, IB)',
        'Special educational needs teaching',
        'Digital teaching tools and online classroom management',
        'Assessment and feedback best practices',
        'Teaching for international curricula',
        'Leadership and management in education',
      ],
    }} />
  )
}
