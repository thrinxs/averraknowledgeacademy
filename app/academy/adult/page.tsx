import ComingSoonDivision from '@/components/academy/ComingSoonDivision'
export const metadata = { title: 'Averra Adult Education | Averra Knowledge Academy' }
export default function AdultAcademyPage() {
  return (
    <ComingSoonDivision division={{
      name: 'Averra Adult Education',
      tagline: 'It Is Never Too Late to Learn. Your Journey Starts Here.',
      description: 'A welcoming, structured and respectful learning environment for adults at any stage of life. Whether you missed formal education, are returning after years away, or wish to refresh your knowledge — we meet you exactly where you are.',
      target_audience: 'Adults of all ages who missed formal education, are returning to learning after years away, wish to improve literacy and numeracy, or want to refresh academic knowledge for personal or professional reasons.',
      age_range: '18+',
      emoji: '🌱',
      color: '#065F46',
      features: [
        'Foundational literacy and numeracy',
        'Basic education for those who missed formal schooling',
        'Adult education equivalency programmes',
        'Refresher courses for mature returners',
        'Digital literacy for adults',
        'Financial literacy and life skills',
        'Professional development reading and writing',
        'Confidence-building academic support',
      ],
    }} />
  )
}
