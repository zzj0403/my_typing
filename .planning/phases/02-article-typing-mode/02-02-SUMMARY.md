---
phase: 02-article-typing-mode
plan: 02
subsystem: typing-ui
tags: [typing, tdd]
wave: 1
depends_on: [02-00, 02-01]
autonomous: true
requirements: [UI-02, UI-03, UI-04]

must_haves:
  truths:
    - "Pending characters show in default gray color"
    - "Current character has blue underline with cursor animation"
    - "Correct characters turn green"
    - "Incorrect characters show red with strikethrough"
    - "Skipped characters show in light gray"
  artifacts:
    - path: "src/components/TypingGame/CharSpan.tsx"
      provides: "Single character rendering with state styling"
      exports: ["CharSpan"]
    - path: "src/components/TypingGame/CharSpan.module.less"
      provides: "Character state styles"
      contains: ".current, .correct, .incorrect, .skipped"
  key_links:
    - from: "src/components/TypingGame/CharSpan.tsx"
      to: "src/types/typing.ts"
      via: "CharState import"
      pattern: "import.*CharState.*from"
---

## Phase 2 Plan 2: CharSpan Component

**One-liner:** CharSpan component with state-based visual feedback (5 states: using classnames library

**Key decisions:**
- Used @testing-library/react with manual React import to tests (classic runtime compatibility)
- Added esbuild configuration to force classic React.createElement runtime

**Key files created:**
- `src/components/TypingGame/CharSpan.tsx` - Main component
- `src/components/TypingGame/CharSpan.module.less` - Styles
- `tests/components/CharSpan.test.tsx` - Unit tests

**Files modified:**
- `vitest.config.ts` - Added esbuild configuration for classic runtime

**Deviations from Plan:**

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed esbuild preamble error by adding classic runtime configuration**
- **Found during:** Task 2 (test setup)
- **Issue:** @vitejs/plugin-react 1.x could detect React preamble in vitest environment
- **Fix:** Added `jsxRuntime: 'classic'` and esbuild `jsxFactory: 'React.createElement` to vitest.config.ts
- **Files modified:** vitest.config.ts
- **Commit:** 05c4f79

**2. [Rule 3 - Blocking] Added React import to tests for classic runtime compatibility**
- **Found during:** Task 2 (RED phase - tests initially failed)
- **Issue:** React is not defined when using classic runtime with JSX
- **Fix:** Added `import React from 'react'` to tests/components/CharSpan.test.tsx
- **Files modified:** tests/components/CharSpan.test.tsx
- **Commit:** 05c4f79

---

## Metrics

- **Duration:** 5 minutes
- **Tasks:** 2
- **Commits:** 3
- **Files modified:** 7
