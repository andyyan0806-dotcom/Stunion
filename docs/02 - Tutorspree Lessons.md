---
title: Tutorspree Lessons
project: Stunion
date: 2026-05-10
date_updated: 2026-05-10
tags:
  - stunion
  - research
  - case-study
---

# Tutorspree Lessons

## What Tutorspree Was

YC W11 startup founded September 2010 by Aaron Harris, Josh Abrams, Ryan Bednar. "Airbnb for tutoring." Raised $1.8M (Sequoia, Founder Collective, Lerer, SV Angel, etc.). Shut down September 2013. Assets acquired by Wyzant in January 2014.

## Five Failure Modes (and Stunion's Mitigations)

### 1. Single-Channel SEO Dependency

**Tutorspree:** SEO architecturally embedded; programmatic location-specific tutor profile pages drove the majority of acquisition. March 2013 Google Panda update caused ~80% traffic drop. Unrecoverable within remaining runway.

**Stunion mitigation:** Hard cap of 35% on any single acquisition channel from day one. Channel mix:
- KakaoTalk parent groups: 35%
- Chadwick/SFS/KIS direct outreach: 25%
- Naver Blog/Cafe SEO: 20%
- Instagram parent accounts: 15%
- Referral program: 5%

**Mitigation strength:** Strong.

### 2. Marketplace Trust Gap

**Tutorspree:** Parents would not transact on text profiles alone. Conversion was critically low. March 2012 pivot to "Agency" model added human consultants → operational cost without solving root problem.

**Stunion mitigation (revised after video removal):** Three layers of trust signal, all weaker than video would provide individually but stronger in combination than Tutorspree's text-only profiles:

1. **Manual transcript verification** - every tutor uploads their university transcript and standardized test scores. Admin reviews each one before profile activation. This is something Tutorspree did not do at all.
2. **Reviews from on-platform sessions only** - reputation cannot be transferred or faked.
3. **Escrow with dispute resolution** - parent's money is held until session completes. Risk of paying for a bad session is bounded.
4. **Tight network effect** - Chadwick parent community is small enough that bad tutors get filtered through word-of-mouth quickly. Tutorspree had no equivalent network density in any of its 6 cities.

**Mitigation strength:** Medium. **This is Stunion's biggest open risk.** Phase 0 parent interviews must specifically test whether transcripts + reviews + escrow are sufficient. If parents say "I would still want to meet first" or "I would still ask for personal references," the model is too thin.

**What was given up by removing video:**
- Visceral trust signal (parents see teaching style before booking)
- Differentiation vs. 김과외/설탭 (we cannot say "see them teach")
- Marketing virality (no shareable demo videos)

**What was gained:**
- ~1 week shorter build time
- Lower tutor onboarding friction (estimated 20-30% drop-off at video step removed)
- No Cloudflare Stream cost

### 3. 50% Take Rate Disintermediation

**Tutorspree:** 50% rake gave both sides massive financial incentive to transact off-platform after first match. No structural lock-in.

**Stunion mitigation:** 10% take rate. Per-session disintermediation incentive is only ₩10,000 on a ₩100,000 session. Plus pre-paid bundles, in-platform messaging filters, reviews-only-on-platform, repeat booking discount.

**Mitigation strength:** Strong.

### 4. VC-Scale Capital on Non-VC-Scale Market

**Tutorspree:** $1.8M from Sequoia and Founder Collective. Tutoring market growth ceiling did not match VC return expectations. Founders shut down with capital remaining.

**Stunion mitigation:** Bootstrapped. No VC pressure. $1k/month is the goal, not $100M ARR.

**Mitigation strength:** Strong.

### 5. No Education Domain Expertise

**Tutorspree:** Founders had finance and engineering backgrounds. No one understood parent decision-making in education.

**Stunion mitigation:** User attends Chadwick International with HL Business, HL Economics, HL Math AI. Directly inside the target market.

**Mitigation strength:** Medium-strong (user is a sophomore, not a parent; understands student side better than parent side).

## Mitigation Strength Summary

| Failure Mode | Tutorspree Severity | Stunion Mitigation |
|---|---|---|
| 1. SEO dependency | Fatal | Strong |
| 2. Trust gap | Fatal | **Medium (weakest link)** |
| 3. Disintermediation | High | Strong |
| 4. VC mismatch | Critical | Strong |
| 5. Domain expertise | High | Medium-strong |

**Strategic implication:** The trust gap is now Stunion's primary risk. Phase 0 validation is non-negotiable. If trust is not validated, options are (a) add video back, (b) add additional trust layers (e.g., 30-min free trial session, parent video call with tutor pre-booking), or (c) abandon Path A.

## Specific Numbers from Tutorspree

| Metric | Value |
|---|---|
| Total funding | $1.8M |
| Seed round (Jan 2011) | $1M at ~$7M valuation |
| Final round (Feb 2013) | $800K from Resolute.VC |
| Tutors recruited (peak) | 7,000+ |
| Cities served at peak | 6 (SF, DC, NYC, LA, Chicago, Brooklyn) |
| Employees at shutdown | 10 |
| Take rate | 50% |
| Original launch cities | 4 (Jan 2011) |

## Key Quotes from Aaron Harris Post-Mortem

- "We chose to shut Tutorspree down, not because it was not a business, but because we could not make it the company we wanted."
- "Parents simply didn't trust profiles and a messaging system enough to transact at the rate we needed."
- "SEO was baked into our model from the start, and it became increasingly important to the business as we grew and evolved."
- "It convinced us that there had to be another channel that would perform for us at the level of SEO." (There wasn't.)
