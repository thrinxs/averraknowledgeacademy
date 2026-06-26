import type { Metadata } from 'next'
import AuthPageShell from '@/components/auth/AuthPageShell'
import SignupForm from '@/components/auth/SignupForm'

export const metadata: Metadata = {
  title: 'Sign Up | Averra Knowledge Academy',
  description:
    'Create your Averra Knowledge Academy account.',
}

export default function SignupPage() {
  return (
    <AuthPageShell
      title="Create Your Account"
      description="Sign up to access scholarship support, skills training, career growth opportunities, and your personalised dashboard."
      footerText="Already have an account?"
      footerLinkText="Log in"
      footerLinkHref="/auth/login"
    >
      <SignupForm />
    </AuthPageShell>
  )
}