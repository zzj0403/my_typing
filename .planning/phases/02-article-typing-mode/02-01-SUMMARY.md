---
phase: 02-article-typing-mode
plan: 01
subsystem: typing
tags: [types, hook, tdd, pinyin, punctuation]
requires: [02-00]
provides:
  [useTypingGame, CharState, TypingChar, TypingProgress, PUNCTUATION_MAP]
affects: []
tech_stack:
  added: []
  patterns: [React hooks, TDD, useState, useCallback, useMemo]
key_files:
  created:
    - src/types/typing.ts
    - src/hooks/useTypingGame.ts
    - tests/hooks/useTypingGame.test.ts
  modified: []
decisions: []
metrics:
  duration: 5min
  completed_date: 2026-03-18
  task_count: 2
  file_count: 3
  test_count: 6
---

# Phase 02 Plan 01: Define Typing Types & useTypingGame Hook Summary

Implement core typing state machine with CharState enum, TypingChar/TypingProgress types, and useTypingGame hook for article typing mode with full pinyin/punctuation matching logic.

## One-liner

Core typing state machine with CharState enum and useTypingGame hook implementing pinyin matching, punctuation mapping, and progress tracking.

---

## Completed Tasks

### Task 1: Define typing types

**Commit:** `f6506fe`

Created `src/types/typing.ts` with:

- **CharState enum**: Pending, Correct, Incorrect, Skipped states
- **TypingChar interface**: Extends CharInfo with state and inputPinyin fields
- **TypingProgress interface**: typed, total, correct, incorrect, skipped counts
- **PUNCTUATION_MAP**: English-to-Chinese punctuation mapping (`,.!?;:` -> `，。！？；：`)

### Task 2: Implement useTypingGame hook with tests (TDD)

**Commits:**

- `fa84023` - RED: Failing tests for useTypingGame
- `285e4ef` - GREEN: Implementation with all tests passing

**Hook Features:**

- `handleInput(value)`: Match pinyin for Hanzi (TYP-02), mark Correct/Incorrect (TYP-03, TYP-04)
- `skipCurrent()`: Skip current character on ESC (TYP-04)
- Punctuation mapping via PUNCTUATION_MAP (TYP-05)
- Progress calculation with all counts (UI-05)
- `reset()`: Reset game state
- `isComplete`: Boolean flag for completion

**Test Coverage (6 tests):**

1. Match pinyin for Hanzi characters
2. Mark correct when pinyin matches
3. Mark incorrect and continue
4. Skip current character
5. Punctuation mapping (English ',' matches Chinese '，')
6. Progress calculation

---

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed test assertion for wrong pinyin scenario**

- **Found during:** Task 2 GREEN phase
- **Issue:** Test expected `chars[1].state` to be Incorrect after input 'hao', but `chars[0]` is affected since currentIndex=0
- **Fix:** Changed assertion from `chars[1]` to `chars[0]` with corrected comment
- **Files modified:** tests/hooks/useTypingGame.test.ts
- **Commit:** 285e4ef

---

## Files Created/Modified

| File | Action | Purpose |
| --- | --- | --- |
| src/types/typing.ts | Created | CharState, TypingChar, TypingProgress, PUNCTUATION_MAP |
| src/hooks/useTypingGame.ts | Created | Core typing game logic hook |
| tests/hooks/useTypingGame.test.ts | Created | 6 unit tests for hook |

---

## Verification Results

```bash
# Type exports verified
grep -E "export (enum|interface|const) (CharState|TypingChar|TypingProgress|PUNCTUATION_MAP)" src/types/typing.ts
# All 4 exports found

# Tests verified
npm run test -- tests/hooks/useTypingGame.test.ts
# 6 passed
```

---

## Next Steps

Plan 02-02 will consume useTypingGame hook in TypingGame component.
