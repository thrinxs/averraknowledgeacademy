# AGENTS3.md — Addendum to AGENTS.md and AGENTS2.md

This file documents all changes made **after AGENTS2.md was written**
(after commit 6ca10033). It is a delta, not a replacement.

Read all three files together in order:
1. AGENTS.md — full project foundation
2. AGENTS2.md — tech stack breaking changes + Academy build
3. AGENTS3.md — this file, most recent changes

When instructions conflict, **this file takes precedence** over both
AGENTS2.md and AGENTS.md. AGENTS2.md takes precedence over AGENTS.md.

Baseline: AGENTS2.md commit 6ca10033
HEAD at time of audit: 90c96ff
Branch: main
Remote: https://github.com/thrinxs/averraknowledgeacademy.git

---

## 1. AcademyEnrollForm.tsx — Three Changes

File: `components/academy/AcademyEnrollForm.tsx`

This is the only source file changed since AGENTS2.md was written.
Three commits modified it. All three are described below.

---

### 1.1 country_of_origin Added to initialFormData

**Commit:** `61c5e75 Fix: add country_of_origin to initialFormData`

`country_of_origin` was missing from the form's `initialFormData`
object. It has now been added as an explicit field with an empty
string default.

#### Rule for AI agents

When reading or writing `AcademyEnrollForm.tsx`, always include
`country_of_origin` in `initialFormData`. Never omit it.

Do not confuse `country_of_origin` with `country`. Both fields exist:

| Field               | Purpose                                           |
| ------------------- | ------------------------------------------------- |
| `country`           | Country of residence — determines NGN/GBP pricing |
| `country_of_origin` | Learner's country of origin / nationality         |

If either field is missing from `initialFormData`, the form will reset
to undefined on step navigation and fail validation. Always declare both.

---

### 1.2 Schedule Step — General Class Now Uses Fixed Slots

**Commit:** `fff6537 General class fixed schedule slots, private class custom picker`

The schedule preferences step (Step 5) now behaves differently
depending on `class_type`.

#### General Class (`class_type === 'general'`)

General class users are shown **fixed, pre-defined schedule slots**
to select from. They do not pick a custom time.

Rationale: General class learners are assigned to an existing group.
Averra needs them to select from slots that already exist so they can
be placed in the right cohort.

UI behaviour:

- A grid of fixed time slot buttons is displayed
- Each slot shows the day(s) and time
- User selects one slot
- The amber info box (documented in AGENTS2.md section 5.6) remains
- No custom time picker is shown for general class

#### Private Class (`class_type === 'private'`)

Private class users see a **custom time picker** so they can specify
their preferred days and time freely.

Rationale: Private class is one-on-one. The teacher is assigned to
match the learner's schedule, so full flexibility is appropriate.

UI behaviour:

- Day selector (multi-select checkboxes or buttons for preferred days)
- Time input or dropdown for preferred start time
- Timezone selector
- Free-text notes field for additional schedule preferences

#### Rules for AI agents

- Never render the custom time picker for `class_type === 'general'`
- Never render fixed slots for `class_type === 'private'`
- Always branch the schedule step UI on `class_type`
- The `preferred_days`, `preferred_time`, and `timezone` fields still
  exist in `academy_enrollments` for both class types — only the UI differs
- For general class, `preferred_time` stores the selected fixed slot
  identifier or label
- Do not remove or rename `preferred_days`, `preferred_time`, or
  `timezone` from the form state or the API payload

---

### 1.3 Redeploy Trigger

**Commit:** `90c96ff Trigger redeploy`

This commit made no code changes. It was a blank commit used to
trigger a fresh Vercel deployment. No logic was altered.

---

## 2. vercel.json — Documented for the First Time

File: `./vercel.json` (project root)

This file exists in the project but was never mentioned in AGENTS.md
or AGENTS2.md.

#### Rules for AI agents

- Do not delete `vercel.json`
- Do not overwrite it without reading its current contents first
- If you need to add Vercel configuration (headers, redirects, rewrites,
  function regions, cron jobs), add it to this file — do not create a
  second Vercel config
- The file is at the project root alongside `next.config.ts`

---

## 3. .gitignore — Recommended Addition

The audit script and its output folder are currently untracked.
Add the following lines to `.gitignore`:

# AGENTS audit script and output
make-agents3-report.sh
agents3_audit_*/

# Supabase seed / fix SQL files (local use only)
supabase_*.sql
fix_*.sql
check_*.sql

---

## 4. Complete State Summary — AcademyEnrollForm

This section summarises the current correct state of the form so an
AI agent can reconstruct or modify it without reading all three
AGENTS files for Academy form details.

### Form flows
- 'parent' — 6 steps (0-6)
- 'student' — 7 steps (0-7)

### initialFormData — Required Fields

