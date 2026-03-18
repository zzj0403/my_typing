# Phase 01: 文章管理系统 - Research

**Researched:** 2026-03-17 **Domain:** React + TypeScript + Zustand 状态管理 + 文件处理 **Confidence:** HIGH

## Summary

本阶段实现文章导入、存储和选择功能，是整个打字练习工具的核心数据层。需要扩展现有 TextRegister 系统，添加 Zustand 全局状态管理，实现文件上传解析，并创建内置诗词和名言数据。

**Primary recommendation:** 扩展现有 Registry.text 模式，使用 Zustand 管理文章列表状态，FileReader API 处理 txt 文件上传，正则分句实现句子分割。

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
| --- | --- | --- |
| ART-01 | 用户可以上传 txt 文件导入自定义文章 | FileReader API + UTF-8 编码解析（见 Code Examples） |
| ART-02 | 内置诗词库（唐诗宋词精选） | 参考 Saying.ts 模式，创建 Poems.ts 数据文件 |
| ART-03 | 内置名人名言库 | 扩展现有 Saying.ts，添加更多名言 |
| ART-04 | 文章自动分句处理（按标点分割） | 正则分句函数（见 Code Examples） |
| ART-05 | 用户可以选择文章进行练习 | Zustand store + Ant Design List 组件 |

</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
| --- | --- | --- | --- |
| zustand | 5.0.12 | 全局状态管理 | 项目已决定使用，轻量级零样板 |
| antd | 4.22.8 (项目) / 6.3.3 (最新) | UI 组件库 | 项目已使用，提供 Upload、List 等组件 |
| ahooks | 3.7.0 | React Hooks 工具 | 项目已使用，提供 useBoolean 等 |
| uuid | 13.0.0 | 唯一 ID 生成 | 为文章生成唯一标识符 |

### Supporting

| Library    | Version | Purpose    | When to Use            |
| ---------- | ------- | ---------- | ---------------------- |
| pinyin-pro | 3.28.0  | 汉字转拼音 | 为上传文章自动标注拼音 |
| lodash-es  | 4.17.21 | 工具函数   | 深拷贝、数组操作等     |

### Alternatives Considered

| Instead of  | Could Use         | Tradeoff                                 |
| ----------- | ----------------- | ---------------------------------------- |
| Zustand     | Redux Toolkit     | Redux 更重量级，项目规模不需要           |
| Zustand     | Jotai/Recoil      | Zustand 更成熟，文档更完善               |
| antd Upload | 自定义 input file | antd Upload 提供拖拽、预览等开箱即用功能 |

**Installation:**

```bash
pnpm add zustand uuid
pnpm add -D @types/uuid
```

**Version verification:**

- zustand@5.0.12 - 发布于 2026-03-16（最新）
- uuid@13.0.0 - 最新稳定版
- pinyin-pro@3.28.0 - 最新稳定版

## Architecture Patterns

### Recommended Project Structure

```
src/
├── stores/                    # Zustand stores (新增)
│   ├── articleStore.ts        # 文章管理状态
│   └── index.ts               # 导出
├── assets/
│   └── texts/                 # 内置文章数据
│       ├── index.ts           # 导入所有文本
│       ├── ChuShiBian.ts      # 现有：出师表
│       ├── Saying.ts          # 现有：名人名言（需扩展）
│       ├── Poems.ts           # 新增：诗词库
│       └── Quotes.ts          # 新增：更多名言
├── utils/                     # 工具函数 (新增)
│   ├── sentenceSplit.ts       # 分句函数
│   ├── fileParser.ts          # 文件解析
│   └── pinyinHelper.ts        # 拼音处理
├── components/
│   ├── ArticleList/           # 文章列表组件 (新增)
│   │   ├── index.tsx
│   │   └── index.module.less
│   └── FileUpload/            # 文件上传组件 (新增)
│       ├── index.tsx
│       └── index.module.less
└── types/                     # 类型定义 (新增)
    └── article.ts             # 文章相关类型
```

### Pattern 1: Zustand Store 模式

**What:** 使用 Zustand 管理文章列表和当前选中状态 **When to use:** 需要在多个组件间共享文章状态时 **Example:**

