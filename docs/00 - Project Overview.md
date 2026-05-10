---
title: Stunion - Project Overview
project: Stunion
status: pre-validation
take_rate: 10%
target_market: Korean international school families (SAT/IB/AP tutoring)
revenue_target: $1,000 USD / month
date_created: 2026-05-10
date_updated: 2026-05-10
tags:
  - stunion
  - business
  - tutoring-marketplace
  - active
---

# Stunion - Project Overview

## What is Stunion?

A verified-transcript tutor marketplace for Korean families at international schools (Chadwick, SFS, KIS, Dwight Seoul, Branksome Hall Asia) preparing for SAT, IB, and AP exams. Inspired by the failed Tutorspree (YC W11, 2010-2013), redesigned to fix Tutorspree's five core failure modes within the constraints of a solo, bootstrapped, Korean-based founder.

## Core Decisions Locked

| Decision | Value | Rationale |
|---|---|---|
| Target market | Korean international school families | Native market access; existing parent network at Chadwick |
| Take rate | 10% | Balance between revenue speed (5% too slow) and disintermediation risk (15% too high) |
| Revenue goal | $1,000 USD / month | User-stated goal |
| MVP timeline | Months 0-3 build; $1k by Month 5-6 | Based on 10% take rate volume math |
| Trust mechanism | Verified transcripts + reviews + escrow | NO video. Decision 2026-05-10. Reduces build complexity; trust gap mitigated by tight Chadwick network and credential verification |
| Tech stack | Next.js + Supabase + PortOne | Matches existing skills; localized for Korea |
| Legal entity | Operate under parent's 사업자등록 | Minor cannot register independently |
| Geography | Web-first, no mobile app at MVP | Scope discipline |
| Pricing model | Pure 10% transaction fee; no subscription at MVP | Simplicity |

## Five Tutorspree Failure Modes (Mitigations)

1. **Single-channel SEO dependency.** Stunion caps any single acquisition channel at 35% (KakaoTalk parent groups) with Naver SEO at 20%, Instagram 15%.
2. **Marketplace trust gap.** Mitigated by manual transcript verification + reviews + escrow + tight Chadwick parent network. **Note:** This mitigation is weaker than video would provide. Phase 0 validation must confirm parents accept this trust level. See [[02 - Tutorspree Lessons]] for full risk analysis.
3. **50% take rate disintermediation.** 10% rate keeps tutor incentive to stay on-platform reasonable.
4. **VC-scale capital on non-VC market.** Stunion is bootstrapped, not VC-funded. No mismatch.
5. **No education domain expertise.** User attends Chadwick (HL Business, HL Econ, HL Math AI) with direct exposure to the IB/SAT prep market.

## Status Tracker

- [ ] Phase 0: Validation (20 parent + 15 tutor interviews) - **CRITICAL: must validate trust mechanism without video**
- [ ] Phase 1: Legal setup (사업자등록, 통신판매업 신고, ToS, Privacy Policy)
- [ ] Phase 2: MVP build (Weeks 3-7) - shortened from 8 weeks after video removed
- [ ] Phase 3: Supply onboarding (25 tutors by Week 8)
- [ ] Phase 4: Demand acquisition (Weeks 7-15)
- [ ] Phase 5: Scale to $1k/month (Months 4-6)

## Naming Open Items

- [ ] Domain check: stunion.com, stunion.co, stunion.kr
- [ ] Korean phonetic: 스튜니언 vs 스튜니온
- [ ] Trademark search: KIPO (Korea) and USPTO (US)
- [ ] Pronunciation test with English-speaking tutors

## Linked Notes

- [[01 - Strategic Path Decision]]
- [[02 - Tutorspree Lessons]]
- [[03 - Build Plan and Phases]]
- [[04 - PRD v0.2]]
- [[05 - Open Questions]]
- [[06 - Next Actions This Week]]

## Change Log

| Date | Change | Reason |
|---|---|---|
| 2026-05-10 | Initial vault creation | Project kickoff |
| 2026-05-10 | Removed video profiles from MVP | User decision: transcripts + reviews only. Reduces build by ~1 week. Trust gap mitigation now weaker; requires Phase 0 validation. |
