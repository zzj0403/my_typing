# Feature Landscape

**Domain:** 中文打字练习工具
**Researched:** 2026-03-17

## Table Stakes

用户期望的基础功能。缺失则产品不完整。

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| 文章导入 | 打字练习需要素材来源 | Low | 支持诗词、名言、txt上传 |
| 整篇文章连续打字 | 核心使用场景，不能只支持单句 | Med | 需要处理分句、进度保存 |
| 全拼输入匹配 | 中文输入的核心方式 | High | 需要拼音匹配引擎 |
| 实时正确/错误反馈 | 练习必须知道对错 | Med | UI高亮 + 视觉反馈 |
| 打错可跳过继续 | 实际使用体验，不能卡住 | Low | 允许跳过当前字继续 |

## Differentiators

差异化功能。非必须但有价值。

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| 诗词/名言内置库 | 无需用户自己准备素材 | Low | 可内置经典诗词、名人名言 |
| 拼音提示模式 | 初学者友好，显示目标拼音 | Low | 在字符上方/下方显示拼音 |
| 打字统计（速度/准确率） | 追踪进步，增加动力 | Med | WPM、准确率、错误字符分析 |
| 历史记录 | 保存练习进度 | Med | 本地存储或云端同步 |

## Anti-Features

明确不做的功能。

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| 双拼/五笔支持 | 增加复杂度，核心是全拼 | 专注全拼体验 |
| 语音朗读 | 偏离核心功能 | 如果需要，后期再考虑 |
| 社交/排行榜 | 初期不必要 | 专注个人练习体验 |

---

## 核心功能实现方案

### 1. 逐字/逐句拼音匹配

**推荐方案：pinyin-pro + 自定义匹配逻辑**

```javascript
import { pinyin } from 'pinyin-pro';

// 获取目标汉字的拼音（不带声调）
function getTargetPinyin(char) {
  return pinyin(char, { toneType: 'none', type: 'array' })[0];
}

// 逐字匹配
function matchCharacter(targetChar, userInput) {
  const targetPinyin = getTargetPinyin(targetChar);
  // 用户输入全拼，直接比较
  return userInput.toLowerCase() === targetPinyin.toLowerCase();
}
```

**关键点：**
- 使用 `pinyin-pro` 库进行汉字转拼音（不带声调）
- 用户输入拼音后按空格/数字键选择汉字
- 监听 `compositionend` 事件获取最终汉字
- 将用户选中的汉字与目标汉字比较

**处理多音字：**
```javascript
// pinyin-pro 支持获取多音字所有读音
pinyin('好', { multiple: true }); // ['hǎo', 'hào']

// 匹配时可以接受任一读音
function matchWithPolyphonic(targetChar, userPinyin) {
  const allPinyins = pinyin(targetChar, {
    multiple: true,
    toneType: 'none'
  });
  return allPinyins.includes(userPinyin.toLowerCase());
}
```

