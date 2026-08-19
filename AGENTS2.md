# AGENTS2.md — Addendum to AGENTS.md

# Technology Stack Updates Not Yet Reflected in AGENTS.md

This file is a companion to `AGENTS.md`. It documents breaking changes and
behavioural updates discovered in the project's core dependencies **after**
`AGENTS.md` was written. When any instruction here conflicts with `AGENTS.md`,
the instruction here takes precedence.

Read this file alongside `AGENTS.md` — do not treat it as a replacement.

---

## 1. Next.js 16 — Breaking Changes

### 1.1 Node.js minimum version raised

Next.js 16 drops Node.js 18 entirely.

- **Required minimum: Node.js 20.9.0**
- TypeScript minimum is also raised: **5.1.0 or later**

Verify your local and Vercel environment both meet these before running any
Next.js 16 commands.

### 1.2 `middleware.ts` is gone — replaced by `proxy.ts`

`middleware.ts` is deprecated and no longer executes in Next.js 16.

- The file must be renamed to **`proxy.ts`** at the project root.
- The exported function must be renamed from `middleware` to **`proxy`**.
- The `config` matcher export remains, but the flag
  `skipMiddlewareUrlNormalize` is renamed to **`skipProxyUrlNormalize`**.
- **The edge runtime is NOT supported in `proxy.ts`.** The runtime is always
  Node.js and cannot be configured.
- If you manually renamed the package version without running the codemod,
  your old `middleware.ts` will sit there silently, compile without errors,
  pass TypeScript checks, and do **absolutely nothing at runtime**. All
  redirects and route guards will silently fail.

Migration:

```ts
// OLD — middleware.ts
export function middleware(request: NextRequest) { ... }
export const config = { matcher: [...] }

// NEW — proxy.ts
export function proxy(request: NextRequest) { ... }
export const config = { matcher: [...] }
```

