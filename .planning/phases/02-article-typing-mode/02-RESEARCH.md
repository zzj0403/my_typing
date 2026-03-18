# Phase 2: 整篇文章打字模式 - Research

**Researched:** 2026-03-18 **Domain:** React中文打字练习应用、拼音匹配、实时反馈、状态管理 **Confidence:** HIGH

## Summary

本阶段需要将现有单字打字练习改造为整篇文章连续打字模式。核心任务是复用现有拼音匹配逻辑（pinyin-pro）、改造UI为整篇文章展示、实现逐字实时反馈、处理标点符号直接匹配、实现错误可跳过继续机制、添加进度指示和完成提示。

**Primary recommendation:** 采用状态机模式管理打字流程，复用现有 `CharInfo` 类型体系和 `useArticleStore`，创建新的 `TypingGame` 组件处理整篇文章打字逻辑，使用 composition 事件处理中文输入法，通过字符级状态数组实现实时反馈。

## Standard Stack

### Core

| Library    | Version  | Purpose  | Why Standard            |
| ---------- | -------- | -------- | ----------------------- |
| React      | ^18.2.0  | UI框架   | 项目已使用              |
| Zustand    | ^5.0.12  | 状态管理 | Phase 1已集成，轻量高效 |
| pinyin-pro | ^3.28.0  | 拼音转换 | 项目已使用，准确度高    |
| Ant Design | ^4.24.16 | UI组件库 | 项目已使用              |

### Supporting

| Library    | Version | Purpose           | When to Use                      |
| ---------- | ------- | ----------------- | -------------------------------- |
| ahooks     | ^3.7.0  | React Hooks工具集 | useControllableValue、useBoolean |
| classnames | ^2.2.6  | 条件样式          | 字符状态样式切换                 |
| vitest     | ^1.6.0  | 测试框架          | Phase 1已配置，单元测试          |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
| --- | --- | --- |
| react-typing-game-hook | 自定义状态管理 | react-typing-game-hook提供完整打字游戏逻辑，但本项目已有CharInfo体系，自定义更灵活 |
| react-window | CSS分段渲染 | 仅超长文章（>500字）需虚拟滚动，初期可暂不引入 |

**Installation:** 无需新增依赖，所有核心库已安装。

**Version verification:**

```
React: 18.2.0 (package.json)
Zustand: 5.0.12 (npm list)
pinyin-pro: 3.28.0 (npm view pinyin-pro version)
Ant Design: 4.24.16 (npm list)
vitest: 1.6.0 (package.json)
```

## Architecture Patterns

### Recommended Project Structure

```
src/
├── components/
│   ├── TypingGame/           # 新增：整篇文章打字组件
│   │   ├── index.tsx         # 主组件
│   │   ├── ArticleDisplay.tsx # 文章展示组件
│   │   ├── CharSpan.tsx      # 单个字符渲染
│   │   ├── ProgressBar.tsx   # 进度条组件
│   │   └── index.module.less # 样式
├── hooks/
│   └── useTypingGame.ts      # 新增：打字游戏逻辑hook
├── stores/
│   ├── articleStore.ts       # 已存在：文章管理
│   └── typingStore.ts        # 新增：打字状态管理（可选）
├── types/
│   ├── article.ts            # 已存在
│   └── typing.ts             # 新增：打字相关类型
└── pages/
    └── Hero/
        └── index.tsx         # 已存在：需要改造
```

### Pattern 1: 字符状态管理模式

**What:** 使用字符级状态数组跟踪每个字符的输入状态

**When to use:** 需要实时反馈每个字符正确/错误时

**Example:**

