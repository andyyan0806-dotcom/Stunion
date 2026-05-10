---
title: Strategic Path Decision
project: Stunion
date: 2026-05-10
tags:
  - stunion
  - strategy
  - decision-log
---

# Strategic Path Decision

## Three Paths Considered

### Path A: Korean SAT/IB Tutor Marketplace (CHOSEN)

- **Market:** Korean students at international schools preparing for SAT, IB, AP, US college admissions
- **Supply:** Recent Korean US-university graduates, current Chadwick/SFS upperclassmen, IB-7 scorers
- **Demand:** Korean parents at international schools (₩29.2T/year private education market in Korea per Statistics Korea 2023)
- **Wedge:** Wyzant does not serve Korea; existing Korean platforms (김과외, 설탭) serve Korean curriculum, not IB/AP/SAT
- **Path to $1k/month:** ~150 sessions/month at 10% take rate
- **Why chosen:** Highest revenue path; user has direct market access

### Path B: Diagnostic-First Lite Product (NOT CHOSEN)

- LLM-powered diagnostic tool sold B2B to Korean hagwons
- $50-100/month subscription per hagwon → $1k/month at 15-20 paying hagwons
- Lower legal complexity, no marketplace liability
- Strongest admissions narrative
- Rejected in favor of Path A

### Path C: Tutorspree Rebuild as Stated (NOT CHOSEN)

- Rebuild plan from provided document, US K-8 market
- Requires Series A capital, US background checks, Stripe Connect
- Not feasible for a high school student in Korea
- Rejected as scale-mismatched

## Why Path A Beats the Tutorspree 2026 Rebuild Plan for User

| Rebuild assumption | User reality | Implication |
|---|---|---|
| Target U.S. K-8 parents | User in Korea, no US parent network | CAC prohibitive |
| 500 verified tutors in 90 days | Cannot run US background checks at scale | Trust layer fails |
| TikTok/Reels acquisition | No creator audience or ad budget | Channel collapses |
| Stripe Connect escrow | Stripe restricts minors as platform operators | Legal blocker |
| $150K monthly GMV by month 6 | User goal is $1k/month | Wrong scale of bet |

## Decision Drivers

1. User has direct Chadwick parent network (warm distribution)
2. User has shipped tutor-match-chadwick.vercel.app already (technical feasibility proven)
3. Korean private education market is 6x US per-capita (demand exists)
4. Path A allows admissions narrative continuity ("expanded my Chadwick prototype to a real business")

## Open Risks of Path A

- Minor cannot register business independently → must operate under parent's 사업자등록
- Liability exposure if adult tutor + minor student session goes wrong
- Disintermediation pressure even at 10% rake
- IB grades dropping if time commitment exceeds 10 hr/week
