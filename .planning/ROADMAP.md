# Roadmap: My Typing - 个人打字练习工具

**Project:** 基于 https://github.com/yunsii/pinyin Fork
**Strategy:** 增量开发，复用已有拼音匹配逻辑
**Milestone:** v1.0 MVP - 可用的文章打字练习

---

## Phase 0: 项目初始化 ✅ COMPLETE

**Goal:** Fork 参考项目，清理不需要的代码，建立开发环境

**Plans:** 1 plan (1 complete)

Plans:
- [x] 00-01-PLAN.md — Fork 项目、清理双拼代码、验证运行
  - Summary: `.planning/phases/00-project-init/00-01-SUMMARY.md`

**Success Criteria:**
- 项目可本地启动
- 基础打字功能正常
- 代码中无双拼相关逻辑

---

## Phase 1: 文章管理系统 ✅ COMPLETE

**Goal:** 实现文章导入、存储和选择功能

**Plans:** 6 plans in 4 waves (6 complete)

Plans:
- [x] 01-01-PLAN.md — 测试基础设施 (Wave 0) — Vitest 配置和测试骨架
- [x] 01-02-PLAN.md — 类型定义和分句函数 (Wave 1) — Article 类型 + splitIntoSentences
- [x] 01-03-PLAN.md — 诗词数据 (Wave 1) — 25 首唐诗宋词
- [x] 01-04-PLAN.md — 名言数据和文件解析 (Wave 1) — 32 条名言 + parseTxtFile
- [x] 01-05-PLAN.md — Zustand Store (Wave 2) — 文章状态管理 + 持久化
- [x] 01-06-PLAN.md — 文章列表 UI (Wave 3) — ArticleList 组件 + 上传/删除功能
  - Summary: `.planning/phases/01-article-management/01-06-SUMMARY.md`

**Success Criteria:**
- 可选择内置诗词/名言进行练习
- 可上传自定义 txt 文件
- 文章正确分句显示

**Requirements:** ART-01, ART-02, ART-03, ART-04, ART-05

---

## Phase 2: 整篇文章打字模式 🔵 IN PROGRESS

**Goal:** 改造现有单字练习为整篇文章连续打字

**Plans:** 5 plans in 4 waves (3 complete)

Plans:
- [x] 02-00-PLAN.md — 测试基础设施 (Wave 0) — 测试骨架文件
  - Summary: `.planning/phases/02-article-typing-mode/02-00-SUMMARY.md`
- [x] 02-01-PLAN.md — 类型定义和 Hook (Wave 1) — typing types + useTypingGame
  - Summary: `.planning/phases/02-article-typing-mode/02-01-SUMMARY.md`
- [x] 02-02-PLAN.md — CharSpan 组件 (Wave 1) — 字符渲染 + 状态样式
  - Summary: `.planning/phases/02-article-typing-mode/02-02-SUMMARY.md`
- [ ] 02-03-PLAN.md — TypingGame 组件 (Wave 2) — 文章展示 + 输入处理 + 完成提示
- [ ] 02-04-PLAN.md — Hero 页面集成 (Wave 3) — TypingGame 替换 Hanzi

**Success Criteria:**
- 看着原文逐句打完整篇文章
- 实时看到正确/错误反馈
- 打错不会阻断，可继续
- 知道当前进度

**Requirements:** TYP-01, TYP-02, TYP-03, TYP-04, TYP-05, TYP-06, UI-01~05

---

## Phase 3: UI 优化 & 收尾

**Goal:** 优化用户体验，准备发布

**Tasks:**
- [ ] 优化界面布局和样式
- [ ] 添加使用说明
- [ ] 处理边界情况（空文章、超长文章）
- [ ] 性能优化（长文章渲染）
- [ ] 修复已知 bug
- [ ] 测试多浏览器兼容性

**Success Criteria:**
- 界面清晰易用
- 无明显 bug
- 主流浏览器正常工作

---

## Future Phases (v2)

**Phase 4: 统计功能**
- 打字速度统计
- 准确率统计
- 错字回顾

**Phase 5: 历史记录**
- 练习历史
- 进度追踪

---

## Dependencies

```
Phase 0 (初始化)
    ↓
Phase 1 (文章管理)
    ├── 01-01 (Wave 0: 测试框架)
    ├── 01-02, 01-03, 01-04 (Wave 1: 数据层)
    ├── 01-05 (Wave 2: 状态层)
    └── 01-06 (Wave 3: UI 层)
    ↓
Phase 2 (打字模式) ← 依赖 Phase 1 的文章数据
    ├── 02-00 (Wave 0: 测试骨架)
    ├── 02-01, 02-02 (Wave 1: 核心逻辑)
    ├── 02-03 (Wave 2: UI 组件)
    └── 02-04 (Wave 3: 页面集成)
    ↓
Phase 3 (UI优化)
```

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| 参考项目代码难以理解 | 先阅读源码，理解拼音匹配流程 |
| 分句逻辑复杂 | 从简单正则开始，迭代优化 |
| 长文章性能问题 | 考虑虚拟滚动或分段渲染 |

---
*Roadmap created: 2026-03-17*
*Estimated phases: 4 (v1) + 2 (v2)*
*Last updated: 2026-03-18 - Phase 2 plans created*