```typescript
// Source: https://github.com/pmndrs/zustand (官方文档)
import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

interface Sentence {
  id: string
  text: string
  pinyin?: string
}

interface Article {
  id: string
  title: string
  content: string
  sentences: Sentence[]
  source: 'builtin' | 'upload'
  createdAt: number
}

interface ArticleState {
  articles: Article[]
  currentArticleId: string | null

  // Actions
  addArticle: (article: Omit<Article, 'id' | 'createdAt'>) => void
  removeArticle: (id: string) => void
  selectArticle: (id: string) => void
  getArticleById: (id: string) => Article | undefined
}

export const useArticleStore = create<ArticleState>((set, get) => ({
  articles: [],
  currentArticleId: null,

  addArticle: (article) =>
    set((state) => ({
      articles: [
        ...state.articles,
        {
          ...article,
          id: uuidv4(),
          createdAt: Date.now(),
        },
      ],
    })),

  removeArticle: (id) =>
    set((state) => ({
      articles: state.articles.filter((a) => a.id !== id),
    })),

  selectArticle: (id) => set({ currentArticleId: id }),

  getArticleById: (id) => get().articles.find((a) => a.id === id),
}))
```

### Pattern 2: 文章数据结构扩展

**What:** 扩展现有 TextRegister 的 TextConfig 结构 **When to use:** 兼容现有系统，同时支持新功能 **Example:**

```typescript
// 扩展自 src/core/registers/TextRegister/index.ts
export interface ArticleConfig {
  id: string
  key: string // 兼容现有 TextConfig.key
  title: string
  description?: string
  content: string // 原始文本
  sentences: Sentence[] // 分句后的数据
  source: 'builtin' | 'upload'
  text?: TextConfig['text'] // 兼容现有结构（可选）
}

export interface Sentence {
  id: string
  text: string
  chars: (MarkCharConfig | HanziCharConfig)[]
}
```

### Pattern 3: 文件上传与解析

**What:** 使用 FileReader API 解析 txt 文件 **When to use:** 用户上传自定义文章 **Example:**

```typescript
// 基于 WebSearch 验证的最佳实践
export function parseTxtFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const text = e.target?.result as string
      resolve(text)
    }

    reader.onerror = () => reject(new Error('文件读取失败'))

    // 关键：指定 UTF-8 编码处理中文
    reader.readAsText(file, 'UTF-8')
  })
}
```

### Pattern 4: 分句函数

**What:** 使用正则按中文标点分割句子 **When to use:** 将文章内容分割成可练习的句子 **Example:**

```typescript
// 基于 WebSearch 结果优化
const CHINESE_PUNCTUATION = /[。！？；]/

export function splitIntoSentences(text: string): string[] {
  // 按中文标点分割，保留标点
  const sentences = text
    .split(CHINESE_PUNCTUATION)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s, i, arr) => {
      // 重新附加标点（除了最后一个）
      const punctuation = text.match(CHINESE_PUNCTUATION)?.[i]
      return punctuation ? s + punctuation : s
    })

  return sentences
}
```

### Anti-Patterns to Avoid

- **不要直接修改 Registry.text 内部状态:** 应通过 Zustand store 管理，避免与现有系统冲突
- **不要在组件内直接调用 FileReader:** 封装成独立 hook 或工具函数，便于测试和复用
- **不要忽略文件编码:** 必须指定 UTF-8，否则中文会出现乱码
- **不要用 split('').filter() 处理中文:** 会破坏多字节字符，应使用 Array.from() 或 for...of

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
| --- | --- | --- | --- |
| 唯一 ID 生成 | 自定义时间戳+随机数 | uuid | uuid 处理碰撞、分布式场景 |
| 文件上传 UI | 自定义 input + 样式 | antd Upload | 拖拽、进度、预览开箱即用 |
| 列表选择 UI | 自定义 div + onClick | antd List + Select | 键盘导航、无障碍支持 |
| 状态持久化 | localStorage 手动读写 | Zustand persist middleware | 自动序列化、版本管理 |
| 拼音转换 | 自己写拼音映射表 | pinyin-pro | 处理多音字、生僻字 |

**Key insight:** 文件处理和状态管理看似简单，但边界情况（编码、并发更新、持久化）容易出错，使用成熟库可避免大量隐患。

## Common Pitfalls

### Pitfall 1: FileReader 编码问题

**What goes wrong:** 未指定编码导致中文乱码 **Why it happens:** 默认可能使用系统编码（GBK 等） **How to avoid:** 始终指定 `reader.readAsText(file, 'UTF-8')` **Warning signs:** 上传文件后显示乱码或空字符

### Pitfall 2: Zustand 状态选择器性能