```typescript
// types/typing.ts
export enum CharState {
  Pending = 'pending', // 待输入
  Correct = 'correct', // 正确
  Incorrect = 'incorrect', // 错误
  Skipped = 'skipped', // 已跳过
}

export interface TypingChar extends CharInfo {
  state: CharState
  inputPinyin?: string // 用户输入的拼音（用于错误标记）
}

// hooks/useTypingGame.ts
export function useTypingGame(article: Article) {
  const [chars, setChars] = useState<TypingChar[]>(() =>
    article.sentences.flatMap((s) =>
      s.chars.map((c) => ({ ...c, state: CharState.Pending })),
    ),
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [inputBuffer, setInputBuffer] = useState('')

  const handleInput = (value: string) => {
    const currentChar = chars[currentIndex]
    if (!currentChar) return

    if (currentChar.type === CharType.Mark) {
      // 标点直接匹配
      if (value === currentChar.char) {
        markCorrect(currentIndex)
        moveToNext()
      }
    } else if (currentChar.type === CharType.Hanzi) {
      // 汉字拼音匹配
      if (value === currentChar.quanpin) {
        markCorrect(currentIndex)
        moveToNext()
      } else if (!currentChar.quanpin.startsWith(value)) {
        // 输入不匹配，标记错误但可继续
        markIncorrect(currentIndex, value)
        moveToNext()
      }
    }
  }

  const markCorrect = (index: number) => {
    setChars((prev) =>
      prev.map((c, i) =>
        i === index ? { ...c, state: CharState.Correct } : c,
      ),
    )
  }

  const markIncorrect = (index: number, input: string) => {
    setChars((prev) =>
      prev.map((c, i) =>
        i === index
          ? { ...c, state: CharState.Incorrect, inputPinyin: input }
          : c,
      ),
    )
  }

  return {
    chars,
    currentIndex,
    progress: { typed: currentIndex, total: chars.length },
    handleInput,
    skipCurrent: () => moveToNext(),
    isComplete: currentIndex >= chars.length,
  }
}
```

**Source:** 参考自 react-typing-game-hook 的状态管理模式，适配本项目 CharInfo 体系

### Pattern 2: Composition Event 处理

**What:** 使用 compositionstart/compositionend 处理中文输入法

**When to use:** 需要支持中文拼音输入时

**Example:**

```typescript
// components/TypingGame/index.tsx
export function TypingGame({ article }: { article: Article }) {
  const [isComposing, setIsComposing] = useState(false)
  const { handleInput, chars, currentIndex } = useTypingGame(article)

  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false)
    const value = (e.target as HTMLInputElement).value
    handleInput(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // ESC 跳过当前字符
    if (e.key === 'Escape') {
      skipCurrent()
      return
    }
    // 非输入法状态下的普通按键
    if (!isComposing && e.key.length === 1) {
      // 标点符号直接匹配
      const currentChar = chars[currentIndex]
      if (currentChar?.type === CharType.Mark && e.key === currentChar.char) {
        handleInput(e.key)
      }
    }
  }

  return (
    <div>
      <input
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onKeyDown={handleKeyDown}
        value={inputBuffer}
        onChange={(e) => setInputBuffer(e.target.value)}
      />
    </div>
  )
}
```

