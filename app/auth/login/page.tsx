import type { Metadata } from 'next'
import { Suspense } from 'react'
import AuthPageShell from '@/components/auth/AuthPageShell'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Login | Averra Knowledge Academy',
  description:
    'Log in to your Averra Knowledge Academy account.',
}

export default function LoginPage() {
  return (
    <AuthPageShell
      title="Welcome Back"
      description="Log in to continue your scholarship journey, access your dashboard, and manage your academic progress."
      footerText="Don't have an account?"
      footerLinkText="Create one"
      footerLinkHref="/auth/signup"
    >
      <Suspense fallback={
        <div className="flex items-center justify-center py-12">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#062850', borderTopColor: 'transparent' }}
          />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </AuthPageShell>
  )
}