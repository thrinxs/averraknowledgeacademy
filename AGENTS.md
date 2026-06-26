<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Averra Knowledge Academy — Project Guide for AI Agents

## Project Overview

Averra Knowledge Academy is **Africa's complete academic success platform**.

The platform is **one unified brand** that offers multiple services under a single roof so users never get confused about whether the page or service they are using is still under Averra Knowledge Academy.

The platform is **not exclusively for Africans**. It is built for students and professionals worldwide. All copy and UI must reflect global accessibility.

The platform combines:

- scholarship matching service for students who want to study abroad
- practical skills trainings
- career trainings and coaching (CTC)
- a future digital academy (Averra Academy — Smarter Than Einstein)
- a future settlement assistance, degree programs, and trainings system
- affiliate system
- trainer system
- scholarship statistics blog

The brand name on every page is always:
**Averra Knowledge Academy**

Subdomains may be used later, but every subdomain still belongs to Averra Knowledge Academy.

## Vision

To build one of Africa's most effective digital academic success platforms — combining:

- scholarship matching and study abroad assistance
- practical skills trainings
- career coaching and industrial training
- structured academic learning for secondary, university, and exam candidates
- earning opportunities through affiliates and trainers

## Core Tech Stack

| Layer           | Technology                                                     |
| --------------- | -------------------------------------------------------------- |
| Framework       | Next.js 16 + App Router + TypeScript                           |
| Styling         | Tailwind CSS                                                   |
| UI Components   | shadcn/ui                                                      |
| Icons           | Lucide React (+ inline SVG for brand logos)                    |
| Font            | Geist                                                          |
| Database        | Supabase PostgreSQL                                            |
| Auth            | Supabase Auth                                                  |
| Storage         | Supabase Storage                                               |
| Realtime        | Supabase Realtime                                              |
| Forms           | React Hook Form + Zod                                          |
| State           | Zustand                                                        |
| Payments        | Paystack                                                       |
| Emails          | Resend                                                         |
| Video Hosting   | YouTube (Phase 1) → Bunny Stream / Cloudflare Stream (Phase 2) |
| Hosting         | Vercel                                                         |
| Version Control | GitHub                                                         |

## Brand Information

### Brand Name

Averra Knowledge Academy

### Contact

- Email: info@averraknowledgeacademy.com
- Phone: +2349033440966
- WhatsApp: +2349033440966

### Footer Credit

Use:
Built by Thrinxs

Thrinxs should link to:
https://www.thrinxs.com.ng

Do not use:

- "Built with ❤️ by Thrinxs"
- any heart icon in the footer credit

### Copyright

Always render the year dynamically:

const currentYear = new Date().getFullYear()

Never hardcode the year.

## Brand Colors

Always use these exact colors:

- #062850 — Deep Navy Blue (main primary color)
- #1D4469 — Slate Blue
- #325E84 — Secondary Blue
- #497296 — Primary Medium Blue
- #033B6A — Dark Accent Blue
- #97C3E0 — Light Blue for contrast on dark sections

### Color Usage Rules

- #062850 is the main brand color
- header text should use the darkest brand shade
- footer background should always use #062850
- accents, badges, icons, highlights can use #497296 and #325E84
- avoid random Tailwind blue classes like bg-blue-600 for branded sections
- prefer inline styles for brand colors when precision matters

Example:
style={{ backgroundColor: '#062850' }}
style={{ color: '#497296' }}

## Subdomain Strategy

The website is being built as **one Next.js project with routes** in Phase 1.

Later, each major service may be split into its own subdomain for cleaner auth and structure:

averraknowledgeacademy.com → main site
scholarships.averraknowledgeacademy.com → scholarship service
skills.averraknowledgeacademy.com → skills courses
careers.averraknowledgeacademy.com → career trainings
academy.averraknowledgeacademy.com → Averra Academy (Smarter Than Einstein)

For now (Phase 1), use route folders:

/scholarship
/skills
/careers
/academy
/earn
/blog
/about

## Important Next.js Rules

### 1. 'use client' must always be first

If a component uses:

- useState
- useEffect
- event handlers like onClick
- browser APIs

then 'use client' must be the absolute first line of the file. Nothing can come before it — not even imports.

Correct:
'use client'
import { useState } from 'react'

Wrong:
import { useState } from 'react'
'use client'

### 2. Internal navigation

Always use next/link for internal links.

### 3. Images

Always use next/image for images.

When styling image size with CSS classes, avoid aspect ratio warnings by using h-auto or matching width and height classes properly.

### 4. Buttons

Use shadcn Button component for buttons.

### 5. App Router

This project uses the Next.js App Router, not Pages Router.

### 6. Brand Icons (Facebook, Instagram, etc.)

lucide-react no longer exports brand logos like Facebook, Instagram, Twitter, TikTok, LinkedIn, YouTube.

For brand logos always use **inline SVG** instead of importing from lucide-react.

### 7. Hydration Safety

Never use if (typeof window !== 'undefined') inside component render logic or useState initialisers.

Instead, use a mounted state pattern:

const [mounted, setMounted] = useState(false)
useEffect(() => { setMounted(true) }, [])
if (!mounted) return null

Always declare mounted as the **FIRST** useState in the component so the early return never breaks hook order.

### 8. No Early Returns Before All Hooks

Never return early before all hooks have been called. All useState, useEffect, useCallback, useMemo calls must appear before any conditional return statement.

### 9. No Duplicate Imports

Never import the same identifier twice from the same module. Always merge into a single import line.

Correct:
import { useState, useEffect } from 'react'

Wrong:
import { useState } from 'react'
import { useEffect, useState } from 'react'

## Project Structure