**Source:** [React IME Composition Events Best Practices](https://github.com/facebook/react/issues/8683)

### Pattern 3: 字符实时反馈渲染

**What:** 使用条件样式实现字符级别的实时视觉反馈

**When to use:** 需要逐字高亮显示输入状态时

**Example:**

```typescript
// components/TypingGame/CharSpan.tsx
export function CharSpan({
  char,
  state,
  isCurrent,
  inputPinyin,
}: {
  char: CharInfo
  state: CharState
  isCurrent: boolean
  inputPinyin?: string
}) {
  const className = classNames({
    [styles.char]: true,
    [styles.current]: isCurrent,
    [styles.correct]: state === CharState.Correct,
    [styles.incorrect]: state === CharState.Incorrect,
    [styles.skipped]: state === CharState.Skipped,
  })

  return (
    <span className={className}>
      {char.char}
      {state === CharState.Incorrect && inputPinyin && (
        <span className={styles.errorPinyin}>{inputPinyin}</span>
      )}
    </span>
  )
}

// index.module.less
.char {
  position: relative;
  transition: color 0.2s;

  &.current {
    border-bottom: 2px solid #1890ff;
    animation: blink 1s infinite;
  }

  &.correct {
    color: #52c41a;
  }

  &.incorrect {
    color: #ff4d4f;
    text-decoration: line-through;
  }

  .errorPinyin {
    position: absolute;
    bottom: -20px;
    left: 0;
    font-size: 12px;
    color: #ff4d4f;
  }
}
```

**Source:** 本项目现有 Grid.tsx 的字符样式模式

### Anti-Patterns to Avoid

- **全量重新渲染：** 每次输入触发整个文章重新渲染会严重影响性能。应使用 React.memo 和 key 优化单个字符组件
- **阻塞式错误处理：** 强制用户纠正错误才能继续会导致体验不佳。应允许跳过并标记错误
- **忽略输入法状态：** 不处理 composition 事件会导致中文输入异常触发匹配逻辑

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
| --- | --- | --- | --- |
| 拼音转换 | 自定义拼音映射表 | pinyin-pro 库 | 已集成，准确度高，处理多音字和 ü->v 转换 |
| 文章分句 | 复杂正则分割 | splitIntoSentences (已有) | Phase 1已实现，支持 。！？；分隔符 |
| 字符信息生成 | 手动构建 CharInfo | textToChars (已有) | articleStore 已实现，自动处理汉字和标点 |
| 状态持久化 | 自定义 localStorage | Zustand persist | 已集成，仅持久化必要数据 |

**Key insight:** 本项目已有完善的文章管理体系（Article、Sentence、CharInfo），应复用而非重写

## Common Pitfalls

### Pitfall 1: Composition Event 不触发导致拼音提前匹配

**What goes wrong:** 输入中文时，每个字母都会触发 onChange，导致拼音输入未完成就进行匹配

**Why it happens:** 未正确处理 compositionstart/compositionend 事件，React 的 controlled input 会实时更新

**How to avoid:**

```typescript
const [isComposing, setIsComposing] = useState(false)

// 只在非 composition 状态下处理匹配
const handleChange = (value: string) => {
  if (!isComposing) {
    setInputBuffer(value)
  }
}

const handleCompositionEnd = (e: React.CompositionEvent) => {
  setIsComposing(false)
  const value = (e.target as HTMLInputElement).value
  handleInput(value)
  setInputBuffer('') // 清空输入框
}
```

**Warning signs:** 输入"zhong"时，输入"z"就立即触发匹配，导致所有 z 开头的汉字都被错误匹配

### Pitfall 2: 长文章性能问题

**What goes wrong:** 文章超过 500 字时，每次输入都触发全量渲染，界面卡顿

**Why it happens:** React 需要对比大量 DOM 节点，即使只有一个字符状态改变

**How to avoid:**

1. 使用 React.memo 包装 CharSpan 组件
2. 按句子分割渲染，只重新渲染当前句子
3. 对于超长文章（>1000字），考虑分页或虚拟滚动

```typescript
// 优化方案：按句子分割渲染
export function ArticleDisplay({ sentences, currentIndex }: Props) {
  const currentSentenceIndex = findSentenceIndex(sentences, currentIndex)

  return (
    <div>
      {sentences.map((sentence, sIdx) => (
        <Sentence
          key={sentence.id}
          sentence={sentence}
          isActive={sIdx === currentSentenceIndex}
          charOffset={getCharOffset(sentences, sIdx)}
          currentIndex={currentIndex}
        />
      ))}
    </div>
  )
}

// 使用 React.memo 避免非活跃句子重新渲染
const Sentence = React.memo(function Sentence({ sentence, isActive, ... }) {
  // 仅活跃句子响应状态变化
})
```

**Warning signs:** 输入延迟明显，DevTools 显示大量组件重新渲染

### Pitfall 3: 标点符号匹配问题

**What goes wrong:** 中文标点（，。！？）无法正确匹配，导致卡在标点字符

**Why it happens:** 键盘输入的是英文标点，文章中是中文标点，字符编码不一致

**How to avoid:**

1. 在 CharInfo 中标记标点类型（CharType.Mark）
2. 建立英文标点到中文标点的映射表
3. 允许英文标点匹配对应的中文标点

```typescript
// 标点映射表
const PUNCTUATION_MAP: Record<string, string> = {
  ',': '，',
  '.': '。',
  '!': '！',
  '?': '？',
  ';': '；',
  ':': '：',
  '"': '"',
  '"': '"',
}

const handlePunctuation = (input: string, target: string) => {
  return input === target || PUNCTUATION_MAP[input] === target
}
```

**Warning signs:** 用户输入逗号但无法匹配中文逗号，需要切换输入法

### Pitfall 4: 进度状态同步问题

**What goes wrong:** 进度指示不准确，或刷新页面后进度丢失

**Why it happens:** 进度状态未持久化，或 Zustand store 未正确配置

**How to avoid:**

```typescript
// stores/typingStore.ts
interface TypingState {
  articleId: string | null
  currentIndex: number
  startTime: number | null
  errors: Array<{ index: number; input: string }>
}

export const useTypingStore = create<TypingState>()(
  persist(
    (set) => ({
      articleId: null,
      currentIndex: 0,
      startTime: null,
      errors: [],
      // ... actions
    }),
    {
      name: 'typing-progress',
      partialize: (state) => ({
        articleId: state.articleId,
        currentIndex: state.currentIndex,
      }),
    },
  ),
)
```

**Warning signs:** 刷新页面后进度归零，或切换文章后进度混乱

## Code Examples

### 整篇文章打字主组件

```typescript
// components/TypingGame/index.tsx
import React, { useState, useCallback } from 'react'
import { Typography, Progress, Button, message } from 'antd'
import { useTypingGame } from '@/hooks/useTypingGame'
import { useArticleStore } from '@/stores'
import ArticleDisplay from './ArticleDisplay'
import styles from './index.module.less'

export function TypingGame() {
  const { currentArticleId, getArticleById } = useArticleStore()
  const article = currentArticleId ? getArticleById(currentArticleId) : null

  const {
    chars,
    currentIndex,
    progress,
    isComplete,
    handleInput,
    skipCurrent,
    reset,
  } = useTypingGame(article)

  const [isComposing, setIsComposing] = useState(false)
  const [inputBuffer, setInputBuffer] = useState('')

  const handleCompositionStart = useCallback(() => {
    setIsComposing(true)
  }, [])

  const handleCompositionEnd = useCallback((e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false)
    const value = (e.target as HTMLInputElement).value
    handleInput(value)
    setInputBuffer('')
  }, [handleInput])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      skipCurrent()
      setInputBuffer('')
      return
    }

    if (!isComposing && e.key.length === 1) {
      const currentChar = chars[currentIndex]
      if (currentChar?.type === CharType.Mark) {
        handleInput(e.key)
        setInputBuffer('')
      }
    }
  }, [isComposing, chars, currentIndex, handleInput, skipCurrent])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputBuffer(value)

    // 非中文输入时实时检查（用于标点和短拼音）
    if (!isComposing) {
      const currentChar = chars[currentIndex]
      if (currentChar?.type === CharType.Mark && value === currentChar.char) {
        handleInput(value)
        setInputBuffer('')
      }
    }
  }, [isComposing, chars, currentIndex, handleInput])

  // 完成提示
  React.useEffect(() => {
    if (isComplete) {
      message.success('恭喜！文章打字完成！')
    }
  }, [isComplete])

  if (!article) {
    return <Typography.Text>请先选择一篇文章</Typography.Text>
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography.Title level={4}>{article.title}</Typography.Title>
        <Progress
          percent={Math.round((progress.typed / progress.total) * 100)}
          status={isComplete ? 'success' : 'active'}
        />
        <Typography.Text type="secondary">
          {progress.typed} / {progress.total} 字
        </Typography.Text>
      </div>

      <ArticleDisplay
        sentences={article.sentences}
        chars={chars}
        currentIndex={currentIndex}
      />

      <div className={styles.inputArea}>
        <input
          className={styles.input}
          value={inputBuffer}
          onChange={handleInputChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          onKeyDown={handleKeyDown}
          placeholder={chars[currentIndex]?.type === CharType.Hanzi
            ? '输入拼音...'
            : '输入标点...'
          }
          autoFocus
        />
        <Button onClick={skipCurrent}>跳过 (ESC)</Button>
        <Button onClick={reset}>重置</Button>
      </div>
    </div>
  )
}
```

**Source:** 基于 react-typing-game-hook 模式，适配本项目 Article 体系

### 打字游戏 Hook

```typescript
// hooks/useTypingGame.ts
import { useState, useCallback, useMemo } from 'react'
import { CharType } from '@/core'
import type { Article, CharInfo } from '@/types/article'

export enum CharState {
  Pending = 'pending',
  Correct = 'correct',
  Incorrect = 'incorrect',
  Skipped = 'skipped',
}

export interface TypingChar extends CharInfo {
  state: CharState
  inputPinyin?: string
}

export function useTypingGame(article: Article | null) {
  const [chars, setChars] = useState<TypingChar[]>(() => {
    if (!article) return []
    return article.sentences.flatMap((s) =>
      s.chars.map((c) => ({ ...c, state: CharState.Pending })),
    )
  })

  const [currentIndex, setCurrentIndex] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)

  // 标点映射
  const punctuationMap: Record<string, string> = {
    ',': '，',
    '.': '。',
    '!': '！',
    '?': '？',
    ';': '；',
    ':': '：',
  }

  const handleInput = useCallback(
    (value: string) => {
      if (!article || currentIndex >= chars.length) return

      // 开始计时
      if (!startTime) {
        setStartTime(Date.now())
      }

      const currentChar = chars[currentIndex]
      let isCorrect = false

      if (currentChar.type === CharType.Mark) {
        // 标点匹配（支持英文标点映射）
        isCorrect =
          value === currentChar.char ||
          punctuationMap[value] === currentChar.char
      } else if (currentChar.type === CharType.Hanzi) {
        // 拼音匹配（完全匹配）
        isCorrect = value === currentChar.quanpin
      }

      setChars((prev) =>
        prev.map((c, i) => {
          if (i !== currentIndex) return c
          return {
            ...c,
            state: isCorrect ? CharState.Correct : CharState.Incorrect,
            inputPinyin: isCorrect ? undefined : value,
          }
        }),
      )

      // 移动到下一个字符（错误也可继续）
      setCurrentIndex((prev) => prev + 1)
    },
    [article, chars, currentIndex, startTime],
  )

  const skipCurrent = useCallback(() => {
    if (currentIndex >= chars.length) return

    setChars((prev) =>
      prev.map((c, i) =>
        i === currentIndex ? { ...c, state: CharState.Skipped } : c,
      ),
    )
    setCurrentIndex((prev) => prev + 1)
  }, [chars, currentIndex])

  const reset = useCallback(() => {
    if (!article) return
    setChars(
      article.sentences.flatMap((s) =>
        s.chars.map((c) => ({ ...c, state: CharState.Pending })),
      ),
    )
    setCurrentIndex(0)
    setStartTime(null)
  }, [article])

  const progress = useMemo(
    () => ({
      typed: currentIndex,
      total: chars.length,
      correct: chars.filter((c) => c.state === CharState.Correct).length,
      incorrect: chars.filter((c) => c.state === CharState.Incorrect).length,
      skipped: chars.filter((c) => c.state === CharState.Skipped).length,
    }),
    [chars, currentIndex],
  )

  return {
    chars,
    currentIndex,
    progress,
    isComplete: currentIndex >= chars.length,
    handleInput,
    skipCurrent,
    reset,
    startTime,
  }
}
```

**Source:** 参考自 [react-typing-game-hook](https://github.com/jokarz/react-typing-game-hook)，适配本项目需求

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
| --- | --- | --- | --- |
| 单字练习 | 整篇文章练习 | Phase 2 | 用户可以连续打完整篇文章，体验更流畅 |
| 阻塞式错误 | 跳过式错误 | Phase 2 | 错误不阻断，用户可继续，标记错误即可 |
| 无进度指示 | 实时进度 + 完成提示 | Phase 2 | 用户清楚当前进度，完成有成就感 |

**Deprecated/outdated:**

- 双拼支持：Phase 0 已移除，仅保留全拼
- TextRegister.load()：手动加载拼音的方式已过时，使用 articleStore 自动生成

## Open Questions

1. **是否需要独立 typingStore？**
   - What we know: articleStore 已管理文章数据，typingState 可用 useState 管理
   - What's unclear: 进度持久化是否必要？刷新页面是否需要恢复进度？
   - Recommendation: 初期用 useState，如需持久化再迁移到 Zustand

2. **长文章是否需要虚拟滚动？**
   - What we know: 测试数据中诗词最长约 100 字，名言约 30 字
   - What's unclear: 用户上传的超长文章（如 1000+ 字）如何处理？
   - Recommendation: 初期使用按句子分割渲染，如性能有问题再引入 react-window

3. **错误是否允许回退修改？**
   - What we know: 需求中明确"错误可跳过继续"
   - What's unclear: 是否需要 Backspace 回退修改已打字符？
   - Recommendation: 初期不支持回退，简化逻辑，后续根据用户反馈决定

## Validation Architecture

### Test Framework

| Property           | Value                 |
| ------------------ | --------------------- |
| Framework          | vitest 1.6.0          |
| Config file        | vitest.config.ts      |
| Quick run command  | `npm run test`        |
| Full suite command | `npm run test` (same) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
| --- | --- | --- | --- | --- |
| TYP-01 | 看着原文逐句/逐段打字 | integration | `vitest run tests/components/TypingGame.test.tsx` | ❌ Wave 0 |
| TYP-02 | 全拼输入匹配 | unit | `vitest run tests/hooks/useTypingGame.test.ts` | ❌ Wave 0 |
| TYP-03 | 实时正确/错误反馈 | unit | `vitest run tests/hooks/useTypingGame.test.ts` | ❌ Wave 0 |
| TYP-04 | 打错可跳过继续 | unit | `vitest run tests/hooks/useTypingGame.test.ts` | ❌ Wave 0 |
| TYP-05 | 标点符号直接匹配 | unit | `vitest run tests/hooks/useTypingGame.test.ts` | ❌ Wave 0 |
| TYP-06 | 打完一篇文章后有完成提示 | integration | `vitest run tests/components/TypingGame.test.tsx` | ❌ Wave 0 |
| UI-01 | 清晰的原文展示区域 | visual | Manual testing | N/A |
| UI-02 | 当前输入位置高亮显示 | unit | `vitest run tests/components/CharSpan.test.tsx` | ❌ Wave 0 |
| UI-03 | 正确字符绿色标记 | unit | `vitest run tests/components/CharSpan.test.tsx` | ❌ Wave 0 |
| UI-04 | 错误字符红色标记 | unit | `vitest run tests/components/CharSpan.test.tsx` | ❌ Wave 0 |
| UI-05 | 进度指示（已打/总字数） | unit | `vitest run tests/hooks/useTypingGame.test.ts` | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `npm run test` (快速验证新增功能)
- **Per wave merge:** `npm run test` (确保所有测试通过)
- **Phase gate:** 全量测试通过 + 手动 UI 测试

### Wave 0 Gaps

- [ ] `tests/hooks/useTypingGame.test.ts` — covers TYP-02, TYP-03, TYP-04, TYP-05, UI-05
- [ ] `tests/components/TypingGame.test.tsx` — covers TYP-01, TYP-06
- [ ] `tests/components/CharSpan.test.tsx` — covers UI-02, UI-03, UI-04
- [ ] Framework install: vitest 1.6.0 — ✅ Already installed

## Phase Requirements

| ID | Description | Research Support |
| --- | --- | --- |
| TYP-01 | 看着原文逐句/逐段打字 | ArticleDisplay 组件展示原文，useTypingGame 管理逐字输入 |
| TYP-02 | 全拼输入匹配 | 复用 CharInfo.quanpin，pinyin-pro 生成拼音 |
| TYP-03 | 实时正确/错误反馈 | CharState 枚举 + CharSpan 组件条件样式 |
| TYP-04 | 打错可跳过继续 | skipCurrent() 方法，错误标记但不阻断 |
| TYP-05 | 标点符号直接匹配 | punctuationMap 映射表，支持英文标点 |
| TYP-06 | 打完一篇文章后有完成提示 | isComplete 状态 + message.success() |
| UI-01 | 清晰的原文展示区域 | ArticleDisplay 组件，Typography 样式 |
| UI-02 | 当前输入位置高亮显示 | currentIndex + styles.current 样式 |
| UI-03 | 正确字符绿色标记 | CharState.Correct + styles.correct (#52c41a) |
| UI-04 | 错误字符红色标记 | CharState.Incorrect + styles.incorrect (#ff4d4f) |
| UI-05 | 进度指示（已打/总字数） | Progress 组件 + progress.typed/total |

## Sources

### Primary (HIGH confidence)

- react-typing-game-hook - GitHub: https://github.com/jokarz/react-typing-game-hook
- React Composition Events - React Issue #8683: https://github.com/facebook/react/issues/8683
- 本项目源码 - src/core/registers/TextRegister, src/stores/articleStore, src/pages/Hero

### Secondary (MEDIUM confidence)

- React IME Composition Events - GitHub Discussions: https://github.com/orgs/community/discussions/185819
- React State Management 2026 - Medium: https://medium.com/codetodeploy/15-react-concepts-every-frontend-engineer-must-know-in-2026-25549bb1656a

### Tertiary (LOW confidence)

- React Performance Optimization - Stack Overflow (访问受限)

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - 所有库已安装并验证版本
- Architecture: HIGH - 基于 react-typing-game-hook 成熟模式，适配本项目体系
- Pitfalls: HIGH - 基于实际开发经验和社区最佳实践

**Research date:** 2026-03-18 **Valid until:** 2026-04-18 (1个月，React/Zustand 生态稳定)
