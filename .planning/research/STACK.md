# Technology Stack

**Project:** 个人中文打字练习工具
**Researched:** 2026-03-17
**Reference:** https://github.com/yunsii/pinyin

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Vite** | ^6.x | 构建工具 | 极速 HMR、原生 ESM 支持、零配置开箱即用、生态成熟 |
| **TypeScript** | ^5.x | 类型系统 | 类型安全、IDE 支持完善、代码可维护性高 |
| **React** | ^18.x | UI 框架 | 参考项目使用、组件化开发、生态丰富 |
| **React DOM** | ^18.x | DOM 渲染 | 与 React 配套的标准渲染器 |

### UI Libraries

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Ant Design** | ^5.x | UI 组件库 | 企业级组件、中文友好、文档完善、参考项目使用 |
| **@ant-design/icons** | ^5.x | 图标库 | 与 Ant Design 配套、图标丰富 |
| **Less** | ^4.x | CSS 预处理器 | Ant Design 默认使用、支持变量和 mixin |

### 中文拼音处理

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **pinyin-pro** | ^3.x | 拼音转换 | TypeScript 原生支持、多音字识别准确、功能全面（声母/韵母/音调/首字母）、GitHub 2.7K+ stars、活跃维护 |
| **pinyin-data** | - | 拼音数据源（可选） | 基于 cc-cedict 的完整拼音数据集、Unicode 17.0.0 兼容 |

### State & Hooks

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **ahooks** | ^3.x | React Hooks 库 | 阿里出品、Hook 丰富、参考项目使用、中文文档完善 |

### Utilities

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **lodash-es** | ^4.x | 工具函数 | ES Module 版本、Tree-shaking 友好 |
| **classnames** | ^2.x | CSS 类名拼接 | 简化条件类名逻辑 |

### Development Tools

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **ESLint** | ^9.x | 代码检查 | 标准化代码风格、捕获常见错误 |
| **Prettier** | ^3.x | 代码格式化 | 统一格式化风格 |
| **Husky** | ^9.x | Git Hooks | 提交前自动检查 |
| **lint-staged** | ^15.x | 暂存文件检查 | 只检查变更文件、提升效率 |
| **cross-env** | ^7.x | 跨平台环境变量 | Windows/macOS/Linux 兼容 |

### Vite Plugins

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **@vitejs/plugin-react** | ^4.x | React 支持 | 官方 React 插件、Fast Refresh |
| **vite-tsconfig-paths** | ^5.x | 路径别名 | 支持 tsconfig paths 配置 |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| UI 框架 | React | Vue 3 | 参考项目使用 React，保持一致性 |
| UI 库 | Ant Design | Element Plus / Arco Design | Element Plus 是 Vue 生态，Arco Design 生态较小 |
| 拼音库 | pinyin-pro | pinyin (hokaccha) | pinyin-pro 功能更全、TypeScript 支持更好、多音字处理更准确 |
| 拼音库 | pinyin-pro | pinyin-pro 原生 | 原生版本性能更高但安装复杂，纯 JS 版本够用 |
| 构建工具 | Vite | Webpack | Vite 开发体验更好、构建速度更快 |
| Hooks 库 | ahooks | react-use | ahooks 中文文档更完善、与 Ant Design 风格一致 |

## File Upload Implementation

### 推荐方案: FileReader API + TextDecoder

```typescript
// 文件上传处理
const handleFileUpload = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 1. 文件类型验证
    if (!file.name.endsWith('.txt')) {
      reject(new Error('仅支持 .txt 文件'));
      return;
    }

    // 2. 文件大小限制 (建议 1MB 以内)
    const MAX_SIZE = 1024 * 1024;
    if (file.size > MAX_SIZE) {
      reject(new Error('文件大小不能超过 1MB'));
      return;
    }

    // 3. 使用 FileReader 异步读取
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        // 4. 使用 TextDecoder 正确处理中文编码
        const decoder = new TextDecoder('utf-8');
        const text = decoder.decode(arrayBuffer);
        resolve(text);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(reader.error);

    // 5. 以 ArrayBuffer 形式读取
    reader.readAsArrayBuffer(file);
  });
};
```

### 最佳实践

| 实践 | 说明 |
|------|------|
| 异步处理 | FileReader 异步读取，不阻塞 UI |
| 类型验证 | 检查文件扩展名和 MIME 类型 |
| 大小限制 | 限制文件大小防止内存溢出 |
| 编码处理 | 使用 TextDecoder 正确处理 UTF-8 中文 |
| 错误处理 | 完善的 try-catch 和错误提示 |

## Real-Time Input Feedback Implementation

### 推荐方案: Input Event + 状态管理

