

---

## 24. Addendum — Changes Not Captured at Time of Writing

This section documents everything discovered via git audit (git log a835683..HEAD)
that was missing from the original AGENTS5.md above.

---

### 24.1 New Packages Added to package.json

Three packages were added since AGENTS4.md:

| Package            | Type          | Version   | Purpose                                            |
| ------------------ | ------------- | --------- | -------------------------------------------------- |
| bcryptjs           | dependency    | ^3.0.3    | Hashing staff secret answers and codes (12 rounds) |
| @types/bcryptjs    | devDependency | ^2.4.6    | TypeScript types for bcryptjs                      |
| @deepgram/sdk      | dependency    | ^5.9.0    | Speech recognition SDK — installed, NOT yet wired  |

Import bcryptjs as:
import bcrypt from 'bcryptjs'

Deepgram status correction: Section 22 of this file lists Deepgram as
"Planned". The SDK is now installed in package.json. The integration is
not yet wired to any component. When building Deepgram integration,
the package is already available — do not run npm install again.

---

### 24.2 TipTap — Pre-existing Undocumented Packages

Three TipTap packages exist in package.json and predate AGENTS4.md.
They were never documented in any AGENTS file:

| Package               | Version |
| --------------------- | ------- |
| @tiptap/pm            | ^3.27.1 |
| @tiptap/react         | ^3.27.1 |
| @tiptap/starter-kit   | ^3.27.1 |

These are a rich text editor framework. Their exact usage location in
the codebase is not confirmed — do not remove them.
When a rich text editor is needed anywhere in the project, use TipTap.

---

### 24.3 next.config.ts — Supabase Storage Added to remotePatterns

Commit: 3505d6b

Supabase Storage was added to remotePatterns in next.config.ts so
that avatar images served from Supabase Storage load correctly through
Next.js Image.

When editing next.config.ts, preserve the Supabase Storage entry in
remotePatterns. Do not replace it with a domains key (domains is
removed in Next.js 16).

Never add domains to the images config. Always use remotePatterns.
Do not overwrite next.config.ts without reading its current content first.

---

### 24.4 Secondary Assessment System (MCQ — Year 7+)

AGENTS5.md Section 3 documents only the primary assessment (Year 1-6).
There is a completely separate secondary MCQ assessment system built in
commit 8917e46 that was never documented.

#### Assessment routing

app/dashboard/academy/page.tsx routes students based on year group:

- Primary year groups (Year 1 - Year 6) -> /dashboard/academy/assessment/primary
- Secondary year groups (Year 7+) -> /dashboard/academy/assessment

This routing logic was added in commit adbda20 and is not described
in AGENTS5.md.

This page was also modified in commits adbda20, dce00ad, and 9c855d6.
Its current full behaviour:
- Checks child year group and routes assessment CTA as above
- Shows timetable section with clickable Google Meet links per class entry
- Shows billing period label correctly (Monthly / Termly / Annually)
- Shows active enrollment status, payment status, next steps
When editing this page, preserve all of these behaviours.

#### Secondary assessment files

| File                                              | Purpose                                    |
| ------------------------------------------------- | ------------------------------------------ |
| app/dashboard/academy/assessment/page.tsx         | Entry point — routes primary vs secondary  |
| app/dashboard/academy/assessment/results/page.tsx | Results page after MCQ assessment          |
| components/academy/AssessmentClient.tsx           | Timed MCQ UI for secondary students        |
| app/api/academy/assessment/create/route.ts        | Creates assessment record per child        |
| app/api/academy/assessment/start/route.ts         | Starts assessment, returns questions       |
| app/api/academy/assessment/submit/route.ts        | Submits answers, calculates score          |

#### AssessmentClient — Secondary MCQ behaviour

- Timed test (duration from assessment record)
- One question at a time
- Auto-submits when timer reaches zero
- Score calculated in submit route using reduce accumulator
  (TypeScript type must be explicit — fixes applied in commits 284d66e and 3b8e63b)
- Results page shows score and level result

#### Question Bank Admin Page

app/admin/dashboard/academy/questions/page.tsx

Admin page for managing the assessment question bank.
Added in commit 8917e46 alongside the baseline assessment system.
This page is listed in no AGENTS file. Do not confuse it with
primary_assessment_content (which stores primary assessment content).
The question bank page is for the secondary MCQ system.

#### Assessment routing rules

- Always check year group before routing to assessment
- Year 1-6 -> primary assessment (reading, tracing, audio, sentences)
- Year 7+ -> secondary MCQ assessment
- Never send a primary student to the MCQ route
- Never send a secondary student to the primary route

---

### 24.5 app/api/academy/referral/route.ts

Commit: 9c855d6

This is a separate route from /api/referral/capture/route.ts.
Both exist. Do not confuse them:

