import type { Metadata } from 'next'
import { Suspense } from 'react'
import AuthPageShell from '@/components/auth/AuthPageShell'
import VerifyEmailContent from '@/components/auth/VerifyEmailContent'

export const metadata: Metadata = {
  title: 'Verify Email | Averra Knowledge Academy',
  description:
    'Verify your email address to activate your Averra Knowledge Academy account.',
}

export default function VerifyEmailPage() {
  return (
    <AuthPageShell
      title="Check Your Inbox"
      description="We've sent a verification email to your address. Open it and click the confirmation link to activate your account."
      footerText="Already verified?"
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
        <VerifyEmailContent />
      </Suspense>
    </AuthPageShell>
  )
}