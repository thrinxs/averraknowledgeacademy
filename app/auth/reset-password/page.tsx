import type { Metadata } from 'next'
import { Suspense } from 'react'
import AuthPageShell from '@/components/auth/AuthPageShell'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Reset Password | Averra Knowledge Academy',
  description:
    'Set a new password for your Averra Knowledge Academy account.',
}

export default function ResetPasswordPage() {
  return (
    <AuthPageShell
      title="Reset Your Password"
      description="Create a new password for your account. Make sure it is strong and secure."
      footerText="Back to"
      footerLinkText="Login"
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
        <ResetPasswordForm />
      </Suspense>
    </AuthPageShell>
  )
}