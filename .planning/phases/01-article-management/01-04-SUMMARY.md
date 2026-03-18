---
phase: 01-article-management
plan: 04
subsystem: assets/utils
tags: [quotes, file-parser, tdd, utf-8]
dependency_graph:
  requires:
    - src/types/article.ts (Article type)
  provides:
    - src/assets/texts/Quotes.ts (QUOTES_DATA)
    - src/utils/fileParser.ts (parseTxtFile, isValidTxtFile)
  affects:
    - src/assets/texts/index.ts
tech_stack:
  added:
    - FileReader API for txt parsing
  patterns:
    - TDD (Test-Driven Development)
    - UTF-8 encoding for Chinese text
key_files:
  created:
    - src/assets/texts/Quotes.ts
    - src/utils/fileParser.ts
    - tests/assets/quotes.test.ts
    - tests/utils/fileParser.test.ts
  modified:
    - src/assets/texts/index.ts
decisions:
  - Use FileReader.readAsText with UTF-8 encoding for Chinese support
  - 32 classic quotes from Chinese classics (I Ching, Analects, etc.)
  - File validation by extension (.txt)
metrics:
  duration: 5 minutes
  completed_date: 2026-03-17
  test_coverage: 13 tests passing
  quotes_count: 32
---

# Phase 1 Plan 4: Quotes Data & File Parser Summary

**One-liner:** Created quotes data with 32 classic Chinese quotes and implemented UTF-8 txt file parser with TDD.

## Completed Tasks

### Task 1: Create Quotes Data File (TDD)

**Files:** `src/assets/texts/Quotes.ts`, `tests/assets/quotes.test.ts`

**Implementation:**

- Created `QUOTES_DATA` array with 32 classic Chinese quotes
- Sources include: I Ching, Analects, Mencius, Tao Te Ching, etc.
- Each quote has: id, key, title, description, content, source
- All quotes have `source: 'builtin'`

**Tests (6 passing):**

- Array validation (length >= 30)
- Required field validation
- Source type validation
- Non-empty content validation
- ID format validation (quote-xxx)
- Key matches ID validation

**Commit:** 2d896a0

### Task 2: Implement txt File Parser (TDD)

**Files:** `src/utils/fileParser.ts`, `tests/utils/fileParser.test.ts`

**Implementation:**

- `parseTxtFile(file: File): Promise<string>` - Main parsing function
- `isValidTxtFile(file: File): boolean` - File validation helper
- `FileParseError` class for error handling
- Uses `FileReader.readAsText(file, 'UTF-8')` for Chinese support

**Tests (7 passing):**

- UTF-8 encoded txt file parsing
- Chinese character handling
- Non-txt file rejection
- Empty file handling
- File extension validation
- Case-insensitive extension check

**Commit:** fb05941

### Task 3: Update Text Resource Index

**Files:** `src/assets/texts/index.ts`

**Implementation:**

- Added `export { QUOTES_DATA } from './Quotes'`
- Preserved existing imports and exports

**Commit:** 8810e15

## Deviations from Plan

None - plan executed exactly as written.

## Files Created/Modified

| File                           | Action   | Lines | Description              |
| ------------------------------ | -------- | ----- | ------------------------ |
| src/assets/texts/Quotes.ts     | Created  | 150+  | 32 classic quotes data   |
| src/utils/fileParser.ts        | Created  | 55    | File parser with UTF-8   |
| tests/assets/quotes.test.ts    | Created  | 50    | Quote validation tests   |
| tests/utils/fileParser.test.ts | Modified | 50    | Parser tests             |
| src/assets/texts/index.ts      | Modified | 7     | Added QUOTES_DATA export |

## Verification Results

```
Test Files  2 passed (2)
     Tests  13 passed (13)
  Duration  921ms
```

## Success Criteria Met

- [x] Quotes data contains >= 30 classic quotes (32 quotes)
- [x] File parser correctly handles UTF-8 encoding
- [x] File parser validates file type
- [x] All unit tests pass

## Self-Check

- [x] src/assets/texts/Quotes.ts exists
- [x] src/utils/fileParser.ts exists
- [x] tests/assets/quotes.test.ts exists
- [x] tests/utils/fileParser.test.ts exists
- [x] src/assets/texts/index.ts exports QUOTES_DATA
- [x] All commits exist in git history

## Self-Check: PASSED
