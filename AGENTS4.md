# AGENTS4.md — Addendum to AGENTS.md, AGENTS2.md, and AGENTS3.md

This file documents all changes made **after AGENTS3.md was written**
(after commit de5811c). It is a delta, not a replacement.

Read all four files together in order:
1. AGENTS.md — full project foundation
2. AGENTS2.md — tech stack breaking changes + Academy build
3. AGENTS3.md — schedule step changes, country_of_origin fix
4. AGENTS4.md — this file, most recent changes

When instructions conflict, **this file takes precedence** over all
previous AGENTS files.

Baseline: AGENTS3.md commit de5811c
HEAD at time of audit: 7dc07d2
Branch: main
Remote: https://github.com/thrinxs/averraknowledgeacademy.git

---

## 1. Academy Payment System — Full Build

### 1.1 Payment Flow Architecture

The complete Academy payment flow is now built end to end.

Flow:
  /academy/enroll (form submitted)
  POST /api/academy/enroll
  returns { enrollment_id, currency, billing_amount }
  stored in localStorage
  /academy/enroll/verify   (shows amount + exchange rate + Pay Now)
  /academy/enroll/payment  (payment method selection)
    NGN users     -> Paystack only
    International -> Card (Paystack NGN) | GBP transfer | EUR transfer
  Paystack callback -> /dashboard/academy?payment=success|failed

### 1.2 Currency and Payment Rules

| User Country | Payment Options                                         |
| ------------ | ------------------------------------------------------- |
| Nigeria (NG) | Paystack card only (NGN)                                |
| All others   | Paystack card (charged in NGN) + GBP transfer + EUR transfer |

Critical rule: Averra has a Nigerian Paystack account. It cannot
charge in GBP or EUR. International users paying by card are charged
in NGN. Their bank converts at their live rate. You receive NGN.

### 1.3 Bank Account Details (GBP and EUR)

Both GBP and EUR use the same account. Only the payment method differs.

| Field          | Value                      |
| -------------- | -------------------------- |
| Account Name   | Baridubari Joshua Joe-Amos |
| Account Number | 35651420                   |
| Sort Code      | 04-13-07                   |
| IBAN           | GB68CLJU04130735651420     |
| Bank           | Clear Junction Limited     |
| GBP Method     | Faster Payment (FPS)       |
| EUR Method     | SEPA & SEPA Instant        |

IMPORTANT: The IBAN in AGENTS2.md (GB68CLJU0413073565420) was
incorrect. The correct IBAN is GB68CLJU04130735651420 (24 chars).
Always use the correct IBAN from this file.

### 1.4 New API Routes

#### POST /api/academy/paystack/initialize

File: app/api/academy/paystack/initialize/route.ts

Receives: { enrollment_id, ngn_amount }

- Uses service role client (getAdminClient)
- Fetches enrollment from academy_enrollments
- Resolves email: uses enrollment.email first, falls back to profiles.email
- ngn_amount: if provided and > 0, uses it (for international converted amount)
  Otherwise uses enrollment.billing_amount directly
- Amount in kobo = Math.round(ngn_amount * 100)
- Reference format: AVR-ACAD-{enrollment_id.slice(0,8).toUpperCase()}-{timestamp}
- Sets payment_status to 'pending' before redirecting
- Returns { authorization_url, reference }

#### GET /api/academy/paystack/callback

File: app/api/academy/paystack/callback/route.ts

Query params: reference, enrollment_id

- Verifies payment with Paystack API
- On success: sets academy_enrollments.payment_status = 'paid',
  sets all academy_children.status = 'active' for this enrollment
- On failure: sets payment_status = 'failed'
- Redirects to /dashboard/academy?payment=success|failed

### 1.5 Exchange Rate System

#### GET /api/exchange-rate

File: app/api/exchange-rate/route.ts

- Fetches live rates from ExchangeRate-API (base currency: NGN)
- Rate calculation: Math.round(1 / conversion_rates.GBP)
- Caches result in memory for 1 hour
- Falls back to env vars if API fails or key missing
- Returns { GBP: number, EUR: number, source: 'live'|'cache'|'fallback' }

Required environment variables (add to Vercel AND .env.local):

