import React from 'react'
import {
  Button,
  Drawer,
  Form,
  Input,
  List,
  Modal,
  Tooltip,
  Typography,
} from 'antd'
import {
  CloudDownloadOutlined,
  CloudUploadOutlined,
  GithubOutlined,
  LoadingOutlined,
  RedoOutlined,
  SettingOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import { useBoolean } from 'ahooks'

import useProfileBin from './useProfileBin'
import styles from './index.module.less'

import { TypingGame } from '@/components'
import ArticleList from '@/components/ArticleList'
import { useArticleStore } from '@/stores'

const mouseEnterDelay = 0.5

export default function Hero() {
  const [formRef] = Form.useForm()
  const {
    detailLoading,
    updateLoading,
    onSignIn,
    onUpload,
    onDownload,
    onClearCache,
  } = useProfileBin({
    schemaType: 'QuanPin', // 仅支持全拼
    textKey: 'default',
    inputTextIndex: 0,
    inputPinyin: '',
  })
  const [visible, setVisible] = React.useState(false)
  const [settingsVisible, { toggle: toggleSettingsVisible }] = useBoolean(false)
  const [articleListVisible, { toggle: toggleArticleListVisible }] = useBoolean(false)

  // 获取文章 store
  const { selectArticle } = useArticleStore()

  // 当选中文章时，关闭 Drawer
  const handleArticleSelect = React.useCallback((articleId: string) => {
    selectArticle(articleId)
    toggleArticleListVisible()
  }, [selectArticle, toggleArticleListVisible])

  return (
    <div className={styles.app}>
      <div className={styles.mainContent}>
        <TypingGame />
      </div>
      <div className={styles.menu}>
        <Input.Group compact>
          <Button
            icon={<FileTextOutlined />}
            onClick={() => toggleArticleListVisible()}
          />
          <Button
            icon={<SettingOutlined />}
            onClick={() => toggleSettingsVisible()}
          />
          <Tooltip
            overlay='同步本地状态到云端'
            mouseEnterDelay={mouseEnterDelay}
          >
            <Button
              icon={
                updateLoading ? <LoadingOutlined /> : <CloudUploadOutlined />
              }
              onClick={() => {
                onUpload(() => setVisible(true))
              }}
            />
          </Tooltip>
          <Tooltip
            overlay='同步云端状态到本地'
            mouseEnterDelay={mouseEnterDelay}
          >
            <Button
              icon={
                detailLoading ? <LoadingOutlined /> : <CloudDownloadOutlined />
              }
              onClick={() => {
                onDownload(() => {
                  setVisible(true)
                })
              }}
            />
          </Tooltip>
        </Input.Group>
      </div>
      <Modal
        width={480}
        title='同步设置'
        visible={visible}
        cancelText='取消'
        okText='确定'
        onCancel={() => setVisible(false)}
        onOk={() => {
          const values = formRef.getFieldsValue()
          onSignIn(values.binId, values.name, {
            onOk: () => setVisible(false),
          })
        }}
        destroyOnClose
      >
        <Form form={formRef}>
          <Form.Item name='binId' label='BIN_ID'>
            <Input />
          </Form.Item>
          <Form.Item
            name='name'
            label='用户名'
            extra={
              <Typography.Text type='secondary'>
                默认使用云端用户名，如果没有用户名会根据当前值创建。
              </Typography.Text>
            }
          >
            <Input />
          </Form.Item>
        </Form>
        <Typography.Paragraph type='secondary'>
          同步功能基于&nbsp;
          <a href='https://jsonbin.io/' target='_blank' rel='noreferrer'>
            JSONbin
          </a>
          &nbsp; 实现，可自行注册并创建一个公开 BIN 后将 BIN_ID
          贴于此处确认即可。
        </Typography.Paragraph>
        <Typography.Text type='secondary'>
          当然，如果不想注册的话，可邮箱
          <a href='mailto:yuns.xie@qq.com' target='_blank' rel='noreferrer'>
            联系我
          </a>
          为你创建 BIN_ID。
        </Typography.Text>
      </Modal>
      <Drawer
        width={360}
        title={<Typography.Title level={4}>控制面板</Typography.Title>}
        visible={settingsVisible}
        onClose={() => toggleSettingsVisible()}
      >
        <List size='small' bordered className={styles.settingsList}>
          <List.Item onClick={onClearCache}>清除缓存</List.Item>
        </List>
        <Button
          type='primary'
          icon={<GithubOutlined />}
          className={styles.github}
          href='https://github.com/theprimone/pinyin'
          target='_blank'
        >
          Star
        </Button>
      </Drawer>
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
