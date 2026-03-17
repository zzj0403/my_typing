# Roadmap: My Typing - 个人打字练习工具

**Project:** 基于 https://github.com/yunsii/pinyin Fork
**Strategy:** 增量开发，复用已有拼音匹配逻辑
**Milestone:** v1.0 MVP - 可用的文章打字练习

---

## Phase 0: 项目初始化

**Goal:** Fork 参考项目，清理不需要的代码，建立开发环境

**Plans:** 1 plan

Plans:
- [ ] 00-01-PLAN.md — Fork 项目、清理双拼代码、验证运行

**Success Criteria:**
- 项目可本地启动
- 基础打字功能正常
- 代码中无双拼相关逻辑

---

## Phase 1: 文章管理系统

**Goal:** 实现文章导入、存储和选择功能

**Tasks:**
- [ ] 设计文章数据结构 (id, title, content, sentences[])
- [ ] 实现文章分句函数（按标点分割）
- [ ] 创建内置诗词库数据文件
- [ ] 创建内置名人名言数据文件
- [ ] 实现 txt 文件上传和解析
- [ ] 实现文章列表 UI（选择文章）
- [ ] 实现文章管理状态（Zustand store）

**Success Criteria:**
- 可选择内置诗词/名言进行练习
- 可上传自定义 txt 文件
- 文章正确分句显示

**Requirements:** ART-01, ART-02, ART-03, ART-04, ART-05

---

## Phase 2: 整篇文章打字模式

**Goal:** 改造现有单字练习为整篇文章连续打字

**Tasks:**
- [ ] 复用现有拼音匹配逻辑
- [ ] 修改打字界面为整篇文章展示
- [ ] 实现逐字实时反馈（正确绿色/错误红色）
- [ ] 实现标点符号直接匹配
- [ ] 实现错误可跳过继续
- [ ] 实现进度指示（已打/总字数）
- [ ] 实现打完提示

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
    ↓
Phase 2 (打字模式) ← 依赖 Phase 1 的文章数据
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