averra-knowledge-academy/
├── app/
│ ├── layout.tsx
│ ├── page.tsx
│ ├── globals.css
│ ├── terms/
│ │ └── page.tsx
│ ├── privacy/
│ │ └── page.tsx
│ ├── auth/
│ │ ├── login/page.tsx
│ │ ├── signup/page.tsx
│ │ ├── verify-email/page.tsx
│ │ ├── forgot-password/page.tsx
│ │ ├── reset-password/page.tsx
│ │ └── callback/route.ts
│ ├── dashboard/
│ │ ├── layout.tsx
│ │ ├── page.tsx
│ │ ├── scholarship/page.tsx
│ │ ├── matches/page.tsx
│ │ ├── notifications/page.tsx
│ │ ├── messages/page.tsx
│ │ └── profile/page.tsx
│ ├── admin/dashboard/page.tsx
│ ├── staff/dashboard/page.tsx
│ ├── affiliate/dashboard/page.tsx
│ ├── trainer/dashboard/page.tsx
│ ├── scholarship/
│ │ ├── page.tsx
│ │ └── apply/page.tsx
│ ├── skills/
│ ├── careers/
│ ├── academy/
│ ├── earn/
│ ├── blog/
│ ├── about/
│ └── api/
│ ├── promo/validate/route.ts
│ ├── scholarship/
│ │ ├── register/route.ts
│ │ └── save-preferences/route.ts
│ └── paystack/
│ ├── initialize/route.ts
│ ├── callback/route.ts
│ └── webhook/route.ts
├── components/
│ ├── ui/
│ ├── layout/
│ │ ├── Navbar.tsx
│ │ └── Footer.tsx
│ ├── auth/
│ │ ├── AuthPageShell.tsx
│ │ ├── LoginForm.tsx
│ │ ├── SignupForm.tsx
│ │ ├── ForgotPasswordForm.tsx
│ │ ├── ResetPasswordForm.tsx
│ │ ├── VerifyEmailContent.tsx
│ │ └── RedirectOverlay.tsx
│ ├── homepage/
│ │ ├── HeroSection.tsx
│ │ ├── ScholarshipLogos.tsx
│ │ ├── ServicesOverviewSection.tsx
│ │ ├── ScholarshipSection.tsx
│ │ ├── CoursesSection.tsx
│ │ ├── CareersSection.tsx
│ │ ├── AcademyTeaserSection.tsx
│ │ ├── TestimonialsSection.tsx (hidden — returns null until real testimonials exist)
│ │ └── EarnWithAverraSection.tsx
│ ├── scholarship/
│ │ ├── ScholarshipPageHero.tsx
│ │ ├── WhatIsThisService.tsx
│ │ ├── HowItWorksDetailed.tsx
│ │ ├── ScholarshipPricing.tsx
│ │ ├── WhatYouWillReceive.tsx
│ │ ├── ScholarshipFAQ.tsx
│ │ ├── ScholarshipFinalCTA.tsx
│ │ └── form/
│ │ ├── FormShell.tsx
│ │ ├── ProgressBar.tsx
│ │ ├── FormNavigation.tsx
│ │ ├── CountryMap.tsx
│ │ └── steps/
│ │ ├── Step1BasicInfo.tsx
│ │ ├── Step2AcademicBackground.tsx
│ │ ├── Step3CountryPreferences.tsx
│ │ ├── Step4CoursePreferences.tsx
│ │ └── Step5AccountCreation.tsx
│ ├── dashboard/
│ │ ├── DashboardSidebar.tsx
│ │ ├── DashboardHome.tsx
│ │ ├── ScholarshipStatus.tsx
│ │ ├── MatchesList.tsx
│ │ └── ProfileEditor.tsx
│ └── forms/
├── lib/
│ ├── supabase.ts
│ └── supabase-server.ts
├── utils/
│ ├── auth.ts
│ └── helpers.ts
├── types/
│ └── index.ts
└── public/
├── logo.png (header logo, full color)
├── footer-logo.png (footer logo, white fill version)
└── favicon.svg

## Environment Variables

Current required environment variables:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PAYSTACK_PUBLIC_KEY=
PAYSTACK_SECRET_KEY=

Later expected:

RESEND_API_KEY=
GOOGLE_CUSTOM_SEARCH_API_KEY=
GOOGLE_SEARCH_ENGINE_ID=

## Database Tables

All tables have RLS enabled.

### Original 14 Tables

- profiles
- academic_backgrounds
- scholarship_preferences
- service_packages
- scholarships
- scholarship_matches
- notifications
- messages
- documents
- affiliates
- commissions
- courses
- enrollments
- blog_stats

### profiles Table — Updated Columns

- id (uuid)
- full_name (text)
- email (text)
- phone (text)
- whatsapp (text)
- date_of_birth (date)
- gender (text)
- country (text)
- state_city (text)
- role (text) — values: student, admin, staff, affiliate, trainer — default: student
- avatar_url (text)
- email_verified (boolean) — default: false
- created_at, updated_at

### academic_backgrounds Table — Updated Columns

- id, user_id
- education_level, field_of_study
- institution, institution_accredited (boolean)
- graduation_year, cgpa, grading_scale
- test_scores (JSONB array of {name, score} objects)
- publications (text, optional)
- work_experience (text, optional)
- work_experience_years (text, optional)

### scholarship_preferences Table — Updated Columns

- id, user_id
- preferred_countries (array)
- scholarship_type
- start_date, preferred_start_date
- degree_level, field_abroad, specific_course
- reason (text), reason_for_studying (text)
- special_circumstances (array)
- selected_package
- promo_code, referral_code
- final_price (numeric)
- payment_status (text) — values: unpaid, pending, paid, failed — default: unpaid
- email_updates (boolean)

### scholarships Table — Updated Columns

- id, name, university, country
- level (array), fields (array)
- funding_type, covers (array)
- deadline, link, description
- requires_ielts (boolean), min_cgpa (text)
- eligibility_summary (text)
- required_documents (text array)
- application_steps (text array)
- language_requirements (text)
- duration (text)
- num_awards (text)
- institution_type (text)
- eligible_nationalities (text array)
- contact_email (text)
- is_active (boolean), source_url, last_updated

### scholarship_matches Table — Updated Columns

- id, user_id, scholarship_id
- match_score (integer)
- status (text)
- is_verified (boolean)
- verified_at, verified_by (uuid)
- match_reason (text)
- admin_notes (text)
- viewed (boolean) — default: false
- viewed_at (timestamp)
- created_at

### Promo Codes Table

promo_codes:

- code (unique string)
- description
- discount_type: percentage or fixed
- discount_value (numeric)
- applicable_packages (text array)
- max_uses (integer, optional — null means unlimited)
- times_used (integer) — default: 0
- is_active (boolean) — default: true
- expires_at (timestamp, optional)
- created_at, updated_at

Validated server-side via /api/promo/validate
RPC function: increment_promo_usage(promo_code_value TEXT) increments times_used

### Trainer Earnings Tables