**What goes wrong:** 选择器返回新对象导致不必要的重渲染 **Why it happens:** Zustand 默认使用严格相等比较 **How to avoid:** 使用 `useShallow` 或确保选择器返回稳定引用

```typescript
// 错误：每次渲染都创建新对象
const { articles, currentId } = useArticleStore((state) => ({
  articles: state.articles,
  currentId: state.currentArticleId,
}))

// 正确：使用 useShallow
import { useShallow } from 'zustand/react/shallow'
const { articles, currentId } = useArticleStore(
  useShallow((state) => ({
    articles: state.articles,
    currentId: state.currentArticleId,
  })),
)

// 或者分开选择（更高效）
const articles = useArticleStore((state) => state.articles)
const currentId = useArticleStore((state) => state.currentArticleId)
```

### Pitfall 3: 分句边界处理

**What goes wrong:** 分句时丢失标点或分割错误 **Why it happens:** split() 会移除分隔符，引号等边缘情况未处理 **How to avoid:** 使用捕获组保留分隔符，或重新附加标点 **Warning signs:** 句子末尾缺少标点，或标点单独成句

### Pitfall 4: 与现有 TextRegister 集成冲突

**What goes wrong:** 新旧系统同时存在，数据不一致 **Why it happens:** Registry.text 是静态注册，新增文章无法动态加入 **How to avoid:** Zustand 作为主要数据源，Registry.text 仅用于兼容旧代码 **Warning signs:** Hero 页面下拉列表不显示新上传的文章

## Code Examples

### 完整的文章上传流程

```typescript
// hooks/useArticleUpload.ts
import { useArticleStore } from '@/stores'
import { parseTxtFile } from '@/utils/fileParser'
import { splitIntoSentences } from '@/utils/sentenceSplit'
import { pinyin } from 'pinyin-pro'

export function useArticleUpload() {
  const addArticle = useArticleStore((state) => state.addArticle)

  const handleUpload = async (file: File) => {
    try {
      const content = await parseTxtFile(file)
      const sentences = splitIntoSentences(content)

      // 转换为带拼音的句子结构
      const processedSentences = sentences.map((text, index) => ({
        id: `sentence-${index}`,
        text,
        chars: Array.from(text).map((char) => {
          const isHanzi = /[\u4e00-\u9fa5]/.test(char)
          return isHanzi
            ? {
                type: 'Hanzi',
                char,
                quanpin: pinyin(char, { toneType: 'none' }),
              }
            : { type: 'Mark', char }
        }),
      }))

      addArticle({
        title: file.name.replace('.txt', ''),
        content,
        sentences: processedSentences,
        source: 'upload',
      })

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  return { handleUpload }
}
```

### 文章列表组件

```typescript
// components/ArticleList/index.tsx
import React from 'react'
import { List, Button, Upload } from 'antd'
import { DeleteOutlined, FileTextOutlined } from '@ant-design/icons'
import { useArticleStore } from '@/stores'
import { useArticleUpload } from '@/hooks/useArticleUpload'

export default function ArticleList() {
  const articles = useArticleStore(state => state.articles)
  const currentArticleId = useArticleStore(state => state.currentArticleId)
  const selectArticle = useArticleStore(state => state.selectArticle)
  const removeArticle = useArticleStore(state => state.removeArticle)
  const { handleUpload } = useArticleUpload()

  return (
    <div className="article-list">
      <Upload
        accept=".txt"
        showUploadList={false}
        beforeUpload={(file) => {
          handleUpload(file)
          return false // 阻止默认上传行为
        }}
      >
        <Button>上传文章</Button>
      </Upload>

      <List
        dataSource={articles}
        renderItem={(article) => (
          <List.Item
            onClick={() => selectArticle(article.id)}
            className={article.id === currentArticleId ? 'active' : ''}
          >
            <FileTextOutlined />
            <span>{article.title}</span>
            {article.source === 'upload' && (
              <Button
                icon={<DeleteOutlined />}
                onClick={(e) => {
                  e.stopPropagation()
                  removeArticle(article.id)
                }}
              />
            )}
          </List.Item>
        )}
      />
    </div>
  )
}
```

### Zustand Store 持久化

