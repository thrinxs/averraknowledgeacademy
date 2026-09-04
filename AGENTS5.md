# AGENTS5.md — Addendum to AGENTS.md, AGENTS2.md, AGENTS3.md, and AGENTS4.md

This file documents all changes made **after AGENTS4.md was written**
(after commit a835683). It is a delta, not a replacement.

Read all five files together in order:
1. AGENTS.md — full project foundation
2. AGENTS2.md — tech stack breaking changes + Academy build
3. AGENTS3.md — schedule step changes, country_of_origin fix
4. AGENTS4.md — payment system, profile, settings, dashboard top bar
5. AGENTS5.md — this file, most recent changes

When instructions conflict, **this file takes precedence** over all previous files.

Baseline: AGENTS4.md commit a835683
HEAD at time of audit: 1dd0440
Branch: main
Remote: https://github.com/thrinxs/averraknowledgeacademy.git

---

## 1. Staff Login System (3-Step Authentication)

### 1.1 Staff Login Page
File: app/auth/staff-login/page.tsx

URL: /auth/staff-login
Dark navy background (#062850). Used by: admin, staff, trainer, principal.

3-step flow:
- Step 1: Email + password
- Step 2: Secret question answer
- Step 3: Secret code

Account locked after 3 failed attempts on step 2 or 3.
Admin notified via in-app notification when account locked.
Admin can unlock from /admin/dashboard/staff.

### 1.2 Staff Onboarding
File: app/auth/staff-onboarding/page.tsx
File: components/auth/StaffOnboardingForm.tsx

Admin sends invite via /admin/dashboard/staff -> invite form.
Staff receives email with onboarding link containing a 48-hour token.
Staff completes: profile photo upload, secret question selection, answer, secret code, password.
On completion: account activated, redirected to /auth/staff-login.

### 1.3 Staff Credentials Table
Table: staff_credentials

Columns: user_id, secret_question, secret_answer_hash (bcrypt), secret_code_hash (bcrypt),
failed_attempts, locked_at, onboarding_completed, onboarding_token, onboarding_token_expires_at.

Answers hashed with bcrypt (12 rounds). Never stored plain text.

### 1.4 API Routes — Staff
- POST /api/staff/verify — handles all 3 login steps
- GET/POST /api/staff/onboarding — validates token, completes setup
- POST /api/staff/invite — admin sends onboarding email
- POST /api/staff/unlock — admin unlocks locked account
- GET /api/staff/list — admin views all staff members

### 1.5 Roles That Use Staff Login
admin, staff, trainer, principal — all use /auth/staff-login.
Affiliates and students use /auth/login (main login).
Subtle "Staff / Admin Login" link at bottom of main login page.

---

## 2. Admin Dashboard — Full Rebuild

### 2.1 Admin Layout Architecture
Same Shell pattern as student/trainer dashboards:
- app/admin/dashboard/layout.tsx — server component, auth check
- components/admin/AdminShell.tsx — client, owns mobileOpen state
- components/admin/AdminSidebar.tsx — left nav, controlled mobile
- components/admin/AdminTopBar.tsx — top bar with avatar dropdown

AdminTopBar dropdown: Staff Management, My Profile, Back to Website, Sign Out.
Admin signs out to /auth/staff-login (not /auth/login).

### 2.2 Confirm Payment Modal
File: components/admin/ConfirmPaymentModal.tsx
File: components/admin/ConfirmPaymentButton.tsx

Replaces the old HTML form POST. Now opens a modal with:
- Amount received field (pre-filled with expected amount)
- Discount selector (none / percentage / fixed)
- Live payment summary showing final amount
- Receipt upload (image or PDF, max 10MB, uploaded to Supabase avatars bucket under receipts/ path)
- Admin notes field

On confirm: updates payment_status to paid, activates children, sends email, creates assessment.

New columns added to academy_enrollments:
amount_received, discount_type, discount_value, final_amount_paid, admin_notes, receipt_url.

### 2.3 Admin Sidebar Sections
Scholarships, Academy, Staff, Referrals, Users, Communications, Content.

Academy sub-items: Enrollments, Children Profiles, Timetables, Question Bank, Assessments, Roadmap, Classwork, Homework, Class Groups.

---

## 3. Primary Assessment System (Reading, Tracing, Audio, Sentences)

### 3.1 Assessment Flow
Payment confirmed -> assessment created per child -> student sees Start Assessment banner.
Primary year groups (Y1-Y6) -> /dashboard/academy/assessment/primary
Secondary year groups (Y7+) -> /dashboard/academy/assessment (MCQ)

### 3.2 Device Selection Screen
First screen shown when student clicks Start Assessment.
Options: Phone, Tablet, Laptop, Desktop.
Choice saved permanently to profiles.device_type column.
UI adapts: canvas height, tracing hints, mic button size.

### 3.3 Four Assessment Sections (English)
Current lengths after parent feedback:
- Reading: 1 passage (unchanged)
- Tracing: 5 words (reduced from 10)
- Audio questions: 4 questions (reduced from 8)
- Sentence starters: 3 sentences (reduced from 5)

Between subjects: transition screen shown, student clicks Continue.

### 3.4 Audio Recording
Uses MediaRecorder API to record actual audio files.
Uploaded to Supabase Storage bucket: academy-audio
Path: assessments/{assessment_id}/reading.webm, audio_q{id}.webm, sentence_{id}.webm
Audio URLs stored in assessment subject_scores JSON.

### 3.5 Speech Recognition Fix
Uses accumulated transcript pattern (not replace).
All final results concatenated — no more cut words.
Still uses Web Speech API (browser built-in, free).
Deepgram integration planned but not yet built.

### 3.6 Canvas Tracing Fix
Coordinate scaling applied: x = (pointerX - rect.left) * (canvas.width / rect.width)
Fixes the offset issue where drawn line did not match pointer position.
Works correctly on all screen sizes and device types.

### 3.7 Admin Review Page
File: app/admin/dashboard/academy/assessments/page.tsx

Shows all completed assessments.
For primary assessments: play audio inline, download button per recording.
Shows reading transcript, speaking responses, sentence responses.
Badge shown when audio review is needed.

### 3.8 Primary Assessment Content Table
Table: primary_assessment_content

Content types: reading_passage, word_list, audio_question, sentence_construction.
Seeded for Year 1, Year 2, Year 3 (English).
Math content for Year 2 pending SQL insert.

Year group codes must match exactly: Year 1, Year 2, Year 3 (not Y1, Y2, Y3).
Run this to fix if needed:
UPDATE academy_children SET year_group_code = 'Year 2' WHERE year_group_code = 'Y2';

---

## 4. Learning Roadmap System

### 4.1 Tables
Table: learning_roadmap_progress
Columns: child_id, enrollment_id, subject_code, topic_unit, topic_name, topic_index, status, started_at, completed_at, completed_by, trainer_notes.
Status values: upcoming, current, completed.

### 4.2 Generation
API: POST /api/academy/roadmap/generate
Called when trainer is assigned to a child.
Reads from averra_super_curriculum for the child's year group and subjects.
Creates one topic row per topic per subject.
First topic set to current, all others upcoming.

IMPORTANT: Year group code must match averra_super_curriculum exactly.
If roadmap shows empty, check year_group_code format and run generate API manually via curl.

### 4.3 RoadmapView Component
File: components/academy/learning/RoadmapView.tsx

Shared component used on student, trainer, and admin pages.
Props: topics, childName, canEdit, onUpdateStatus, childId.
canEdit=true: trainer can mark topics as taught, access lesson plans.
canEdit=false: read-only view for student and admin.

Colour coding:
- Green: completed
- Blue pulsing dot: current (currently teaching)
- Grey: upcoming

### 4.4 Lesson Plans
API: GET /api/academy/lesson-plan
Auto-generates lesson plan per topic from curriculum content.
Saves to lesson_plans table to avoid regenerating.
Format: objectives, starter_activity, main_teaching, practice_activity, plenary, resources, differentiation, assessment_criteria.
Trainer can view and download as .txt file.
Principal can edit via /principal/dashboard/curriculum.

### 4.5 Roadmap Routes
- /dashboard/academy/roadmap — student view (read-only)
- /trainer/dashboard/roadmap — trainer view (can mark taught, see lesson plans)
- /admin/dashboard/academy/roadmap — admin view (all students)
- /principal/dashboard/curriculum — principal edits lesson plans

---

## 5. Classwork System

### 5.1 Auto-Generation
API: POST /api/academy/classwork/generate
Generates 5 questions per subject per day from current roadmap topic.
Question types: 3 MCQ + 1 true/false + 1 written.
Stored in classwork table with assigned_date = today.

KNOWN LIMITATION: Questions are template-based, not curriculum-aligned.
Full curriculum seeding is required before questions can be properly aligned.

### 5.2 Student UI
File: components/academy/learning/ClassworkClient.tsx

Child-friendly design: colourful subject cards with emojis.
One question at a time (not overwhelming).
Progress dots show answered/unanswered.
Star rating on completion (1-3 stars based on score).
Generate button if no classwork exists yet.

### 5.3 Scoring
MCQ and true/false: auto-graded exact match.
Written: 50% marks awarded pending teacher review.
Score stored in classwork.score, status set to submitted.

### 5.4 Routes
- /dashboard/academy/classwork — parent/student classwork
- /child/dashboard/classwork — child account classwork
- /trainer/dashboard/classwork — trainer sees all students
- /admin/dashboard/academy/classwork — admin overview

---

## 6. Homework System

### 6.1 Auto-Generation
API: POST /api/academy/homework/generate
5 questions per subject: 3 written + 1 MCQ + 1 true/false.
Homework questions are reflection-based (explain, give example, teach someone).
Due date set to next day automatically.

### 6.2 Student UI
File: components/academy/learning/HomeworkClient.tsx
Same pattern as ClassworkClient but with homework-specific prompts.

### 6.3 Routes
- /dashboard/academy/homework — parent view
- /child/dashboard/homework — child account view
- /trainer/dashboard/homework — trainer overview
- /admin/dashboard/academy/homework — admin overview

---

## 7. Tests and Exams System

### 7.1 Generation
API: POST /api/academy/tests/generate
type: monthly_test (20 questions, 30 mins) or quarterly_exam (40 questions, 60 mins).
Questions drawn from completed roadmap topics for the period.
Stored in tests_exams table.

### 7.2 Student Test UI
File: components/academy/learning/TestTakingClient.tsx

Intro screen: shows question count, time limit, rules.
Timed test: countdown timer in top bar, turns red under 1 minute.
Auto-submits when time reaches zero.
One question at a time with answer grid overview.
Results page shows score, stars, level result.

### 7.3 Routes
- /dashboard/academy/tests — list scheduled and completed tests
- /dashboard/academy/tests/take?test_id=xxx — take timed test
- /trainer/dashboard/tests — trainer generates tests per student

### 7.4 Tables
Table: tests_exams
Columns: child_id, enrollment_id, trainer_id, subject_code, type, title, questions, scheduled_date, duration_minutes, status, responses, score, max_score, level_result, is_auto_generated.

---

## 8. Attendance System

### 8.1 API
File: app/api/academy/attendance/route.ts
POST: mark attendance (present/absent/late) per child per subject per date.
GET: fetch attendance records filtered by child_id and month.
Upsert on conflict (child_id, class_date, subject_code).

### 8.2 Trainer Attendance Page
File: app/trainer/dashboard/attendance/page.tsx
Client component. Loads children via /api/academy/students.
Shows each child's subjects with Present/Late/Absent buttons.
Saves immediately on click with visual feedback.

### 8.3 Table
Table: attendance
Columns: child_id, enrollment_id, trainer_id, class_date, subject_code, status, notes, marked_by.
Unique constraint: (child_id, class_date, subject_code).

---

## 9. Timetable System — Full Build

### 9.1 TimetableBuilder Component
File: components/admin/TimetableBuilder.tsx

Props: childId, subjects, studentTimezone, initialEntries, onChange.
Supports two entry types: weekly (recurring) and oneoff (specific date).
Time entered in WAT (Nigerian time, UTC+1).
Auto-converts to student's local timezone using getTimezoneOffset().
Shows both times side by side:
- Orange badge: Nigeria (WAT)
- Blue badge: Student local time

Google Meet link per class entry.
Admin/Principal can add rows, remove rows, edit any field.
Edit button appears on confirmed timetables.

### 9.2 Confirm Timetable
API: POST /api/academy/timetable
Saves timetable as JSON array to academy_children.timetable.
Sets timetable_confirmed = true on both child and enrollment.
Sends email to parent with timetable details.
Creates in-app notification for parent.

### 9.3 Student Timetable View
Student sees timetable as clean cards: day, time (WAT + local), subject, Join Class button.
Join Class button links to Google Meet URL.
Today's classes highlighted in green.

### 9.4 Class Slots (General Class)
File: app/admin/dashboard/academy/class-slots/page.tsx
Table: class_slots

Default slot created: Group A, Monday/Wednesday/Friday, 5:00 PM – 6:00 PM WAT.
Admin can create more groups with different days/times/Meet links.
Max students per group configurable.

### 9.5 Principal Timetable Manager
File: app/principal/dashboard/timetable/page.tsx
File: components/principal/PrincipalTimetableClient.tsx

Principal can view ALL students' timetables in one place.
Can assign tutors and set timetables for any student.
Shows existing class slots for reference.

---

## 10. Trainer Assignment System

### 10.1 API
File: app/api/academy/assign-trainer/route.ts
POST: assigns trainer to a child. Admin or Principal can assign.
Updates academy_children.assigned_trainer_id and assigned_trainer_name.
Notifies trainer via in-app notification.
Auto-generates learning roadmap for the child after assignment.

### 10.2 Admin Enrollment Detail
File: app/admin/dashboard/academy/EnrollmentDetailClient.tsx (client)
File: app/admin/dashboard/academy/[id]/page.tsx (server)

Server page fetches: enrollment, parent profile, children, trainers list, classType, scheduleNotes.
Client component handles: trainer dropdown + assign button, timetable builder, confirm button.
classType derived from first child's learning_format column.
scheduleNotes parsed from enrollment.notes column.

---

## 11. Results System

### 11.1 Student Results Page
File: app/dashboard/academy/results/page.tsx
File: app/child/dashboard/results/page.tsx (child account version)

Shows: classwork average, homework average, test average.
Lists recent classwork, homework, tests with scores.
Child version shows stars (1-3) instead of percentage for primary students.

### 11.2 Trainer Results Page
File: app/trainer/dashboard/results/page.tsx
Shows results for all assigned students.
Quick links to view individual student's assessment results.

### 11.3 Principal Results Page
File: app/principal/dashboard/results/page.tsx
Platform-wide results across all students and subjects.

---

## 12. Referral System — Full Build

### 12.1 Database Tables
Table: referrals — records each referral event
Table: referral_wallet — running balance per user (total_earned, total_paid, pending_payout)
Table: referral_payouts — payout requests from users

### 12.2 Referral Links
Format: averraknowledgeacademy.com/{service}?ref=XXXXXXXX
Ref code = first 8 chars of user ID (uppercase).
Services: scholarship, academy/junior, skills, careers.

### 12.3 RefCapture Component
File: components/referral/RefCapture.tsx
Client component. Reads ?ref= from URL params.
Stores in: localStorage (averra_ref_code) and cookie (averra_ref, 30 days).
Must be added to landing pages via Suspense wrapper.
NOT YET WIRED to landing pages — pending.

### 12.4 Commission Rates
- Scholarship Basic: 10% of ₦30,000 = ₦3,000
- Scholarship Standard: 10% of ₦50,000 = ₦5,000
- Scholarship Premium: 10% of ₦150,000 = ₦15,000
- Academy Standard: 10% of ₦50,000 = ₦5,000
- Academy Premium: 10% of ₦100,000 = ₦10,000

### 12.5 Capture API
File: app/api/referral/capture/route.ts
Called after payment confirmed (academy Paystack callback, confirm-payment, scholarship callback).
Reads averra_ref cookie from request headers.
Finds referrer by matching ref code (first 8 chars of user ID).
Credits commission to referral_wallet (total_earned + pending_payout).
Creates in-app notification for referrer.
Ignores self-referrals.

### 12.6 User Earn Page
File: app/dashboard/earn/page.tsx
Shows: total earned, pending payout, total paid out, referral count.
Shows referral links per service with copy and WhatsApp share buttons.
Payout request form: amount + bank details.
Commission rates table.
Referral history list.
Payments made every Friday by admin.

### 12.7 Admin Referral Page
File: app/admin/dashboard/referrals/page.tsx
File: components/admin/AdminPayoutClient.tsx
Shows pending payout requests with bank details.
Mark as Paid button: updates wallet, notifies user, records paid_at.
Shows all recent referrals platform-wide.

---

## 13. Principal Role — Full System

### 13.1 Role Definition
Role value in profiles.role: 'principal'
Login: /auth/staff-login (3-step auth, same as trainer)
Dashboard: /principal/dashboard

### 13.2 Principal vs Trainer vs Admin
Principal: academic authority, manages all students and tutors, no financial access.
Trainer: own students only, teaching and grading.
Admin: full platform control including payments and staff management.

### 13.3 Principal Dashboard Pages
- /principal/dashboard — home with stats and alerts
- /principal/dashboard/students — all students across all tutors
- /principal/dashboard/tutors — all trainers with student counts
- /principal/dashboard/curriculum — edit lesson plans (full build)
- /principal/dashboard/timetable — manage all timetables
- /principal/dashboard/results — platform-wide results
- /principal/dashboard/attendance — placeholder
- /principal/dashboard/profile — uses shared ProfileEditor
- /principal/dashboard/settings — uses shared SettingsEditor

### 13.4 Principal Curriculum Manager
File: app/principal/dashboard/curriculum/page.tsx (full client component)

Reads from lesson_plans table.
Groups by subject with progress rings showing % plans edited.
Expandable subject sections.
Edit modal for each plan: all fields editable.
Saves with is_auto_generated = false to distinguish principal edits.
Filters by subject and year group.

### 13.5 Permissions Extended to Principal
- assign-trainer API: admin OR principal
- timetable API: admin OR staff OR principal
- Staff login: admin OR staff OR trainer OR principal
- Staff invite: can invite as principal role

### 13.6 Current Principal
Gift Kanikwu — email: kanikwugift94@gmail.com
Role upgraded via SQL: UPDATE profiles SET role = 'principal' WHERE email = 'kanikwugift94@gmail.com'

---

## 14. Child Account System

### 14.1 Database Changes
Column added to profiles: account_type (standard / child / trusted_person)
Column added to profiles: parent_user_id (uuid, FK to profiles)
Column added to academy_children: child_user_id (uuid, FK to profiles)

### 14.2 Creating Child Accounts
Parent goes to /dashboard/academy/children.
File: components/academy/learning/ChildAccountManager.tsx
Fills in child's email and password.
API: POST /api/academy/child-account/create
Creates Supabase auth user with email_confirm: true.
Sets profile.account_type = 'child' and profile.parent_user_id = parent's ID.
Sets academy_children.child_user_id = new auth user ID.
Sends welcome email to child with login details.

### 14.3 Child Routing
When child logs in -> /dashboard -> layout.tsx detects account_type = 'child' -> redirect('/child/dashboard').
utils/auth.ts updated: getDashboardRouteByRole now accepts accountType parameter.
getAgeGroup() helper determines 'primary' vs 'secondary' from year group code.

### 14.4 Child Dashboard — Primary (Ages 5-10)
File: app/child/dashboard/page.tsx (primary section)

Big emoji greeting with time of day.
3 stat cards: Classwork done, Homework done, Topics learned.
Today's classes with green highlighted cards and Join button.
4 big colourful action cards: Do Classwork, Do Homework, My Classes, My Progress.
Subject badges with emojis.
Motivational banner at bottom.

### 14.5 Child Dashboard — Secondary (Ages 11-18)
Same page, different rendering branch based on ageGroup.
Standard clean layout without billing or payment information.
Quick links to classwork, homework, roadmap, results.

### 14.6 Child Navigation
File: components/child/ChildSidebar.tsx

Primary nav items use large emojis and friendly labels:
Home (🏠), My Classes (📅), Classwork (✏️), Homework (📝), My Progress (🌟), My Results (🏆).

Secondary nav uses standard labels with small emojis.
No billing, no payments, no settings, no referrals.

### 14.7 Child Pages
All child pages check account_type === 'child'. Non-child redirected to /dashboard.
- /child/dashboard — home
- /child/dashboard/classwork — uses ClassworkClient
- /child/dashboard/homework — uses HomeworkClient
- /child/dashboard/timetable — shows schedule, Join Class button
- /child/dashboard/roadmap — read-only RoadmapView
- /child/dashboard/results — stars for primary, percentage for secondary

### 14.8 Navbar/Footer
Hidden on /child/dashboard/* routes (added to hide list in Navbar and Footer).

---

## 15. Trainer and Staff Dashboards

### 15.1 Trainer Dashboard
Layout: app/trainer/dashboard/layout.tsx + components/trainer/TrainerShell.tsx
Sidebar: TrainerSidebar, TopBar: TrainerTopBar

Nav items: Dashboard, My Students, Learning Roadmap, Assessments, Classwork,
Homework, Tests and Exams, Attendance, Schedule, Earnings, My Profile, Settings.

Trainer home shows real student count and assessments-to-review count.

### 15.2 Trainer Sub-Pages Built
- /trainer/dashboard/students — assigned students with timetable display
- /trainer/dashboard/roadmap — mark topics taught, download lesson plans
- /trainer/dashboard/assessments — view/play/download student audio
- /trainer/dashboard/classwork — today's classwork overview
- /trainer/dashboard/homework — today's homework overview
- /trainer/dashboard/tests — generate monthly tests and quarterly exams
- /trainer/dashboard/attendance — mark present/absent/late per class
- /trainer/dashboard/results — all student results

### 15.3 Staff Dashboard
Layout: app/staff/dashboard/layout.tsx + components/staff/StaffShell.tsx
Nav items: Dashboard, Enrollments, Students, Messages, My Profile, Settings.
Staff home shows total students, active/pending enrollments.

---

## 16. Pricing Update — Academy Plans

### 16.1 New Pricing (replaces old range-based pricing)
| Plan | Nigeria | International |
|---|---|---|
| Basic (pre-recorded) | ₦15,000/subject/month | £10/subject/month |
| Standard (General Class) | ₦50,000/month | £30/month |
| Premium (Private Class) | ₦100,000/month | £55/month |

GBP pricing is now flat (not range-based).
NGN pricing: Private = ₦100,000 flat regardless of subjects (was ₦100k-250k).
General = ₦50,000 flat (was ₦50k-120k).

Updated in:
- components/academy/AcademyEnrollForm.tsx (NGN_PRICING and GBP_PRICING constants)
- app/academy/junior/page.tsx (pricing display)

### 16.2 Existing Enrollments Updated
Dan Dan and Happiness Tudum: billing_amount updated from £265 to £55 via SQL.
Children monthly_fee updated from £240 to £55.

---

## 17. Academy Emails — Professional Templates

### 17.1 Email File
File: lib/academy-emails.ts

Three email functions:
- sendEnrollmentWelcomeEmail — welcome + payment instructions + next steps
- sendAdminEnrollmentAlert — new enrollment alert to admin
- sendPaymentConfirmedEmail — payment confirmed + what happens next

### 17.2 Email Design
HTML email with Averra branding: navy header (#062850), logo image, styled sections.
Hero image auto-selected based on learner's year group:
- Year 1-6: /public/academy/students/primary.png or middle.png or senior.png
Welcome email: no bank details, focus on journey, step-by-step next steps, dashboard CTA button.

### 17.3 When Emails Fire
1. Enrolment registered: welcome email to parent + alert to admin
2. Payment confirmed (Paystack): confirmation email to parent
3. Payment confirmed (bank transfer): confirmation email to parent
4. Timetable confirmed: timetable email to parent (from timetable API)

---

## 18. New Database Tables (Since AGENTS4.md)

| Table | Purpose |
|---|---|
| staff_credentials | Staff login security (secret Q+A, secret code, bcrypt hashed) |
| class_slots | General class groups with days, times, Meet links |
| learning_roadmap_progress | Per-child topic progress tracking |
| lesson_plans | Auto-generated and principal-edited lesson plans |
| primary_assessment_content | Reading passages, word lists, audio questions, sentence starters |
| assessments | Baseline assessment records per child |
| assessment_responses | Answers per question per assessment |
| classwork | Daily classwork assignments |
| homework | Daily homework assignments |
| tests_exams | Monthly tests and quarterly exams |
| attendance | Class attendance records |
| student_reports | Monthly progress reports |
| referrals | Referral events (who referred whom) |
| referral_wallet | Running earnings balance per user |
| referral_payouts | Payout requests |
| academy_referrals | (duplicate — use referrals table instead) |
| trusted_persons | (planned — not yet built) |

---

## 19. New Environment Variables (Since AGENTS4.md)

No new env vars required. All existing vars still valid.
EXCHANGE_RATE_API_KEY, FALLBACK_GBP_TO_NGN, FALLBACK_EUR_TO_NGN still required.

---

## 20. Files Structure — New Since AGENTS4.md

### App routes (new)
app/auth/staff-login/page.tsx
app/auth/staff-onboarding/page.tsx
app/child/dashboard/* (7 pages)
app/principal/dashboard/* (9 pages)
app/trainer/dashboard/* (12 pages)
app/staff/dashboard/* (7 pages)
app/dashboard/academy/assessment/* (3 pages)
app/dashboard/academy/classwork/page.tsx
app/dashboard/academy/homework/page.tsx
app/dashboard/academy/roadmap/page.tsx
app/dashboard/academy/results/page.tsx
app/dashboard/academy/tests/* (2 pages)
app/dashboard/academy/children/page.tsx
app/dashboard/earn/page.tsx
app/admin/dashboard/academy/* (8 new pages)
app/admin/dashboard/referrals/page.tsx
app/admin/dashboard/staff/page.tsx

### API routes (new)
app/api/staff/* (invite, list, onboarding, unlock, verify)
app/api/academy/assessment/* (create, primary, primary/submit, start, submit)
app/api/academy/assign-trainer/route.ts
app/api/academy/attendance/route.ts
app/api/academy/child-account/create/route.ts
app/api/academy/classwork/* (generate, route, submit)
app/api/academy/homework/* (generate, route, submit)
app/api/academy/lesson-plan/route.ts
app/api/academy/paystack/* (callback, initialize)
app/api/academy/referral/route.ts
app/api/academy/roadmap/* (generate, update)
app/api/academy/students/route.ts
app/api/academy/tests/* (generate, submit)
app/api/academy/timetable/route.ts
app/api/exchange-rate/route.ts
app/api/referral/* (capture, payout, route)

### Components (new)
components/academy/assessment/PrimaryAssessmentClient.tsx
components/academy/learning/* (6 components)
components/admin/* (AdminShell, AdminTopBar, ConfirmPaymentButton, ConfirmPaymentModal, TimetableBuilder, AdminPayoutClient)
components/auth/* (StaffLoginForm, StaffOnboardingForm)
components/child/* (ChildShell, ChildSidebar, ChildTopBar)
components/principal/* (PrincipalShell, PrincipalSidebar, PrincipalTopBar, PrincipalTimetableClient)
components/referral/RefCapture.tsx
components/staff/* (StaffShell, StaffSidebar, StaffTopBar)
components/trainer/* (TrainerShell, TrainerSidebar, TrainerTopBar)
lib/academy-emails.ts

---

## 21. Coding Rules — New Additions Since AGENTS4.md

### Child accounts
- Always check profile.account_type === 'child' on child pages
- Child pages redirect non-child users to /dashboard
- Never show billing, payments, referrals, or settings on child pages
- Use getAgeGroup() from utils/auth.ts to determine primary vs secondary UI

### Year group codes
- Always store as 'Year 2' format (not 'Y2') in academy_children
- averra_super_curriculum uses 'Year 2' format
- primary_assessment_content uses 'Year 2' format
- If mismatch, run: UPDATE academy_children SET year_group_code = 'Year 2' WHERE year_group_code = 'Y2'

### Staff authentication
- Staff login uses /auth/staff-login not /auth/login
- After successful login: window.location.href = '/dashboard' which layout redirects by role
- Principal redirects to /principal/dashboard
- bcryptjs used for hashing — never store answers or codes plain text
- Account locked after 3 failed attempts on step 2 or 3

### Timetable
- All times entered in WAT (Africa/Lagos, UTC+1)
- TimetableBuilder stores entries as JSON array in academy_children.timetable
- Student display time auto-converted from WAT to student's timezone
- Google Meet links stored per entry in the JSON array

### Assessment content
- primary_assessment_content seeded for English Year 1-3
- Math assessment content for Year 2 pending SQL insert (see AGENTS5 Item 3.8)
- Curriculum seeding is the prerequisite for proper question generation
- Do NOT generate questions without proper curriculum content in database

### Referral
- RefCapture component must be wrapped in Suspense (uses useSearchParams)
- Ref code = first 8 chars of user ID, uppercase
- averra_ref cookie expires in 30 days
- Commission is 10% of first month fee, credited after payment confirmed
- Never credit self-referrals

---

## 22. What Is Still NOT Built

| Item | Notes |
|---|---|
| RefCapture wired to landing pages | Component built, not added to pages yet |
| Math assessment content SQL | SQL printed in session, not yet run |
| Curriculum seeding (full) | Only Maths Year 1-13 and English Year 1-3 seeded |
| Scholarship matching algorithm | Flagship service, not started |
| Skills landing + course pages | Not started |
| Careers landing + programme pages | Not started |
| About + Contact pages | Not started |
| Earn With Us landing page | Not started |
| Monthly reports (PDF) | Not started |
| Principal attendance page (full) | Placeholder only |
| Trusted person system | Tables not created, not built |
| Deepgram integration | Planned for speech recognition improvement |

---

## 23. Next Priorities

| Priority | Item |
|---|---|
| 1 | Run Math assessment SQL for Year 2 |
| 2 | Wire RefCapture to academy/junior, scholarship pages |
| 3 | Scholarship matching algorithm |
| 4 | Skills landing + course pages |
| 5 | Careers landing + programme pages |
| 6 | About + Contact pages |
| 7 | Earn With Us landing page |
| 8 | Curriculum seeding (full — all subjects, all years) |
| 9 | Deepgram speech recognition integration |
| 10 | Monthly progress reports (PDF generation) |