- lesson_views — tracks minutes watched per user per lesson per day for subscription revenue attribution
- trainer_monthly_earnings — monthly rollup of subscription earnings per trainer based on minutes-watched attribution
- trainer_course_earnings — fixed-price course earnings per sale (60% trainer, 40% Averra)
- trainer_session_earnings — live session earnings per session (65% trainer, 35% Averra)

More tables will be added later for skills, careers (CTC), academy subscriptions, video lessons, tests, live classes, etc.

---

# THE 4 CORE SERVICES OF AVERRA

The website is structured around **4 core services**, all under one brand.

## SERVICE 1 — Scholarships (LIVE)

The flagship service. Already in development.

### Scholarship Service Packages

All 3 tiers provide exactly **5 scholarship matches**.

#### Basic — ₦30,000

- 5 Scholarship Matches
- Detailed Match Report
- Country and Deadline Info
- Eligibility Breakdown

#### Standard — ₦50,000

- 5 Scholarship Matches
- Detailed Match Report
- SOP Review and Modification
- CV Review and Modification
- Application Guidance

#### Premium — ₦150,000

- 5 Scholarship Matches
- Everything in Standard
- Profile Boosting Coaching
- Interview Preparation
- WhatsApp Advisor Access
- Priority Support

The difference between packages is **NOT the number of matches**.
Each package gets exactly 5 matches.
The difference is the level of support and preparation.

### Scholarship Delivery Rules

- Matches are **automatically delivered in less than 1 hour** after payment is confirmed
- Manual verification by the Averra team is completed **within 24 hours**
- If scholarships in the user's preferred countries are not available due to their academic profile, the system will provide matches in **other suitable countries** — the user always receives 5 quality options
- **No refunds** are offered once payment is made

### Study Abroad Add-ons (later expansion)

- Research on fully funded scholarships — $50
- Admission aids — $50
- Guidance on applications and paperwork — $30
- Total cost calculations — $10

Settlement assistance:

- Search for rent (shared or single) — $50
- House stuff procurement (service fee + logistics) — $1,000
- Tour round city and school — $100
- Phone number, ID, bank account assistance — $50
- Part-time job search assistance — $50
- Language, culture, clothing, weather, food, laws training — $200
- Financial aid application guidance — $30

## SERVICE 2 — Skills (LIVE)

Practical, certificate-based skills trainings.

### Minimum Course Price

₦3,000 — no course on the platform may be priced below this.

### Course Pricing

Averra sets all course prices. Trainers do not set their own prices.

### Currently Launching

- Typing Mastery (2 weeks, Beginner → Intermediate)
- Basic Practical Computer Skills (4 weeks, Beginner) — full hands-on training for people with little or no computer experience, including Microsoft Word and essential software
- Website Building — No Code (5 weeks, Beginner → Intermediate) — using WordPress, Wix, Google Sites
- Website Building — With Code (6 weeks, Beginner → Intermediate) — HTML, CSS, JavaScript
- Website Building — AI-Powered (4 weeks, Beginner → Intermediate) — using AI tools to generate and deploy professional websites
- Web Hosting & Domain Management (2 weeks, Beginner) — domain purchase, DNS management, hosting setup

### Future Skills

- Digital Skills Trainings
- Craft Trainings
- Trending skills
- Trending jobs
- University courses for high-demand jobs

High-demand university course tracks (future content reference):

- Data Analyst / Data Scientist (Python, R, SQL, Excel, Power BI, ML)
- Software Developer / Engineer (JavaScript, Python, Java, React, Node, Git, Agile)
- Mobile App Developer (Flutter, React Native, Kotlin, Swift, UX)

### Subscription vs Fixed Price

Some courses will be available to platform subscribers. Some will have a fixed price. This is determined per course by Averra.

### Trainer Revenue Share (PRIVATE — never shown publicly)

| Course Type           | Trainer Share | Averra Share |
| --------------------- | ------------- | ------------ |
| Fixed-price course    | 60%           | 40%          |
| Subscription content  | 50%           | 50%          |
| Live training session | 65%           | 35%          |

Subscription attribution uses **minutes-watched** per trainer per month.

Public-facing copy should say:
"Earn a competitive share of every course and training fee you deliver."

## SERVICE 3 — Careers (CTC) (LIVE)

Career Trainings and Coaching programs.

### Career Test — ₦150,000

- Purpose: help applicants gain exposure in certain careers, understand what it takes, and choose a career they will love and be efficient in.
- Duration: 2 weeks

### Industrial Training — ₦350,000

- Purpose: help applicants who have undergone training or graduated to gain real practical experience in their field.
- Duration: 3 months

### Career Switch — ₦500,000

- Purpose: help applicants from a different career gain the skills and experience required to switch fields and practice depending on the laws and field.
- Duration: 6 months

### Related Career Add-ons

- Adult lessons
- Language, accent, culture training
- Logistics
- Physical tours
- Accommodations

## SERVICE 4 — Averra Academy (COMING SOON)

"Smarter Than Einstein" — a digital academic learning ecosystem.

### About "Smarter Than Einstein"

"Smarter Than Einstein" is a **book written by Josh Gold**, currently under review by two university professors ahead of publication. The Averra Academy learning system is built on its principles. Other books by the author can be found at https://www.drjoshtherapycentre.com.ng/library

When this phrase is displayed on the website, hovering on it should show a tooltip explaining this.

### Mission

To simplify learning and help students truly understand academic subjects rather than memorize information.

### Long-term Goal

A leading African edtech platform that combines:

- Curriculum-based teaching
- AI-assisted learning systems
- Diagnostic assessments
- Live teaching
- Structured academic progress tracking
- Exam preparation systems
- Personalized learning paths

### Target Audience (Global)

The Academy is built for students worldwide — not exclusively Nigeria or Africa.

High school students (including but not limited to SS1–SS3):

- WAEC, NECO, JAMB candidates (Nigeria)
- GCSE, A-Level candidates (UK)
- SAT candidates (US)
- IB candidates (International)
- Any national or international examination candidates

University-level students:

- Undergraduates
- Master's students
- PhD scholars

Parents seeking:

- better academic performance
- structured learning support
- affordable tutoring alternatives
- performance tracking

### Platform Components

YouTube funnel:

- short summaries, simplified explanations, difficult concept breakdowns, revision lessons, exam tips, problem-solving videos, educational shorts
- CTA always directs to full lessons on Averra Knowledge Academy

