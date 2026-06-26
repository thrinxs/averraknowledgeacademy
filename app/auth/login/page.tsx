import type { Metadata } from 'next'
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
      <LoginForm />
    </AuthPageShell>
  )
}