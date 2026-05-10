---
title: PRD v0.3
project: Stunion
date: 2026-05-10
date_updated: 2026-05-10
version: 0.3
tags:
  - stunion
  - prd
  - product
---

# Stunion PRD v0.3

| Field | Value |
|---|---|
| Document version | 0.3 |
| Author | Gyubin An |
| Date | 2026-05-10 |
| Status | Draft - pending Phase 0 validation |
| Take rate | 10% (waived for first 15 tutors, first 5 sessions each) |
| Trust mechanism | Verified transcripts + reviews + escrow + optional intro call |

## Changes from v0.2

- **Removed video profile requirement.** Trust mechanism now relies on verified transcripts, reviews, and escrow. Reduces MVP build by ~1 week; removes Cloudflare Stream from tech stack.
- **Added 15-min free intro call feature.** Compensates partially for loss of video preview; tutors who opt in receive a visibility badge.
- **Reframed problem statement.** Problem #3 changed from "no teaching-quality preview" to "no payment protection." Aligns with what the product actually solves.
- **Locked supply strategy: sisters' network as Tier 1.** Founder's two sisters and their college-graduate friends form the initial vouched-quality tutor pool. Removes cold-outreach risk for first 25 tutors.
- **Added tutor-side promo code.** First 15 tutors receive 0% take rate on first 5 sessions (`FOUNDER15`). Estimated platform revenue lost: ~₩750,000 over 90 days. Treated as CAC.
- **Updated revenue forecast.** Months 1-3 are largely promo-period; meaningful revenue starts Month 3-4. $1k/month still achieved Month 5.
- **Flagged conversion risk.** Without video, parent-to-first-booking conversion may drop from 10% target to 6-8%. Phase 0 must validate.

---

## 1. Problem Statement

Korean families at international schools (Chadwick, SFS, KIS, Dwight Seoul, Branksome Hall Asia) spend a portion of Korea's ₩29.2T annual private education market on SAT, IB, and AP tutoring [Statistics Korea 2023]. They face three problems no existing platform solves:

1. **No verification layer.** Tutors self-report credentials. Parents have no way to verify that a "Harvard graduate IB tutor" actually has those credentials before booking.
2. **No price transparency.** Hagwons and individual tutors quote ₩100,000–300,000/hour with no comparable benchmarking.
3. **No payment protection.** Parents pay upfront with no recourse if a tutor underperforms or no-shows. Tutors invoice after sessions and chase payment.

### Existing solutions and gaps

| Solution | Gap for Stunion's user |
|---|---|
| 김과외, 설탭 | Korean curriculum focus; text profiles; no SAT/IB depth; Korean-only UI |
| Hagwons (offline) | High overhead; group-based; limited 1:1; opaque pricing |
| Word-of-mouth referrals | Trust-high but supply-constrained; no payment infrastructure |
| Wyzant, Preply (US) | Not localized to Korea; no IB/Korean university admissions context; limited supply in Korea |

---

## 2. Target Users

### 2.1 Demand side (primary)

**Persona:** Mother of a student at an international school in Seoul/Incheon, household income ₩150M+/year, child in grades 9-12 preparing for SAT, IB, or AP.

**Job-to-be-done:** Find a verified tutor whose credentials match my child's specific test prep needs, with payment protection if it does not work out.

**Decision pattern:** Researches via KakaoTalk parent groups; asks 3-5 references; books a trial session before committing to a long-term arrangement.

### 2.2 Supply side (primary)

**Persona A (priority):** Korean college student or recent graduate (US Top 50, Korean SKY/KAIST/POSTECH), connected to founder's family network, ages 19-25. Looking for ₩50,000–100,000/hour income.

**Persona B:** Current Chadwick/SFS senior with verified IB scores, ages 17-18, parental consent required.

**Persona C (defer to V2):** Korean returnees discovered via 해외리턴 카페 or LinkedIn outreach. Used only after sisters' network is exhausted.

### 2.3 Out of scope (MVP)

- Korean curriculum (수능) tutoring: served by 김과외
- Adult learners
- Group classes
- Test prep companies (B2B sales)

---

## 3. Goals and Non-Goals

### 3.1 Goals (V1)

