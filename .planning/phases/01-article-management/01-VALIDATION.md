---
phase: 1
slug: article-management
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-17
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property               | Value                                |
| ---------------------- | ------------------------------------ |
| **Framework**          | Vitest                               |
| **Config file**        | vitest.config.ts (Wave 0 creates)    |
| **Quick run command**  | `pnpm vitest run --reporter=verbose` |
| **Full suite command** | `pnpm vitest run`                    |
| **Estimated runtime**  | ~5 seconds                           |

---

## Sampling Rate

- **After every task commit:** Run `pnpm vitest run --reporter=verbose`
- **After every plan wave:** Run `pnpm vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1-01-01 | 01 | 1 | ART-04 | unit | `pnpm vitest run tests/utils/sentenceSplit.test.ts` | ❌ W0 | ⬜ pending |
| 1-01-02 | 01 | 1 | ART-02 | unit | `pnpm vitest run tests/assets/poems.test.ts` | ❌ W0 | ⬜ pending |
| 1-02-01 | 02 | 1 | ART-03 | unit | `pnpm vitest run tests/assets/quotes.test.ts` | ❌ W0 | ⬜ pending |
| 1-03-01 | 03 | 1 | ART-01 | unit | `pnpm vitest run tests/utils/fileParser.test.ts` | ❌ W0 | ⬜ pending |
| 1-04-01 | 04 | 2 | ART-05 | unit | `pnpm vitest run tests/stores/articleStore.test.ts` | ❌ W0 | ⬜ pending |

_Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky_

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` — Vitest 配置文件
- [ ] `tests/utils/sentenceSplit.test.ts` — 分句函数测试
- [ ] `tests/utils/fileParser.test.ts` — 文件解析测试
- [ ] `tests/stores/articleStore.test.ts` — Zustand store 测试
- [ ] `tests/assets/poems.test.ts` — 诗词数据验证
- [ ] `tests/assets/quotes.test.ts` — 名言数据验证
- [ ] `pnpm add -D vitest @testing-library/react` — 安装测试框架

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
| --- | --- | --- | --- |
| 文件上传 UI 交互 | ART-01 | 需要 UI 测试环境 | 1. 打开应用 2. 点击上传按钮 3. 选择 .txt 文件 4. 验证文章出现在列表中 |
| 文章列表选择 | ART-05 | 需要 UI 测试环境 | 1. 打开应用 2. 点击文章项 3. 验证选中状态高亮 |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