All of the following must be present in initialFormData:

  // Step 0
  applicant_type: '' as 'parent' | 'student' | '',

  // Step 1 — Your Information
  full_name: '',
  email: '',
  phone: '',
  whatsapp: '',
  country: '',              // country of RESIDENCE — sets NGN/GBP
  country_of_origin: '',    // learner's nationality — added in commit 61c5e75
  date_of_birth: '',
  relationship: '',         // parent flow only

  // Step 2 — Learner Details (parent) / Academic Info (student)
  learners: [],

  // Step 4 — Class Type and Pricing
  class_type: '' as 'private' | 'general' | '',
  currency: '' as 'NGN' | 'GBP' | '',
  monthly_price: 0,
  billing_period: 'monthly' as 'monthly' | 'termly' | 'annually',
  billing_amount: 0,

  // Step 5 — Schedule Preferences
  preferred_days: [],
  preferred_time: '',
  timezone: '',
  notes: '',

  // Step 6/7 — Account Creation
  password: '',
  confirm_password: '',
  agree_terms: false,
  agree_privacy: false,

  // Student flow only (Step 6 — Parent Access)
  wants_parent_access: false,
  optional_parent_name: '',
  optional_parent_email: '',
  optional_parent_phone: '',
  optional_parent_relationship: '',

  // Optional
  heard_from: '',

### Schedule step UI — current behaviour

| class_type  | UI rendered         | preferred_time stores        |
| ----------- | ------------------- | ---------------------------- |
| 'general'   | Fixed slot selector | Selected slot label/id       |
| 'private'   | Custom time picker  | User-entered preferred time  |

### Pricing constants (from AGENTS2.md section 5.4 — unchanged)

NGN per learner per month:

| Subjects | Private   | General   |
| -------- | --------- | --------- |
| 1-2      | N100,000  | N50,000   |
| 3-4      | N180,000  | N90,000   |
| 5-6      | N250,000  | N120,000  |

GBP per learner per month:

| Subjects | Private | General |
| -------- | ------- | ------- |
| 1-2      | 100     | 50      |
| 3-4      | 180     | 90      |
| 5-6      | 250     | 120     |

Billing discounts: Monthly 0%, Termly (3 months) 5%, Annually 10%.
Maximum subjects per learner: 6. No registration fee.

### Currency logic (unchanged from AGENTS2.md)

- country === 'NG' -> currency = 'NGN' -> Paystack
- All other countries -> currency = 'GBP' -> Bank transfer (FPS)

---

## 5. No Other Changes

The following areas were **not changed** since AGENTS2.md and remain
exactly as documented there:

- All database tables (academy_enrollments, academy_children,
  academy_countries, country_subjects, local_curricula,
  averra_super_curriculum, year_group_equivalencies)
- All API routes (/api/academy/enroll, /api/academy/confirm-payment,
  /api/auth/role)
- All Paystack routes (/api/paystack/initialize, /callback, /webhook)
- All scholarship routes and form steps
- All auth pages and auth flow
- All admin dashboard pages
- All student dashboard pages
- Navbar, Footer, legal pages, homepage sections
- All Next.js 16 rules from AGENTS2.md
- All Supabase Auth rules from AGENTS2.md
- CurriculumExplorer and all curriculum database tables

---

## 6. Next Priorities (Updated)

| Priority | Item                                               | Status      |
| -------- | -------------------------------------------------- | ----------- |
| 1        | Scholarship matching algorithm                     | Next        |
| 2        | Notifications + messages + email flow (Resend)     | Not started |
| 3        | Admin dashboard — scholarship review, match verify | Not started |
| 4        | Admin dashboard — promo code management            | Not started |
| 5        | Admin dashboard — user management                  | Not started |
| 6        | Friday cron job — scholarship DB updates           | Not started |
| 7        | Blog — statistics pages from scholarship DB        | Not started |
| 8        | Skills landing + individual course pages           | Not started |
| 9        | Careers landing + individual program pages         | Not started |
| 10       | Earn With Us landing page                          | Not started |
| 11       | About + Contact pages                              | Not started |
| 12       | Trainer application flow                           | Not started |
| 13       | Trainer dashboard (earnings breakdown)             | Not started |
| 14       | Affiliate dashboard (full referral tracking)       | Not started |
| 15       | Academy timetable admin (placeholder exists)       | Not started |
| 16       | Averra Library waitlist backend                    | Not started |
| 17       | Curriculum content — seed remaining subjects       | Not started |
| 18       | Academy — NGN payment via Paystack                 | Not started |

---

## 7. Quick Reference — Rules Added or Confirmed in This File

- Always include country_of_origin in AcademyEnrollForm initialFormData
- Always branch schedule step UI on class_type (fixed slots vs custom picker)
- Never render custom picker for general class
- Never render fixed slots for private class
- Do not delete or overwrite vercel.json without reading it first
- Add agents3_audit_*/ and make-agents3-report.sh to .gitignore
- Add supabase_*.sql, fix_*.sql, check_*.sql to .gitignore if not already present