Website platform sections:

- Homepage
- Subjects section (by class, subject, textbook, exam)
- Student dashboard (enrolled subjects, progress, tests, assignments, live classes, performance reports, certificates)
- Teacher dashboard (upload lessons, create tests, grade assignments, manage live classes, student analytics)
- Testing and assessment system (classwork, assignments, weekly tests, monthly tests, exams, progress analytics)
- Live class system (Zoom integration or internal streaming, attendance, Q&A, homework discussions)

Educational content strategy:

- Textbook-based teaching using standard textbooks per subject
- Chapter-by-chapter explanations, practice questions, revision materials

Lesson structure must include:

1. Topic Introduction (learning objective, why it matters, real-world relevance)
2. Simplified Explanation (analogies, visuals, diagrams)
3. Classwork (quick questions, mini exercises)
4. Assignment (homework, application-based exercises)
5. Revision Summary (key points, definitions, formulas, memory tricks)
6. Quiz / Test (MCQs, theory, timed assessments)

Diagnostic learning system — "Smarter Than Einstein":

- Step 1: Initial assessment (subject evaluation, comprehension test, learning speed, strength/weakness)
- Step 2: Learning profile generation
- Step 3: Guided learning path
- Step 4: Continuous evaluation

Assessment system:

- Daily classwork
- Assignments
- Weekly tests
- Monthly tests
- Full simulated exams (WAEC/JAMB style, CBT practice, timed environment)

### Academy Subscription Tiers

1. Free Tier (Freemium)
   - Limited video access, ad-supported, intro lessons, educational shorts
2. Basic — ₦1,500/month
   - Full prerecorded lessons, subject library, video streaming, notes and summaries
3. Standard — ₦4,000/month
   - Everything in Basic + tests, quizzes, assignments, progress tracking, weekend tests, monthly tests, performance reports
4. Premium Live Class — ₦10,000/month
   - Everything in Standard + live classes, Q&A, teacher support, group revision classes
5. Elite Diagnostic Program — ₦35,000/month
   - Everything in Premium + full diagnostic assessment, personalized learning plan, "Smarter Than Einstein" strategy system, coaching, advanced performance tracking, deep weakness analysis

### Monetization Strategy

- Subscriptions
- Video advertising (free tier)
- Live classes
- Exam bootcamps
- School partnerships
- Sponsored educational content
- Digital study materials (PDFs, notes, revision packs, CBT prep materials)

### Video Infrastructure Strategy

**Phase 1 (Now → 6 months):**

- Use YouTube Unlisted videos embedded behind authentication
- Cost: ₦0
- Acceptable for skills courses and free content

**Phase 2 (When Academy launches with paid subscriptions):**

- Move to Bunny Stream or Cloudflare Stream
- Provides DRM protection, professional player, global CDN

**Never** attempt to build a custom video infrastructure from scratch.

### Diagnostic + Gamification

Future gamification:

- Badges
- Achievement levels
- Study streaks
- Leaderboards
- Completion rewards
- Academic rankings

### Competitive Advantages (Academy)

1. Structured curriculum (not random YouTube)
2. Textbook-based learning (familiar to students)
3. African curriculum focus (localized relevance)
4. Live classes (human interaction)
5. Diagnostic system (personalized learning)
6. Full academic ecosystem (videos + tests + assignments + analytics)

### Phased Academy Launch

- Phase 1 MVP: WAEC/JAMB science subjects — Biology, Chemistry, Physics, Mathematics + website, video system, basic tests, subscription system
- Phase 2: Live classes, diagnostics, progress analytics, parent reports
- Phase 3: Arts subjects, commercial subjects, university courses, mobile app, AI learning assistant

### Brand Personality (Academy)

Intelligent, structured, professional, student-friendly, modern, academic, motivational.

Suggested brand positioning:

- "A smarter way to truly understand your subjects."
- Alternative: "Learn better. Understand deeper. Perform higher."

---

# CROSS-CUTTING SYSTEMS

## Earn With Us

Two ways to earn under one Averra "Earn With Us" page:

### Affiliate System

Affiliate account flow:

- affiliate creates an account
- affiliate gets unique referral link
- affiliate gets unique referral code
- any client who visits through the link and pays counts as referral
- any client who enters referral code during registration and pays counts as referral

Commission:

- 10% of payment

Examples:

- Basic ₦30,000 → ₦3,000 commission
- Standard ₦50,000 → ₦5,000 commission
- Premium ₦150,000 → ₦15,000 commission

Affiliate dashboard should show:

- total referrals
- total earnings
- total paid
- pending payout
- referral code
- referral link
- commission history
- bank details

Payout schedule:

- monthly

### Trainer System

Trainer account flow:

- trainer signs up
- trainer can be approved by admin
- trainer delivers courses
- trainer earns a competitive share of every course and training fee

Revenue share by course type (PRIVATE — shown only to approved trainers):

| Course Type           | Trainer Share | Averra Share |
| --------------------- | ------------- | ------------ |
| Fixed-price course    | 60%           | 40%          |
| Subscription content  | 50%           | 50%          |
| Live training session | 65%           | 35%          |

Subscription revenue is attributed using **minutes-watched per trainer per month**.

Public-facing copy must NOT show specific percentages. Use:
"Earn a competitive share of every course and training fee you deliver. Full details provided when you apply."

Course prices are set by **Averra**, not trainers.
Minimum course price: **₦3,000**
Payout schedule: **monthly**

## Auth System

User roles: student, admin, staff, affiliate, trainer

Role-based dashboard routing via getDashboardRouteByRole() in utils/auth.ts:

- student → /dashboard
- admin → /admin/dashboard
- staff → /staff/dashboard
- affiliate → /affiliate/dashboard
- trainer → /trainer/dashboard

Supabase trigger (handle_new_user) auto-creates a profiles row on every new signup.

After successful login or auto-login after signup:

- RedirectOverlay appears full screen
- 10-second countdown with progress bar
- "Go to Dashboard Now" — immediate redirect
- "Continue From Where You Stopped" — window.history.back()
- Auto-redirects to dashboard at 0 if no action

Login and signup links in Navbar pass ?from=currentPathname so overlay knows where to send user back.

FormShell re-checks auth state on:

