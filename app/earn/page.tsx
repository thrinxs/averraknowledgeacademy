'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users,
  Link2,
  BadgePercent,
  CalendarCheck,
  BookOpen,
  Video,
  Mic,
  ArrowRight,
  CheckCircle,
  Wallet,
  Share2,
  ClipboardList,
  ShieldCheck,
  TrendingUp,
  Clock,
  Star,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const faqs = [
  {
    q: 'How do I become an affiliate?',
    a: 'Create an account on Averra Knowledge Academy and select the affiliate option. Once your account is set up, you will receive your unique referral link and referral code immediately.',
  },
  {
    q: 'When do I get paid as an affiliate?',
    a: 'Affiliate commissions are paid out monthly. Your earnings are calculated at the end of each month based on confirmed payments from your referrals.',
  },
  {
    q: 'How does the referral tracking work?',
    a: 'You earn a commission when someone visits Averra Knowledge Academy through your unique referral link and makes a payment, or when someone enters your referral code during registration and makes a payment. Both methods are tracked automatically.',
  },
  {
    q: 'Is there a limit to how much I can earn as an affiliate?',
    a: 'No limit at all. The more clients you refer who make a payment, the more you earn. There is no cap on affiliate earnings.',
  },
  {
    q: 'How do I become a trainer?',
    a: 'Submit a trainer application through your account. Our team will review your application and get back to you. Once approved, you will receive full details about course delivery, earnings, and payout structure during onboarding.',
  },
  {
    q: 'Do trainers set their own course prices?',
    a: 'No. Course prices are set by Averra Knowledge Academy to ensure consistency and fairness across the platform. The minimum course price is ₦3,000.',
  },
  {
    q: 'When do trainers get paid?',
    a: 'Trainer earnings are paid out monthly, calculated based on your course activity for that month.',
  },
  {
    q: 'Can I be both an affiliate and a trainer?',
    a: 'Yes. You can participate in both programmes simultaneously. Each has its own tracking and payout system.',
  },
]

