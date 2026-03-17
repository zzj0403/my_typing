# Requirements: My Typing - 个人打字练习工具

**Defined:** 2026-03-17
**Core Value:** 能导入自己的文章 + 实时反馈 + 打完一篇

## v1 Requirements

### 文章管理 (ART)

- [x] **ART-01**: 用户可以上传 txt 文件导入自定义文章
- [x] **ART-02**: 内置诗词库（唐诗宋词精选）
- [x] **ART-03**: 内置名人名言库
- [x] **ART-04**: 文章自动分句处理（按标点分割）
- [x] **ART-05**: 用户可以选择文章进行练习

### 打字练习 (TYP)

- [ ] **TYP-01**: 看着原文逐句/逐段打字
- [ ] **TYP-02**: 全拼输入匹配（仅支持全拼）
- [ ] **TYP-03**: 实时正确/错误反馈（字符高亮）
- [ ] **TYP-04**: 打错可跳过继续（标记错误但不阻断）
- [ ] **TYP-05**: 标点符号直接按键匹配
- [ ] **TYP-06**: 打完一篇文章后有完成提示

### UI/UX (UI)

- [ ] **UI-01**: 清晰的原文展示区域
- [ ] **UI-02**: 当前输入位置高亮显示
- [ ] **UI-03**: 正确字符绿色标记
- [ ] **UI-04**: 错误字符红色标记
- [ ] **UI-05**: 进度指示（已打/总字数）

## v2 Requirements

延期到后续版本。

### 统计功能 (STAT)

- **STAT-01**: 打字速度统计（字/分钟）
- **STAT-02**: 准确率统计
- **STAT-03**: 错字回顾

### 历史记录 (HIST)

- **HIST-01**: 练习历史记录
- **HIST-02**: 进度追踪

## Out of Scope

| Feature | Reason |
|---------|--------|
| 双拼支持 | 用户只用全拼 |
| 中英文混合 | 纯中文练习 |
| 社交功能 | 个人工具，无需社交 |
| 云端同步 | 本地存储足够 |
| 移动端适配 | 优先桌面端 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| ART-01 | Phase 1 | Complete |
| ART-02 | Phase 1 | Complete |
| ART-03 | Phase 1 | Complete |
| ART-04 | Phase 1 | Complete |
| ART-05 | Phase 1 | Complete |
| TYP-01 | Phase 2 | Pending |
| TYP-02 | Phase 2 | Pending |
| TYP-03 | Phase 2 | Pending |
| TYP-04 | Phase 2 | Pending |
| TYP-05 | Phase 2 | Pending |
| TYP-06 | Phase 2 | Pending |
| UI-01 | Phase 2 | Pending |
| UI-02 | Phase 2 | Pending |
| UI-03 | Phase 2 | Pending |
| UI-04 | Phase 2 | Pending |
| UI-05 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-17*
*Last updated: 2026-03-17 after project initialization*
