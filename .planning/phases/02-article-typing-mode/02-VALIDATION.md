---
phase: 02
slug: article-typing-mode
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-18
---

# Phase 02 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

## Sampling Rate

- **After every task commit:** Run `npm run test`
- **After every plan wave:** Run `npm run test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | TYP-02, TYP-03, TYP-04, TYP-05, UI-05 | unit | `npm run test -- tests/hooks/useTypingGame.test.ts` | ❌ W0 | ⬜ pending |
| 02-02-01 | 02 | 1 | UI-02, UI-03, UI-04 | unit | `npm run test -- tests/components/CharSpan.test.tsx` | ❌ W0 | ⬜ pending |
| 02-03-01 | 03 | 2 | TYP-01 | integration | `npm run test -- tests/components/TypingGame.test.tsx` | ❌ W0 | ⬜ pending |
| 02-03-02 | 03 | 2 | TYP-06 | integration | `npm run test -- tests/components/TypingGame.test.tsx` | ❌ W0 | ⬜ pending |
| 02-04-01 | 04 | 3 | UI-01, UI-05 | integration | Manual + `npm run test` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `vitest 1.6.0` — Framework installed
- [ ] `tests/hooks/useTypingGame.test.ts` — Test stubs for TYP-02, TYP-03, TYP-04, TYP-05, UI-05
- [ ] `tests/components/CharSpan.test.tsx` — Test stubs for UI-02, UI-03, UI-04
- [ ] `tests/components/TypingGame.test.tsx` — Test stubs for TYP-01, TYP-06

---

## Validation Rules

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` in frontmatter

---

**Approval:** ⬜ pending / approved 2026-03-18
