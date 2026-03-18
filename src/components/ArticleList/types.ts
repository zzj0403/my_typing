import type { ArticleSource } from '@/types/article'

/**
 * 文章分类
 */
export type ArticleCategory = 'all' | 'poems' | 'quotes' | 'uploads'

/**
 * 分类到来源的映射
 */
export const CATEGORY_SOURCE_MAP: Record<
  ArticleCategory,
  ArticleSource | null
> = {
  all: null,
  poems: 'builtin',
  quotes: 'builtin',
  uploads: 'upload',
}

/**
 * ArticleList 组件 Props
 */
export interface ArticleListProps {
  /** 是否显示上传按钮 */
  showUpload?: boolean
  /** 是否显示分类 Tabs */
  showTabs?: boolean
  /** 初始选中的分类 */
  defaultCategory?: ArticleCategory
  /** 文章选中回调 */
  onSelect?: (articleId: string) => void
  /** 自定义类名 */
  className?: string
}