**Sources:**
- [pinyin-pro 官方文档](https://pinyin-pro.cn/use/pinyin.html) - HIGH confidence
- [pinyin-pro npm](https://www.npmjs.com/package/pinyin-pro) - HIGH confidence

---

### 2. 标点符号处理策略

**策略：标点符号不需要拼音输入，直接按键匹配**

```javascript
// 判断是否为标点符号
function isPunctuation(char) {
  const punctuationRegex = /[，。！？、；：""''（）《》【】\s,.!?;:'"()\[\]]/;
  return punctuationRegex.test(char);
}

// 处理输入
function handleInput(targetChar, userKey) {
  if (isPunctuation(targetChar)) {
    // 标点符号直接按键匹配
    return userKey === targetChar;
  } else {
    // 汉字需要拼音匹配
    return matchCharacter(targetChar, userKey);
  }
}
```

**中文标点符号键盘映射参考：**

| 中文标点 | 英文键盘 | 备注 |
|---------|---------|------|
| ， | , | 逗号 |
| 。 | . | 句号 |
| ！ | ! | 感叹号（Shift+1） |
| ？ | ? | 问号（Shift+/） |
| 、 | \ | 顿号 |
| ； | ; | 分号 |
| ： | : | 冒号（Shift+;） |
| "" | Shift+' | 引号（需按两次） |
| （） | Shift+9/0 | 括号 |

**Sources:**
- 中文标点键盘映射 - MEDIUM confidence（通用知识）

---

### 3. 实时反馈 UI 实现

**推荐设计模式（参考 MonkeyType）：**

```javascript
// 字符状态枚举
const CharStatus = {
  PENDING: 'pending',   // 待输入（灰色）
  CURRENT: 'current',   // 当前（高亮/下划线）
  CORRECT: 'correct',   // 正确（绿色）
  WRONG: 'wrong',       // 错误（红色）
  SKIPPED: 'skipped'    // 跳过（黄色）
};

// 渲染函数
function renderText(text, currentIndex, statusMap) {
  return text.split('').map((char, index) => {
    let className = '';
    if (index < currentIndex) {
      className = statusMap[index] || CharStatus.CORRECT;
    } else if (index === currentIndex) {
      className = CharStatus.CURRENT;
    } else {
      className = CharStatus.PENDING;
    }
    return `<span class="char ${className}">${char}</span>`;
  }).join('');
}
```

**CSS 样式建议：**
```css
.char { transition: color 0.1s ease; }
.char.pending { color: #666; }
.char.current { color: #fff; background: #007bff; border-radius: 2px; }
.char.correct { color: #28a745; }
.char.wrong { color: #dc3545; text-decoration: underline; }
.char.skipped { color: #ffc107; }
```

**处理中文输入法的组合事件：**
```javascript
// React 示例
const [isComposing, setIsComposing] = useState(false);

const handleCompositionStart = () => setIsComposing(true);
const handleCompositionEnd = (e) => {
  setIsComposing(false);
  // 此时 e.target.value 是最终选中的汉字
  checkCharacter(e.target.value);
};

<input
  onCompositionStart={handleCompositionStart}
  onCompositionEnd={handleCompositionEnd}
  onChange={(e) => {
    if (!isComposing) {
      // 非中文输入时直接处理
      checkCharacter(e.target.value);
    }
  }}
/>
```

**Sources:**
- [React 中文输入法处理](https://juejin.cn/post/6921706679264690189) - HIGH confidence
- [MonkeyType UI 设计参考](https://www.monkeytype.com) - HIGH confidence

---

### 4. 文章分句/分段策略

**方案一：按标点符号分句**

```javascript
// 按句号、问号、感叹号分句（保留分隔符）
function splitIntoSentences(text) {
  // 匹配非终结符 + 终结符
  const sentences = text.match(/[^。！？.!?]+[。！？.!?]?/g) || [];
  return sentences.filter(s => s.trim());
}

// 示例
const text = "床前明月光，疑是地上霜。举头望明月，低头思故乡。";
const sentences = splitIntoSentences(text);
// ["床前明月光，疑是地上霜。", "举头望明月，低头思故乡。"]
```

**方案二：按固定长度分段（适合长文章）**

```javascript
function splitByLength(text, maxLength = 50) {
  const chunks = [];
  for (let i = 0; i < text.length; i += maxLength) {
    chunks.push(text.slice(i, i + maxLength));
  }
  return chunks;
}
```

**方案三：智能分句（结合语义）**

```javascript
// 优先在句号、问号、感叹号处分句
// 次选在逗号、分号处分句（当句子过长时）
function smartSplit(text, maxSentenceLength = 30) {
  // 先按强分割点（句号等）分割
  const strongDelimiters = /([。！？.!?])/g;
  let parts = text.split(strongDelimiters);

  // 重组句子
  const sentences = [];
  let current = '';

  for (let i = 0; i < parts.length; i++) {
    current += parts[i];
    // 遇到强分割点或超过长度限制时，结束当前句子
    if (/[。！？.!?]/.test(parts[i]) ||
        (current.length >= maxSentenceLength && /[，；,;]/.test(parts[i]))) {
      if (current.trim()) sentences.push(current.trim());
      current = '';
    }
  }

  if (current.trim()) sentences.push(current.trim());
  return sentences;
}
```

**诗词特殊处理：**
```javascript
// 诗词通常按逗号/句号分行
function splitPoem(text) {
  // 按逗号或句号分割
  return text.split(/(?<=[，。])/g).filter(s => s.trim());
}

// 示例
const poem = "床前明月光，疑是地上霜。";
const lines = splitPoem(poem);
// ["床前明月光，", "疑是地上霜。"]
```

**Sources:**
- [JavaScript 中文分句](https://blog.csdn.net/lijinze2/article/details/143232518) - MEDIUM confidence
- [Intl.Segmenter API](https://cloud.tencent.com/developer/article/2207694) - HIGH confidence（现代浏览器支持）

---

## Feature Dependencies

```
文章导入 → 分句处理 → 逐字匹配 → 实时反馈
              ↓
         拼音匹配引擎（pinyin-pro）
```

---

## MVP Recommendation

**优先实现：**
1. 文章导入（txt上传 + 内置诗词库）
2. 整篇文章连续打字（智能分句）
3. 全拼输入匹配（pinyin-pro）
4. 实时正确/错误反馈（字符高亮）

**延期考虑：**
- 打字统计（WPM/准确率）：需要计时器实现，但非核心
- 历史记录：需要存储方案设计
- 拼音提示模式：可后期添加

---

## 技术选型总结

| 需求 | 推荐方案 | 置信度 |
|------|---------|--------|
| 汉字转拼音 | **pinyin-pro** | HIGH |
| 拼音匹配 | 自定义实现 + pinyin-pro | HIGH |
| 中文输入法处理 | compositionstart/end 事件 | HIGH |
| 文本分句 | 正则表达式 / Intl.Segmenter | HIGH |
| UI 实时反馈 | CSS 状态切换 + React 状态管理 | HIGH |

---

## Sources

- [pinyin-pro 官方文档](https://pinyin-pro.cn/use/pinyin.html) - HIGH confidence
- [pinyin-pro npm](https://www.npmjs.com/package/pinyin-pro) - HIGH confidence
- [React 中文输入法处理](https://juejin.cn/post/6921706679264690189) - HIGH confidence
- [Vue 打字训练器实现](https://developer.aliyun.com/article/1246133) - MEDIUM confidence
- [JavaScript 中文分句](https://blog.csdn.net/lijinze2/article/details/143232518) - MEDIUM confidence
- [Intl.Segmenter API](https://cloud.tencent.com/developer/article/2207694) - HIGH confidence
- [MonkeyType 参考设计](https://www.monkeytype.com) - HIGH confidence
