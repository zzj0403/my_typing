# Deferred Items

## Pre-existing Issues (Out of Scope)

### CharSpan CSS Module Class Name Tests
- **Issue:** tests/components/CharSpan.test.tsx expects exact class names (e.g., 'correct') but CSS modules generate hashed names (e.g., '_correct_1ea07a')
- **Source:** Phase 2 Plan 02 (CharSpan component creation)
- **Status:** 3 of 4 CharSpan tests fail due to this pattern
- **Impact:** Does not affect TypingGame integration tests (8 tests pass)
- **Recommendation:** Update CharSpan tests to use partial class matching or data-testid attributes