```typescript
// stores/articleStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useArticleStore = create(
  persist<ArticleState>(
    (set, get) => ({
      // ... state and actions
    }),
    {
      name: 'article-storage',
      storage: createJSONStorage(() => localStorage),
      // 仅持久化上传的文章，内置文章每次从代码加载
      partialize: (state) => ({
        articles: state.articles.filter((a) => a.source === 'upload'),
        currentArticleId: state.currentArticleId,
      }),
    },
  ),
)
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
| --- | --- | --- | --- |
| 类组件 + this.state | 函数组件 + Hooks | React 16.8 (2019) | 更简洁的状态逻辑 |
| Redux + Actions | Zustand 直接修改 | Zustand v4 (2022) | 减少 80% 样板代码 |
| 手动文件读取 | FileReader + Promise | ES6+ | 异步处理更清晰 |
| split() 分句 | 正则 + 标点保留 | 持续优化 | 处理复杂边界 |

**Deprecated/outdated:**

- **Class 组件状态管理:** 项目已全面使用 Hooks，无需 Class
- **Redux 标准模式:** 对小项目过于复杂，Zustand 更合适

## Open Questions

1. **pinyin-pro 多音字处理**
   - What we know: pinyin-pro 支持多音字识别
   - What's unclear: 需要配置上下文识别还是默认即可
   - Recommendation: 先使用默认配置，Phase 2 测试时根据实际效果调整

2. **文章大小限制**
   - What we know: 浏览器对大文件处理有限制
   - What's unclear: 多大的文章会影响性能
   - Recommendation: 设置 100KB 上限，超出时提示用户精简

3. **内置文章数量**
   - What we know: 需要诗词库和名言库
   - What's unclear: 具体多少篇合适
   - Recommendation: 诗词 20-30 篇（唐诗宋词精选），名言 50-100 条

## Validation Architecture

### Test Framework

| Property           | Value                           |
| ------------------ | ------------------------------- |
| Framework          | 无 - 需要安装 Vitest            |
| Config file        | 无 - 需要创建 vitest.config.ts  |
| Quick run command  | `vitest run --reporter=verbose` |
| Full suite command | `vitest run`                    |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
| --- | --- | --- | --- | --- |
| ART-01 | 上传 txt 文件解析 | unit | `vitest run tests/utils/fileParser.test.ts` | ❌ Wave 0 |
| ART-02 | 内置诗词数据加载 | unit | `vitest run tests/assets/poems.test.ts` | ❌ Wave 0 |
| ART-03 | 内置名言数据加载 | unit | `vitest run tests/assets/quotes.test.ts` | ❌ Wave 0 |
| ART-04 | 文章分句处理 | unit | `vitest run tests/utils/sentenceSplit.test.ts` | ❌ Wave 0 |
| ART-05 | 文章选择状态管理 | unit | `vitest run tests/stores/articleStore.test.ts` | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `vitest run --reporter=verbose` (快速验证单个功能)
- **Per wave merge:** `vitest run` (完整测试套件)
- **Phase gate:** 所有测试通过 + 手动验证文件上传

### Wave 0 Gaps

- [ ] `tests/utils/fileParser.test.ts` — 测试 txt 文件解析、编码处理
- [ ] `tests/utils/sentenceSplit.test.ts` — 测试分句边界情况
- [ ] `tests/stores/articleStore.test.ts` — 测试 Zustand store 操作
- [ ] `tests/assets/poems.test.ts` — 验证诗词数据格式
- [ ] `vitest.config.ts` — Vitest 配置文件
- [ ] Framework install: `pnpm add -D vitest @testing-library/react` — 测试框架

## Sources

### Primary (HIGH confidence)

- [Zustand GitHub](https://github.com/pmndrs/zustand) - 官方文档，最新版本 5.0.12
- [MDN FileReader API](https://developer.mozilla.org/en-US/docs/Web/API/FileReader) - 标准文件读取 API
- [pinyin-pro 官方文档](https://pinyin-pro.cn/) - 拼音转换库

### Secondary (MEDIUM confidence)

- [State Management in React 2026: Best Practices](https://www.c-sharpcorner.com/article/state-management-in-react-2026-best-practices-tools-real-world-patterns/) - 验证 Zustand 最佳实践
- [Stack Overflow: Chinese Comma Regex](https://stackoverflow.com/questions/44669073/regular-expression-to-match-and-split-on-chinese-comma-in-javascript) - 中文标点正则处理

### Tertiary (LOW confidence)

- 项目源码分析 - 基于现有代码模式推断

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - 基于 npm 官方版本验证和项目现有依赖
- Architecture: HIGH - 基于现有项目结构和 Zustand 官方文档
- Pitfalls: MEDIUM - 部分基于 WebSearch，需要实际测试验证

**Research date:** 2026-03-17 **Valid until:** 2026-04-17 (1 个月，库版本可能更新)
