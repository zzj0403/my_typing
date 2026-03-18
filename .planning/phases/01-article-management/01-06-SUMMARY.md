---
phase: 01-article-management
plan: 06
subsystem: ui
tags: [react, antd, drawer, upload, article-list, zustand]

# Dependency graph
requires:
  - phase: 01-05
    provides: Article store (useArticleStore) with CRUD and persistence
  - phase: 01-04
    provides: parseTxtFile utility and QUOTES_DATA
provides:
  - ArticleList UI component with category filtering
  - File upload functionality for txt articles
  - Article selection with Drawer integration
  - Delete confirmation modal for uploaded articles
affects: [hero-page, typing-mode]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - 'Drawer pattern for modal article selection'
    - 'Article to TextConfig conversion for TextRegister integration'
    - 'Category-based filtering with source mapping'

key-files:
  created:
    - src/components/ArticleList/index.tsx
    - src/components/ArticleList/index.module.less
    - src/components/ArticleList/types.ts
  modified:
    - src/components/index.ts
    - src/pages/Hero/index.tsx
    - src/stores/articleStore.ts

key-decisions:
  - 'Use Drawer component for article list display instead of separate page'
  - 'Convert ü to v in pinyin for keyboard input compatibility'
  - 'Filter poems/quotes by ID prefix (poem-/quote-)'

patterns-established:
  - 'Pattern 1: Article to TextConfig conversion bridges store and TextRegister'
  - 'Pattern 2: Category tabs filter by source and ID prefix'

requirements-completed: [ART-01, ART-05]

# Metrics
duration: 45min
completed: 2026-03-17
---

# Phase 1 Plan 6: Article List UI Summary

**ArticleList component with category tabs, file upload, Drawer integration, and ü->v pinyin conversion**

## Performance

- **Duration:** 45 min
- **Started:** 2026-03-17T14:30:00Z
- **Completed:** 2026-03-17T15:15:00Z
- **Tasks:** 5 (4 auto + 1 integration)
- **Files modified:** 6

## Accomplishments

- Created ArticleList component with all UI interactions
- Integrated ArticleList into Hero page via Drawer
- Fixed pinyin ü -> v conversion for proper keyboard input
- Implemented category-based filtering (全部/诗词/名言/我的)
- Connected Article selection to TextRegister for typing

## Task Commits

Each task was committed atomically:

1. **Task 1: 创建 ArticleList 组件类型定义** - `7ff3d53` (feat)
2. **Task 2: 创建 ArticleList 样式文件** - `3f9916a` (feat)
3. **Task 3: 创建 ArticleList 主组件** - `e25706a` (feat)
4. **Task 4: 更新组件导出** - `bca061d` (feat)
5. **Task 5: Hero 页面集成** - `1e1c89e` (feat)

**Plan metadata:** (pending)

## Files Created/Modified

- `src/components/ArticleList/types.ts` - Type definitions for ArticleCategory, ArticleListProps
- `src/components/ArticleList/index.module.less` - Styles with active states and transitions
- `src/components/ArticleList/index.tsx` - Main component with Upload, Tabs, List, Modal
- `src/components/index.ts` - Added ArticleList exports
- `src/pages/Hero/index.tsx` - Integrated ArticleList via Drawer
- `src/stores/articleStore.ts` - Fixed ü -> v pinyin conversion

## Decisions Made

- Used Drawer for article selection UX (better than separate page)
- Filter poems/quotes by ID prefix since they share 'builtin' source
- Convert ü to v in pinyin because standard keyboards don't have ü key

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed pinyin ü -> v conversion**

- **Found during:** Hero page integration
- **Issue:** Pinyin library returns ü for 绿 (lv), but keyboard has no ü key
- **Fix:** Added `.replace(/ü/g, 'v')` to quanpin in textToChars function
- **Files modified:** src/stores/articleStore.ts
- **Verification:** 绿 now correctly maps to 'lv' for typing
- **Committed in:** 1e1c89e (integration commit)

---

**Total deviations:** 1 auto-fixed (1 bug) **Impact on plan:** Essential fix for Chinese pinyin typing accuracy

## Issues Encountered

None - all tasks completed as planned

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- ArticleList component ready for use in typing practice flow
- Users can now select articles from built-in or uploaded sources
- Phase 1 complete - ready to proceed to Phase 2 (整篇文章打字模式)

---

_Phase: 01-article-management_ _Completed: 2026-03-17_

## Self-Check: PASSED

**Verified:**

- SUMMARY.md exists at `.planning/phases/01-article-management/01-06-SUMMARY.md`
- All commits present:
  - `78b017d` docs(01-06): complete ArticleList UI plan
  - `1e1c89e` feat(01-06): integrate ArticleList into Hero page with Drawer
  - `bca061d` feat(01-06): export ArticleList from components index
  - `e25706a` feat(01-06): create ArticleList main component
  - `3f9916a` feat(01-06): create ArticleList component styles
  - `7ff3d53` feat(01-06): create ArticleList component type definitions