- Reach 15-20 verified, vouched tutors live within 30 days of MVP launch (sisters' network)
- Reach 25 tutors total within 60 days
- Reach $1,000 USD monthly platform revenue at 10% take rate within 6 months
- Achieve session repeat rate ≥50% within 30 days of first booking
- Achieve parent-to-first-booking conversion ≥8% (revised down from 10% to account for no-video trust friction)

### 3.2 Non-goals (V1)

- Mobile native app (web responsive only)
- Video tutor profiles (deferred; revisit at V2 based on Phase 0 trust validation data)
- AI diagnostic matching (defer to V2)
- School/hagwon B2B channel
- Background checks via third-party API (manual transcript verification only)
- Live video conferencing infrastructure (use Zoom/Google Meet links)

---

## 4. Functional Requirements

### 4.1 Tutor onboarding

*Story: As a tutor, I can create a verified profile and start receiving bookings without recording a video.*

| Requirement | Priority | Acceptance criteria |
|---|---|---|
| Sign up with email + phone (Korean SMS via Aligo) | P0 | OTP delivered in under 30s; account created on verification |
| Upload university transcript (PDF/image) | P0 | File stored encrypted in Supabase storage; reviewed manually within 48h |
| Upload official test scores (SAT, IB, AP, where applicable) | P0 | Same as transcript |
| Profile photo (head-and-shoulders, clear face) | P0 | Required; admin reviews for appropriateness |
| Write bio (under 500 characters) | P0 | Auto-validated for length; manually reviewed for content |
| Set hourly rate (₩30,000–200,000 range) | P0 | Field validates range |
| Select up to 5 subjects from controlled list | P0 | Dropdown: SAT Math, SAT R&W, IB HL Math AA/AI, IB HL Econ/Business/Bio/Chem, AP |
| Toggle: "Open to 15-min intro call before first booking" | P0 | Tutors who opt in get a visibility badge on profile |
| Sign independent contractor agreement (digital) | P0 | Cannot activate without signature; agreement includes 10% platform fee, 3.3% withholding disclosure |
| Apply promo code (if assigned) | P0 | First 15 tutors receive code `FOUNDER15` which waives platform fee on first 5 sessions; tracked per-tutor |
| Profile goes live after admin approval | P0 | Manual approval for first 50 tutors; automated rule-based after |

**Tutor verification states:** Pending → Under Review → Verified → Active | Suspended | Rejected

### 4.2 Parent / student discovery

*Story: As a parent, I can find tutors filtered by my child's specific test prep needs and verify their credentials before booking.*

| Requirement | Priority | Acceptance criteria |
|---|---|---|
| Browse tutors without sign-up | P0 | Home page shows tutor grid with photo, first name + last initial, subjects, rate, rating |
| Filter by subject | P0 | Multi-select; results update without page reload |
| Filter by rate range | P1 | Slider ₩30,000–200,000/hour |
| Filter by language (Korean / English / Both) | P0 | Three-state toggle |
| Filter by "Open to intro call" | P1 | Boolean toggle; helps trust-cautious parents find willing tutors |
| Sort by rating, rate, response time | P1 | Default: rating DESC |
| View full tutor profile | P0 | Profile shows: photo, bio, education + verified credentials display, test scores, subjects, reviews, rate |
| Verified credentials display on profile | P0 | Green checkmark badges next to each verified credential (university, SAT score, IB score) |
| Sign-up required to send booking request or intro call request | P0 | Email + phone OTP; minimal form |

### 4.3 Booking and payment (10% take rate)

*Story: As a parent, I can book and pay for a tutoring session through the platform with payment held until session completes.*

| Requirement | Priority | Acceptance criteria |
|---|---|---|
| Submit booking request | P0 | Date, time, duration, subject focus, location preference (online/offline); tutor notified via SMS + email |
| Tutor accepts/declines within 24h | P0 | Auto-cancel if no response in 24h |
| Parent pays full amount upfront via PortOne or TossPayments | P0 | Payment held in platform-controlled escrow account |
| Platform takes 10% transaction fee from gross session amount | P0 | Recorded in transactions table; visible to tutor in dashboard at booking time |
| Promo code `FOUNDER15` waives platform fee | P0 | Applies to first 5 sessions of any tutor with the code; tracked per-tutor; no expiration date |
| 3.3% withholding deducted from tutor payout (Korean tax law) | P0 | Withholding receipt generated for tutor's tax filing |
| Tutor payout released within 48h of parent confirmation | P0 | Bank transfer via PortOne payout API or manual until volume justifies automation |
| Refund within 24h of session if parent disputes | P0 | Tutor counter-statement collected; manual review by founder for first 100 sessions |

**Money-flow worked example, standard session at ₩100,000:**

| Step | Standard tutor | Promo-code tutor (first 5 sessions) |
|---|---|---|
| Parent pays gross | ₩100,000 | ₩100,000 |
| Platform fee | ₩10,000 (10%) | ₩0 (waived) |
| Tutor gross | ₩90,000 | ₩100,000 |
| Withholding tax (3.3%) | ₩2,970 | ₩3,300 |
| Tutor net payout | ₩87,030 | ₩96,700 |

Note: 3.3% withholding is paid by the platform to the tax authority on the tutor's behalf (원천징수). It is the tutor's tax obligation, not platform revenue. With promo code, platform revenue per session = ₩0; the founder absorbs this as customer acquisition cost.

### 4.4 Free intro call feature (NEW in v0.3)

*Story: As a parent uncertain about a tutor, I can request a 15-minute video call before booking to evaluate fit.*

| Requirement | Priority | Acceptance criteria |
|---|---|---|
| Tutor opts in during onboarding | P0 | Toggle in profile setup; visible badge on profile |
| Parent requests intro call from profile | P0 | Form: preferred times, child's subject focus, what parent wants to discuss |
| Tutor accepts and provides Zoom/Meet link within 48h | P0 | Auto-cancel if no response |
| Call is 15 minutes max, completely free | P0 | Stated in ToS; no platform mediation |
| After call, parent can book a paid session via standard flow | P0 | Standard 10% fee or promo code applies normally |
| Track intro call → booking conversion rate | P1 | Metric for V2 decision on whether to add video |

**Rationale:** Compensates partially for the lack of video tutor profiles. Lower implementation cost than video infrastructure (no Cloudflare Stream needed). If intro call → booking conversion is high, this validates that the trust gap is solvable without video. If low, V2 should add video.

### 4.5 Disintermediation defense

| Requirement | Priority | Acceptance criteria |
|---|---|---|
| Pre-paid session bundles (5 or 10 sessions, 8% discount) | P0 | Locks parent financially to platform; bundle credits in dashboard |
| In-platform messaging only until first session paid | P0 | Strip phone numbers, KakaoTalk IDs, emails via regex; warn user on attempt |
| Reviews valid only for on-platform sessions | P0 | Tutor's rating freezes if they leave platform |
| Dispute / refund coverage applies only to on-platform sessions | P0 | Visible in ToS and at checkout |
| Repeat booking discount (3% off after 5 sessions with same tutor) | P1 | Encourages parent to keep booking on-platform |

**Calibration note:** At 10% take rate, the per-session financial incentive to disintermediate is ₩10,000 on a ₩100,000 session. This is meaningful but not catastrophic compared to Tutorspree's 50% rake. Risk: Sisters' network tutors have other income options and are most likely to disintermediate. Mitigation depends on platform delivering ongoing convenience value.

### 4.6 Reviews and trust

| Requirement | Priority | Acceptance criteria |
|---|---|---|
| Parent rates session 1-5 stars + optional text after each session | P0 | Prompted 24h post-session via email/SMS |
| Tutor cannot view parent name in review | P1 | Reduces retaliation risk |
| Tutor can respond once to a review | P1 | Public response shown below review |
| Verified Tutor badge | P0 | Visible on profile after manual transcript + score review |
| Top Rated badge | P2 | Tutors with rating ≥4.7 across ≥10 reviews |
| "Open to Intro Call" badge | P0 | Awarded automatically to tutors who toggle on during onboarding |

### 4.7 Admin console (founder)

| Requirement | Priority | Acceptance criteria |
|---|---|---|
| Tutor approval queue | P0 | List view with one-click approve/reject + reason |
| Transcript / score verification interface | P0 | Side-by-side view of credential file and tutor's claimed credentials |
| Promo code management | P0 | Issue, track usage, expire codes; per-tutor session counter |
| Transaction log | P0 | All bookings, fees, payouts, refunds; CSV export for tax filing |
| Dispute queue | P0 | Both parties' statements visible; refund / partial / deny actions |
| Manual payout trigger (until automated) | P0 | Single button per pending payout |
| Daily metrics dashboard | P1 | Active tutors, sessions today, GMV, refund rate, conversion funnel, intro call → booking rate |

---

## 5. Non-functional Requirements

| Category | Requirement |
|---|---|
| Performance | Page load under 2.5s on mobile 4G in Seoul |
| Languages | Korean (default) + English toggle |
| Accessibility | WCAG 2.1 AA for tutor profiles |
| Privacy | PIPA-compliant; user data deletion on request within 30 days |
| Security | All payments via certified Korean PG (PortOne / TossPayments); no card data stored on platform servers; transcripts encrypted at rest in Supabase storage |
| Uptime | 99% acceptable at MVP; no SLA promises |
| Mobile | Responsive web; 70%+ of traffic expected mobile |

---

## 6. Tech Stack

- **Frontend:** Next.js 14 + Tailwind, deployed on Vercel
- **Backend / DB:** Supabase (Postgres, Auth, Storage with encryption, Row-Level Security)
- **Payments:** PortOne (formerly Iamport) primary; TossPayments fallback
- **SMS:** Aligo (Korean SMS gateway)
- **Email:** SendGrid or Resend
- **Analytics:** PostHog (free tier)
- **Error monitoring:** Sentry (free tier)

> Removed from v0.2: Cloudflare Stream (no video).

---

## 7. Data Model (core tables)

```sql
users (id, email, phone, role[parent|tutor|admin], created_at, status)

tutor_profiles (user_id, bio, hourly_rate, languages, profile_photo_url,
  intro_call_enabled, verification_status)

tutor_subjects (tutor_id, subject_id)  -- many-to-many

subjects (id, name, category[SAT|IB|AP|Other])

tutor_credentials (id, tutor_id, type[transcript|test_score], file_url,
  verified_at, verified_by_admin_id)

promo_codes (code, tutor_id, free_sessions_remaining, created_at, expires_at)

bookings (id, parent_id, tutor_id, scheduled_at, duration_min, subject_id,
  status, gross_amount, fee_amount, payout_amount, promo_code_used)

intro_calls (id, parent_id, tutor_id, requested_at, scheduled_at, completed_at,
  converted_to_booking_id)

payments (id, booking_id, pg_transaction_id, amount, status, paid_at)

payouts (id, tutor_id, booking_id, amount, withholding_tax, status, paid_at)

reviews (id, booking_id, parent_id, tutor_id, rating, text, response, created_at)

messages (id, sender_id, recipient_id, booking_id, content, redacted_at)

disputes (id, booking_id, raised_by, reason, resolution, resolved_at)
```

---

## 8. Supply Strategy

Stunion's tutor recruitment uses a tiered approach. Tier 1 is the founder's family network (sisters and their college-graduate friends), which provides vouched-quality supply for the first 15-20 tutors. This eliminates cold-outreach risk and credential-verification ambiguity for the launch cohort. Tier 2 expands via Tier 1 referrals. Tier 3 transitions to public recruitment.

| Tier | Source | Target count | Timeline | Acquisition cost |
|---|---|---|---|---|
| Tier 1 | Founder's two sisters + their college friends | 15 | Week 1-3 | Promo code (0% fee, 5 sessions) |
| Tier 2 | Tier 1 referrals (₩100K bonus per qualified referral) | 10 | Week 4-8 | Referral bonuses |
| Tier 3 | 해외리턴 카페, Chadwick alumni LinkedIn, Naver | as needed | Month 3+ | Standard recruitment |

### 8.1 Tier 1 quality criteria

- US Top 50 university OR Korean SKY/KAIST/POSTECH OR US Liberal Arts Top 30
- Subject competency: 7 in HL for IB tutors, 1500+ SAT for SAT tutors, 5 on AP for AP tutors
- Active interest in tutoring as side income (not just willing to do family a favor)
- Vouched by founder's sister as "good teacher" (not just "good student")

### 8.2 Family-pressure mitigation

- 60-day pilot expectation set explicitly with each Tier 1 tutor
- Realistic demand expectation: "expect 2-5 students if profile is strong"
- Off-ramp: deactivate profile after 30 days with no booking, by mutual agreement
- Quality bar applied uniformly; no exceptions for family connections

---

## 9. Launch Plan

| Phase | Timeline | Goal |
|---|---|---|
| Validation | Weeks 1-2 | 20 parent + 15 tutor interviews; trust threshold validated; go/no-go decision |
| Legal setup | Weeks 2-3 | 사업자등록 (under parent), 통신판매업 신고, ToS, Privacy Policy |
| MVP build | Weeks 3-7 | All P0 features; closed beta with 5 Tier 1 tutors + 10 parents from network |
| Soft launch | Weeks 8-11 | 15-20 Tier 1 tutors live with promo codes; KakaoTalk parent group seeding |
| Growth phase | Months 3-6 | Tier 2 referrals; promo codes start expiring; revenue ramps; reach $1k/month |

---

## 10. Success Metrics

| Metric | V1 target | Kill threshold |
|---|---|---|
| Tier 1 tutors live (Day 30) | 15 | 8 |
| Total verified tutors (Day 60) | 25 | 12 |
| First-month parent sign-ups | 60 | 25 |
| Parent → first booking conversion | 8% (revised down from 10%) | 3% |
| Intro call → booking conversion | Track for V2 (no target yet) | n/a |
| Session repeat rate (30d) | 50% | 25% |
| Monthly GMV (Month 6) | ₩13.7M (~$10,000) | ₩5M |
| Monthly platform revenue (Month 6) | ₩1.37M (~$1,000) | ₩500K |
| Tutor monthly churn | ≤8% | ≥20% |
| Refund rate | <5% | >15% |
| Promo code burn (Month 1-3 total) | <₩750K | >₩1.2M |

### 10.1 Revenue forecast with promo period

| Month | Tutors | Sessions | Promo sessions | Paid sessions | Platform revenue |
|---|---|---|---|---|---|
| 1 | 15 | 20 | 20 | 0 | ₩0 |
| 2 | 20 | 50 | 45 | 5 | ₩50K |
| 3 | 25 | 80 | 30 | 50 | ₩500K |
| 4 | 35 | 110 | 5 | 105 | ₩1.05M |
| 5 | 50 | 140 | 0 | 140 | ₩1.4M (~$1,020) |
| 6 | 60 | 160 | 0 | 160 | ₩1.6M (~$1,170) |

Cumulative promo cost over Months 1-3 (worst case): ~₩10,000 × 100 promo sessions = ₩1.0M (~$730 USD). Treated as customer acquisition cost. $1k/month sustained revenue achieved Month 5; cumulative platform revenue over 6 months approximately ₩4.6M (~$3,360 USD).

---

## 11. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Trust mechanism without video proves insufficient (Phase 0 fails) | Medium | Critical | Have V0.4 fallback ready: add video back, or pivot to Path B (diagnostic tool) |
| Parent registration capacity issues (founder is a minor) | High | Critical | Operate under parent's 사업자등록 from day one |
| Tier 1 tutors disintermediate after promo expires | Medium-High | High | Bundle prepayments; messaging filter; convenience value (scheduling, payment, reviews) |
| Sisters' network quality is uneven | Medium | High | Apply quality bar uniformly; sister vouching does not bypass credential verification |
| Family pressure if Tier 1 tutors get no bookings | High | Medium | Set 60-day pilot expectation; clear off-ramp |
| Adult tutor + minor student liability incident | Low | Catastrophic | Mandatory recording for under-18 students; ToS clause; consider insurance |
| Payment dispute / chargeback | Medium | Medium | Clear refund policy; PG-side dispute handling |
| Naver SEO underperforms vs. expectations | High | Medium | Channel cap policy: max 20% from any single channel |
| IB grades drop | High | High | Hard 10 hr/week cap; pause growth during exam periods |
| 10% rate seen as too high by tutors after promo | Medium | Medium | Communicate value clearly; tier-down rate for top performers in V2 |

---

## 12. Versioning

- **V1 (this PRD, v0.3):** Korean international school market, 10% take rate, no video, transcripts + reviews + escrow + intro call, promo code for first 15 tutors
- **V2 (post $1k/month sustained):** Reconsider video addition based on intro call data; AI diagnostic matching; mobile app; tier-down rate for top performers; expansion to Japan/HK international schools
- **V3 (post-Series-A or post-maturity):** B2B hagwon channel, white-label for schools

---

## 13. Open Decisions

- [ ] Confirm promo code structure: tutor-side only, volume-bounded (5 sessions), capped at 15 tutors? **Assumed yes for v0.3.**
- [ ] Confirm domain availability: stunion.com / .co / .kr
- [ ] Confirm KIPO + USPTO trademark availability
- [ ] Confirm parent will register 사업자등록 under their name
- [ ] Phase 0 trust threshold: do at least 4/10 parents say they would book based on transcripts + reviews + escrow alone?

---

## References

1. Statistics Korea (KOSTAT), Private Education Expenditure Survey 2023.
2. Tutorspree post-mortem.
3. Tutorspree 2026 rebuild plan.
4. Korean Income Tax Act, 3.3% withholding for independent contractor service income (사업소득세).
5. PortOne and TossPayments developer documentation; Korean Electronic Financial Transactions Act compliance.
6. Personal Information Protection Act (PIPA, 개인정보보호법).
7. Korean Value-Added Tax Act Article 8, business registration requirement.
8. Korean Act on Consumer Protection in Electronic Commerce, 전자상거래법.
9. Korean Civil Act Article 5, capacity of minors to contract.

> References [1], [4]–[9] cited from training data and not re-verified. Verify with current Korean tax authority (국세청), legal counsel, and PG documentation before implementation.