- mount (checkUser)
- visibilitychange event
- window focus event
- supabase.auth.onAuthStateChange

Email templates are custom-branded with Averra colors, gradient header, logo, and footer.
SMTP is configured in Supabase via Resend using averraknowledgeacademy.com domain.

## Navbar Behaviour

- Returns null on all dashboard routes (dashboard has its own sidebar)
- Checks auth state via supabase.auth.getSession() on mount
- Shows "My Dashboard" button when user is logged in
- Shows Login + Get Started when logged out
- Login link passes ?from=currentPathname
- Active nav item highlighted with underline + darker color
- Mobile active item has blue background

## Footer Behaviour

- Returns null on all dashboard routes
- Uses usePathname to detect dashboard routes
- Must have 'use client' directive

## Dashboard Layout

- Sidebar: fixed left, 64px wide on desktop, #062850 navy background
- Sidebar collapses to hamburger overlay on mobile
- "Back to Website" uses <a href="/"> not <Link> — ensures full page reload and session persistence
- Main content area: flex-1, #F0F6FB background, lg:ml-64

## Dashboard Pages

- /dashboard — DashboardHome with status banners (awaiting payment / matching / matches ready / no application), stats grid, quick action cards
- /dashboard/scholarship — ScholarshipStatus with PayNowButton, package details, preferences summary, academic summary
- /dashboard/matches — MatchesList with expandable cards showing full scholarship details
- /dashboard/notifications — placeholder
- /dashboard/messages — placeholder
- /dashboard/profile — ProfileEditor (editable name, phone, whatsapp, gender, country, state/city)
- /admin/dashboard — shell (full admin tools being built)
- /staff/dashboard — shell
- /affiliate/dashboard — shell
- /trainer/dashboard — shell

## PayNowButton

Internal component inside ScholarshipStatus.tsx.
Receives userId and amount as props.
ScholarshipStatus receives userId prop from its page (app/dashboard/scholarship/page.tsx passes user.id).
Calls POST /api/paystack/initialize with {userId}.
Shows "Connecting..." spinner while loading.
On success: redirects to authorization_url from Paystack.
On failure: shows error message below button.

## Paystack Integration

### /api/paystack/initialize

- Fetches user profile and scholarship preferences from Supabase
- Validates payment status is not already paid
- Calculates amount in kobo (naira × 100)
- Uses final_price from scholarship_preferences if available (accounts for promo discount)
- Creates Paystack transaction with reference: AVR-{userId.slice(0,8)}-{timestamp}
- Sets callback_url dynamically from request origin
- Updates payment_status to 'pending'
- Returns authorization_url

### /api/paystack/callback

- Reads reference from query params
- Verifies payment with Paystack API
- If failed: updates payment_status to 'failed', redirects to /dashboard?payment=failed
- If success: updates payment_status to 'paid', creates notification, creates message, credits affiliate commission if referral_code used, redirects to /dashboard?payment=success

### /api/paystack/webhook

- Verifies HMAC SHA-512 signature
- Handles charge.success event
- Checks if already processed before updating
- Backup in case callback redirect fails

## Promo Code System

- Admin creates promo codes in the admin panel (to be built)
- Each promo code has: code, description, discount_type (percentage or fixed), discount_value, applicable_packages, max_uses, times_used, is_active, expires_at
- Validated via /api/promo/validate (server-side only)
- Invalid, expired, or usage-exceeded codes rejected with clear error messages
- Applied promo shows discount and final price in order summary
- Discounted final_price stored in scholarship_preferences and sent to Paystack
- increment_promo_usage RPC called after successful registration

## Scholarship User Flow

1. User lands on homepage
2. User clicks scholarship service section
3. User goes to /scholarship info page
4. User reads: how it works, fees, procedures, FAQ
5. User clicks "Get Started" or a package CTA
6. User goes to /scholarship/apply?package=basic|standard|premium
7. User fills a multi-step form, one section at a time
8. On Step 5, package is pre-selected from URL param but changeable
9. User can apply a promo code for a discount

If new user: 10. User creates account (password + agreements) 11. Account created → redirected to verify email page 12. User verifies email → redirected to /dashboard 13. Dashboard shows "Pay Now" button 14. User clicks Pay Now → Paystack payment page 15. Payment confirmed → payment_status = 'paid'

If logged-in user: 10. Step 5 shows "Review & Pay" (no password or terms fields) 11. User chooses: Pay Now or Save to Dashboard 12. If Pay Now: data saved then immediately redirected to Paystack 13. If Save to Dashboard: data saved, redirected to /dashboard/scholarship, pays later

After payment: 14. Matching algorithm runs automatically — delivers matches in under 1 hour 15. User receives notification + message + email: - "your scholarship matches are ready" - "our team is manually verifying the information" - "please hold on while we confirm all details" - "manual verification usually takes up to 24 hours" 16. Admin manually reviews the matches within 24 hours 17. User receives a second notification + message + email: - "your matches have been verified" - "they are active and suitable for your profile" - "proceed with confidence" - "support will begin based on your selected package" 18. Support / coaching begins based on package chosen

## Multi-Step Scholarship Form — Current Implementation

### Section 1 — Basic Information

- full name
- email
- phone
- WhatsApp (defaults to same as phone number with toggle to change)
- date of birth
- gender
- country
- state/city

### Section 2 — Academic Background

- highest education level
- field of study
- institution (searchable autocomplete against NUC accredited universities list — non-accredited institutions show amber warning but user can still proceed)
- graduation year
- CGPA + grading scale (auto-calculates degree classification: First Class, Second Class Upper, Second Class Lower, Third Class, Pass)
- test scores (flexible system — searchable dropdown of internationally accepted tests grouped by Language Proficiency and Graduate Admission categories, user adds test name + score, can add multiple, custom option available)
- publications (optional)
- work experience + years (optional)

### Section 3 — Country Preferences

- preferred countries (multi-select dropdown with search — 30 scholarship countries listed)
- Google Maps embed that centers on the last selected country
- country cards showing flag, country name, capital city, and landmark image (Unsplash)
- scholarship type (Fully Funded, Partially Funded, Tuition Only, Stipend Only, Any)
- preferred start date (dynamically generated from current date forward — no past dates shown, includes Flexible/Open option)

### Section 4 — Course / Field Preferences

