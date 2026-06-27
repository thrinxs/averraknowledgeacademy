import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact Us | Averra Knowledge Academy',
  description:
    'Get in touch with the Averra Knowledge Academy team. ' +
    'We are here to help with scholarships, learning, careers, and more.',
}

export default function ContactPage() {
  return <ContactClient />
}