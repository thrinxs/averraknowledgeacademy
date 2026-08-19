import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'

export const metadata = {
  title: 'Averra Junior Academy | Averra Knowledge Academy',
  description: 'Structured academic tutoring for primary and secondary school learners. Powered by the Averra Super Curriculum.',
}

export default function JuniorAcademyPage() {
  return (
    <div className="min-h-screen bg-white">

      <div className="relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #062850 0%, #1D4469 50%, #325E84 100%)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">

          <Link href="/academy" className="inline-flex items-center gap-2
          text-blue-300 hover:text-white transition-colors mb-8 text-sm group">
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Back to Academy
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
          text-sm font-bold text-white border border-green-400/30 bg-green-400/10 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Now Enrolling
          </div>

          <div className="text-7xl mb-6">🏫</div>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Averra Junior Academy
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-6" style={{ color: '#97C3E0' }}>
            Where Young Minds Discover Their True Potential
          </p>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Structured academic tutoring for primary and secondary school learners —
            powered by the Averra Super Curriculum, a fusion of seven of the
            world&apos;s best education systems.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/academy/enroll">
              <Button size="lg" className="bg-white font-bold px-10 py-6 rounded-xl
              shadow-xl transition-all hover:scale-105 hover:shadow-2xl group"
              style={{ color: '#062850' }}>
                Start Enrolment
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/academy#explorer">
              <Button size="lg" variant="outline"
              className="border-2 border-white/50 text-white bg-transparent px-10
              py-6 rounded-xl hover:bg-white/10 hover:border-white hover:scale-105 transition-all">
                Explore The Curriculum
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path d="M0 60L60 54C120 48 240 36 360 30C480 24 600 24 720 27C840
            30 960 36 1080 39C1200 42 1320 42 1380 42L1440 42V60H1380C1320 60
            1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60
            120 60 60 60H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#062850' }}>
            Who Is Junior Academy For?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Every child deserves a structured, personalised learning experience
            that goes beyond what school alone can provide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              emoji: '📚',
              title: 'Primary School',
              desc: 'Ages 5-11. Building strong foundations in core subjects with engaging, age-appropriate lessons.',
              tags: ['Primary 1-6', 'Year 1-6', 'Grade 1-5'],
            },
            {
              emoji: '📐',
              title: 'Junior Secondary',
              desc: 'Ages 11-14. Navigating the transition years with confidence and solid academic grounding.',
              tags: ['JSS 1-3', 'Year 7-9', 'Grade 6-8'],
            },
            {
              emoji: '🏆',
              title: 'Senior Secondary',
              desc: 'Ages 14-18. Exam preparation and deep subject mastery for WAEC, GCSE, A-Level and more.',
              tags: ['SS 1-3', 'Year 10-13', 'WAEC/GCSE'],
            },
          ].map(item => (
            <div key={item.title} className="bg-white rounded-2xl p-6 border
            border-gray-100 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="text-4xl mb-4">{item.emoji}</div>
              <h3 className="font-bold text-lg mb-2" style={{ color: '#062850' }}>
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">{item.desc}</p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-full
                  font-medium text-white" style={{ backgroundColor: '#497296' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl p-8 mb-16" style={{ backgroundColor: '#F0F6FB' }}>
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: '#062850' }}>
            Examination Preparation
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { flag: '🇳🇬', exams: ['WAEC', 'NECO', 'JAMB', 'Common Entrance'] },
              { flag: '🇬🇧', exams: ['GCSE', 'A-Level', 'SATs', '11+'] },
              { flag: '🌍', exams: ['IB', 'IGCSE', 'SAT', 'AP'] },
              { flag: '📋', exams: ['Mock Exams', 'Past Papers', 'Revision', 'Test Prep'] },
            ].map((group, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100">
                <div className="text-3xl mb-3">{group.flag}</div>
                <ul className="space-y-1">
                  {group.exams.map(exam => (
                    <li key={exam} className="flex items-center gap-1.5 text-xs text-gray-600">
                      <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: '#497296' }} />
                      {exam}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-4" style={{ color: '#062850' }}>
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Nigerian families pay in ₦. International families pay in £.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                type: 'Private Class', emoji: '👤',
                desc: '1-on-1 with your dedicated teacher.',
                ngn: ['₦100,000', '₦180,000', '₦250,000'],
                gbp: ['£65', '£110', '£150'],
                bundles: ['1-2 subjects', '3-4 subjects', '5-6 subjects'],
                highlight: true,
              },
              {
                type: 'General Class', emoji: '👥',
                desc: 'Group sessions with peers at the same level.',
                ngn: ['₦50,000', '₦90,000', '₦120,000'],
                gbp: ['£35', '£60', '£80'],
                bundles: ['1-2 subjects', '3-4 subjects', '5-6 subjects'],
                highlight: false,
              },
            ].map(pkg => (
              <div key={pkg.type} className={`rounded-2xl border-2 overflow-hidden
              ${pkg.highlight ? 'border-[#062850]' : 'border-gray-200'}`}>
                <div className="px-6 py-4"
                style={{ backgroundColor: pkg.highlight ? '#062850' : '#F0F6FB' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{pkg.emoji}</span>
                    <div>
                      <p className="font-bold"
                      style={{ color: pkg.highlight ? 'white' : '#062850' }}>
                        {pkg.type}
                      </p>
                      <p className="text-xs"
                      style={{ color: pkg.highlight ? '#97C3E0' : '#497296' }}>
                        {pkg.desc}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left text-xs text-gray-500 pb-2">Subjects</th>
                        <th className="text-right text-xs font-semibold pb-2 text-green-600">🇳🇬 NGN</th>
                        <th className="text-right text-xs font-semibold pb-2" style={{ color: '#062850' }}>🌍 GBP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pkg.bundles.map((bundle, i) => (
                        <tr key={bundle} className="border-t border-gray-50">
                          <td className="py-2 text-xs text-gray-500">{bundle}</td>
                          <td className="py-2 text-right text-xs font-bold text-green-600">
                            {pkg.ngn[i]}/mo
                          </td>
                          <td className="py-2 text-right text-xs font-bold"
                          style={{ color: '#062850' }}>
                            {pkg.gbp[i]}/mo
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
                    Discounts: Termly (5% off) • Annually (10% off)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl p-8 mb-16 text-center"
        style={{ backgroundColor: '#062850' }}>
          <p className="text-xl font-bold text-white mb-3">
            ✨ Powered by the Averra Super Curriculum
          </p>
          <p className="text-blue-300 max-w-2xl mx-auto mb-6 text-sm leading-relaxed">
            Your child doesn&apos;t follow just one curriculum. They follow the best
            of seven of the world&apos;s most respected education systems.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['🇬🇧 England','🇯🇵 Japan','🇪🇪 Estonia','🇨🇦 Canada','🇳🇬 Nigeria','🇸🇬 Singapore','🇫🇮 Finland'].map(item => (
              <span key={item} className="px-3 py-1.5 rounded-full text-sm text-white
              border border-white/20 bg-white/10">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#062850' }}>
            Ready to Give Your Child the Averra Advantage?
          </h2>
          <p className="text-gray-500 mb-8">
            Enrolment takes 5 minutes. First class within 48 hours.
          </p>
          <Link href="/academy/enroll">
            <Button size="lg" className="text-white font-bold px-12 py-6 rounded-xl
            shadow-lg transition-all hover:scale-105 hover:shadow-xl group"
            style={{ backgroundColor: '#062850' }}>
              Start Enrolment Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  )
}