- degree level (Undergraduate, Postgraduate Diploma, Master's, PhD, Short Course, Any)
- field of study abroad (searchable dropdown with 11 categories and 100+ fields, custom option)
- specific course (dynamic dropdown based on selected field, custom option)
- reason for studying abroad (clickable tag system with 3 categories):
  - Strong Reasons (green) — 10 options that scholarship committees love
  - Acceptable Reasons (yellow) — 7 options that are fine but not standout
  - Risky Reasons (red) — 5 options that may hurt applications
  - Smart recommendation box appears based on selections
  - Selected tags auto-populate an expandable textarea for the user to edit and add detail
- special circumstances (clickable tag system with 3 categories):
  - Highly Valued by Scholarship Committees (green) — 14 options
  - Relevant Circumstances (blue) — 12 options
  - Professional Strengths (purple) — 9 options
  - Smart recommendation box appears based on selections
  - Selected tags auto-populate an expandable textarea

### Section 5 — Account Creation (new user) or Review & Pay (logged-in user)

For new users:

- package selection (pre-selected from URL query param, changeable — shows original and discounted price if promo applied)
- promo code input (validates against Supabase via API, shows discount amount and savings, can be removed)
- order summary (package price, discount line if applicable, final total)
- password + confirm password (with show/hide toggle)
- referral code (optional)
- agree to Terms of Service (required — opens /terms in new tab)
- agree to Privacy Policy (required — opens /privacy in new tab)
- optional email updates checkbox
- no refund notice displayed
- "Create My Account" button disabled and grayed out until both Terms and Privacy are checked

For logged-in users:

- package selection + promo code + order summary (same as above)
- payment timing choice: "Pay now and get matched immediately" or "Save and pay later from my dashboard"
- logged-in user notice shown instead of password/terms
- button shows "Save & Pay Now" or "Save to Dashboard" depending on choice

### Form Behaviour

- progress saved to localStorage automatically after every change
- "✓ Progress saved" indicator appears briefly after each save
- on return visit, form restores from localStorage
- on successful submission, localStorage is cleared
- mounted guard prevents hydration mismatches
- FormShell detects login state via supabase.auth.getUser() on mount
- re-checks auth on visibilitychange, window focus, and onAuthStateChange
- canSubmit is true if user is logged in OR if both agreeTerms and agreePrivacy are checked

## Scholarship Matching System Rules

After payment confirmation:

1. system runs matching algorithm
2. it scans scholarship database
3. compares scholarships against user profile and preferences
4. ranks matches
5. saves best 5 matches to scholarship_matches

Then send first communication: in-app notification + internal message + email.

After admin verification (within 24 hours), send second communication: notification + message + email.

## Scholarship Data Update Rules

The system should update the scholarships database regularly.

Planned flow:

- scholarship search and update runs every Friday
- uses search keywords around scholarships, financial aid, fully funded opportunities, etc.
- fetches scholarship information from search results and university / scholarship websites
- stores new and updated records in Supabase

Important:

- do not assume scraped information is final truth
- admin/manual review is always part of the process

## Blog System Rules

The blog is not a traditional article blog only.

It must also support **scholarship statistics pages** driven from the scholarship database.

Blog / stats pages should cover:

- total scholarships by country
- total scholarships by course / field
- total scholarships by scholarship type
- total scholarships by degree level

Examples:

- Scholarships in Germany
- Scholarships in the United Kingdom
- Scholarships for Computer Science
- Fully Funded Scholarships
- Master's Scholarships

These should auto-update from the scholarship database.

---

# UI / UX DIRECTION

The design direction should feel like:

- edX
- Coursera

Characteristics:

- clean
- modern
- spacious
- professional
- strong typography
- card-based sections
- smooth hover interactions
- polished hamburger animation
- subtle motion and transitions
- "Coming Soon" services should still be visually represented on the website so visitors see the full Averra ecosystem

## Navbar Requirements

Navbar should:

- be sticky
- have a h-24 height to comfortably fit the bigger logo
- show the actual logo from public/logo.png
- logo sizing: w-20 h-20 on mobile, w-24 h-24 on sm: and up
- show the full name: Averra Knowledge Academy
- name text uses the darkest main brand shade #062850
- name text scales responsively: text-sm → text-base → text-lg → text-xl
- nav items: Scholarships | Skills | Careers | Academy | Earn With Us | Blog | About
- desktop menu visible from xl: breakpoint upwards
- hamburger menu shows below xl: with smooth animated transition
- hover underline on desktop menu items
- active nav item has underline + #062850 color
- Login + Get Started buttons on desktop when logged out
- "My Dashboard" button when logged in
- Get Started routes to /scholarship
- Login link passes ?from=currentPathname
- returns null on all dashboard routes

## Footer Requirements

Footer should:

- use dark navy background #062850
- show large logo from public/footer-logo.png
- logo sizing: w-20 h-20
- show the full brand name Averra Knowledge Academy in a single white color
- contain a short brand description
- include a **4-column links grid** styled like edX / Coursera:
  - Column 1 — Scholarships
  - Column 2 — Skills
  - Column 3 — Careers
  - Column 4 — Company (About Us, Averra Academy, Blog, Earn With Us, Contact Us, Privacy Policy, Terms of Service)
- include a **2-column section** below the links grid:
  - "Get In Touch" column with email, phone, WhatsApp (stacked vertically with icons)
  - "Follow Us" column with a short description and social icons
- social icons must use **inline SVG brand logos** (Facebook, Instagram, Twitter, TikTok, LinkedIn, YouTube), not lucide brand exports
- social icons should be circular buttons with hover effect (border + bg color change + scale)
- bottom bar:
  - left: dynamic copyright using new Date().getFullYear()
  - right: "Built by Thrinxs" with Thrinxs linking to https://www.thrinxs.com.ng
- returns null on all dashboard routes

## Homepage Structure

Homepage sections in order:

1. Hero Section — "Your Academic, Professional & Career Success — All In One Place" with service pill tags and realistic stats (50+ countries, 1,000+ universities, 500+ courses)
2. Scholarship Logos Strip — 20 countries with flags offering fully funded scholarships (not scholarship names)
3. Services Overview Section — 4 cards (Scholarships, Skills, Careers, Academy — Academy marked "Coming Soon"), globally inclusive copy
4. Scholarship Section — awareness copy about scholarships, 3-step how it works, pricing cards, stats
5. Courses / Skills Section — 6 course cards (Typing, Computer Skills, 3x Website Building, Web Hosting)
6. Careers (CTC) Section — Career Test, Industrial Training, Career Switch with updated descriptions
7. Averra Academy Teaser Section — "Coming Soon", Smarter Than Einstein tooltip, global audience labels, exam systems listed
8. Testimonials Section — currently hidden (returns null until real testimonials exist)
9. Earn With Averra Section — Affiliate (10% shown) + Trainer (no specific % shown publicly), light background (#F0F6FB)

## Legal Pages

- /terms — Terms of Service (built, standalone page)
- /privacy — Privacy Policy (built, standalone page)

Both pages:

- open in new tab when linked from the scholarship form
- are linked from the footer
- are standalone full pages, not modals
- use dynamic year for copyright

## Coming Soon Strategy

For services that are not yet live (e.g., Academy):

- they must still appear on the homepage so visitors see Averra's full ecosystem
- their dedicated pages should show a clean "Coming Soon" experience
- this maintains brand credibility and builds anticipation

---

# COMPLETED WORK

### Setup

- macOS dev environment
- Node.js, npm, Git, VS Code, extensions
- Next.js project at the correct folder
- GitHub + Vercel + domain assigned
- Supabase project + 14 original tables created with RLS enabled
- Additional tables: promo_codes, lesson_views, trainer_monthly_earnings, trainer_course_earnings, trainer_session_earnings
- profiles table updated: role, email_verified, avatar_url columns added
- academic_backgrounds table updated: grading_scale, institution_accredited, test_scores (JSONB), publications, work_experience columns added
- scholarship_preferences table updated: preferred_start_date, reason_for_studying, selected_package, promo_code, referral_code, final_price, payment_status, email_updates columns added
- scholarships table updated: eligibility_summary, required_documents, application_steps, language_requirements, duration, num_awards, institution_type, eligible_nationalities, contact_email columns added
- scholarship_matches table updated: admin_notes, verified_by, match_reason, viewed, viewed_at columns added
- increment_promo_usage RPC function created
- handle_new_user trigger created (auto-creates profile on signup)
- Project folder structure
- shadcn/ui setup
- TypeScript types
- Utility helpers
- Supabase client files (browser + server) — using @supabase/ssr
- utils/auth.ts — UserRole type + getDashboardRouteByRole function
- app/globals.css updated with scroll animation + fadeInUp keyframe
- app/layout.tsx updated with metadata + Navbar + Footer + Toaster
- Resend account setup, domain verified, SMTP configured in Supabase
- Supabase email templates custom-branded (Confirm Signup, Reset Password, Change Email, Magic Link)
- Paystack test keys configured in .env.local
- Paystack test callback URL set in Paystack dashboard

### Layout Components

- components/layout/Navbar.tsx — sticky, auth-aware (My Dashboard when logged in), active route highlighting, hides on dashboard routes, passes ?from= param to login link
- components/layout/Footer.tsx — hides on dashboard routes, 4-column links grid, Get In Touch + Follow Us, inline SVG social icons, dynamic copyright, Built by Thrinxs link

### Homepage Components (all built and copy-updated)

- HeroSection.tsx — global positioning, service pill tags, realistic stats
- ScholarshipLogos.tsx — 20 countries with flags (not scholarship names), scrolling strip
- ServicesOverviewSection.tsx — "Four Services. One Platform. One Goal." globally inclusive copy
- ScholarshipSection.tsx — awareness copy, 3-step how it works, 3 pricing cards, updated stats
- CoursesSection.tsx — 6 skills courses with updated descriptions
- CareersSection.tsx — Career Test, Industrial Training, Career Switch
- AcademyTeaserSection.tsx — Smarter Than Einstein tooltip, global audience cards, exam systems listed
- TestimonialsSection.tsx — hidden (returns null)
- EarnWithAverraSection.tsx — Affiliate (10% shown) + Trainer (competitive share language), light background

### Auth Pages

- components/auth/AuthPageShell.tsx — branded split layout (brand panel left, form right)
- components/auth/LoginForm.tsx — email/password, error handling, mounted guard, RedirectOverlay after login
- components/auth/SignupForm.tsx — full name, email, password, mounted guard, RedirectOverlay if auto-login
- components/auth/ForgotPasswordForm.tsx — email input, success state
- components/auth/ResetPasswordForm.tsx — new password, success redirect
- components/auth/VerifyEmailContent.tsx — resend button, go to login
- components/auth/RedirectOverlay.tsx — full-screen overlay, 10-second countdown, progress bar, "Go to Dashboard Now" + "Continue From Where You Stopped" (window.history.back())
- app/auth/login/page.tsx
- app/auth/signup/page.tsx
- app/auth/verify-email/page.tsx
- app/auth/forgot-password/page.tsx
- app/auth/reset-password/page.tsx
- app/auth/callback/route.ts — handles email verification + password reset redirects, updates email_verified, role-based redirect

### Scholarship Info Page (/scholarship)

- ScholarshipPageHero.tsx — hero with trust indicators
- WhatIsThisService.tsx — 4-point explanation + country flexibility note
- HowItWorksDetailed.tsx — 6 detailed steps with timing notes
- ScholarshipPricing.tsx — 3 pricing cards, links to /scholarship/apply?package=
- WhatYouWillReceive.tsx — full comparison table
- ScholarshipFAQ.tsx — 9 FAQ questions with honest answers
- ScholarshipFinalCTA.tsx — final CTA

### Multi-Step Scholarship Form (/scholarship/apply)

- FormShell.tsx — auth-aware, localStorage save/restore, re-checks auth on focus/visibility/authStateChange, mounted guard, both new user and logged-in user submission flows
- ProgressBar.tsx — 5-step with labels, circles, connector lines
- FormNavigation.tsx — back/next/submit, canSubmit prop, submitLabel prop
- CountryMap.tsx — Google Maps embed + country cards with landmark images
- Step1BasicInfo.tsx
- Step2AcademicBackground.tsx — NUC autocomplete, test score dropdown, CGPA classification
- Step3CountryPreferences.tsx — multi-select, Google Maps, dynamic start dates
- Step4CoursePreferences.tsx — field/course dropdowns, reason tags + recommendations, circumstance tags + recommendations
- Step5AccountCreation.tsx — auth-aware (new user vs logged-in user), promo code, order summary, payment timing choice

### API Routes

- app/api/promo/validate/route.ts
- app/api/scholarship/register/route.ts — creates auth user, profile, academic_backgrounds, scholarship_preferences, sends verification email
- app/api/scholarship/save-preferences/route.ts — saves/updates data for logged-in users
- app/api/paystack/initialize/route.ts — creates Paystack transaction, sets payment_status to pending
- app/api/paystack/callback/route.ts — verifies payment, updates status, creates notification + message, credits affiliate commission
- app/api/paystack/webhook/route.ts — HMAC verified backup webhook

### Student Dashboard

- app/dashboard/layout.tsx — auth check, role redirect, DashboardSidebar
- app/dashboard/page.tsx — DashboardHome with paymentResult prop
- app/dashboard/scholarship/page.tsx — ScholarshipStatus with userId prop
- app/dashboard/matches/page.tsx — MatchesList with payment status check
- app/dashboard/notifications/page.tsx — placeholder
- app/dashboard/messages/page.tsx — placeholder
- app/dashboard/profile/page.tsx — ProfileEditor
- components/dashboard/DashboardSidebar.tsx — navy sidebar, mobile hamburger, "Back to Website" uses <a> tag
- components/dashboard/DashboardHome.tsx — status banners (awaiting payment/matching/matches ready/no application), stats grid, quick actions, paymentResult banners
- components/dashboard/ScholarshipStatus.tsx — PayNowButton component, package details, payment status, preferences summary, academic summary
- components/dashboard/MatchesList.tsx — expandable match cards with full scholarship details
- components/dashboard/ProfileEditor.tsx — editable profile form

### Dashboard Shells

- app/admin/dashboard/page.tsx
- app/staff/dashboard/page.tsx
- app/affiliate/dashboard/page.tsx
- app/trainer/dashboard/page.tsx

### Legal Pages

- app/terms/page.tsx — full Terms of Service
- app/privacy/page.tsx — full Privacy Policy

---

# NEXT PRIORITIES

1. ~~Scholarship info page at /scholarship~~ ✅
2. ~~Multi-step scholarship form (5 sections)~~ ✅
3. ~~Auth pages (login + signup)~~ ✅
4. ~~Student dashboard~~ ✅
5. ~~Paystack integration~~ ✅
6. **Scholarship matching algorithm** ← next
7. Notifications + messages + email flow (Resend)
8. Admin dashboard (scholarship review, match verification, promo code management, user management)
9. Friday cron job for scholarship database updates
10. Blog statistics pages (auto-driven from scholarship DB)
11. Skills landing + individual course pages
12. Careers landing + individual program pages
13. Academy "Coming Soon" landing
14. Earn With Us landing
15. About + Contact pages
16. Trainer application flow
17. Trainer dashboard (earnings breakdown by course type)
18. Monthly trainer payout calculation (minutes-watched attribution)
19. Affiliate dashboard (full referral tracking, earnings, payout)

---

# CODING PREFERENCES

- use TypeScript
- use clean, readable JSX
- split sections into reusable components
- use responsive Tailwind classes
- add transitions to interactive elements
- keep animations smooth and modern
- prefer transition-all duration-300
- use hover:scale-105 on buttons where appropriate
- use hover:-translate-y-1 or hover:-translate-y-2 on cards where appropriate
- use rounded-xl, rounded-2xl, rounded-3xl generously for modern UI
- use Lucide icons for general iconography
- use inline SVG for brand logos (Facebook, Instagram, Twitter, TikTok, LinkedIn, YouTube)
- keep components visually polished, not plain

---

# IMPORTANT FUNCTIONAL PREFERENCES

- users have accounts after registration
- information should be sent through:
  - in-app notifications
  - dashboard messages
  - email (Resend)
- affiliate referrals should work by:
  - link
  - referral code
- trainer and affiliate systems should each have their own flows
- scholarship service remains the primary product focus in Phase 1
- all 4 services (Scholarships, Skills, Careers, Academy) must visibly exist on the website
- services that are not yet live must show "Coming Soon" pages
- promo codes are validated server-side via API — never client-side only
- trainer revenue share details are never shown publicly
- the platform is global — copy must not imply Africa-only audience
- Averra sets all course prices — trainers do not set their own prices
- minimum course price is ₦3,000
- trainer payout is monthly
- affiliate payout is monthly
- Navbar and Footer both return null on all dashboard routes
- RedirectOverlay is shown after login and after auto-login on signup
- FormShell re-checks auth state on visibilitychange, window focus, and onAuthStateChange
- "Continue From Where You Stopped" uses window.history.back()
- Paystack amounts must be in kobo (naira × 100)
- payment_status flows: unpaid → pending → paid (or failed)
- ScholarshipStatus.tsx must receive userId prop from its page

---

# FINAL REMINDER FOR AI AGENTS

When modifying this codebase:

- preserve the brand colors exactly
- preserve the scholarship business rules exactly
- do not change package pricing
- do not change the 5-match rule
- do not show trainer revenue percentages publicly
- keep the UI elegant and polished
- keep the homepage feeling like a premium education platform
- always respect Next.js App Router conventions
- always place 'use client' at the top when needed
- always use new Date().getFullYear() for the copyright year
- always use inline SVG for social media brand logos
- always treat every page as part of Averra Knowledge Academy — never split it into separate-looking brands
- never hardcode dates or years
- never build custom video infrastructure
- always use the mounted guard pattern to prevent hydration mismatches
- always declare mounted as the FIRST useState in the component
- never place an early return before all hooks have been declared
- never duplicate imports from the same module — always merge into one import line
- promo code validation must always go through the server-side API route — never validate promo codes on the client only
- PayNowButton must receive userId as a prop — the page fetches user.id server-side and passes it down
- Navbar and Footer must return null on all dashboard routes (/dashboard, /admin/dashboard, /staff/dashboard, /affiliate/dashboard, /trainer/dashboard)
- use <a href="/"> not <Link href="/"> for "Back to Website" in the dashboard sidebar
- always re-check auth state in FormShell on visibilitychange, window focus, and supabase.auth.onAuthStateChange
- always use window.history.back() for "Continue From Where You Stopped" in RedirectOverlay
- Paystack amounts must be in kobo (multiply naira amount by 100)
- scholarship_preferences.payment_status must follow: unpaid → pending → paid (or failed)
