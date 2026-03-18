# 拼音打字练习

一个基于 React + TypeScript 的在线拼音打字练习应用，支持全拼输入，帮助用户提升中文打字速度和拼音熟练度。

## 功能特性

### 拼音方案

- [x] 全拼输入
- [ ] 小鹤双拼

### 核心功能

- [x] 拼音编码注册器 - 可扩展的拼音方案注册系统
- [x] 文本注册器 - 文章内容管理
- [x] 单字训练 - 基础汉字拼音练习
- [x] 文章滚动输入 - 完整文章打字练习

### 进阶功能

- [ ] 键位提示
- [ ] 常用字字典及自动注音
- [ ] 常用词组训练
- [ ] 实时数据分析

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI 组件库**: Ant Design
- **状态管理**: Zustand
- **样式**: Less + CSS Modules
- **拼音处理**: pinyin-pro
- **测试**: Vitest + Testing Library
- **代码规范**: ESLint + Prettier + Husky

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 运行测试

```bash
npm run test
```

### 代码检查

```bash
npm run lint
npm run lint:fix  # 自动修复
```

## 项目结构

```
src/
├── components/       # UI 组件
│   ├── ArticleList/  # 文章列表
│   ├── FourLinesGrid/ # 四线三格显示
│   ├── Hanzi/        # 汉字组件
│   └── TypingGame/   # 打字游戏核心组件
├── core/             # 核心逻辑
│   └── registers/    # 注册器（拼音方案、文本）
├── hooks/            # 自定义 Hooks
├── pages/            # 页面组件
├── stores/           # Zustand 状态管理
├── types/            # TypeScript 类型定义
└── utils/            # 工具函数
```

## License

MIT
