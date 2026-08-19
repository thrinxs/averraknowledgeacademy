import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'
import SmarterTooltip from '@/components/ui/SmarterTooltip'

export const metadata = {
  title: 'Averra Junior Academy | Averra Knowledge Academy',
  description: 'Expert academic tutoring for school-age learners worldwide. From first year of school through to final examinations — powered by the Averra Super Curriculum.',
}

export default function JuniorAcademyPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ══════════════════════ */}
      {/* HERO                  */}
      {/* ══════════════════════ */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #062850 0%, #1D4469 50%, #325E84 100%)',
        }}
      >
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10 animate-pulse"
          style={{ backgroundColor: '#97C3E0', animationDuration: '5s' }} />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-10 animate-pulse"
          style={{ backgroundColor: '#497296', animationDuration: '7s' }} />

          {/* Floating school items */}
          {[
            { icon: '✏️', top: '12%', left: '6%', delay: '0s', duration: '3s', rotate: '-15deg' },
            { icon: '📐', top: '20%', right: '8%', delay: '0.5s', duration: '4s', rotate: '10deg' },
            { icon: '📖', bottom: '35%', left: '5%', delay: '1s', duration: '3.5s', rotate: '5deg' },
            { icon: '🔭', top: '55%', right: '6%', delay: '1.5s', duration: '5s', rotate: '-8deg' },
            { icon: '🎨', bottom: '25%', right: '15%', delay: '2s', duration: '4s', rotate: '12deg' },
            { icon: '🔬', top: '35%', left: '4%', delay: '0.8s', duration: '3.8s', rotate: '-10deg' },
            { icon: '🌟', top: '8%', right: '25%', delay: '1.2s', duration: '2.5s', rotate: '0deg' },
            { icon: '💡', bottom: '15%', left: '18%', delay: '2.5s', duration: '4.5s', rotate: '8deg' },
            { icon: '🎯', top: '70%', left: '10%', delay: '0.3s', duration: '3.2s', rotate: '-5deg' },
            { icon: '📝', top: '45%', right: '3%', delay: '1.8s', duration: '4.2s', rotate: '15deg' },
          ].map((item, i) => (
            <div
              key={i}
              className="absolute opacity-20 text-3xl select-none"
              style={{
                top: item.top,
                bottom: item.bottom,
                left: item.left,
                right: item.right,
                transform: `rotate(${item.rotate})`,
                animation: `float ${item.duration} ease-in-out infinite`,
                animationDelay: item.delay,
              }}
            >
              {item.icon}
            </div>
          ))}

          {/* Floating stars/sparkles */}
          {[
            { top: '15%', left: '20%', size: 'w-2 h-2', delay: '0s' },
            { top: '30%', right: '20%', size: 'w-1.5 h-1.5', delay: '1s' },
            { bottom: '40%', left: '25%', size: 'w-1 h-1', delay: '2s' },
            { top: '60%', right: '30%', size: 'w-2 h-2', delay: '0.5s' },
            { bottom: '20%', right: '10%', size: 'w-1.5 h-1.5', delay: '1.5s' },
            { top: '80%', left: '35%', size: 'w-1 h-1', delay: '2.5s' },
          ].map((star, i) => (
            <div
              key={i}
              className={`absolute rounded-full bg-white opacity-40 ${star.size}`}
              style={{
                top: star.top,
                bottom: star.bottom,
                left: star.left,
                right: star.right,
                animation: `twinkle 2s ease-in-out infinite`,
                animationDelay: star.delay,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">

          <Link href="/academy" className="inline-flex items-center gap-2
          text-blue-300 hover:text-white transition-colors mb-8 text-sm group">
            <ArrowLeft className="w-4 h-4 transition-transform duration-200
            group-hover:-translate-x-1" />
            Back to Academy
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
          text-sm font-bold text-white border border-green-400/30
          bg-green-400/10 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Now Enrolling — Limited Spaces Available
          </div>

          <div className="text-7xl mb-6">🏫</div>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Averra Junior Academy
          </h1>

          <p className="text-xl md:text-2xl font-medium mb-4"
          style={{ color: '#97C3E0' }}>
            Building the right foundation of knowledge
            <br className="hidden md:block" />
            while they are still young enough to absorb it deeply.
          </p>

          <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto
          mb-10 leading-relaxed">
            Every child learns differently. Averra Junior Academy provides
            structured, personalised academic support — from a child&apos;s
            very first school year through to their final examinations —
            powered by the{' '}
            <SmarterTooltip>
              <span className="font-semibold text-white underline
              decoration-dotted decoration-blue-300">
                Averra Super Curriculum
              </span>
            </SmarterTooltip>
            , a fusion of seven of the world&apos;s best education systems.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/academy/enroll">
              <Button size="lg" className="bg-white font-bold px-10 py-6
              rounded-2xl shadow-xl transition-all hover:scale-105
              hover:shadow-2xl group" style={{ color: '#062850' }}>
                Start Enrolment
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1
                transition-transform" />
              </Button>
            </Link>
            <Link href="/academy#explorer">
              <Button size="lg" variant="outline"
              className="border-2 border-white/50 text-white bg-transparent
              px-10 py-6 rounded-2xl hover:bg-white/10 hover:border-white
              hover:scale-105 transition-all">
                Explore the Curriculum
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

        {/* ══════════════════════ */}
        {/* WHO IS IT FOR         */}
        {/* ══════════════════════ */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4"
          style={{ color: '#062850' }}>
            Who Is Junior Academy For?
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Averra Junior Academy supports school-age learners at every stage
            — from their first year of primary school all the way through to
            their final secondary school examinations.
            We work with learners across all national and international curricula.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            {
              emoji: '📚',
              title: 'Early & Primary Years',
              ages: 'Ages 5 – 11',
              desc: 'Building strong, confident foundations in core subjects. Lessons are structured yet engaging — designed to develop genuine understanding and a love for learning from the very start.',
              examples: [
                'Reading, writing & comprehension',
                'Number sense & early mathematics',
                'Science & the world around us',
                'Computing & digital literacy',
              ],
            },
            {
              emoji: '📐',
              title: 'Middle School Years',
              ages: 'Ages 11 – 14',
              desc: 'The transition years are critical. We provide clear, structured support across all core and optional subjects — helping learners build academic confidence as the work becomes more demanding.',
              examples: [
                'All core and optional subjects',
                'Study skills and exam technique',
                'Critical thinking development',
                'Building academic independence',
              ],
            },
            {
              emoji: '🏆',
              title: 'Senior & Examination Years',
              ages: 'Ages 14 – 18',
              desc: 'Focused examination preparation and deep subject mastery for learners approaching their most important school assessments — wherever in the world those examinations are taken.',
              examples: [
                'National & international exam prep',
                'Past paper practice & revision',
                'Subject-specific deep coaching',
                'University preparation support',
              ],
            },
          ].map((item) => (
            <div key={item.title}
            className="bg-white rounded-3xl p-7 border border-gray-100
            shadow-sm transition-all duration-300 hover:shadow-xl
            hover:-translate-y-2 group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full
              opacity-5 group-hover:opacity-10 transition-opacity duration-300"
              style={{ backgroundColor: '#062850' }} />

              <div className="text-5xl mb-4 transition-transform duration-300
              group-hover:scale-110">
                {item.emoji}
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1
              rounded-full text-xs font-bold text-white mb-3"
              style={{ backgroundColor: '#497296' }}>
                {item.ages}
              </div>

              <h3 className="font-bold text-xl mb-3" style={{ color: '#062850' }}>
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                {item.desc}
              </p>
              <ul className="space-y-1.5">
                {item.examples.map((ex) => (
                  <li key={ex} className="flex items-start gap-2
                  text-xs text-gray-600">
                    <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                    style={{ color: '#497296' }} />
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Global note */}
        <div className="rounded-2xl p-5 flex items-start gap-4 mb-16"
        style={{ backgroundColor: '#F0F6FB' }}>
          <span className="text-2xl flex-shrink-0">🌍</span>
          <div>
            <p className="font-semibold text-sm mb-1" style={{ color: '#062850' }}>
              We support learners across all national and international school systems.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              Whether your child follows the Nigerian curriculum, the England National
              Curriculum, the International Baccalaureate, the American Common Core,
              or any other national system — Averra Junior Academy works with their
              specific curriculum and prepares them for their own examinations.
            </p>
          </div>
        </div>

        {/* ══════════════════════ */}
        {/* EXAM PREP             */}
        {/* ══════════════════════ */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3"
            style={{ color: '#062850' }}>
              Examination Preparation
            </h2>
            <p className="text-gray-500 text-base max-w-2xl mx-auto">
              We prepare learners for examinations in every country we serve.
              Our teachers know the specific requirements of each exam system
              and tailor preparation accordingly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                flag: '🇳🇬',
                country: 'Nigeria',
                exams: ['WAEC / WASSCE', 'NECO', 'JAMB / UTME', 'Common Entrance'],
                color: '#065F46',
                lightColor: '#ECFDF5',
              },
              {
                flag: '🇬🇧',
                country: 'United Kingdom',
                exams: ['GCSE', 'A-Level', 'SATs', '11+ (Grammar School)'],
                color: '#062850',
                lightColor: '#EBF4FF',
              },
              {
                flag: '🌍',
                country: 'International',
                exams: ['IB (International Baccalaureate)', 'Cambridge IGCSE', 'SAT (USA)', 'AP Examinations'],
                color: '#0369A1',
                lightColor: '#E0F2FE',
              },
              {
                flag: '📋',
                country: 'Exam Support',
                exams: ['Mock examinations', 'Past paper practice', 'Timed revision sessions', 'Exam technique coaching'],
                color: '#6D28D9',
                lightColor: '#F5F3FF',
              },
            ].map((group) => (
              <div key={group.country}
              className="rounded-2xl overflow-hidden border border-gray-100
              shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="px-5 py-4 flex items-center gap-3"
                style={{ backgroundColor: group.color }}>
                  <span className="text-3xl">{group.flag}</span>
                  <span className="font-bold text-white text-sm">
                    {group.country}
                  </span>
                </div>
                <div className="p-5" style={{ backgroundColor: group.lightColor }}>
                  <ul className="space-y-2">
                    {group.exams.map((exam) => (
                      <li key={exam} className="flex items-center gap-2
                      text-xs font-medium" style={{ color: group.color }}>
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        {exam}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════ */}
        {/* PRICING               */}
        {/* ══════════════════════ */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3"
            style={{ color: '#062850' }}>
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              Nigerian families and Nigerians in diaspora pay in Naira (₦).
              All other international families pay in British Pounds (£).
              No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {[
              {
                type: 'Private Class',
                emoji: '👤',
                tag: 'Best Results',
                tagColor: '#062850',
                desc: 'One-on-one sessions with a dedicated teacher. Full personalisation — lessons are built entirely around your child\'s curriculum, pace and learning style.',
                ngn: ['₦100,000', '₦180,000', '₦250,000'],
                gbp: ['£65', '£110', '£150'],
                bundles: ['1 – 2 subjects', '3 – 4 subjects', '5 – 6 subjects'],
                highlight: true,
              },
              {
                type: 'General Class',
                emoji: '👥',
                tag: 'Best Value',
                tagColor: '#0369A1',
                desc: 'Small group sessions with learners at the same level and year group. Collaborative, structured and significantly more affordable — without compromising on quality.',
                ngn: ['₦50,000', '₦90,000', '₦120,000'],
                gbp: ['£35', '£60', '£80'],
                bundles: ['1 – 2 subjects', '3 – 4 subjects', '5 – 6 subjects'],
                highlight: false,
              },
            ].map((pkg) => (
              <div key={pkg.type}
              className={`rounded-3xl overflow-hidden border-2 transition-all
              duration-300 hover:shadow-xl
              ${pkg.highlight ? 'border-[#062850]' : 'border-gray-200'}`}>

                {/* Card header */}
                <div className="px-7 py-5 flex items-center justify-between"
                style={{ backgroundColor: pkg.highlight ? '#062850' : '#F0F6FB' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{pkg.emoji}</span>
                    <div>
                      <p className="font-bold text-lg"
                      style={{ color: pkg.highlight ? 'white' : '#062850' }}>
                        {pkg.type}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1.5 rounded-full
                  font-bold text-white"
                  style={{ backgroundColor: pkg.tagColor }}>
                    {pkg.tag}
                  </span>
                </div>

                {/* Card body */}
                <div className="p-7">
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {pkg.desc}
                  </p>

                  {/* Pricing table */}
                  <div className="rounded-2xl overflow-hidden border
                  border-gray-100 mb-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ backgroundColor: '#F0F6FB' }}>
                          <th className="px-4 py-3 text-left text-xs
                          font-bold text-gray-500">
                            Subjects/month
                          </th>
                          <th className="px-4 py-3 text-right text-xs
                          font-bold text-green-600">
                            🇳🇬 Naira
                          </th>
                          <th className="px-4 py-3 text-right text-xs
                          font-bold" style={{ color: '#062850' }}>
                            🌍 Pounds
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pkg.bundles.map((bundle, i) => (
                          <tr key={bundle}
                          className="border-t border-gray-50 hover:bg-gray-50
                          transition-colors">
                            <td className="px-4 py-3 text-xs text-gray-600">
                              {bundle}
                            </td>
                            <td className="px-4 py-3 text-right text-xs
                            font-bold text-green-600">
                              {pkg.ngn[i]}/mo
                            </td>
                            <td className="px-4 py-3 text-right text-xs font-bold"
                            style={{ color: '#062850' }}>
                              {pkg.gbp[i]}/mo
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      Termly billing saves 5%
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      Annual billing saves 10%
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      Maximum 6 subjects
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing note */}
          <div className="rounded-2xl p-5 border border-gray-100
          flex items-start gap-3"
          style={{ backgroundColor: '#F0F6FB' }}>
            <span className="text-xl flex-shrink-0">💡</span>
            <div>
              <p className="font-semibold text-sm mb-1"
              style={{ color: '#062850' }}>
                Not sure which option is right for you?
              </p>
              <p className="text-gray-500 text-sm leading-relaxed">
                We recommend starting with Private Class if your child needs
                intensive support or has significant gaps. General Class is
                excellent for learners who are on track but want structured
                extra support. You can always switch between formats each term.
              </p>
            </div>
          </div>
        </div>

        {/* ══════════════════════ */}
        {/* SUPER CURRICULUM      */}
        {/* ══════════════════════ */}
        <div className="rounded-3xl overflow-hidden mb-16">
          <div className="px-8 py-8 text-center"
          style={{ backgroundColor: '#062850' }}>
            <div className="text-4xl mb-3">✨</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Powered by the{' '}
              <SmarterTooltip>
                <span className="underline decoration-dotted
                decoration-blue-300 cursor-help">
                  Averra Super Curriculum
                </span>
              </SmarterTooltip>
            </h2>
            <p className="text-blue-300 text-sm max-w-2xl mx-auto leading-relaxed">
              Your child does not follow just one curriculum. They follow the best
              of seven of the world&apos;s most respected education systems —
              fused into one coherent, personalised learning plan that goes far
              beyond anything a single national curriculum can provide.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100">
            {[
              { flag: '🇬🇧', name: 'England', contribution: 'Structure & exam pathways' },
              { flag: '🇯🇵', name: 'Japan', contribution: 'Mastery & discipline' },
              { flag: '🇪🇪', name: 'Estonia', contribution: 'Digital competence' },
              { flag: '🇨🇦', name: 'Canada', contribution: 'Student-centred learning' },
              { flag: '🇳🇬', name: 'Nigeria', contribution: 'Culture & local exams' },
              { flag: '🇸🇬', name: 'Singapore', contribution: 'World #1 Maths method' },
              { flag: '🇫🇮', name: 'Finland', contribution: 'Deep understanding' },
              { flag: '🧠', name: 'Your Child', contribution: 'Individual assessment' },
            ].map((item) => (
              <div key={item.name} className="bg-white px-5 py-4 text-center
              transition-all duration-200 hover:bg-blue-50">
                <div className="text-3xl mb-2">{item.flag}</div>
                <p className="font-bold text-xs mb-1"
                style={{ color: '#062850' }}>
                  {item.name}
                </p>
                <p className="text-xs text-gray-400 leading-tight">
                  {item.contribution}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════ */}
        {/* FINAL CTA             */}
        {/* ══════════════════════ */}
        <div
          className="relative rounded-3xl p-12 text-center overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #062850 0%, #1D4469 50%, #325E84 100%)',
          }}
        >
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-10"
          style={{ backgroundColor: '#97C3E0' }} />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full opacity-10"
          style={{ backgroundColor: '#497296' }} />

          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Give Your Child the Averra Advantage
            </h2>
            <p className="text-blue-300 text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Join families from Nigeria, the United Kingdom and around the world
              who have chosen Averra Junior Academy. Enrolment takes 5 minutes
              and your child&apos;s first class begins within 48 hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/academy/enroll">
                <Button size="lg" className="bg-white font-bold px-10 py-6
                rounded-2xl shadow-xl transition-all hover:scale-105
                hover:shadow-2xl group" style={{ color: '#062850' }}>
                  Start Enrolment Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1
                  transition-transform" />
                </Button>
              </Link>
              <Link href="/academy#explorer">
                <Button size="lg" variant="outline"
                className="border-2 border-white/40 text-white bg-transparent
                px-10 py-6 rounded-2xl hover:bg-white/10 hover:border-white
                transition-all hover:scale-105">
                  Explore the Curriculum First
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {[
                '✓ No registration fee',
                '✓ First class within 48 hours',
                '✓ Nigerian & international pricing',
                '✓ All school systems supported',
                '✓ Cancel anytime',
              ].map((point) => (
                <span key={point} className="text-blue-300 text-sm font-medium">
                  {point}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
