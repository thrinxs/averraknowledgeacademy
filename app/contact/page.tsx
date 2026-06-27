import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the Averra Knowledge Academy team. We are here to help with scholarships, learning, digital skills, career training, and more.',
  keywords: [
    'contact Averra Knowledge Academy',
    'Averra support',
    'scholarship help Nigeria',
    'academic support contact',
  ],
  alternates: {
    canonical: 'https://www.averraknowledgeacademy.com/contact',
  },
  openGraph: {
    title: 'Contact Us | Averra Knowledge Academy',
    description:
      'Reach out to the Averra Knowledge Academy team for scholarship matching, skills training, career coaching, or general enquiries.',
    url: 'https://www.averraknowledgeacademy.com/contact',
  },
}

export default function ContactPage() {
  return <ContactClient />
}