export default function EarnPage() {
  const [mounted, setMounted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  function toggleFaq(index: number) {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <main className="min-h-screen bg-white">

      {/* ── HERO ───────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-24 md:py-32"
        style={{ backgroundColor: '#062850' }}
      >
        {/* Background glows */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ backgroundColor: '#97C3E0' }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-5 blur-3xl pointer-events-none"
          style={{ backgroundColor: '#97C3E0' }}
        />

        <div className="relative max-w-5xl mx-auto px-6 text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 text-white text-sm font-medium mb-8">
            <Wallet className="w-4 h-4" style={{ color: '#97C3E0' }} />
            Earn With Averra
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Turn Your Network &{' '}
            <span style={{ color: '#97C3E0' }}>
              Knowledge Into Income
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-12">
            Two ways to earn with Averra Knowledge Academy — refer clients
            as an affiliate, or deliver courses and training as a trainer.
            Both pay monthly. Both are open to you right now.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a href="#affiliate">
              <Button
                className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: '#497296', color: '#fff' }}
              >
                <Users className="w-4 h-4 mr-2" />
                Become an Affiliate
              </Button>
            </a>
            <a href="#trainer">
              <Button
                variant="outline"
                className="px-8 py-3 rounded-xl font-semibold border-white/20 text-white hover:bg-white/10 transition-all duration-300"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Become a Trainer
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── TWO WAYS OVERVIEW ───────────────────────────── */}
      <section
        className="py-16 px-6"
        style={{ backgroundColor: '#F0F6FB' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Affiliate overview */}
            <div
              className="rounded-2xl p-8 text-white hover:-translate-y-1 transition-all duration-300"
              style={{ backgroundColor: '#062850' }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                style={{ backgroundColor: '#1D4469' }}
              >
                <Share2 className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3">
                Affiliate Programme
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Refer clients to Averra Knowledge Academy using your unique
                link or code. Earn 10% of every confirmed payment — no cap,
                no limit, paid every month.
              </p>
              <div className="flex items-center gap-2 text-white font-semibold text-lg">
                <BadgePercent
                  className="w-5 h-5"
                  style={{ color: '#97C3E0' }}
                />
                10% commission per referral
              </div>
            </div>

            {/* Trainer overview */}
            <div
              className="rounded-2xl p-8 text-white hover:-translate-y-1 transition-all duration-300"
              style={{ backgroundColor: '#325E84' }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                style={{ backgroundColor: '#497296' }}
              >
                <Mic className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3">
                Trainer Programme
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Deliver courses and training sessions on the Averra
                platform. Earn a competitive share of every course and
                training fee you deliver — paid every month.
              </p>
              <div className="flex items-center gap-2 text-white font-semibold text-lg">
                <TrendingUp
                  className="w-5 h-5 text-white/60"
                />
                Competitive share on every delivery
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── AFFILIATE SECTION ───────────────────────────── */}
      <section
        id="affiliate"
        className="py-20 px-6 bg-white"
      >
        <div className="max-w-5xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium mb-6"
              style={{ backgroundColor: '#062850' }}
            >
              <Users className="w-4 h-4" />
              Affiliate Programme
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: '#062850' }}
            >
              Refer. Earn. Repeat.
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Share your unique referral link or code with anyone who needs
              scholarship matching, skills training, or career coaching.
              Every time they pay — you earn.
            </p>
          </div>

          {/* How it works */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            {[
              {
                step: '01',
                icon: <ClipboardList className="w-6 h-6" />,
                title: 'Create Your Account',
                desc: 'Sign up on Averra Knowledge Academy and set up your affiliate account.',
                color: '#062850',
              },
              {
                step: '02',
                icon: <Link2 className="w-6 h-6" />,
                title: 'Get Your Link & Code',
                desc: 'Receive your unique referral link and referral code immediately.',
                color: '#1D4469',
              },
              {
                step: '03',
                icon: <Share2 className="w-6 h-6" />,
                title: 'Share & Refer',
                desc: 'Share your link on social media, WhatsApp, or give out your code directly.',
                color: '#325E84',
              },
              {
                step: '04',
                icon: <Wallet className="w-6 h-6" />,
                title: 'Earn Monthly',
                desc: 'Earn 10% of every confirmed payment from your referrals, paid monthly.',
                color: '#497296',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl p-6 text-white text-center hover:-translate-y-1 transition-all duration-300"
                style={{ backgroundColor: item.color }}
              >
                <div className="text-4xl font-bold text-white/20 mb-3">
                  {item.step}
                </div>
                <div className="flex justify-center mb-3 text-white/70">
                  {item.icon}
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Commission breakdown */}
          <div
            className="rounded-2xl p-8 mb-16"
            style={{ backgroundColor: '#F0F6FB' }}
          >
            <h3
              className="text-2xl font-bold mb-2 text-center"
              style={{ color: '#062850' }}
            >
              Your Earnings Per Referral
            </h3>
            <p className="text-gray-500 text-center text-sm mb-8">
              10% of every confirmed scholarship service payment
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  package:    'Basic Package',
                  price:      '₦30,000',
                  commission: '₦3,000',
                  color:      '#062850',
                  desc:       'Per confirmed Basic referral',
                },
                {
                  package:    'Standard Package',
                  price:      '₦50,000',
                  commission: '₦5,000',
                  color:      '#325E84',
                  desc:       'Per confirmed Standard referral',
                },
                {
                  package:    'Premium Package',
                  price:      '₦150,000',
                  commission: '₦15,000',
                  color:      '#497296',
                  desc:       'Per confirmed Premium referral',
                },
              ].map((item) => (
                <div
                  key={item.package}
                  className="rounded-2xl p-6 text-white text-center hover:-translate-y-1 transition-all duration-300"
                  style={{ backgroundColor: item.color }}
                >
                  <p className="text-white/60 text-sm mb-1">
                    {item.package}
                  </p>
                  <p className="text-white/40 text-sm mb-4">
                    Package price: {item.price}
                  </p>
                  <p
                    className="text-4xl font-bold mb-2"
                    style={{ color: '#97C3E0' }}
                  >
                    {item.commission}
                  </p>
                  <p className="text-white/60 text-xs">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-center text-gray-400 text-xs mt-6">
              No cap on earnings. Refer as many clients as you want.
              Commission applies to scholarship service packages only.
              Skills, careers, and other services also earn you commission.
            </p>
          </div>

          {/* Affiliate benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
            <div>
              <h3
                className="text-2xl font-bold mb-6"
                style={{ color: '#062850' }}
              >
                What You Get as an Affiliate
              </h3>
              <div className="space-y-4">
                {[
                  {
                    icon: <Link2 className="w-5 h-5" />,
                    title: 'Unique Referral Link',
                    desc: 'A personal link that automatically tracks every visitor you send to Averra.',
                  },
                  {
                    icon: <BadgePercent className="w-5 h-5" />,
                    title: 'Unique Referral Code',
                    desc: 'A code clients can enter during registration to credit you with the referral.',
                  },
                  {
                    icon: <TrendingUp className="w-5 h-5" />,
                    title: 'Affiliate Dashboard',
                    desc: 'Track your referrals, earnings, and payout history in real time.',
                  },
                  {
                    icon: <CalendarCheck className="w-5 h-5" />,
                    title: 'Monthly Payouts',
                    desc: 'Earnings are calculated and paid at the end of every month.',
                  },
                  {
                    icon: <ShieldCheck className="w-5 h-5" />,
                    title: 'No Cap, No Limit',
                    desc: 'There is no maximum to how much you can earn. The more you refer, the more you earn.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white"
                      style={{ backgroundColor: '#062850' }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <h4
                        className="font-bold mb-1"
                        style={{ color: '#062850' }}
                      >
                        {item.title}
                      </h4>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Affiliate CTA card */}
            <div
              className="rounded-2xl p-8 flex flex-col justify-between"
              style={{ backgroundColor: '#062850' }}
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Start Earning Today
                </h3>
                <p className="text-white/70 leading-relaxed mb-6">
                  It takes less than 5 minutes to set up your affiliate
                  account. No experience needed. No targets. Just share
                  your link — and earn every time someone pays.
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    'Free to join — no cost at all',
                    'Works via link or referral code',
                    'Tracks referrals automatically',
                    '10% of every confirmed payment',
                    'Paid monthly to your bank account',
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-white/80 text-sm"
                    >
                      <CheckCircle className="w-4 h-4 shrink-0 text-green-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/auth/signup">
                <Button
                  className="w-full py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: '#497296', color: '#fff' }}
                >
                  Create Affiliate Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── TRAINER SECTION ─────────────────────────────── */}
      <section
        id="trainer"
        className="py-20 px-6"
        style={{ backgroundColor: '#F0F6FB' }}
      >
        <div className="max-w-5xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium mb-6"
              style={{ backgroundColor: '#325E84' }}
            >
              <Mic className="w-4 h-4" />
              Trainer Programme
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: '#062850' }}
            >
              Teach. Deliver. Earn.
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              If you have skills, knowledge, or expertise others want to
              learn — Averra gives you the platform to reach students
              and earn a competitive share of every course and training
              fee you deliver.
            </p>
          </div>

          {/* Course types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon:  <BookOpen className="w-7 h-7" />,
                type:  'Fixed-Price Courses',
                desc:  'Pre-recorded courses sold at a fixed price per student. Earn a competitive share of every sale.',
                color: '#062850',
                note:  'Best for: Skills courses, tutorials, how-to programs',
              },
              {
                icon:  <Star className="w-7 h-7" />,
                type:  'Subscription Content',
                desc:  'Content made available to platform subscribers. Earn based on how many minutes students watch your content each month.',
                color: '#325E84',
                note:  'Best for: Ongoing educational series, curriculum lessons',
              },
              {
                icon:  <Video className="w-7 h-7" />,
                type:  'Live Training Sessions',
                desc:  'Deliver real-time training sessions directly to students. Earn a competitive share of every session fee.',
                color: '#497296',
                note:  'Best for: Workshops, coaching, interactive training',
              },
            ].map((item) => (
              <div
                key={item.type}
                className="rounded-2xl p-7 text-white hover:-translate-y-1 transition-all duration-300"
                style={{ backgroundColor: item.color }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl mb-3">{item.type}</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  {item.desc}
                </p>
                <p
                  className="text-xs px-3 py-2 rounded-xl"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
                >
                  {item.note}
                </p>
              </div>
            ))}
          </div>

          {/* How trainer flow works */}
          <div className="bg-white rounded-2xl p-8 mb-16 shadow-sm">
            <h3
              className="text-2xl font-bold mb-8 text-center"
              style={{ color: '#062850' }}
            >
              How the Trainer Programme Works
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                {
                  step:  '01',
                  title: 'Apply',
                  desc:  'Submit your trainer application through your Averra account.',
                  color: '#062850',
                },
                {
                  step:  '02',
                  title: 'Get Approved',
                  desc:  'Our team reviews your application and approves qualified trainers.',
                  color: '#1D4469',
                },
                {
                  step:  '03',
                  title: 'Onboarding',
                  desc:  'Receive full details on earnings, course delivery, and platform guidelines.',
                  color: '#325E84',
                },
                {
                  step:  '04',
                  title: 'Deliver',
                  desc:  'Upload courses, run live sessions, or deliver training content.',
                  color: '#497296',
                },
                {
                  step:  '05',
                  title: 'Earn Monthly',
                  desc:  'Receive your earnings every month based on your course activity.',
                  color: '#033B6A',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-2xl p-5 text-white text-center hover:-translate-y-1 transition-all duration-300"
                  style={{ backgroundColor: item.color }}
                >
                  <div className="text-3xl font-bold text-white/20 mb-2">
                    {item.step}
                  </div>
                  <h4 className="font-bold mb-2">{item.title}</h4>
                  <p className="text-white/60 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Trainer benefits + CTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Benefits */}
            <div>
              <h3
                className="text-2xl font-bold mb-6"
                style={{ color: '#062850' }}
              >
                Why Teach on Averra?
              </h3>
              <div className="space-y-4">
                {[
                  {
                    icon:  <Users className="w-5 h-5" />,
                    title: 'Ready Audience',
                    desc:  'Deliver to students who are already on the platform and actively seeking skills and knowledge.',
                    color: '#062850',
                  },
                  {
                    icon:  <Wallet className="w-5 h-5" />,
                    title: 'Competitive Earnings',
                    desc:  'Earn a competitive share of every course, subscription, and live session fee you deliver.',
                    color: '#325E84',
                  },
                  {
                    icon:  <Clock className="w-5 h-5" />,
                    title: 'Flexible Delivery',
                    desc:  'Deliver pre-recorded courses, subscription content, or live training — whatever suits your style.',
                    color: '#497296',
                  },
                  {
                    icon:  <TrendingUp className="w-5 h-5" />,
                    title: 'Monthly Payouts',
                    desc:  'Your earnings are calculated and paid out every month — reliably and transparently.',
                    color: '#1D4469',
                  },
                  {
                    icon:  <ShieldCheck className="w-5 h-5" />,
                    title: 'Platform Support',
                    desc:  'Averra handles payments, student management, and platform operations so you can focus on teaching.',
                    color: '#033B6A',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <h4
                        className="font-bold mb-1"
                        style={{ color: '#062850' }}
                      >
                        {item.title}
                      </h4>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trainer CTA card */}
            <div
              className="rounded-2xl p-8 flex flex-col justify-between"
              style={{ backgroundColor: '#325E84' }}
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Apply to Become a Trainer
                </h3>
                <p className="text-white/70 leading-relaxed mb-6">
                  If you have skills or knowledge that can help others
                  grow — apply to join the Averra trainer network. Full
                  earnings details and onboarding information are provided
                  after approval.
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    'Open to qualified trainers in any skill area',
                    'Deliver courses, subscriptions, or live sessions',
                    'Competitive share on every delivery',
                    'Monthly earnings payout',
                    'Platform handles students and payments',
                    'Full details shared upon approval',
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-white/80 text-sm"
                    >
                      <CheckCircle className="w-4 h-4 shrink-0 text-green-400" />
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="text-white/40 text-xs mb-6">
                  Note: Course prices are set by Averra Knowledge Academy.
                  Minimum course price is ₦3,000. Full revenue share
                  details are provided during trainer onboarding.
                </p>
              </div>

              <Link href="/auth/signup">
                <Button
                  className="w-full py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: '#062850', color: '#fff' }}
                >
                  Apply as a Trainer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: '#062850' }}
            >
              Affiliate vs Trainer — At a Glance
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Not sure which is right for you? Here's a quick comparison.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#062850' }}>
                  <th className="text-left text-white/60 font-medium px-6 py-4 w-1/3">
                    Feature
                  </th>
                  <th className="text-center text-white font-bold px-6 py-4 w-1/3">
                    Affiliate
                  </th>
                  <th
                    className="text-center text-white font-bold px-6 py-4 w-1/3"
                    style={{ backgroundColor: '#325E84' }}
                  >
                    Trainer
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature:   'How you earn',
                    affiliate: 'Refer clients',
                    trainer:   'Deliver courses/training',
                  },
                  {
                    feature:   'Requires approval',
                    affiliate: 'No — instant access',
                    trainer:   'Yes — application reviewed',
                  },
                  {
                    feature:   'Earning rate',
                    affiliate: '10% per referral',
                    trainer:   'Competitive share per delivery',
                  },
                  {
                    feature:   'Payout schedule',
                    affiliate: 'Monthly',
                    trainer:   'Monthly',
                  },
                  {
                    feature:   'Earning cap',
                    affiliate: 'None',
                    trainer:   'None',
                  },
                  {
                    feature:   'Skills required',
                    affiliate: 'None — just share your link',
                    trainer:   'Subject knowledge & delivery skills',
                  },
                  {
                    feature:   'Dashboard access',
                    affiliate: 'Yes — referrals & earnings',
                    trainer:   'Yes — courses & earnings',
                  },
                  {
                    feature:   'Cost to join',
                    affiliate: 'Free',
                    trainer:   'Free',
                  },
                ].map((row, i) => (
                  <tr
                    key={row.feature}
                    style={{
                      backgroundColor: i % 2 === 0 ? '#F0F6FB' : '#fff',
                    }}
                  >
                    <td
                      className="px-6 py-4 font-medium"
                      style={{ color: '#062850' }}
                    >
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      {row.affiliate}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      {row.trainer}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section
        className="py-20 px-6"
        style={{ backgroundColor: '#F0F6FB' }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: '#062850' }}
            >
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 text-lg">
              Everything you need to know about earning with Averra.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors hover:bg-gray-50"
                >
                  <span
                    className="font-semibold pr-4"
                    style={{ color: '#062850' }}
                  >
                    {faq.q}
                  </span>
                  {openFaq === index ? (
                    <ChevronUp
                      className="w-5 h-5 shrink-0"
                      style={{ color: '#497296' }}
                    />
                  ) : (
                    <ChevronDown
                      className="w-5 h-5 shrink-0"
                      style={{ color: '#497296' }}
                    />
                  )}
                </button>

                {openFaq === index && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-500 leading-relaxed text-sm">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <section
        className="py-20 px-6 text-center"
        style={{ backgroundColor: '#062850' }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Earning?
          </h2>
          <p className="text-white/60 text-lg mb-10">
            Create your account today and choose the earning path that
            works best for you — affiliate, trainer, or both.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/auth/signup">
              <Button
                className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: '#497296', color: '#fff' }}
              >
                Create Your Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a
              href="mailto:info@averraknowledgeacademy.com"
            >
              <Button
                variant="outline"
                className="px-8 py-3 rounded-xl font-semibold border-white/20 text-white hover:bg-white/10 transition-all duration-300"
              >
                Contact Us First
              </Button>
            </a>
          </div>

          <p className="text-white/30 text-sm mt-8">
            Questions? Email us at{' '}
            <a
              href="mailto:info@averraknowledgeacademy.com"
              className="underline hover:text-white/50 transition-colors"
            >
              info@averraknowledgeacademy.com
            </a>
          </p>
        </div>
      </section>

    </main>
  )
}