| Route                              | Purpose                                                              |
| ---------------------------------- | -------------------------------------------------------------------- |
| /api/referral/capture/route.ts     | Reads averra_ref cookie after payment, credits commission to wallet  |
| /api/academy/referral/route.ts     | Academy-specific referral handling — added with trainer assignment   |

The exact distinction between these two routes is not confirmed from
git alone. Do not delete either. Do not merge them without reading
both files first.

---

### 24.6 Trainer Dashboard Sub-Pages — Complete List

AGENTS5.md Section 15.2 listed trainer sub-pages but omitted several.
Full confirmed list from git:

| Route                              | File                                          | Status |
| ---------------------------------- | --------------------------------------------- | ------ |
| /trainer/dashboard                 | app/trainer/dashboard/page.tsx                | Built  |
| /trainer/dashboard/students        | app/trainer/dashboard/students/page.tsx       | Built  |
| /trainer/dashboard/roadmap         | app/trainer/dashboard/roadmap/page.tsx        | Built  |
| /trainer/dashboard/assessments     | app/trainer/dashboard/assessments/page.tsx    | Built  |
| /trainer/dashboard/classwork       | app/trainer/dashboard/classwork/page.tsx      | Built  |
| /trainer/dashboard/homework        | app/trainer/dashboard/homework/page.tsx       | Built  |
| /trainer/dashboard/tests           | app/trainer/dashboard/tests/page.tsx          | Built  |
| /trainer/dashboard/attendance      | app/trainer/dashboard/attendance/page.tsx     | Built  |
| /trainer/dashboard/results         | app/trainer/dashboard/results/page.tsx        | Built  |
| /trainer/dashboard/courses         | app/trainer/dashboard/courses/page.tsx        | Built  |
| /trainer/dashboard/earnings        | app/trainer/dashboard/earnings/page.tsx       | Built  |
| /trainer/dashboard/schedule        | app/trainer/dashboard/schedule/page.tsx       | Built  |
| /trainer/dashboard/profile         | app/trainer/dashboard/profile/page.tsx        | Built  |
| /trainer/dashboard/settings        | app/trainer/dashboard/settings/page.tsx       | Built  |

---

### 24.7 Staff Dashboard Sub-Pages — Complete List

AGENTS5.md Section 15.3 described the staff dashboard but never listed
its sub-pages. Full confirmed list from git:

| Route                          | File                                      | Status |
| ------------------------------ | ----------------------------------------- | ------ |
| /staff/dashboard               | app/staff/dashboard/page.tsx              | Built  |
| /staff/dashboard/enrollments   | app/staff/dashboard/enrollments/page.tsx  | Built  |
| /staff/dashboard/students      | app/staff/dashboard/students/page.tsx     | Built  |
| /staff/dashboard/messages      | app/staff/dashboard/messages/page.tsx     | Built  |
| /staff/dashboard/profile       | app/staff/dashboard/profile/page.tsx      | Built  |
| /staff/dashboard/settings      | app/staff/dashboard/settings/page.tsx     | Built  |

---

### 24.8 DashboardSidebar — Zero Internal State (Final Confirmed State)

Four sequential fix commits (91f98c8, 3c6754f, d473780, 19bcaff)
resolved the DashboardSidebar state ownership completely.

Final confirmed state:

- DashboardSidebar has NO internal mobileOpen useState
- DashboardSidebar has NO setMobileOpen anywhere in the file
- Props interface includes mobileOpen?: boolean and onMobileClose?: () => void
- All close actions call onMobileClose?.() — never internal state
- DashboardTopBar hamburger calls onMobileMenuToggle from DashboardShell
- DashboardShell is the single owner of mobileOpen state

Do not add mobileOpen state back to DashboardSidebar under any circumstances.

---

### 24.9 Coding Rules — Additions from Audit

#### Deepgram
- SDK is installed (@deepgram/sdk ^5.9.0) — do not run npm install again
- Integration is not yet wired — do not assume any Deepgram code exists
- When building Deepgram integration, import from @deepgram/sdk

#### bcryptjs
- Always import as: import bcrypt from 'bcryptjs'
- Types are installed: @types/bcryptjs ^2.4.6
- Use 12 rounds for all staff credential hashing
- Never store secret answers or secret codes as plain text

#### TipTap
- Three TipTap packages are installed — do not remove them
- Do not install a second version or an older version
- When a rich text editor is needed anywhere in the project, use TipTap

#### next.config.ts
- Always use remotePatterns for external images — never domains
- Supabase Storage entry must remain in remotePatterns
- Do not overwrite next.config.ts without reading its current content first

#### Referral routes
- /api/referral/capture and /api/academy/referral are separate routes
- Do not delete either without reading both files first
- Do not merge them without reading both files first
