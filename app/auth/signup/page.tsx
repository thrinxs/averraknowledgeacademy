import type { Metadata } from 'next'
import { Suspense } from 'react'
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
      <Suspense fallback={
        <div className="flex items-center justify-center py-12">
          <div
            className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{ borderColor: '#062850', borderTopColor: 'transparent' }}
          />
        </div>
      }>
        <SignupForm />
      </Suspense>
    </AuthPageShell>
  )
}