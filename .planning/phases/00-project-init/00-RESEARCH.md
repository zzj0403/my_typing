# Phase 0: 项目初始化 - Research

**Researched:** 2026-03-17
**Domain:** 项目 Fork、代码清理、开发环境搭建
**Confidence:** HIGH

## Summary

Phase 0 的核心任务是 Fork 参考项目 [yunsii/pinyin](https://github.com/yunsii/pinyin) 并进行清理,为后续开发做准备。通过对参考项目的深入分析,我已经明确了双拼相关代码的位置、需要保留的核心模块以及依赖配置。

参考项目是一个基于 Vite + TypeScript + React 的在线拼音打字练习工具,支持全拼和双拼(小鹤双拼)。项目结构清晰,核心功能通过注册器模式实现。我们需要移除双拼相关代码,保留全拼输入和单字练习模式的基础架构。

**Primary recommendation:** 直接 Fork 参考项目到本地,删除双拼方案配置文件,简化 PinyinSchemaRegister,验证基础打字功能后即可进入 Phase 1。

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| **Vite** | 8.0.0 (latest) | 构建工具 | 参考项目使用,开发体验极佳,HMR 快速 |
| **TypeScript** | ^5.x | 类型系统 | 类型安全,IDE 支持完善 |
| **React** | 19.2.4 (latest) | UI 框架 | 参考项目使用,组件化开发 |
| **React DOM** | 19.2.4 (latest) | DOM 渲染 | React 标配 |
| **Ant Design** | 6.3.3 (latest) | UI 组件库 | 参考项目使用,企业级组件,中文友好 |
| **ahooks** | ^3.7.0 | React Hooks 库 | 参考项目使用,阿里出品,Hook 丰富 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **@ant-design/icons** | ^4.5.0 | 图标库 | 使用 Ant Design 组件图标 |
| **classnames** | ^2.2.6 | CSS 类名拼接 | 条件类名逻辑 |
| **lodash-es** | ^4.17.21 | 工具函数 | ES Module 版本,Tree-shaking 友好 |
| **cross-env** | ^7.0.3 | 跨平台环境变量 | Windows/macOS/Linux 兼容 |

### Development Tools
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **@vitejs/plugin-react** | ^1.3.1 | React 支持 | Vite 官方 React 插件 |
| **vite-tsconfig-paths** | ^2.1.0 | 路径别名 | 支持 tsconfig paths |
| **vite-plugin-imp** | ^2.0.4 | 按需导入 | Ant Design 样式按需加载 |
| **less** | ^4.1.1 | CSS 预处理器 | Ant Design 默认使用 |
| **husky** | ^8.0.1 | Git Hooks | 提交前自动检查 |
| **lint-staged** | ^13.0.3 | 暂存文件检查 | 只检查变更文件 |
| **ESLint** | >=8.0.0 | 代码检查 | 通过 @jannajs/lint 集成 |
| **Prettier** | >=2.0.0 | 代码格式化 | 统一格式化风格 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Fork 参考项目 | 从零创建新项目 | Fork 节省时间,已有拼音匹配和输入法处理逻辑,但需要清理不需要的代码 |
| Ant Design 4.x | Ant Design 5.x/6.x | 参考项目使用 4.22.8,建议升级到最新 6.3.3 获得更好性能和新特性 |
| 参考项目的无测试 | 添加 Vitest/Jest | Phase 0 暂不添加测试框架,Phase 1 开始引入 |

**Installation:**
```bash
# Phase 0: 直接 Fork
git clone https://github.com/yunsii/pinyin.git my_typing
cd my_typing

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

**Version verification:** 已验证以下最新版本:
- pinyin-pro: 3.28.0 (2026-03-17)
- antd: 6.3.3 (2026-03-17)
- react: 19.2.4 (2026-03-17)
- vite: 8.0.0 (2026-03-17)

## Architecture Patterns

### 参考项目结构
```
pinyin/
├── .github/workflows/       # GitHub Actions
├── .husky/                  # Git hooks
├── public/                  # 静态资源
├── src/
│   ├── assets/              # 资源文件
│   │   ├── schemes/         # 拼音方案配置
│   │   │   ├── XianHe.ts    # 小鹤双拼配置 [需删除]
│   │   │   └── index.ts     # 方案注册入口
│   │   └── texts/           # 练习文本配置
│   │       ├── ChuShiBian.ts
│   │       ├── HelloWorld.ts
│   │       ├── Saying.ts
│   │       └── index.ts
│   ├── components/          # React 组件
│   │   ├── FourLinesGrid/   # 四线三格输入组件
│   │   ├── Hanzi/           # 汉字显示组件
│   │   └── index.ts
│   ├── core/                # 核心逻辑
│   │   ├── Pinyin.ts        # 拼音枚举定义
│   │   ├── index.ts         # 核心导出
│   │   └── registers/       # 注册器
│   │       ├── PinyinSchemaRegister/  # 拼音方案注册器
│   │       │   ├── index.ts           # 方案管理逻辑
│   │       │   └── Quanpin.ts         # 全拼方案配置
│   │       ├── TextRegister/           # 文本注册器
│   │       │   └── index.ts
│   │       └── Registry.ts             # 全局注册器
│   ├── hooks/               # React Hooks
│   │   ├── bin.ts           # 云同步相关
│   │   └── index.ts
│   ├── pages/               # 页面组件
│   │   └── Hero/            # 主页面
│   │       ├── index.tsx
│   │       ├── index.module.less
│   │       └── useProfileBin.ts
│   ├── global.less          # 全局样式
│   └── global.ts            # 全局初始化(注册 schemes/texts)
├── index.html               # 入口 HTML
├── package.json
├── tsconfig.json
├── vite.config.ts
└── pnpm-lock.yaml
```

### Pattern 1: 注册器模式 (Registry Pattern)
**What:** 通过注册器管理拼音方案和文本配置,实现可插拔架构
**When to use:** 需要动态添加/切换不同拼音方案或练习文本时
**Example:**
```typescript
// src/core/registers/Registry.ts
import PinyinSchemaRegister from './PinyinSchemaRegister';
import TextRegister from './TextRegister';

export default class Registry {
  public static schema: PinyinSchemaRegister = new PinyinSchemaRegister();
  public static text: TextRegister = new TextRegister();

  public static reinitialize = () => {
    Registry.schema = new PinyinSchemaRegister();
    Registry.text = new TextRegister();
  };
}

// 使用示例
Registry.schema.register(shuangpinSchema);  // 注册双拼方案
Registry.text.register(textConfig);          // 注册练习文本

const currentPinyin = Registry.schema.getPinyin('XianHe', 'ni');
const textConfig = Registry.text.getTextConfig('HelloWorld');
```

### Pattern 2: 枚举驱动的类型安全
**What:** 使用 TypeScript 枚举定义拼音编码,确保类型安全
**When to use:** 拼音匹配、方案映射
**Example:**
```typescript
// src/core/Pinyin.ts
export enum Quanpin {
  a = 'a',
  o = 'o',
  e = 'e',
  ni = 'ni',
  hao = 'hao',
  // ... 更多拼音
}

export enum Shuangpin {
  a = 'a',
  // ... 双拼编码
}

// 在注册器中使用
public getPinyin(schemaType: string, quanpin: string) {
  if (schemaType === 'QuanPin') {
    return quanpin;  // 全拼直接返回
  }
  const schema = this.getShuangPinSchema(schemaType)!;
  // 双拼需要映射
  return schema.map[quanpin as Shuangpin];
}
```

### Pattern 3: 字符配置分离
**What:** 将文本拆分为字符配置数组,每个字符独立标记类型和拼音
**When to use:** 打字练习文本处理
**Example:**
```typescript
// src/core/registers/TextRegister/index.ts
export enum CharType {
  Mark = 'Mark',    // 标点符号
  Hanzi = 'Hanzi',  // 汉字
}

export interface HanziCharConfig {
  type: CharType.Hanzi;
  char: string;      // '你'
  quanpin: string;   // 'ni'
}

export interface MarkCharConfig {
  type: CharType.Mark;
  char: string;      // '，'
}

export interface TextConfig {
  key: string;
  title: string;
  text: (MarkCharConfig | HanziCharConfig)[];
}

// 注册示例
Registry.text.register({
  key: 'HelloWorld',
  title: '你好,世界!',
  text: [
    { type: CharType.Hanzi, char: '你', quanpin: 'ni' },
    { type: CharType.Hanzi, char: '好', quanpin: 'hao' },
    { type: CharType.Mark, char: '，' },
    { type: CharType.Hanzi, char: '世', quanpin: 'shi' },
    { type: CharType.Hanzi, char: '界', quanpin: 'jie' },
    { type: CharType.Mark, char: '!' },
  ],
});
```

### Pattern 4: 全局初始化模式
**What:** 在 global.ts 中集中导入所有注册模块
**When to use:** 应用启动时需要注册所有方案和文本
**Example:**
```typescript
// src/global.ts
import '@/assets/schemes';  // 注册所有拼音方案
import '@/assets/texts';    // 注册所有练习文本

// src/assets/schemes/index.ts
import './XianHe';  // 注册小鹤双拼

// src/assets/texts/index.ts
import './ChuShiBian';
import './HelloWorld';
import './Saying';
```

### Pattern 5: 实时输入匹配
**What:** 通过比较用户输入和目标拼音实现实时反馈
**When to use:** 打字练习核心逻辑
**Example:**
```typescript
// src/pages/Hero/index.tsx (简化版)
export default function Hero() {
  const [inputPinyin, setInputPinyin] = useState('');
  const currentCharConfig = textConfig.text[inputTextIndex];
  const currentPinyin = Registry.schema.getPinyin(
    schemaType,
    currentCharConfig.quanpin
  );

  // 检测输入完成
  useEffect(() => {
    if (inputPinyin === currentPinyin) {
      // 匹配成功,进入下一个字符
      setInputTextIndex(prev => prev + 1);
      setInputPinyin('');
    }
  }, [inputPinyin, currentPinyin]);

  return (
    <Hanzi
      zi={currentCharConfig?.char}
      original={currentPinyin}
      modified={inputPinyin}
      onChange={setInputPinyin}
    />
  );
}
```

### Anti-Patterns to Avoid
- **直接修改 node_modules:** 不要修改依赖包,应该 Fork 后修改源码
- **全局污染:** 避免在 window 上挂载变量,使用 Registry 单例
- **忽略类型检查:** TypeScript 枚举和接口必须严格使用,避免 any
- **过度工程:** 不要在 Phase 0 引入复杂的状态管理库(如 Redux),保持简单

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| 拼音转换 | 自己写拼音映射表 | pinyin-pro | 多音字处理复杂,准确率要求高 |
| 双拼映射逻辑 | 自己实现映射算法 | 保留 PinyinSchemaRegister | 注册器模式已经实现,只需删除双拼配置 |
| 文本注册 | 自己实现文本管理 | 保留 TextRegister | 已有完整实现,支持字符配置分离 |
| UI 组件 | 手写输入框/按钮 | Ant Design | 企业级组件,开箱即用 |
| 输入法处理 | 自己处理 composition 事件 | 参考项目已有实现 | 输入法事件处理复杂,参考项目已验证 |

**Key insight:** Phase 0 的核心是"减法"而非"加法",删除双拼相关代码比从零实现更高效。保留的注册器模式和字符配置分离模式为后续扩展提供了良好基础。

## 双拼相关代码清理指南

### 需要删除的文件
```
src/assets/schemes/XianHe.ts              # 小鹤双拼配置文件
```

### 需要修改的文件

#### 1. src/assets/schemes/index.ts
**删除前:**
```typescript
import './XianHe';
```
**删除后:**
```typescript
// 双拼方案已移除,仅保留全拼
```

#### 2. src/core/Pinyin.ts
**删除内容:**
- 删除 `Shuangpin` 枚举 (82-150行)
- 删除 `ZeroShengmu` 枚举 (179-193行)
- 删除 `ShengmuList` 常量 (153-177行)
- 保留 `Quanpin` 枚举

**简化后:**
```typescript
/** 全拼编码枚举 */
export enum Quanpin {
  a = 'a',
  o = 'o',
  // ... 保留所有全拼枚举
}
```

#### 3. src/core/registers/PinyinSchemaRegister/index.ts
**简化策略:**
- 删除 `ShuangpinSchemaConfig` 接口
- 删除 `shuangPinSchemas` 数组
- 删除 `register()` 方法 (双拼专用)
- 删除 `getShuangPinSchema()` 方法
- 删除 `getShengmu()` 静态方法
- 简化 `getPinyin()` 方法,直接返回全拼
- 简化 `getSchemaOptions()`,只返回全拼选项

**简化后:**
```typescript
import quanPinSchema, { type as quanpinType } from './Quanpin';
import type { Quanpin } from '../../Pinyin';

export interface QuanpinSchemaConfig {
  type: string;
  displayName: string;
  map: { [key in Quanpin]: string };
}

export default class PinyinSchemaRegister {
  public quanPinSchema = quanPinSchema;

  public getPinyin(schemaType: string, quanpin: string) {
    // 仅支持全拼,直接返回
    return quanpin;
  }

  public getQuanPinSchema() {
    return this.quanPinSchema;
  }

  public getSchemaOptions() {
    return [{
      type: this.quanPinSchema.type,
      displayName: this.quanPinSchema.displayName,
    }];
  }
}
```

#### 4. src/core/index.ts
**删除导出:**
```typescript
export { Shuangpin, ZeroShengmu } from './Pinyin';  // 删除这行
```

#### 5. src/pages/Hero/index.tsx
**简化逻辑:**
- 删除 `schemaType` 状态选择 (不再需要切换方案)
- 删除拼音方案下拉框
- 简化 `onChangeBin` 逻辑,移除 `schemaType` 参数

### 验证清理完成的检查清单
- [ ] `grep -r "Shuangpin" src/` 无结果
- [ ] `grep -r "shuangpin" src/` 无结果
- [ ] `grep -r "双拼" src/` 无结果
- [ ] `grep -r "XianHe" src/` 无结果
- [ ] `grep -r "ZeroShengmu" src/` 无结果
- [ ] `pnpm dev` 启动成功
- [ ] 浏览器打开 http://localhost:8000 无报错
- [ ] 基础打字功能正常(输入拼音匹配汉字)
- [ ] 标点符号直接匹配正常

## Common Pitfalls

### Pitfall 1: 删除过度导致全拼功能损坏
**What goes wrong:** 删除 PinyinSchemaRegister 中的所有逻辑,导致无法获取拼音
**Why it happens:** 没有理解注册器既服务于双拼也服务于全拼
**How to avoid:** 只删除双拼相关方法,保留 `getPinyin()` 的全拼逻辑
**Warning signs:** `Registry.schema.getPinyin()` 返回 undefined 或报错

### Pitfall 2: 忘记修改 scheme 注册入口
**What goes wrong:** 删除了 XianHe.ts 但忘记修改 `src/assets/schemes/index.ts`
**Why it happens:** import 语句不报错(文件已删除),但运行时警告
**How to avoid:** 删除 XianHe.ts 后立即删除对应的 import 语句
**Warning signs:** 控制台警告 "Cannot find module './XianHe'"

### Pitfall 3: 破坏了 TextRegister 的 load 方法
**What goes wrong:** 误删 TextRegister.load() 方法,导致后续无法通过外部工具注音
**Why it happens:** 混淆了双拼逻辑和文本加载逻辑
**How to avoid:** TextRegister 与双拼无关,完全不修改
**Warning signs:** 后续 Phase 1 导入文章时无法自动注音

### Pitfall 4: 依赖版本不兼容
**What goes wrong:** 升级所有依赖到最新版本后,项目无法启动
**Why it happens:** Vite 2.x 配置与 Vite 8.x 不兼容,Ant Design 4.x 与 6.x 主题配置不同
**How to avoid:** Phase 0 保持参考项目的版本,Phase 1 逐步升级
**Warning signs:** `pnpm dev` 报错 "Cannot find plugin" 或样式异常

### Pitfall 5: 忽略 pnpm-lock.yaml
**What goes wrong:** 删除 node_modules 重新安装后,依赖版本不一致
**Why it happens:** 没有提交 pnpm-lock.yaml 或使用 npm/yarn 安装
**How to avoid:** 必须使用 `pnpm install`,不要删除 pnpm-lock.yaml
**Warning signs:** 依赖版本与参考项目不一致,运行时错误

### Pitfall 6: Git 仓库初始化问题
**What goes wrong:** Fork 后保留原项目的 .git,推送到自己的仓库时冲突
**Why it happens:** 直接克隆没有重新初始化 Git
**How to avoid:**
```bash
git clone https://github.com/yunsii/pinyin.git my_typing
cd my_typing
rm -rf .git
git init
git add .
git commit -m "chore: fork from yunsii/pinyin"
git remote add origin <your-repo-url>
git push -u origin main --force
```
**Warning signs:** git push 提示 "Updates were rejected"

## Code Examples

### 验证项目可正常启动
```bash
# 1. 安装依赖
pnpm install

# 2. 启动开发服务器
pnpm dev

# 3. 浏览器访问 http://localhost:8000
# 预期: 看到"你好,世界!"打字练习界面,无控制台错误
```

### 验证基础打字功能
```typescript
// 在浏览器控制台测试
// 1. 检查注册器是否正常
console.log(Registry.schema.getSchemaOptions());
// 预期输出: [{ type: 'QuanPin', displayName: '全拼' }]

// 2. 检查文本注册
console.log(Registry.text.getTextOptions());
// 预期输出: [
//   { key: 'ChuShiBian', title: '出师表' },
//   { key: 'HelloWorld', title: '你好,世界!' },
//   { key: 'Saying', title: '名人名言' }
// ]

// 3. 检查拼音匹配
const pinyin = Registry.schema.getPinyin('QuanPin', 'ni');
console.log(pinyin);  // 预期输出: 'ni'
```

### 检查无双拼残留
```bash
# 在项目根目录执行
grep -r "Shuangpin" src/         # 应该无结果
grep -r "shuangpin" src/         # 应该无双拼相关(可能有变量名)
grep -r "双拼" src/              # 应该无结果
grep -r "XianHe" src/            # 应该无结果
grep -r "ZeroShengmu" src/       # 应该无结果
```

### 简化后的 Hero 组件示例
```typescript
// src/pages/Hero/index.tsx (简化版)
export default function Hero() {
  const textOptions = Registry.text.getTextOptions();
  const [textKey, setTextKey] = useState(textOptions[0]?.key);
  const [inputTextIndex, setInputTextIndex] = useState(0);
  const [inputPinyin, setInputPinyin] = useState('');

  const textConfig = Registry.text.getTextConfig(textKey);
  const currentCharConfig = textConfig?.text[inputTextIndex] as HanziCharConfig;

  // 仅支持全拼,直接使用 quanpin
  const currentPinyin = currentCharConfig?.quanpin;

  React.useEffect(() => {
    if (inputPinyin && inputPinyin === currentPinyin) {
      setInputTextIndex(prev => prev + 1);
      setInputPinyin('');
    }
  }, [inputPinyin, currentPinyin]);

  return (
    <div>
      <Hanzi
        zi={currentCharConfig?.char}
        original={currentPinyin}
        modified={inputPinyin}
        onChange={setInputPinyin}
      />
      <Select
        value={textKey}
        onChange={(value) => {
          setTextKey(value);
          setInputTextIndex(0);
          setInputPinyin('');
        }}
        options={textOptions.map(item => ({
          value: item.key,
          label: item.title,
        }))}
      />
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| 手动配置 Webpack | Vite 零配置 | 2020+ | 开发体验提升 10x,HMR 速度显著加快 |
| JavaScript | TypeScript | 2020+ | 类型安全,IDE 支持完善 |
| npm/yarn | pnpm | 2022+ | 磁盘空间节省,安装速度更快 |
| 双拼+全拼混合 | 仅全拼 | Phase 0 | 简化代码,降低维护成本 |

**Deprecated/outdated:**
- **@vitjs/vit**: 参考项目使用,但该框架已不活跃,建议后续迁移到纯 Vite + React Router
- **Ant Design 4.x**: 已有 5.x/6.x 新版本,建议 Phase 1 升级

## Open Questions

1. **是否需要升级依赖到最新版本?**
   - What we know: 参考项目使用 Vite 2.9.5, React 18.2.0, Ant Design 4.22.8
   - What's unclear: 升级是否会破坏现有功能,Vite 8.x 配置兼容性
   - Recommendation: Phase 0 保持原版本,Phase 1 逐步升级,每次升级一个主要依赖并验证

2. **是否需要保留云同步功能?**
   - What we know: 参考项目使用 JSONbin.io 实现云同步,记录用户进度
   - What's unclear: 新项目是否需要云同步,还是仅本地存储
   - Recommendation: Phase 0 暂时保留,Phase 1 根据需求决定是否移除

3. **单字练习模式是否需要强化?**
   - What we know: 参考项目主要是单字练习,STATE.md 提到"保留但弱化"
   - What's unclear: "弱化"的具体含义,是完全移除还是减少 UI 突出
   - Recommendation: Phase 0 保留单字练习,Phase 2 实现整篇文章模式后弱化单字模式入口

4. **测试框架何时引入?**
   - What we know: 参考项目无测试,config.json 无 nyquist_validation 设置
   - What's unclear: Phase 0 是否需要引入 Vitest
   - Recommendation: Phase 0 不引入测试,Phase 1 开始使用 Vitest 进行单元测试

## Validation Architecture

> Skip this section entirely if workflow.nyquist_validation is explicitly set to false in .planning/config.json. If the key is absent, treat as enabled.

**Status:** workflow.nyquist_validation 未在 config.json 中设置,跳过此部分。

参考项目无测试框架,Phase 0 不引入测试。Phase 1 开始将建立测试基础设施。

## Sources

### Primary (HIGH confidence)
- [yunsii/pinyin GitHub](https://github.com/yunsii/pinyin) - 参考项目源码,直接分析
- [Vite 官方文档](https://vite.dev/guide/) - 构建工具配置
- [Ant Design 官方文档](https://ant.design/docs/react/introduce-cn) - UI 组件库

### Secondary (MEDIUM confidence)
- [pinyin-pro npm](https://www.npmjs.com/package/pinyin-pro) - 拼音库文档
- [ahooks 官方文档](https://ahooks.js.org/) - Hooks 库文档

### Tertiary (LOW confidence)
- 无

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - 直接分析参考项目 package.json,已验证最新版本
- Architecture: HIGH - 完整阅读源码,理解注册器模式和字符配置分离
- Pitfalls: HIGH - 基于 GitHub README 和源码分析,明确双拼代码位置
- Code examples: HIGH - 参考项目代码直接可用

**Research date:** 2026-03-17
**Valid until:** 2026-04-17 (1个月,依赖版本可能更新)
