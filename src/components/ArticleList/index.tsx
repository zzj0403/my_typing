import React, { useState, useCallback, useMemo } from 'react'
import { List, Button, Upload, Tabs, Modal, Empty, message, Spin } from 'antd'
import { DeleteOutlined, FileTextOutlined, UploadOutlined } from '@ant-design/icons'
import { useArticleStore } from '@/stores/articleStore'
import { parseTxtFile, isValidTxtFile, FileParseError } from '@/utils/fileParser'
import type { Article, CreateArticleInput } from '@/types/article'
import type { ArticleListProps, ArticleCategory } from './types'
import { CATEGORY_SOURCE_MAP } from './types'
import styles from './index.module.less'

const { TabPane } = Tabs
const { confirm } = Modal

// 文件大小限制 100KB
const MAX_FILE_SIZE = 100 * 1024

/**
 * 文章列表组件
 * 展示所有文章，支持分类筛选、选择、上传和删除
 */
const ArticleList: React.FC<ArticleListProps> = ({
  showUpload = true,
  showTabs = true,
  defaultCategory = 'all',
  onSelect,
  className,
}) => {
  const [activeCategory, setActiveCategory] = useState<ArticleCategory>(defaultCategory)
  const [uploading, setUploading] = useState(false)

  const {
    articles,
    currentArticleId,
    addArticle,
    removeArticle,
    selectArticle,
  } = useArticleStore()

  // 根据分类过滤文章
  const filteredArticles = useMemo(() => {
    const source = CATEGORY_SOURCE_MAP[activeCategory]
    if (!source) {
      return articles
    }
    if (activeCategory === 'poems') {
      return articles.filter(a => a.source === 'builtin' && a.id.startsWith('poem-'))
    }
    if (activeCategory === 'quotes') {
      return articles.filter(a => a.source === 'builtin' && a.id.startsWith('quote-'))
    }
    return articles.filter(a => a.source === source)
  }, [articles, activeCategory])

  // 处理文章选择
  const handleSelect = useCallback((article: Article) => {
    selectArticle(article.id)
    onSelect?.(article.id)
  }, [selectArticle, onSelect])

  // 处理文件上传
  const handleUpload = useCallback(async (file: File) => {
    // 验证文件类型
    if (!isValidTxtFile(file)) {
      message.error('不支持的文件类型，请上传 .txt 文件')
      return false
    }

    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      message.error('文件大小超过 100KB 限制')
      return false
    }

    setUploading(true)
    try {
      const content = await parseTxtFile(file)
      const input: CreateArticleInput = {
        key: `upload-${Date.now()}`,
        title: file.name.replace(/\.txt$/i, ''),
        content,
        source: 'upload',
      }
      addArticle(input)
      message.success('文章上传成功')
      // 切换到"我的上传"分类
      setActiveCategory('uploads')
    } catch (error) {
      if (error instanceof FileParseError) {
        message.error(error.message)
      } else {
        message.error('文件读取失败，请确保文件为 UTF-8 编码的 txt 格式')
      }
    } finally {
      setUploading(false)
    }

    return false // 阻止默认上传行为
  }, [addArticle])

  // 处理文章删除
  const handleDelete = useCallback((article: Article, e: React.MouseEvent) => {
    e.stopPropagation()
    confirm({
      title: '删除文章',
      content: `确认删除「${article.title}」吗？此操作不可恢复`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        removeArticle(article.id)
        message.success('文章已删除')
      },
    })
  }, [removeArticle])

  // 渲染文章项
  const renderArticleItem = (article: Article) => {
    const isActive = article.id === currentArticleId
    const canDelete = article.source === 'upload'

    return (
      <div
        key={article.id}
        className={`${styles.articleItem} ${isActive ? styles.articleItemActive : ''}`}
        onClick={() => handleSelect(article)}
      >
        <FileTextOutlined className={styles.articleIcon} />
        <div className={styles.articleContent}>
          <div className={styles.articleTitle}>{article.title}</div>
          {article.description && (
            <div className={styles.articleDescription}>{article.description}</div>
          )}
        </div>
        {canDelete && (
          <Button
            type="text"
            icon={<DeleteOutlined />}
            className={styles.deleteButton}
            onClick={(e) => handleDelete(article, e)}
            aria-label="删除文章"
          />
        )}
      </div>
    )
  }

  // 渲染空状态
  const renderEmpty = () => {
    if (activeCategory === 'uploads') {
      return (
        <div className={styles.emptyState}>
          <Empty
            description={
              <>
                <div className={styles.emptyTitle}>暂无上传文章</div>
                <div className={styles.emptyDescription}>
                  点击「上传文章」按钮导入 txt 文件，或选择下方内置诗词/名言开始练习
                </div>
              </>
            }
          />
        </div>
      )
    }
    return (
      <div className={styles.emptyState}>
        <Empty description="暂无文章" />
      </div>
    )
  }

  return (
    <div className={`${styles.articleList} ${className || ''}`}>
      {/* 上传按钮 */}
      {showUpload && (
        <div className={styles.uploadArea}>
          <Upload
            accept=".txt"
            showUploadList={false}
            beforeUpload={handleUpload}
          >
            <Button icon={<UploadOutlined />} loading={uploading}>
              上传文章
            </Button>
          </Upload>
        </div>
      )}

      {/* 分类 Tabs */}
      {showTabs && (
        <Tabs
          activeKey={activeCategory}
          onChange={(key) => setActiveCategory(key as ArticleCategory)}
          className={styles.tabs}
        >
          <TabPane tab="全部" key="all" />
          <TabPane tab="诗词" key="poems" />
          <TabPane tab="名言" key="quotes" />
          <TabPane tab="我的" key="uploads" />
        </Tabs>
      )}

      {/* 文章列表 */}
      {uploading ? (
        <div className={styles.loading}>
          <Spin tip="上传中..." />
        </div>
      ) : filteredArticles.length > 0 ? (
        <div>
          {filteredArticles.map(article => renderArticleItem(article))}
        </div>
      ) : (
        renderEmpty()
      )}
    </div>
  )
}

export default ArticleList
export type { ArticleListProps, ArticleCategory } from './types'
