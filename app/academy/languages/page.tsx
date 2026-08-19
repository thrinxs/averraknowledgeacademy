import ComingSoonDivision from '@/components/academy/ComingSoonDivision'
export const metadata = { title: 'Averra Language Academy | Averra Knowledge Academy' }
export default function LanguagesAcademyPage() {
  return (
    <ComingSoonDivision division={{
      name: 'Averra Language Academy',
      tagline: "Speak the World's Languages. Understand Every Culture.",
      description: "Learn any of the world's major languages with expert tutors who understand not just language, but culture, context and accent. From business English to Nigerian heritage languages.",
      target_audience: 'Anyone wanting to learn a new language, improve existing language skills, prepare for language examinations, or explore a new culture through its language. Open to all ages worldwide.',
      age_range: 'All ages',
      emoji: '🌍',
      color: '#0369A1',
      features: [
        'English, French, Spanish, German, Arabic, Mandarin',
        'Yoruba, Hausa, Igbo — Nigerian language preservation',
        'Portuguese, Italian and more',
        'Business language for professionals',
        'Conversational language for travel',
        'Culture and accent coaching',
        'Language certification prep (IELTS, DELF, Goethe)',
        'Intensive language bootcamps',
      ],
    }} />
  )
}