| Variable              | Purpose                         |
| --------------------- | ------------------------------- |
| EXCHANGE_RATE_API_KEY | ExchangeRate-API.com free key   |
| FALLBACK_GBP_TO_NGN   | Fallback rate e.g. 2100         |
| FALLBACK_EUR_TO_NGN   | Fallback rate e.g. 1950         |

#### ExchangeRateDisplay Component

File: components/academy/ExchangeRateDisplay.tsx

Props: { currency: string, amount: number, onRateLoaded?: (ngnAmount: number) => void }

- Only renders for non-NGN currencies
- Fetches /api/exchange-rate on mount
- Shows live or approximate rate with colour indicator
- Calls onRateLoaded(ngnAmount) when rate is available
- Used on: verify page and payment page

#### PaystackFeeNotice Component

File: components/academy/PaystackFeeNotice.tsx

Props: { amountNGN: number, isInternational: boolean }

Fee calculation:
  Local card:        min(round(amount * 0.015) + (amount >= 2500 ? 100 : 0), 2000)
  International card: round(amount * 0.039) + 100 (no cap)

Shows: enrolment fee, Paystack fee, total charged.
Note at bottom: No processing fee on GBP or EUR bank transfers.
Used on: payment page (NGN section and international card section).

### 1.6 Verify Page — Updated

File: app/academy/enroll/verify/page.tsx

Now a client component that:
- Reads enrollment_id, currency, billing_amount from localStorage
- Shows amount due with currency symbol
- Shows ExchangeRateDisplay for international users
- Pay Now button routes to /academy/enroll/payment with params:
  enrollment_id, currency, amount, ngn_amount
- Skip button routes to /dashboard/academy

### 1.7 Payment Page

File: app/academy/enroll/payment/page.tsx

Wrapped in Suspense boundary (required for useSearchParams in Next.js 16).
Inner component: AcademyPaymentInner

Reads from URL params: enrollment_id, currency, amount, ngn_amount

NGN users: Paystack only — shows PaystackFeeNotice before button.

International users: three method cards:
1. Pay by Card — Paystack, charged in NGN, shows NGN amount + fee breakdown
2. GBP Bank Transfer — FPS, no processing fee, shows bank details
3. EUR Bank Transfer — SEPA, no processing fee, shows bank details

Each bank card shows: amount, copyable bank details, editable reference,
method note. After bank transfer: WhatsApp + Email proof section shown.

IMPORTANT CODING RULE: Never write this file using Python heredoc or
string concatenation with << syntax. The file will be written as empty.
Always use direct file.write() calls or a saved .py script.
Test after writing: wc -l app/academy/enroll/payment/page.tsx (must be > 0)

---

## 2. Apple Pay Domain Verification

### 2.1 Verification File Location

Correct path: public/.well-known/apple-developer-merchantid-domain-association
Wrong path:   .well-known/apple-developer-merchantid-domain-association (root)

Next.js only serves static files from the public/ directory.

### 2.2 vercel.json Content-Type Header

Required in vercel.json — do not remove:

{
  "headers": [
    {
      "source": "/.well-known/apple-developer-merchantid-domain-association",
      "headers": [{ "key": "Content-Type", "value": "application/text" }]
    }
  ]
}

### 2.3 Apple Pay Status

Domain www.averraknowledgeacademy.com is verified in Paystack dashboard.
Apple Pay is active for NGN transactions on iOS and Safari.
International payments must be enabled in Paystack Settings > Preferences
for foreign cards including Apple Pay to work.

---

## 3. Profile System — Full Build

### 3.1 Architecture — Server Fetches, Client Renders

This is the permanent pattern for all dashboard data pages.
Never fetch auth or profile data from client components.

app/dashboard/profile/page.tsx  (Server Component)
  Uses createSupabaseServerClient() for auth check
  Uses getAdminClient() for DB queries
  Fetches: profile, academy_enrollments, scholarship_preferences
  Passes as props to: ProfileEditor client component

components/dashboard/ProfileEditor.tsx  (Client Component)
  Receives: initialProfile, userId, userEmail, dbRole, services
  Uses supabase from @/lib/supabase for saves and avatar uploads
  Makes NO auth calls

### 3.2 New Supabase Columns — profiles Table

