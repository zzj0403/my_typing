---
gsd_state_version: 1.0
milestone: milestone
milestone_name: 整篇文章打字模式
status: executing
last_updated: '2026-03-18T02:04:05.544Z'
progress:
  total_phases: 4
  completed_phases: 2
  total_plans: 12
  completed_plans: 11
---

## Progress

| Phase   | Status         | Description         |
| ------- | -------------- | ------------------- |
| Phase 0 | ✅ Complete    | Fork 项目、清理代码 |
| Phase 1 | ✅ Complete    | 文章管理系统        |
| Phase 2 | 🔵 In Progress | 整篇文章打字模式    |
| Phase 3 | ⚪ Not started | UI 优化 & 收尾      |
| Phase 4 | ⚪ Not Started |

| Progress: total_phases: 4 completed_phases: 2 total_plans: 12 completed_plans: 11

---

## Current Context

**决策:** Fork https://github.com/yunsii/pinyin 增量开发

- 复用部分： 拼音匹配逻辑 (pinyin-pro)
- 输入法处理 (composition 事件)
- Vite + TypeScript + React 框架
- Ant Design UI 组件
- 文章导入功能 (FileReader API + UTF-8)
- 实时反馈 (状态机 + CSS高亮)

- 整篇文章打字练习 (双拼支持移除)

**复用部分:**

- 拼音匹配逻辑 (pinyin-pro) - `pinyin-pro` 库在 pinyin 区拼音
- 输入法处理 (composition 事件) - 实时字符状态管理 (useTypingGame hook)
- 状态持久化 (zustand persist)
- 内置文章 (诗词/名言)自动加载
- 使用 Drawer 组件展示文章列表

- 集成到 Hero 页面 ( Drawer 组件
- 点击文章后， Drawer 关

  闭， 文章内容显示在主区域

- 支持拼音、符、 输入框显示，输入拼音..."
- 整篇文章打字完成后显示"恭喜!文章打字完成!"消息
- ESC 锍格跳过
- 重置按钮(在 TypingGame 内处理)
- Drawer 中的上传功能保留

- 设置抽屉保持原有控制面板功能
- 样式更新为新布局适配 TypingGame

- 移除了文本模板选择器 (Select`)
- 移除了单字练习的重置按钮但仍保留(重置按钮，因为重置功能现在由 TypingGame 内处理)
- 絑续保留云端同步按钮和设置抽屉同步按钮

因为不再使用 Text模板

- 简化了文章选择处理,只需选中并关闭 Drawer 选中文章 -> Drawer 关 TypingGame 灶 TypingGame 组件
  - 替换了 Hanzi 组件
  - 修改 useProfileBin 简化了 onChangeBin 回调移除了了重置逻辑移除了 Template选择器等 Select 和 textKey 相关逻辑保留云同步按钮 (因为功能现由 TypingGame 内处理) - 移除 Settings 相关状态同步逻辑
  - 设置 Drawer 中的文章列表 Tabs 和上传区域
- 优化样式布局适配新功能
  - 更新 hero 页面 CSS 为 flex-direction column 巻加 mainContent 样式
  - 调整了 flex-direction: column 始 flex: 1
  - 緻加了新的 mainContent 样式以容纳 TypingGame 组件
  - 更新 styles
- flex-direction: column 巻加了 padding flex: 1 padding: 20px 10px padding: 0 16px 16px 32px

        &:last {
          padding: 8px;
        }
      }
      .articleDisplay {
        display: flex;
        gap: 20px;
        padding: 8px;
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

  } }

```

(2) 重置点击 (ESC 锉字)
      const handleReset = useCallback(() => {
    reset()
    setInputBuffer('')
  }, [reset])

  const handleSkip = useCallback(() => {
    skipCurrent()
    setInputBuffer('')
  }, [skipCurrent])

  // ESC 锷字跳过逻辑
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      skipCurrent()
      setInputBuffer('')
      return
    }
  }, [skipCurrent])

  return (
    <div className={styles.container}>
      <div className={styles.articleDisplay}>
        <Typography.Text type="secondary">请先选择一篇文章</Typography.Text>
      </div>
    )
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={4} className={styles.title}>{article.title}</Title>
        <div className={styles.progressWrapper}>
          <Progress
            className={styles.progressBar}
            percent={Math.round((progress.typed / progress.total) * 100)}
            status={isComplete ? 'success' : 'active'}
          />
          <span className={styles.progressText}>
            {progress.typed} / {progress.total} 字
          </span>
        </div>
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
          placeholder={placeholder}
          autoFocus
        />
        <div className={styles.buttons}>
          <Button onClick={handleSkip}>跳过 (ESC)</Button>
          <Button onClick={handleReset}>重置</Button>
        </div>
      </div>
    </div>
  )
}
```
