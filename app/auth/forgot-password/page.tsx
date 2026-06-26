import type { Metadata } from 'next'
import AuthPageShell from '@/components/auth/AuthPageShell'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Forgot Password | Averra Knowledge Academy',
  description:
    'Request a password reset link for your Averra Knowledge Academy account.',
}

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell
      title="Forgot Your Password?"
      description="Enter your email address and we'll send you a secure link to reset your password."
      footerText="Remember your password?"
      footerLinkText="Log in"
      footerLinkHref="/auth/login"
    >
      <ForgotPasswordForm />
    </AuthPageShell>
  )
}