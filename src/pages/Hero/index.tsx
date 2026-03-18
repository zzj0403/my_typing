import React from 'react'
import { Button, Drawer, Typography } from 'antd'
import { FileTextOutlined } from '@ant-design/icons'
import { useBoolean } from 'ahooks'

import styles from './index.module.less'

import { TypingGame } from '@/components'
import ArticleList from '@/components/ArticleList'
import { useArticleStore } from '@/stores'

export default function Hero() {
  const [articleListVisible, { toggle: toggleArticleListVisible }] =
    useBoolean(false)

  // 获取文章 store
  const { selectArticle } = useArticleStore()

  // 当选中文章时，关闭 Drawer
  const handleArticleSelect = React.useCallback(
    (articleId: string) => {
      selectArticle(articleId)
      toggleArticleListVisible()
    },
    [selectArticle, toggleArticleListVisible],
  )

  return (
    <div className={styles.app}>
      <div className={styles.mainContent}>
        <TypingGame />
      </div>
      <div className={styles.menu}>
        <Button
          type='primary'
          icon={<FileTextOutlined />}
          onClick={() => toggleArticleListVisible()}
          className={styles.selectArticleBtn}
        >
          选择文章
        </Button>
      </div>
      {/* 文章列表 Drawer */}
      <Drawer
        width={400}
        title={<Typography.Title level={4}>选择文章</Typography.Title>}
        visible={articleListVisible}
        onClose={() => toggleArticleListVisible()}
        bodyStyle={{ padding: 0 }}
      >
        <ArticleList
          showUpload={true}
          showTabs={true}
          defaultCategory='all'
          onSelect={handleArticleSelect}
        />
      </Drawer>
    </div>
  )
}