````bash
python3 << 'PYEOF'
content = """# AGENTS2.md — Addendum to AGENTS.md
# Documents all changes made in the last 5 days that are not yet in AGENTS.md.
# When anything here conflicts with AGENTS.md, this file takes precedence.
# Read both files together. This is a delta, not a replacement.

---

## 1. Next.js 16 — Breaking Changes

### 1.1 Node.js minimum version raised

Next.js 16 drops Node.js 18 entirely.

- **Required minimum: Node.js 20.9.0**
- TypeScript minimum is also raised: **5.1.0 or later**

Verify your local and Vercel environment both meet these before running any
Next.js 16 commands.

### 1.2 middleware.ts has been deleted — do not recreate it

middleware.ts was deliberately deleted from this project (commit bae4fbd)
and will not be recreated. Route protection lives in the layout server
components. The /api/auth/role route exists as a reference utility only.

If Next.js 16 middleware is ever needed in the future, the correct filename
is proxy.ts and the export must be named proxy, not middleware. The edge
runtime is not supported in proxy.ts.

Do not create middleware.ts or proxy.ts in this project.

### 1.3 next lint command removed

next lint no longer exists in Next.js 16.

- next build no longer runs linting.
- Run ESLint directly: eslint .
- Update all CI scripts and package.json lint scripts accordingly.
- The eslint key inside next.config.ts is also removed.

### 1.4 AMP support fully removed

All AMP-related APIs and config options have been removed. Do not reference
useAmp, amp: true, or any AMP config in next.config.ts.

### 1.5 serverRuntimeConfig and publicRuntimeConfig removed

These config keys no longer work. Use environment variables via .env files.
Do not generate code that references either of these keys.

### 1.6 Synchronous request APIs fully removed

In Next.js 16, all of the following must be awaited:

- cookies()
- headers()
- draftMode()
- params
- searchParams

This applies in layouts, pages, route handlers, Server Components, and
metadata generators.

```ts
// WRONG
const cookieStore = cookies()
const { id } = params

// CORRECT
const cookieStore = await cookies()
const { id } = await params
````

Project note: app/admin/dashboard/academy/[id]/page.tsx already applies
this correctly: const { id } = await params

### 1.7 Turbopack is the default bundler

Turbopack is now stable and the default for development and production.

- Remove --turbopack from package.json scripts if present.
- Move any experimental.turbopack config to top-level turbopack in next.config.ts.

### 1.8 Caching API changes

- experimental.ppr flag and experimental_ppr route segment exports are removed.
- experimental.dynamicIO is renamed to cacheComponents.
- Do not reference experimental.ppr or experimental_ppr anywhere.

### 1.9 Image configuration changes

- domains is removed from the images config — use remotePatterns exclusively.
- minimumCacheTTL default raised to 14400 (4 hours).

### 1.10 Security — patch to 16.2.6 or later

Always ensure package.json targets next@16.2.6 or later. It addresses 13
advisories including DoS in Server Components, proxy bypass, RSC cache
poisoning, and XSS in App Router applications.

---

## 2. Supabase Auth — Breaking Changes

### 2.1 getSession() must NOT be used server-side for auth decisions

- getClaims() — use this to protect pages and user data on the server.
- getUser() — use this when you need an authoritative user record.
- getSession() — safe on the client only. Never rely on the user object
  it returns for server-side authorization decisions.

Project note: The admin layout and dashboard layout both use
supabase.auth.getUser() via createSupabaseServerClient() for the session
check, then use the service role client for all profile queries.
This is the correct pattern. Do not change it.

### 2.2 @supabase/ssr remains the correct package

@supabase/auth-helpers-nextjs and all auth-helpers-\* packages are
deprecated. Do not install or import them. Do not use both packages
in the same application.

### 2.3 Supabase API key migration

Legacy keys remain valid during the migration period but will be removed
in late 2026. Supabase auto-revokes secret keys detected in public GitHub
repositories. Rotate SUPABASE_SERVICE_ROLE_KEY immediately if it has
ever been committed to a public repository.

---

## 3. shadcn/ui — Updates

### 3.1 Base UI is now the default primitive layer

As of July 2026, shadcn/ui switched its default primitive layer from
Radix UI to Base UI. New component installations use Base UI by default.
When adding new components, use npx shadcn@latest add <component> and
verify the output is consistent with existing Radix-based components.

### 3.2 shadcn CLI v4

Use npx shadcn@latest add <component>. The npx shadcn-ui@latest alias
is no longer maintained.

### 3.3 Tailwind CSS v4 — do not upgrade without reading this

If Tailwind is ever upgraded to v4:

- CSS variables must use OKLCH format not raw HSL channels.
- Class-based dark mode requires: @variant dark (&:is(.dark \*)) in globals.css.
- Run npx @tailwindcss/upgrade and re-run npx shadcn init.
- Brand colors in this project use inline styles and are unaffected.

---

## 4. Updated Rules Summary for AI Agents (Tech Stack)

- Never create middleware.ts or proxy.ts — route protection lives in layouts.
- Never use next lint — use eslint . directly.
- Never use domains in image config — use remotePatterns.
- Always await cookies(), headers(), params, searchParams.
- Never reference experimental.ppr — it is removed.
- Node.js must be 20.9+ and TypeScript must be 5.1+.
- Never use supabase.auth.getSession() server-side for auth decisions.
- Never install @supabase/auth-helpers-nextjs.
- Use npx shadcn@latest not npx shadcn-ui@latest.

---

## 5. Averra Academy — Full System (NEW — not in AGENTS.md)

The Academy section has been substantially built. The original AGENTS.md
described the Academy as a future digital learning system with subscription
tiers. What has been built is different in structure and model. This section
supersedes the Academy description in AGENTS.md entirely.

### 5.1 Academy Model — What Changed

The Academy is no longer a subscription-based video platform. It is a live
tutoring service with two class formats, bundle-based pricing, and a
dual-currency system.

The subscription tier model described in AGENTS.md (Free, Basic
N1,500/month, Standard N4,000/month, Premium N10,000/month, Elite
N35,000/month) has been replaced. Do not reference those tiers anywhere.

### 5.2 Academy Structure — Six Divisions

| Division                    | Slug                  | Status               | Target                  |
| --------------------------- | --------------------- | -------------------- | ----------------------- |
| Averra Junior Academy       | /academy/junior       | LIVE — enrolling now | Ages 5-18               |
| Averra University Academy   | /academy/university   | Coming Soon          | Undergrad, Masters, PhD |
| Averra Adult Education      | /academy/adult        | Coming Soon          | Adults 18+              |
| Averra Language Academy     | /academy/languages    | Coming Soon          | All ages                |
| Averra Educators Academy    | /academy/teachers     | Coming Soon          | Teachers                |
| Averra Professional Academy | /academy/professional | Coming Soon          | Professionals 21+       |

All Coming Soon divisions use the ComingSoonDivision component with a
waitlist email capture form. The Junior Academy is the only active division.
All CTAs across the Academy site point to /academy/junior or /academy/enroll.

### 5.3 Academy Routes

```
/academy                    — Academy homepage
/academy/junior             — Junior Academy full page (live)
/academy/university         — ComingSoonDivision
/academy/adult              — ComingSoonDivision
/academy/languages          — ComingSoonDivision
/academy/teachers           — ComingSoonDivision
/academy/professional       — ComingSoonDivision
/academy/enroll             — Enrolment form
/academy/enroll/verify      — Post-registration confirmation
/academy/enroll/payment     — GBP bank transfer payment instructions
/dashboard/academy          — Student/parent Academy dashboard section
```

### 5.4 Academy Pricing Model — Bundle-Based, Dual Currency

Pricing is determined by:

1. Applicant country of residence (detected on Step 1 of the form)
2. Class type (Private or General)
3. Subject bundle (number of subjects selected)

Currency is set automatically:

- Nigeria (NG) — NGN, payment via Paystack
- All other countries — GBP, payment via bank transfer (FPS)

NGN Pricing (per learner per month):

| Subjects     | Private Class | General Class |
| ------------ | ------------- | ------------- |
| 1-2 subjects | N100,000      | N50,000       |
| 3-4 subjects | N180,000      | N90,000       |
| 5-6 subjects | N250,000      | N120,000      |

GBP Pricing (per learner per month) — used in the enrolment form:

| Subjects     | Private Class | General Class |
| ------------ | ------------- | ------------- |
| 1-2 subjects | £100          | £50           |
| 3-4 subjects | £180          | £90           |
| 5-6 subjects | £250          | £120          |

Note: The Junior Academy landing page (/academy/junior) shows slightly
different indicative GBP prices (£65/£110/£150 Private, £35/£60/£80
General). The enrolment form uses the constants above. Update both
consistently if prices change.

Billing periods and discounts:

| Period            | Months | Discount |
| ----------------- | ------ | -------- |
| Monthly           | 1      | 0%       |
| Termly (3 months) | 3      | 5%       |
| Annually          | 12     | 10%      |

Maximum subjects per learner: 6.
There is no registration fee. The REGISTRATION_FEE constant has been
removed entirely. Do not add it back.

### 5.5 Class Types

Only two class types exist:

| Key       | Label         | Description                          |
| --------- | ------------- | ------------------------------------ |
| 'private' | Private Class | One-on-one with a dedicated teacher  |
| 'general' | General Class | Small group, assigned by Averra team |

The old learning_format field with values 'private', 'small_class',
'classroom' no longer exists. Use class_type with 'private' or 'general'.

The old lesson_duration and lessons_per_week fields no longer exist.
Do not add them back.

### 5.6 Enrolment Form — AcademyEnrollForm

File: components/academy/AcademyEnrollForm.tsx

Two applicant flows:

- 'parent' — enrolling a child or ward (6 steps)
- 'student' — enrolling themselves (7 steps, extra parent access step)

Step structure:

| Step | Parent Flow                         | Student Flow              |
| ---- | ----------------------------------- | ------------------------- |
| 0    | Who is applying? (selection screen) | same                      |
| 1    | Your Information                    | Your Personal Information |
| 2    | Learner Details                     | Your Academic Information |
| 3    | Curriculum Preview                  | Your Curriculum Preview   |
| 4    | Class Type and Pricing              | Class Type and Pricing    |
| 5    | Schedule Preferences                | Schedule Preferences      |
| 6    | Create Account                      | Parent / Guardian Access  |
| 7    | —                                   | Create Account            |

Step 4 contains:

- Class type selection (Private / General) with live price shown
- Full pricing reference table with current bundle highlighted
- Billing period selector (Monthly / Termly / Annually) with discounts
- Live order summary

The billing period selector was moved from the account step to Step 4.
It no longer appears on the final account creation step.

Subject cap: Maximum 6 subjects per learner. Attempting to select a 7th
is silently blocked. UI shows greyed-out buttons at cap and displays
"Maximum 6 subjects reached" in amber. Counter shows "X of 6 subjects selected".

Currency note: After selecting country on Step 1, a note appears showing
which currency will be used and which payment method applies.

General Class note on Step 5: When class_type === 'general', an amber
info box explains the user will be assigned to a group within 24 hours.

Account step (Step 6 or 7):

- Password + confirm password
- Terms and Privacy checkboxes (both required)
- Final order summary showing currency-formatted totals
- Payment method note (Paystack for NGN, bank transfer for GBP)
- No registration fee line

Form submission sends to /api/academy/enroll.
Academy accounts are auto-confirmed (email_confirm: true).
No email verification step required for academy accounts.

After submission:

- New user redirected to /academy/enroll/verify
- Then /academy/enroll/payment for full bank transfer details (GBP users)

### 5.7 Payment Flow (GBP — Bank Transfer)

File: app/academy/enroll/payment/page.tsx

GBP payment is via UK bank transfer using Faster Payment (FPS).

Bank account details:

| Field          | Value                      |
| -------------- | -------------------------- |
| Account Name   | Baridubari Joshua Joe-Amos |
| Account Number | 35651420                   |
| Sort Code      | 04-13-07                   |
| IBAN           | GB68CLJU0413073565420      |
| Bank           | Clear Junction Limited     |
| Method         | Faster Payment (FPS)       |

All fields are copyable (click-to-copy with checkmark confirmation).
Payment reference field is editable — default is AVERRA-ACAD.
After payment, user sends proof to WhatsApp (+2349033440966) or email.

What happens after payment is confirmed:

- Learner dashboard will be fully activated
- Team contacts within 24 hours to confirm timetable
- Learner baseline assessment will be scheduled
- Classes begin within 48 hours of timetable confirmation

Go to My Dashboard links to /dashboard/academy.

### 5.8 Verify Page

File: app/academy/enroll/verify/page.tsx

This page no longer asks users to check their email. It shows:

- Enrolment Registered! heading
- Step-by-step payment instructions
- GBP bank details summary (read-only)
- WhatsApp CTA (green button) to send proof of payment
- Go to My Dashboard button linking to /dashboard/academy

Email verification is not part of the Academy onboarding flow.

### 5.9 Admin Payment Confirmation

File: app/api/academy/confirm-payment/route.ts

Admins manually confirm receipt of payment via the admin enrollment detail
page (app/admin/dashboard/academy/[id]/page.tsx). This page shows:

- Parent/guardian details with WhatsApp button
- Payment details and billing period
- Confirm Payment Received button (POST to /api/academy/confirm-payment)
- Per-learner details: year group, country, format, subjects decoded from
  SUBJECT_MAP, timetable status

### 5.10 Averra Library (Coming Soon)

The Academy homepage includes an Averra Library section with three services:

| Service            | Tag             |
| ------------------ | --------------- |
| Buy Physical Books | Ships Worldwide |
| Buy eBooks         | Instant Access  |
| Rent eBooks        | Save Up to 80%  |

All three are labelled Coming Soon — Launching 2026. A waitlist email
capture is included (client-side only, no backend connected yet).

### 5.11 Averra Super Curriculum

A fusion of seven world education systems plus the individual student:

England — Structure and exam pathways
Japan — Mastery and discipline
Estonia — Digital competence
Canada — Student-centred learning
Nigeria — Culture and local exams
Singapore — World number 1 Maths method
Finland — Deep understanding
Student — Individual assessment

Displayed on the Academy homepage, Junior Academy page, and all Coming
Soon division pages.

### 5.12 SmarterTooltip Component

File: components/ui/SmarterTooltip.tsx

A reusable tooltip used wherever Smarter Than Einstein or Averra Super
Curriculum appears. Auto-detects viewport position (top or bottom) via
getBoundingClientRect.

Import:
import SmarterTooltip from '@/components/ui/SmarterTooltip'

Wrap any text:
<SmarterTooltip>
<span className="font-semibold underline decoration-dotted">
Averra Super Curriculum
</span>
</SmarterTooltip>

Used on:

- app/academy/page.tsx
- app/academy/junior/page.tsx
- components/academy/AcademyHero.tsx

Always wrap "Smarter Than Einstein" and "Averra Super Curriculum" in
SmarterTooltip on any Academy-related page.

### 5.13 StudentImage Component

File: components/academy/StudentImage.tsx

A client component wrapping img with an onError fallback. Used on the
Junior Academy page for the three student-stage cards. Extracted to a
client component because onError cannot be used in Server Components.

Fallback renders emoji (default: two children emoji) inside a #F0F6FB div.

Images:

- /public/academy/students/primary.png
- /public/academy/students/middle.png
- /public/academy/students/senior.png

Always use StudentImage for Academy student photos, not next/image,
because onError is needed and cannot be used in Server Components.

### 5.14 ComingSoonDivision Component

File: components/academy/ComingSoonDivision.tsx

Reusable component for the five coming-soon Academy divisions.
Accepts a division prop:

{
name: string
tagline: string
description: string
target_audience: string
age_range: string
emoji: string
color: string
features: string[]
}

Shows: hero with waitlist capture, Who Is This For, What It Will Cover,
Super Curriculum block, and CTA to Junior Academy.

### 5.15 AcademyHero Component — Rebuilt

File: components/academy/AcademyHero.tsx

Key changes:

- Headline: Education for Every Stage of Life.
- Lucide icon imports removed — replaced with emoji floating icons
- SmarterTooltip wraps the Smarter Than Einstein phrase
- Stats grid: 6 divisions, 7 curricula, All ages, 2 class formats
- Primary CTA: Explore All Divisions linking to #divisions
- Secondary CTA: Enrol Now linking to /academy/enroll
- Badge: Junior Academy Now Enrolling — Limited Spaces

### 5.16 Academy Homepage — app/academy/page.tsx

Now a full client component. Sections in order:

1. AcademyHero
2. Six Divisions grid — interactive hover, active/coming-soon badges
3. Averra Library — three service cards with waitlist
4. Why Choose Averra Academy — six benefit cards
5. How It Works — four steps with connector lines
6. Final CTA section

SuperCurriculumSection and CurriculumExplorer are no longer imported or
rendered on this page.

### 5.17 Junior Academy Page — app/academy/junior/page.tsx

Sections:

- Hero with animated floating school icons and sparkle elements, wave divider
- Who Is It For — three age cards (Primary 5-11, Middle 11-14, Senior 14-18)
  with StudentImage photos, colour-coded badges, feature lists
- Global curriculum note
- Examination Preparation — four groups (Nigeria, UK, International, Support)
- Pricing — Private Class and General Class cards with NGN and GBP tables,
  billing discount notes
- Super Curriculum — 8-flag grid
- Final CTA with trust indicators

### 5.18 CSS Animations Required

The Junior Academy hero uses two custom CSS animations that must be present
in globals.css. If they are not there, add them:

@keyframes float {
0%, 100% { transform: translateY(0px); }
50% { transform: translateY(-12px); }
}

@keyframes twinkle {
0%, 100% { opacity: 0.4; }
50% { opacity: 0.1; }
}

---

## 6. Database — New Tables (Not in AGENTS.md)

### 6.1 academy_enrollments

| Column                       | Type        | Notes                           |
| ---------------------------- | ----------- | ------------------------------- |
| id                           | uuid        | primary key                     |
| parent_id                    | uuid        | FK to profiles.id               |
| applicant_type               | text        | 'parent' or 'student'           |
| full_name                    | text        |                                 |
| email                        | text        |                                 |
| phone                        | text        |                                 |
| whatsapp                     | text        |                                 |
| country                      | text        | country code e.g. 'NG', 'GB'    |
| date_of_birth                | date        | nullable                        |
| relationship                 | text        | nullable, parent flow only      |
| class_type                   | text        | 'private' or 'general'          |
| currency                     | text        | 'NGN' or 'GBP'                  |
| monthly_price                | numeric     | per learner per month           |
| billing_period               | text        | 'monthly', 'termly', 'annually' |
| billing_amount               | numeric     | total after discount            |
| preferred_days               | text[]      |                                 |
| preferred_time               | text        |                                 |
| timezone                     | text        |                                 |
| payment_status               | text        | 'unpaid' or 'paid'              |
| notes                        | text        | schedule notes                  |
| wants_parent_access          | boolean     | student flow only               |
| optional_parent_name         | text        | nullable                        |
| optional_parent_email        | text        | nullable                        |
| optional_parent_phone        | text        | nullable                        |
| optional_parent_relationship | text        | nullable                        |
| heard_from                   | text        | nullable                        |
| created_at                   | timestamptz |                                 |

### 6.2 academy_children

| Column              | Type    | Notes                           |
| ------------------- | ------- | ------------------------------- |
| id                  | uuid    | primary key                     |
| enrollment_id       | uuid    | FK to academy_enrollments.id    |
| full_name           | text    |                                 |
| date_of_birth       | date    | nullable                        |
| school_name         | text    | nullable                        |
| country_code        | text    | country where learner studies   |
| year_group_code     | text    | e.g. 'Y7', 'SS2'                |
| year_group_label    | text    | human-readable                  |
| subjects            | text[]  | array of subject codes          |
| learning_challenges | text    | nullable                        |
| learning_format     | text    | mirrors class_type              |
| lesson_duration     | numeric | legacy, not used in form        |
| lessons_per_week    | integer | legacy, not used in form        |
| monthly_fee         | numeric | calculated fee for this learner |
| status              | text    | 'pending' or 'active'           |
| timetable           | jsonb   | nullable, set by admin          |

### 6.3 academy_countries (lookup)

| Column       | Type      |
| ------------ | --------- |
| country_code | text (PK) |
| country_name | text      |
| flag         | text      |

### 6.4 academy_year_groups (lookup)

| Column           | Type    |
| ---------------- | ------- |
| id               | uuid    |
| country_code     | text    |
| year_group_label | text    |
| year_group_code  | text    |
| age_min          | integer |
| age_max          | integer |

Fetched by the enrolment form when a country is selected. Populates the
Year/Class dropdown for each learner.

---

## 7. API Routes — New (Not in AGENTS.md)

### 7.1 POST /api/academy/enroll

Creates an academy account and enrolment record.

Receives: email, password, full_name, phone, whatsapp, country,
applicant_type, relationship, date_of_birth, learners array,
class_type, currency, monthly_price, billing_period, billing_amount,
preferred_days, preferred_time, timezone, wants_parent_access,
optional parent fields, heard_from.

Process:

1. Creates auth user via supabaseAdmin.auth.admin.createUser() with
   email_confirm: true (auto-confirmed, no email verification needed)
2. Profile row created via handle_new_user trigger
3. Inserts academy_enrollments row
4. Inserts academy_children rows (one per learner)

On success: returns { success: true }, client redirects to
/academy/enroll/verify.

### 7.2 POST /api/academy/confirm-payment

Admin-only route. Confirms receipt of bank transfer payment.

Receives: enrollment_id (from form POST)

Process:

1. Updates academy_enrollments.payment_status to 'paid'
2. Updates all academy_children.status to 'active' for this enrolment

On success: redirects back to the admin enrolment detail page.

### 7.3 GET /api/auth/role

Returns the authenticated user's role from the profiles table.

Response: { role: 'student' | 'admin' | 'staff' | 'affiliate' | 'trainer' }

Falls back to { role: 'student' } if user not found or an error occurs.

---

## 8. Admin Dashboard — Changes

### 8.1 All admin pages use service role client

Every page under app/admin/dashboard/ now uses a locally defined
getAdminClient() function instead of createSupabaseServerClient():

function getAdminClient() {
return createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!,
{ auth: { autoRefreshToken: false, persistSession: false } }
)
}

This bypasses RLS and is necessary for admin data access. The same pattern
is used in app/dashboard/layout.tsx for the profile fetch.

Never use createSupabaseServerClient() for admin data queries. Use the
service role client. createSupabaseServerClient() is still used in layouts
for the session check (getUser()), but all database queries use the service
role client.

### 8.2 Supabase join query fix

When joining profiles via a foreign key, the result may be an array.
Always handle both cases:

const profile = (
Array.isArray(enrollment.profiles)
? enrollment.profiles[0]
: enrollment.profiles
) as { full_name: string; email: string } | null

Do not use profiles!parent_id (...) in Supabase .select() strings.
Use profiles (...) and handle the array/object ambiguity in TypeScript.

### 8.3 Admin Academy pages

New admin pages:

- app/admin/dashboard/academy/page.tsx — lists all enrolments
- app/admin/dashboard/academy/[id]/page.tsx — full enrolment detail
- app/admin/dashboard/academy/children/page.tsx — lists all children
- app/admin/dashboard/academy/timetables/page.tsx — placeholder

SUBJECT_MAP is defined in both the list and detail pages:

const SUBJECT_MAP: Record<string, string> = {
ENG: 'English Language', MATH: 'Mathematics',
SCI: 'Science', COMP: 'Computing',
HIST: 'History', GEO: 'Geography',
ART: 'Creative Arts', MUS: 'Music',
PE: 'Physical Education',
NHC: 'Nigerian History & Culture',
REL: 'Religious Studies', BTECH: 'Basic Technology',
BIO: 'Biology', CHEM: 'Chemistry',
PHY: 'Physics', ECON: 'Economics',
GOV: 'Government / Politics',
ENGLIT: 'English Literature',
}

AdminSidebar now includes Academy section with links to:

- /admin/dashboard/academy
- /admin/dashboard/academy/children
- /admin/dashboard/academy/timetables

---

## 9. Auth System — Changes

### 9.1 Login flow rewritten — no RedirectOverlay

After successful signInWithPassword, the form does:

window.location.href = '/dashboard'

The dashboard layout handles role-based routing.

Changes from the original LoginForm:

- RedirectOverlay is no longer used after login
- getDashboardRouteByRole() is no longer called from the login form
- useRouter has been removed from LoginForm
- from= query parameter tracking has been removed
- Email-not-confirmed error handling has been removed

### 9.2 Role-based routing after login

After window.location.href = '/dashboard':

1. app/dashboard/layout.tsx calls supabase.auth.getUser()
2. Gets the profile using the service role client
3. If profile.role is not 'student', redirects to the correct dashboard

### 9.3 Academy accounts auto-confirmed

Academy accounts use email_confirm: true.
No email verification required for academy accounts.
Scholarship accounts still send a verification email (unchanged from AGENTS.md).

### 9.4 Email verification no longer blocks login

The login form does not check or enforce email verification status.
Users can log in regardless of their email_verified flag.

---

## 10. Dashboard — Changes

### 10.1 DashboardHome rebuilt

File: components/dashboard/DashboardHome.tsx

The dashboard home now covers all four services, not just scholarship.

Welcome message uses first name only (profile.full_name.split(' ')[0])
with a wave emoji.

Description: Here is an overview of your Averra Knowledge Academy
services and activity.

Quick Stats grid (4 items):

1. Notifications count — /dashboard/notifications
2. Messages count — /dashboard/messages
3. Scholarship Matches count — /dashboard/matches
4. My Profile — /dashboard/profile

The old Package and Trophy stats have been removed.

Services Grid (2x2):

| Card               | Route                  | Notes                               |
| ------------------ | ---------------------- | ----------------------------------- |
| Scholarships       | /dashboard/scholarship | Shows live payment and match status |
| Academy            | /dashboard/academy     | Shows enrolment status              |
| Skills and Courses | /dashboard/courses     | Coming Soon badge                   |
| Careers            | /dashboard/careers     | Coming Soon badge                   |

Scholarship status banners shown below the services grid:

- unpaid + preferences exist — amber Payment Pending banner with Pay Now button
- paid + matchCount > 0 — green Matches Ready banner with View Matches button
- No preferences — blue Start Your Scholarship Journey banner

### 10.2 New dashboard pages

- app/dashboard/academy/page.tsx — Academy enrolment status
- app/dashboard/courses/page.tsx — placeholder (Skills)
- app/dashboard/careers/page.tsx — placeholder (Careers)

### 10.3 DashboardSidebar updated

Updated to include navigation items for all four services.

---

## 11. Project File Structure — Additions

New files not listed in AGENTS.md:

app/
academy/
junior/page.tsx (new — full Junior Academy page)
university/page.tsx (new — ComingSoonDivision)
adult/page.tsx (new — ComingSoonDivision)
languages/page.tsx (new — ComingSoonDivision)
teachers/page.tsx (new — ComingSoonDivision)
professional/page.tsx (new — ComingSoonDivision)
enroll/
payment/page.tsx (rebuilt — bank transfer details)
verify/page.tsx (rebuilt — no email verification)
admin/dashboard/
academy/
page.tsx (new — enrollment list)
[id]/page.tsx (new — enrollment detail)
children/page.tsx (new)
timetables/page.tsx (new — placeholder)
layout.tsx (updated — service role client)
dashboard/
layout.tsx (updated — service role client)
academy/page.tsx (new)
courses/page.tsx (new — placeholder)
careers/page.tsx (new — placeholder)
api/
academy/
enroll/route.ts (new)
confirm-payment/route.ts (new)
auth/
role/route.ts (new)

components/
academy/
AcademyEnrollForm.tsx (rebuilt — new pricing model)
AcademyHero.tsx (rebuilt)
ComingSoonDivision.tsx (new)
StudentImage.tsx (new)
CurriculumExplorer.tsx (exists — not used on academy page)
SuperCurriculumSection.tsx (exists — not used on academy page)
admin/
AdminSidebar.tsx (updated — Academy nav added)
auth/
LoginForm.tsx (rebuilt — no RedirectOverlay)
dashboard/
DashboardHome.tsx (rebuilt — all 4 services)
DashboardSidebar.tsx (updated — all 4 services)
ui/
SmarterTooltip.tsx (new)

lib/
plans.js (new)

public/
academy/students/
primary.png (new)
middle.png (new)
senior.png (new)

---

## 12. lib/plans.js — New File

Single source of truth for a scheduling/booking pricing system, likely
for a future CTC or coaching feature. Not currently wired to any live
feature. Do not delete it.

ONLINE_PLANS:

- Lite: N20,000 / 30 min
- Basic: N35,000 / 1 hour
- Standard: N80,000 / up to 2 hours

PHYSICAL_PLANS:

- Lite: N25,000 / 30 min
- Basic: N40,000 / 1 hour
- Standard: N110,000 / up to 2 hours

---

## 13. Legal Pages — Updated

Both app/terms/page.tsx and app/privacy/page.tsx were updated as part of
the Academy build. The pages now reference the Academy service alongside
the scholarship service. Preserve references to both services when editing.

---

## 14. Coding Rules — Additions

These are additions to the Coding Preferences and Final Reminder sections
in AGENTS.md.

### Admin queries

- Always use the service role client for admin database queries.
- Never use createSupabaseServerClient() for admin data queries.
- Always define getAdminClient() locally in each admin page file.

### Supabase join results

- Always handle both array and object results from Supabase joins:

  const item = Array.isArray(data.relation)
  ? data.relation[0]
  : data.relation

### Academy pricing

- Never hardcode currency symbols in Academy pricing UI.
  Use formatPrice(amount, currency) which outputs N or £ based on currency.
- Never add back the registration fee. It has been removed.
- Never add back lesson_duration or lessons_per_week to the Academy form.
- Maximum 6 subjects per learner. Enforce in both UI and server validation.

### Middleware

- Never create middleware.ts. It does nothing in Next.js 16.
- Never create proxy.ts unless explicitly required.
- Route protection lives in layout server components.

### Academy accounts

- Academy accounts must be created with email_confirm: true.
- Academy users do not go through an email verification flow.

### Login form

- After successful login, use window.location.href = '/dashboard'.
- Do not use router.push() or RedirectOverlay for login redirects.
- The dashboard layout handles role-based routing automatically.

### SmarterTooltip

- Always wrap Smarter Than Einstein and Averra Super Curriculum in
  SmarterTooltip on any Academy-related page.
- Import from '@/components/ui/SmarterTooltip'.

### StudentImage

- Always use StudentImage for Academy student photos, not next/image,
  because onError is needed and cannot be used in Server Components.
  """

with open('AGENTS2.md', 'w') as f:
f.write(content)

print("✓ AGENTS2.md written successfully")
PYEOF

````

Then commit:

```bash
git add AGENTS2.md && git commit -m "Add AGENTS2.md — documents all changes from last 5 days"
````