```typescript
interface TypingState {
  currentChar: string;        // 当前应输入的字符
  currentPinyin: string;      // 当前字符的拼音
  userInput: string;          // 用户已输入的拼音
  isCorrect: boolean;         // 输入是否正确
  correctCount: number;       // 正确数量
  totalCount: number;         // 总输入数量
}

const TypingPractice: React.FC = () => {
  const [state, setState] = useState<TypingState>({
    currentChar: '你',
    currentPinyin: 'ni',
    userInput: '',
    isCorrect: true,
    correctCount: 0,
    totalCount: 0,
  });

  // 实时输入处理
  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toLowerCase();

    setState(prev => {
      // 实时匹配检测
      const isCorrect = prev.currentPinyin.startsWith(input);
      const isComplete = input === prev.currentPinyin;

      if (isComplete) {
        // 输入完成，进入下一个字符
        return {
          ...prev,
          userInput: '',
          isCorrect: true,
          correctCount: prev.correctCount + 1,
          totalCount: prev.totalCount + 1,
          // 加载下一个字符...
        };
      }

      return {
        ...prev,
        userInput: input,
        isCorrect,
        totalCount: isCorrect ? prev.totalCount : prev.totalCount + 1,
      };
    });
  }, []);

  return (
    <div>
      <div className="current-char">{state.currentChar}</div>
      <div className="pinyin-hint">{state.currentPinyin}</div>
      <input
        value={state.userInput}
        onChange={handleInput}
        className={state.isCorrect ? 'correct' : 'incorrect'}
        autoFocus
      />
      <div className="stats">
        正确率: {(state.correctCount / state.totalCount * 100).toFixed(1)}%
      </div>
    </div>
  );
};
```

### 实时反馈最佳实践

| 实践 | 说明 |
|------|------|
| Input Event | 使用 onChange 事件实时捕获输入 |
| 即时验证 | 每次输入立即检测是否匹配 |
| 视觉反馈 | 通过颜色变化提供即时反馈（绿色=正确，红色=错误） |
| 防抖处理 | 统计计算可适当防抖，避免频繁更新 |
| 焦点管理 | 始终保持输入框焦点，提升体验 |

## Installation

```bash
# 创建项目 (推荐)
npm create vite@latest my-typing -- --template react-ts

# 进入项目目录
cd my-typing

# 安装核心依赖
npm install react react-dom

# 安装 UI 库
npm install antd @ant-design/icons

# 安装拼音处理
npm install pinyin-pro

# 安装 Hooks 和工具库
npm install ahooks lodash-es classnames

# 安装开发依赖
npm install -D typescript @types/react @types/react-dom
npm install -D @types/lodash-es @types/classnames
npm install -D @vitejs/plugin-react vite-tsconfig-paths
npm install -D eslint prettier husky lint-staged cross-env less
```

## Project Structure Recommendation

```
my-typing/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/          # 组件目录
│   │   ├── TypingInput/     # 输入组件
│   │   ├── CharDisplay/     # 字符显示组件
│   │   ├── StatsPanel/      # 统计面板组件
│   │   └── FileUpload/      # 文件上传组件
│   ├── hooks/               # 自定义 Hooks
│   │   ├── useTyping.ts     # 打字逻辑 Hook
│   │   └── useStats.ts      # 统计逻辑 Hook
│   ├── utils/               # 工具函数
│   │   ├── pinyin.ts        # 拼音处理
│   │   └── fileReader.ts    # 文件读取
│   ├── types/               # TypeScript 类型定义
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .eslintrc.cjs
├── .prettierrc
├── tsconfig.json
├── vite.config.ts
└── package.json
```

## Sources

**High Confidence (官方文档/权威来源)**

- [Vite 官方文档](https://vite.dev/guide/) - 构建工具配置
- [MDN: FileReader API](https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications) - 文件处理
- [pinyin-pro NPM](https://www.npmjs.com/pinyin-pro) - 拼音转换库

**Medium Confidence (技术文章/教程)**

- [Complete Guide to React + TypeScript + Vite 2026](https://medium.com/@robinviktorsson/complete-guide-to-setting-up-react-with-typescript-and-vite-2025-468f6556aaf2) - 项目配置
- [Vue3+ts+pinyin-pro 实现拼音标注](https://juejin.cn/post/7426035420728934410) - 拼音库使用
- [pinyin-pro 终极指南](https://blog.csdn.net/gitblog_00458/article/details/155126164) - 库功能详解
- [Building Real-Time Typing Speed Test](https://www.c-sharpcorner.com/article/building-a-real-time-typing-speed-test-website-using-html-css-javascript-and/) - 实时输入实现
- [JavaScript File Handling Best Practices](https://blog.stackademic.com/javascript-file-handling-11-best-practices-developers-must-know-8db5281bb497) - 文件处理

**参考项目**

- [yunsii/pinyin](https://github.com/yunsii/pinyin) - 在线拼音打字练习参考实现
