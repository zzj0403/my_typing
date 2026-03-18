import { describe, it, expect } from 'vitest'
import type {
  Article,
  Sentence,
  CharInfo,
  ArticleSource,
  CreateArticleInput,
} from '@/types/article'
import { CharType } from '@/core'

describe('Article Types', () => {
  describe('ArticleSource', () => {
    it('should accept builtin source', () => {
      const source: ArticleSource = 'builtin'
      expect(source).toBe('builtin')
    })

    it('should accept upload source', () => {
      const source: ArticleSource = 'upload'
      expect(source).toBe('upload')
    })
  })

  describe('CharInfo', () => {
    it('should accept MarkCharConfig', () => {
      const charInfo: CharInfo = {
        type: CharType.Mark,
        char: '。',
      }
      expect(charInfo.type).toBe(CharType.Mark)
    })

    it('should accept HanziCharConfig', () => {
      const charInfo: CharInfo = {
        type: CharType.Hanzi,
        char: '你',
        quanpin: 'ni',
      }
      expect(charInfo.type).toBe(CharType.Hanzi)
    })
  })

  describe('Sentence', () => {
    it('should have id field', () => {
      const sentence: Sentence = {
        id: 'sentence-1',
        text: '你好。',
        chars: [],
      }
      expect(sentence.id).toBe('sentence-1')
    })

    it('should have text field', () => {
      const sentence: Sentence = {
        id: 'sentence-1',
        text: '你好。',
        chars: [],
      }
      expect(sentence.text).toBe('你好。')
    })

    it('should have chars field', () => {
      const sentence: Sentence = {
        id: 'sentence-1',
        text: '你好。',
        chars: [
          { type: CharType.Hanzi, char: '你', quanpin: 'ni' },
          { type: CharType.Hanzi, char: '好', quanpin: 'hao' },
          { type: CharType.Mark, char: '。' },
        ],
      }
      expect(sentence.chars).toHaveLength(3)
    })
  })

  describe('Article', () => {
    it('should have id field', () => {
      const article: Article = {
        id: 'article-1',
        key: 'test-article',
        title: '测试文章',
        content: '测试内容',
        sentences: [],
        source: 'builtin',
        createdAt: Date.now(),
      }
      expect(article.id).toBe('article-1')
    })

    it('should have title field', () => {
      const article: Article = {
        id: 'article-1',
        key: 'test-article',
        title: '测试文章',
        content: '测试内容',
        sentences: [],
        source: 'builtin',
        createdAt: Date.now(),
      }
      expect(article.title).toBe('测试文章')
    })

    it('should have content field', () => {
      const article: Article = {
        id: 'article-1',
        key: 'test-article',
        title: '测试文章',
        content: '测试内容',
        sentences: [],
        source: 'builtin',
        createdAt: Date.now(),
      }
      expect(article.content).toBe('测试内容')
    })

    it('should have sentences field', () => {
      const article: Article = {
        id: 'article-1',
        key: 'test-article',
        title: '测试文章',
        content: '测试内容',
        sentences: [{ id: 's1', text: '测试内容', chars: [] }],
        source: 'builtin',
        createdAt: Date.now(),
      }
      expect(article.sentences).toHaveLength(1)
    })

    it('should have source field', () => {
      const article: Article = {
        id: 'article-1',
        key: 'test-article',
        title: '测试文章',
        content: '测试内容',
        sentences: [],
        source: 'upload',
        createdAt: Date.now(),
      }
      expect(article.source).toBe('upload')
    })
  })

  describe('CreateArticleInput', () => {
    it('should have required fields for article creation', () => {
      const input: CreateArticleInput = {
        key: 'new-article',
        title: '新文章',
        content: '这是新文章的内容。',
        source: 'upload',
      }
      expect(input.key).toBe('new-article')
      expect(input.title).toBe('新文章')
      expect(input.content).toBe('这是新文章的内容。')
      expect(input.source).toBe('upload')
    })

    it('should accept optional description', () => {
      const input: CreateArticleInput = {
        key: 'new-article',
        title: '新文章',
        description: '文章描述',
        content: '这是新文章的内容。',
        source: 'upload',
      }
      expect(input.description).toBe('文章描述')
    })
  })
})
