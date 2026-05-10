---
title: Build Plan and Phases
project: Stunion
date: 2026-05-10
date_updated: 2026-05-10
tags:
  - stunion
  - execution
  - timeline
---

# Build Plan and Phases

## Phase 0: Pre-Build Validation (Weeks 1-2)

### Step 1: 20 Parent Interviews

**Target:** Parents at Chadwick, SFS, KIS, Dwight, Branksome Hall Asia.

**Questions:**
- How do you currently find SAT/IB tutors?
- What did you pay for your last tutor (₩/hour)?
- What went wrong with past tutors?
- How did you verify the tutor was qualified?
- **Trust threshold question (CRITICAL):** Would verified university transcripts + verified test scores + reviews from past students + payment escrow be enough to book a tutor you have never met? Or would you still need to meet them first?

**Blocker check:** If fewer than 12/20 express clear dissatisfaction with current options AND willingness to try a new platform, do not proceed.

**Trust validation blocker (NEW):** If 6+ out of 20 parents say they would still need to meet the tutor in person before booking, the no-video trust mechanism is insufficient. Options: (a) add video back, (b) build a 30-min free trial session feature, (c) build a pre-booking parent-tutor video call feature.

### Step 2: 15 Tutor Interviews

**Target:** Chadwick alumni at US universities, current top-IB Chadwick seniors, Korean returnees from Top 50 US schools.

**Questions:**
- Current hourly rate
- How do you currently find students (referrals, hagwons, 김과외)
- Would you list on a new platform with 10% take rate
- What would make you stay vs. move clients off-platform after first session
- Would you upload a transcript to verify your credentials? (Should be a low-friction yes.)

**Blocker check:** If fewer than 10/15 say they would list, supply side fails before start.

## Phase 1: Legal and Financial Setup (Weeks 2-3)

| Task | Action | Owner |
|---|---|---|
| Business registration (사업자등록) | Register under parent's name | Parent |
| Bank account | Business account linked to registration | Parent |
| Tax category | E-commerce / brokerage service (통신판매업 신고 required) | Parent |
| Service terms (이용약관) | Drafted with disclaimer of liability for tutor-student conduct | User + template |
| Privacy policy (개인정보처리방침) | Required by PIPA | User + template |
| Tutor contractor agreements | Each tutor signs as independent contractor (3.3% withholding tax) | User + template |

**Blocker check:** If parents refuse to co-sign, Path A is dead.

## Phase 2: MVP Build (Weeks 3-7)

> Reduced from 6 weeks to 5 weeks after video profile removal.

### Tech Stack

- **Frontend:** Next.js 14 + Tailwind on Vercel
- **Backend/DB:** Supabase (Postgres + auth + storage for transcript files)
- **Payments:** PortOne (formerly Iamport) primary; TossPayments fallback. NOT Stripe Connect
- **SMS:** Aligo (Korean SMS gateway)
- **Email:** SendGrid or Resend
- **Analytics:** PostHog (free tier)
- **Errors:** Sentry (free tier)

> **Removed from stack:** Cloudflare Stream (no video).

### MVP Feature Scope (Locked)

1. Tutor profile page: photo, bio, verified credentials display, subjects, rate, reviews
2. Subject filter (SAT Math, SAT R&W, IB HL Econ, IB HL Math AA/AI, AP, etc.)
3. Booking request form (parent submits, tutor accepts)
4. Pre-paid voucher system with escrow
5. Post-session confirmation by parent → triggers payout
6. Review system (5-star + text)
7. Manual transcript review queue (admin side)

### Will NOT Build at MVP

- ~~Video profiles~~ (removed 2026-05-10)
- LLM diagnostic matching
- Mobile app
- AI session recap
- Background checks via API
- Calendar sync
- Group sessions

## Phase 3: Supply Onboarding (Weeks 5-8, parallel with build)

**Target:** 25 tutors live by Week 8. (Earlier than before since no video onboarding step.)

### Recruitment Funnel

1. Chadwick alumni network (highest trust): post in alumni Facebook/KakaoTalk groups; offer 0% take rate for first 5 sessions to first 10 tutors as launch incentive
2. Current Chadwick seniors with 7s in HL subjects
3. Returnees board (해외리턴 카페)

### Tutor Quality Bar

- Verified transcript showing relevant subject competency (7 in HL for IB tutors, 1500+ SAT for SAT tutors, 5 on AP for AP tutors)
- Verified standardized test score documentation
- Clean LinkedIn or alumni verification
- Written bio under 500 characters

> **Removed:** 60-second teaching demo video requirement.

**Blocker check:** If cannot get 15 tutors live by Week 7, platform is non-functional. Reduce subject scope rather than reducing quality bar.

## Phase 4: Demand Acquisition (Weeks 7-15)

### Channel Allocation Policy (Hard Rule)

| Channel | Max % of acquisition | Why |
|---|---|---|
| KakaoTalk parent groups (학부모 단톡) | 35% | Highest-trust, lowest CAC |
| Chadwick/SFS/KIS direct outreach | 25% | Warm network |
| Naver Blog/Cafe SEO | 20% | Korean search dominance is Naver |
| Instagram Korean parenting accounts | 15% | Paid promotion of tutor profiles |
| Referral program (₩50,000 credit per referral) | 5% | Compounding |

If any channel exceeds its cap, reallocate. Rule prevents Tutorspree's 80% SEO concentration failure.

### Unit Economics Target

- Average session: ₩100,000
- Take rate: 10% → ₩10,000 platform revenue per session
- Average sessions per parent before churn: 8
- LTV: ₩80,000
- CAC ceiling: ₩27,000 (3:1 LTV:CAC)

## Phase 5: Path to $1k/Month (10% Take Rate)

| Month | Tutors | Sessions/month | GMV | Revenue (10%) |
|---|---|---|---|---|
| 1 | 15 | 20 | ₩2M | ₩200K (~$145) |
| 2 | 25 | 50 | ₩5M | ₩500K (~$365) |
| 3 | 35 | 80 | ₩8M | ₩800K (~$585) |
| 4 | 50 | 110 | ₩11M | ₩1.1M (~$800) |
| 5 | 60 | 140 | ₩14M | ₩1.4M (~$1,020) |

$1k/month achieved Month 5 with ~140 sessions, ~60 tutors, ~40 active parents.

**Assumption:** $1 = ₩1,370 (BOK reference rate fluctuates).

**Risk to forecast:** Without video, parent-to-first-booking conversion may be lower than the 10% target. If actual conversion is ~6-7%, timeline slips by 1-2 months. Phase 0 validation should attempt to estimate this before build commits.