Run in Supabase SQL editor if not already applied:

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS preferred_name text,
  ADD COLUMN IF NOT EXISTS nationality text,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS postal_code text,
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS occupation text,
  ADD COLUMN IF NOT EXISTS education_level text,
  ADD COLUMN IF NOT EXISTS timezone text,
  ADD COLUMN IF NOT EXISTS language text DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS profile_visibility text DEFAULT 'private',
  ADD COLUMN IF NOT EXISTS notification_email boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS notification_inapp boolean DEFAULT true;

### 3.3 Required Fields for 60% Completion

avatar_url, full_name, phone, date_of_birth, gender,
nationality, country, address, occupation, education_level

Profile below 60% blocks payments and shows ProfileIncompleteModal.

### 3.4 Role and Service Display on Profile Page

Role display map:

| DB role   | Display Label      | Emoji |
| --------- | ------------------ | ----- |
| admin     | Administrator      | gear  |
| staff     | Staff              | suit  |
| trainer   | Trainer            | school|
| affiliate | Affiliate Partner  | hands |
| student   | Student            | grad  |

Service badges (cross-referenced from other tables):
- academy_enrollments.applicant_type === 'parent'
    -> badge: "Parent / Guardian (Junior Academy)"
- academy_enrollments.applicant_type === 'student'
    -> badge: "Student (Junior Academy)"
- scholarship_preferences row exists
    -> badge: "Scholarship Matching"

Add more badges as more services are built.

### 3.5 Avatar Upload — Supabase Storage

Bucket: avatars (public)
Path: avatars/{user_id}/avatar.{ext}
Max size: 5MB
Accepted: image/jpeg, image/png, image/webp
Always upload with: upsert: true

Bucket and policies must exist. Run this SQL if not already applied:

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Avatars are publicly readable"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'avatars');

### 3.6 ProfileIncompleteModal

File: components/dashboard/ProfileIncompleteModal.tsx

- Shown on dashboard home when profile completion < 60%
- Dismissed for the session via sessionStorage key: 'profile_modal_dismissed'
- Shows: completion bar, list of filled/missing fields, two buttons
- "Complete My Profile" -> /dashboard/profile
- "Remind Me Later" -> dismisses for session only

calculateProfileCompletion() is exported from ProfileEditor.tsx
and imported by ProfileIncompleteModal.tsx.

---

## 4. Settings System — Full Build

### 4.1 Architecture (same server-fetches-client-renders pattern)

app/dashboard/settings/page.tsx  (Server Component)
  Fetches: notification_email, notification_inapp,
           profile_visibility, timezone, language
  Passes to: SettingsEditor client component

components/dashboard/SettingsEditor.tsx  (Client Component)
  Receives: userId, userEmail, initialSettings
  Uses supabase from @/lib/supabase for saves and auth changes

### 4.2 Settings Sections

| Section         | Fields / Actions                                   |
| --------------- | -------------------------------------------------- |
| Email Address   | Change email (sends Supabase verification email)   |
| Change Password | New password + confirm, minimum 8 characters       |
| Notifications   | Email notifications toggle, In-app toggle          |
| Privacy         | Profile visibility (private or public)             |
| Danger Zone     | Delete account — requires typing DELETE to confirm |

Account deletion shows an alert directing user to email support.
Actual deletion is handled manually by staff for safety.

---

## 5. Dashboard Layout — Rebuilt Architecture

### 5.1 Three-File Structure

| File                                      | Type   | Purpose                            |
| ----------------------------------------- | ------ | ---------------------------------- |
| app/dashboard/layout.tsx                  | Server | Auth, profile fetch, render shell  |
| components/dashboard/DashboardShell.tsx   | Client | Owns mobileOpen state, wires all   |
| components/dashboard/DashboardTopBar.tsx  | Client | Fixed top bar with avatar dropdown |
| components/dashboard/DashboardSidebar.tsx | Client | Fixed left nav (updated props)     |

### 5.2 DashboardShell

File: components/dashboard/DashboardShell.tsx

Owns mobileOpen state. Passes down:
- mobileOpen + onMobileClose -> DashboardSidebar
- onMobileMenuToggle -> DashboardTopBar

Layout:
- DashboardSidebar (fixed left, w-64 on lg+)
- DashboardTopBar (fixed top, left-0 mobile, left-64 lg+, h-16)
- main (flex-1, lg:ml-64, pt-16)

### 5.3 DashboardTopBar

File: components/dashboard/DashboardTopBar.tsx

