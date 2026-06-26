'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function ScholarshipFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question:
        'How long does it take to receive my scholarship matches?',
      answer:
        'Your scholarship matches are automatically delivered ' +
        'in less than 1 hour after payment is confirmed. ' +
        'Our team then manually reviews and verifies every match, ' +
        'which is completed within 24 hours. You will receive ' +
        'a notification, an in-app message, and an email at ' +
        'each stage.',
    },
    {
      question: 'Are the scholarships guaranteed?',
      answer:
        'We do not guarantee that you will win a scholarship — ' +
        'no service honestly can. What we do guarantee is that ' +
        'every match we deliver is personally selected for your ' +
        'profile and manually verified to confirm it is current, ' +
        'active, and that you meet the eligibility requirements.',
    },
    {
      question:
        'What if scholarships are not available in my preferred countries?',
      answer:
        'If scholarships in your preferred countries are not ' +
        'currently available or do not match your academic profile, ' +
        'we will find and provide verified matches in other suitable ' +
        'countries. You will always receive 5 quality scholarship ' +
        'options.',
    },
    {
      question: 'What happens after I receive my matches?',
      answer:
        'Once your matches are verified and delivered, the level ' +
        'of support you receive depends on your package. Basic ' +
        'clients receive their match report to proceed independently. ' +
        'Standard and Premium clients receive additional support ' +
        'including SOP review, CV review, application guidance, ' +
        'coaching, and more.',
    },
    {
      question: 'Can I upgrade my package after paying?',
      answer:
        'Yes. If you have already paid for a package and would ' +
        'like to upgrade to a higher tier, simply contact us at ' +
        'scholarship@averraknowledgeacademy.com or reach us on WhatsApp ' +
        'and we will process your upgrade.',
    },
    {
      question: 'Do you offer refunds?',
      answer:
        'We do not offer refunds. Once payment is made, our team ' +
        'begins working on your profile immediately. What we commit ' +
        'to is delivering 5 personally matched and manually verified ' +
        'scholarship options for every client, without exception.',
    },
    {
      question:
        'Do I need IELTS, TOEFL, or GRE to use this service?',
      answer:
        'No — you do not need to have these qualifications to use ' +
        'our service. However, many scholarships require them as ' +
        'part of the application. If this applies to your matches, ' +
        'we will clearly note it in your match report so you know ' +
        'what to prepare.',
    },
    {
      question:
        'Is this service available for applicants from any country?',
      answer:
        'Yes. The scholarship matching service is open to applicants ' +
        'from any country. You do not need to be based in Africa to ' +
        'use Averra Knowledge Academy.',
    },
    {
      question: 'How do I pay?',
      answer:
        'Payment is processed securely through Paystack. You can ' +
        'pay using a debit or credit card, bank transfer, or USSD. ' +
        'Your payment is confirmed instantly and your matching ' +
        'process begins immediately after.',
    },
  ]

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white mb-4"
            style={{ backgroundColor: '#497296' }}
          >
            FAQ
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4 leading-tight"
            style={{ color: '#062850' }}
          >
            Frequently Asked
            <br />
            <span style={{ color: '#497296' }}>
              Questions
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Everything you need to know before getting started.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border overflow-hidden transition-all duration-300"
              style={{
                borderColor:
                  openIndex === index ? '#97C3E0' : '#E5E7EB',
              }}
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between gap-4 p-6 text-left transition-colors duration-200"
                style={{
                  backgroundColor:
                    openIndex === index ? '#F0F6FB' : '#ffffff',
                }}
              >
                <span
                  className="font-semibold text-base leading-snug"
                  style={{ color: '#062850' }}
                >
                  {faq.question}
                </span>
                <ChevronDown
                  className="w-5 h-5 flex-shrink-0 transition-transform duration-300"
                  style={{
                    color: '#497296',
                    transform:
                      openIndex === index
                        ? 'rotate(180deg)'
                        : 'rotate(0deg)',
                  }}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                  <div className="pt-4">{faq.answer}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div
          className="mt-10 rounded-2xl p-6 text-center border"
          style={{
            backgroundColor: '#F0F6FB',
            borderColor: '#97C3E0',
          }}
        >
          <p
            className="font-semibold mb-1"
            style={{ color: '#062850' }}
          >
            Still have a question?
          </p>
          <p className="text-gray-600 text-sm mb-4">
            Reach us directly and we will be happy to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
            <a
              href="mailto:scholarship@averraknowledgeacademy.com"
              className="font-medium transition-colors hover:underline underline-offset-4"
              style={{ color: '#497296' }}
            >
              scholarship@averraknowledgeacademy.com
            </a>
            <span className="hidden sm:block text-gray-300">
              |
            </span>
            <a
              href="https://wa.me/2349033440966"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium transition-colors hover:underline underline-offset-4"
              style={{ color: '#497296' }}
            >
              WhatsApp Us
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}