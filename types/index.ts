export type AccountType = 'student' | 'affiliate' | 'admin'

export type Profile = {
  id: string
  full_name: string
  email: string
  phone: string
  whatsapp: string
  date_of_birth: string
  gender: string
  country: string
  state_city: string
  account_type: AccountType
  avatar_url: string
  created_at: string
  updated_at: string
}

export type AcademicBackground = {
  id: string
  user_id: string
  education_level: string
  field_of_study: string
  institution: string
  graduation_year: string
  cgpa: string
  has_ielts: boolean
  ielts_score: string
  has_toefl: boolean
  toefl_score: string
  has_gre: boolean
  gre_score: string
  has_gmat: boolean
  gmat_score: string
  has_publications: boolean
  has_work_experience: boolean
  work_experience_years: string
}

export type ScholarshipPreference = {
  id: string
  user_id: string
  preferred_countries: string[]
  scholarship_type: string
  start_date: string
  degree_level: string
  field_abroad: string
  specific_course: string
  reason: string
  special_circumstances: string[]
}

export type ServicePackage = {
  id: string
  user_id: string
  package_type: 'basic' | 'standard' | 'premium'
  amount: number
  payment_status: 'pending' | 'confirmed' | 'failed'
  paystack_reference: string
  paid_at: string
}

export type Scholarship = {
  id: string
  name: string
  university: string
  country: string
  level: string[]
  fields: string[]
  funding_type: string
  covers: string[]
  deadline: string
  link: string
  description: string
  requires_ielts: boolean
  min_cgpa: string
  requires_work_experience: boolean
  source_url: string
  last_updated: string
  is_active: boolean
}

export type ScholarshipMatch = {
  id: string
  user_id: string
  scholarship_id: string
  match_score: number
  status: string
  is_verified: boolean
  verified_at: string
  scholarship?: Scholarship
}

export type Notification = {
  id: string
  user_id: string
  type: 'new' | 'action' | 'info' | 'completed' | 'payment' | 'course' | 'announcement'
  title: string
  message: string
  is_read: boolean
  link: string
  created_at: string
}

export type Message = {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  is_read: boolean
  created_at: string
}

export type Affiliate = {
  id: string
  user_id: string
  referral_code: string
  referral_link: string
  bank_name: string
  account_number: string
  account_name: string
  total_referrals: number
  total_earnings: number
  total_paid: number
  is_active: boolean
}

export type Commission = {
  id: string
  affiliate_id: string
  client_id: string
  package_type: string
  amount: number
  commission_amount: number
  status: 'pending' | 'confirmed' | 'paid'
  paid_at: string
  created_at: string
}

export type Course = {
  id: string
  title: string
  description: string
  duration: string
  level: string
  price: number
  image_url: string
  is_active: boolean
}

export type PackagePrice = {
  basic: number
  standard: number
  premium: number
}

export const PACKAGE_PRICES: PackagePrice = {
  basic: 30000,
  standard: 50000,
  premium: 150000,
}

export const COMMISSION_RATE = 0.1