Props: { fullName, email, avatarUrl, onMobileMenuToggle }

Left: hamburger button (lg:hidden) calls onMobileMenuToggle
      Brand name text on mobile only

Right: Avatar circle + name/email (desktop) + ChevronDown
       Dropdown closes on outside click (useRef + mousedown listener)

Dropdown contents:
- User info header (avatar + full name + email)
- My Profile -> /dashboard/profile
- Settings -> /dashboard/settings
- Divider
- Back to Website -> / (using <a href="/" not Link, for full reload)
- Sign Out -> supabase.auth.signOut() then window.location.href = '/'

Avatar display: shows image if avatarUrl exists, else initials
(first letter of first name + first letter of last name, uppercase)

### 5.4 DashboardSidebar — Updated Props

New props added (both optional):
  mobileOpen?: boolean   (default: false)
  onMobileClose?: () => void

Internal useState for mobileOpen has been removed.
The sidebar no longer manages its own open/close state.
All close actions call onMobileClose?.()

---

## 6. Navbar and Footer — Updated Hide Rules

Both components now return null on these route prefixes:

/dashboard
/admin/dashboard
/staff/dashboard
/affiliate/dashboard
/trainer/dashboard
/academy/enroll    <- NEW added in this session

The /academy/enroll/* rule was added because the enrol flow is a
standalone fullscreen experience. The main website nav and footer
must not appear during enrolment.

---

## 7. Bug Fixes in This Session

### 7.1 learning_format in academy_children (NOT NULL violation)

Problem: AcademyEnrollForm replaced learning_format with class_type,
but academy_children still had learning_format as NOT NULL.

Fix 1 (SQL): ALTER TABLE academy_children ALTER COLUMN learning_format DROP NOT NULL
Fix 2 (API): Insert learning_format: class_type in academy_children insert
Fix 3 (API): Destructure class_type from request body in enroll route

### 7.2 Paystack Email Resolution

Problem: enrollment.email was sometimes empty, causing "email required" error.

Fix in app/api/academy/paystack/initialize/route.ts:
  let paymentEmail = enrollment.email || ''
  if (!paymentEmail && enrollment.parent_id) {
    const { data: profile } = await supabase.from('profiles')
      .select('email').eq('id', enrollment.parent_id).single()
    paymentEmail = profile?.email || ''
  }

### 7.3 currency Shorthand in Enroll Route Return

Problem: return statement used currency as shorthand but it was not in scope.
Fix: currency: enrollment?.currency || 'GBP'

### 7.4 Supabase Session in Client Components

Problem: Client components calling supabase.auth.getUser() got
"Auth session missing!" error in production.

Root cause: Next.js App Router does not pass session cookies to
client-side Supabase instances by default.

Permanent fix: Server component fetches all data and passes as props.
Client component only handles UI interactions and saves.
Never call supabase.auth.getUser() from ProfileEditor or SettingsEditor.

### 7.5 Payment Page Written as Empty File

Problem: Python heredoc (<<'PYEOF') and string concatenation approaches
both produced empty files for the payment page.

Permanent fix: Use a saved .py script with direct file.write() calls.
Always verify after writing: wc -l app/academy/enroll/payment/page.tsx

---

## 8. New Files Added Since AGENTS3.md

app/api/academy/paystack/initialize/route.ts  (new)
app/api/academy/paystack/callback/route.ts    (new)
app/api/exchange-rate/route.ts                (new)
app/academy/enroll/verify/page.tsx            (rebuilt)
app/academy/enroll/payment/page.tsx           (rebuilt)
app/dashboard/settings/page.tsx               (new — server component)
app/dashboard/profile/page.tsx                (rebuilt — server component)
app/dashboard/academy/page.tsx                (rebuilt — service role client)
components/academy/ExchangeRateDisplay.tsx    (new)
components/academy/PaystackFeeNotice.tsx      (new)
components/dashboard/DashboardShell.tsx       (new)
components/dashboard/DashboardTopBar.tsx      (new)
components/dashboard/ProfileEditor.tsx        (rebuilt — no auth calls)
components/dashboard/ProfileIncompleteModal.tsx (new)
components/dashboard/SettingsEditor.tsx       (new)
components/dashboard/DashboardSidebar.tsx     (updated — controlled mobile)
components/dashboard/DashboardHome.tsx        (updated — ProfileIncompleteModal)
components/layout/Navbar.tsx                  (updated — hides on enroll)
components/layout/Footer.tsx                  (updated — hides on enroll)
public/.well-known/apple-developer-merchantid-domain-association (new)

---

## 9. Environment Variables — New

Add to Vercel (Settings > Environment Variables) AND .env.local:

| Variable              | Purpose                                  |
| --------------------- | ---------------------------------------- |
| EXCHANGE_RATE_API_KEY | Free key from exchangerate-api.com       |
| FALLBACK_GBP_TO_NGN   | Fallback GBP to NGN rate e.g. 2100      |
| FALLBACK_EUR_TO_NGN   | Fallback EUR to NGN rate e.g. 1950      |

Update fallback values periodically to match current market rates.

---

## 10. Paystack Account Notes

Account type: Nigerian (not international)
This means: can only settle in NGN, cannot charge in GBP or EUR directly.

Fee structure (standard Nigerian merchant):
- Local card: 1.5% + N100, capped at N2,000 (N100 waived under N2,500)
- International card: 3.9% + N100, no cap
- Educational institution rate: 0.7% capped at N1,500 (apply to Paystack)

Recommended actions not yet taken:
1. Apply for educational institution rate via Paystack support
2. Enable "Pass fees to customers" in Paystack Settings > Preferences
   (this makes Paystack add and show fees automatically)
3. Ensure International Payments is ON in Paystack Settings > Preferences

Apple Pay: domain verified, active on iOS and Safari for NGN transactions.

---

## 11. Coding Rules — New Additions

Always use server component to fetch data, pass as props to client editor.
Never call supabase.auth.getUser() from client components in dashboard.
Always use getAdminClient() for all dashboard DB queries.

Never write payment page or other long TSX files using Python heredoc.
Use direct file.write() calls in a saved .py script instead.
Always run wc -l on the file after writing to confirm it is not empty.

Exchange rate: always set FALLBACK_GBP_TO_NGN and FALLBACK_EUR_TO_NGN.
Rate is cached 1 hour in memory — server restarts clear the cache.

Avatar uploads must use bucket 'avatars' with upsert: true.
Path must be avatars/{user_id}/avatar.{ext} for RLS to work.

DashboardShell owns mobileOpen state — never add it back to DashboardSidebar.
DashboardTopBar hamburger calls onMobileMenuToggle from shell.

Navbar and Footer must return null on /academy/enroll/* routes.

Bank transfer IBAN: GB68CLJU04130735651420 (this is the correct version).
GBP method: Faster Payment (FPS).
EUR method: SEPA & SEPA Instant.

Do not remove the Apple Pay Content-Type header from vercel.json.
Do not move the .well-known file out of the public/ directory.

---

## 12. Next Priorities (Updated)

| Priority | Item                                               | Status        |
| -------- | -------------------------------------------------- | ------------- |
| 1        | Test full NGN payment flow end to end              | Needs testing |
| 2        | Test international card payment end to end         | Needs testing |
| 3        | Test profile completion blocks payment             | Needs testing |
| 4        | Apply for educational institution rate (Paystack)  | Not started   |
| 5        | Enable pass fees to customers (Paystack dashboard) | Not started   |
| 6        | Scholarship matching algorithm                     | Not started   |
| 7        | Notifications + messages + email flow (Resend)     | Not started   |
| 8        | Admin dashboard — scholarship review               | Not started   |
| 9        | Admin dashboard — promo code management            | Not started   |
| 10       | Admin dashboard — user management                  | Not started   |
| 11       | Friday cron job — scholarship DB updates           | Not started   |
| 12       | Blog — statistics pages from scholarship DB        | Not started   |
| 13       | Skills landing + individual course pages           | Not started   |
| 14       | Careers landing + individual program pages         | Not started   |
| 15       | Earn With Us landing page                          | Not started   |
| 16       | About + Contact pages                              | Not started   |
| 17       | Trainer application flow                           | Not started   |
| 18       | Trainer dashboard (earnings breakdown)             | Not started   |
| 19       | Affiliate dashboard (full referral tracking)       | Not started   |
| 20       | Academy timetable admin                            | Not started   |
| 21       | Averra Library waitlist backend                    | Not started   |
| 22       | Curriculum content — seed remaining subjects       | Not started   |
