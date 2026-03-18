---
phase: 0
slug: project-init
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-17
---

# Phase 0 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property               | Value                         |
| ---------------------- | ----------------------------- |
| **Framework**          | none — Phase 0 不引入测试框架 |
| **Config file**        | none                          |
| **Quick run command**  | `pnpm dev` (启动验证)         |
| **Full suite command** | `pnpm dev && 手动验证`        |
| **Estimated runtime**  | ~30 seconds                   |

**说明:** Phase 0 是项目初始化阶段，主要通过手动验证确保项目可正常运行。测试框架将在 Phase 1 引入 (Vitest)。

---

## Sampling Rate

- **After every task commit:** `pnpm dev` 启动验证
- **After every plan wave:** 手动验证功能正常
- **Before `/gsd:verify-work`:** 所有手动验证通过
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 00-01-01 | 01 | 1 | 初始化 | manual | `pnpm dev` | ❌ W0 | ⬜ pending |
| 00-01-02 | 01 | 1 | 清理双拼 | manual | `grep -r "Shuangpin" src/` | N/A | ⬜ pending |
| 00-01-03 | 01 | 1 | 验证运行 | manual | 浏览器访问 localhost:8000 | N/A | ⬜ pending |

_Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky_

---

## Wave 0 Requirements

Phase 0 无需测试基础设施，使用以下手动验证：

- [ ] `pnpm install` 成功
- [ ] `pnpm dev` 启动成功
- [ ] 浏览器访问 http://localhost:8000 无报错
- [ ] 基础打字功能正常（输入拼音匹配汉字）
- [ ] 双拼相关代码已清理（grep 检查）

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
| --- | --- | --- | --- |
| 项目启动 | 开发环境 | 需要浏览器交互 | `pnpm dev` → 打开 localhost:8000 |
| 打字功能 | 基础功能 | 需要输入法交互 | 输入 "nihao" 验证匹配 "你好" |
| 双拼清理 | 代码清理 | grep 静态检查 | `grep -r "Shuangpin\|双拼\|XianHe" src/` 应无结果 |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies (手动验证)
- [x] Sampling continuity: 验证覆盖所有任务
- [x] Wave 0 covers all MISSING references (无测试框架需求)
- [x] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter (完成后设置)

**Approval:** pending
