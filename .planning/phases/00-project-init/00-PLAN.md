---
phase: 00-project-init
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/assets/schemes/XianHe.ts
  - src/assets/schemes/index.ts
  - src/core/Pinyin.ts
  - src/core/index.ts
  - src/core/registers/PinyinSchemaRegister/index.ts
  - src/pages/Hero/index.tsx
autonomous: false
requirements: []
user_setup: []

must_haves:
  truths:
    - "pnpm dev 命令成功启动开发服务器"
    - "浏览器访问 localhost:8000 无报错显示打字界面"
    - "输入全拼可以匹配汉字"
    - "代码中无双拼相关逻辑残留"
  artifacts:
    - path: "package.json"
      provides: "项目依赖配置"
      contains: '"vite"'
    - path: "src/core/Pinyin.ts"
      provides: "拼音枚举定义"
      contains: "enum Quanpin"
    - path: "src/assets/schemes/index.ts"
      provides: "方案注册入口"
      min_lines: 1
  key_links:
    - from: "src/assets/schemes/index.ts"
      to: "双拼方案文件"
      via: "import 语句"
      pattern: "不应存在 import.*XianHe"
    - from: "src/core/Pinyin.ts"
      to: "双拼枚举"
      via: "枚举定义"
      pattern: "不应存在 enum Shuangpin"
---

<objective>
Fork 参考项目 yunsii/pinyin 到本地，安装依赖，清理双拼相关代码，验证基础全拼打字功能正常工作。

Purpose: 建立干净的开发环境，移除不需要的双拼功能，为后续开发做准备
Output: 可运行的全拼打字练习项目
</objective>

<execution_context>
@/root/.claude/get-shit-done/workflows/execute-plan.md
@/root/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/00-project-init/00-RESEARCH.md
@.planning/phases/00-project-init/00-VALIDATION.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fork 参考项目并安装依赖</name>
  <files>package.json, pnpm-lock.yaml</files>
  <read_first>无 (项目目录为空，需要从 GitHub 克隆)</read_first>
  <behavior>
    - 克隆 https://github.com/yunsii/pinyin 到 /root/my_typing_temp
    - 复制所有文件到 /root/my_typing（排除 .git 目录）
    - 删除临时目录
    - 初始化新的 git 仓库
    - 运行 pnpm install 安装依赖
  </behavior>
  <action>
    1. 克隆参考项目到临时目录:
       ```bash
       git clone https://github.com/yunsii/pinyin.git /root/my_typing_temp
       ```

    2. 复制项目文件（排除 .git）:
       ```bash
       rsync -av --exclude='.git' /root/my_typing_temp/ /root/my_typing/
       ```

    3. 清理临时目录:
       ```bash
       rm -rf /root/my_typing_temp
       ```

    4. 初始化新 git 仓库（保留 .planning 目录）:
       ```bash
       cd /root/my_typing && git add . && git commit -m "chore: fork from yunsii/pinyin"
       ```

    5. 安装依赖:
       ```bash
       cd /root/my_typing && pnpm install
       ```

    注意: 不要删除 .planning 目录，这是项目规划文件
  </action>
  <verify>
    <automated>test -f /root/my_typing/package.json && test -d /root/my_typing/node_modules && echo "OK" || echo "FAIL"</automated>
  </verify>
  <acceptance_criteria>
    - package.json 文件存在于 /root/my_typing/
    - node_modules 目录存在
    - pnpm-lock.yaml 文件存在
    - git log 显示初始提交
  </acceptance_criteria>
  <done>
    - package.json 存在
    - node_modules 安装完成
    - git 仓库初始化
  </done>
</task>

<task type="auto">
  <name>Task 2: 删除双拼方案配置文件</name>
  <files>src/assets/schemes/XianHe.ts</files>
  <read_first>
    - src/assets/schemes/index.ts (查看当前导入)
  </read_first>
  <behavior>
    - 删除 src/assets/schemes/XianHe.ts 文件
    - 修改 src/assets/schemes/index.ts 移除 XianHe 导入
  </behavior>
  <action>
    1. 删除小鹤双拼配置文件:
       ```bash
       rm -f /root/my_typing/src/assets/schemes/XianHe.ts
       ```

    2. 读取 src/assets/schemes/index.ts 当前内容，然后将文件修改为:
       ```typescript
       // 双拼方案已移除，仅保留全拼
       // Phase 0: 清理双拼相关代码
       ```

    注意: 文件不能为空，但可以只包含注释
  </action>
  <verify>
    <automated>test ! -f /root/my_typing/src/assets/schemes/XianHe.ts && echo "OK" || echo "FAIL"</automated>
  </verify>
  <acceptance_criteria>
    - src/assets/schemes/XianHe.ts 文件不存在
    - src/assets/schemes/index.ts 不包含 "XianHe" 字符串
    - grep -r "XianHe" /root/my_typing/src/ 无结果
  </acceptance_criteria>
  <done>
    - XianHe.ts 已删除
    - schemes/index.ts 已清理
  </done>
</task>

<task type="auto">
  <name>Task 3: 简化 Pinyin.ts 移除双拼枚举</name>
  <files>src/core/Pinyin.ts</files>
  <read_first>
    - src/core/Pinyin.ts (完整读取，识别需要删除的枚举)
  </read_first>
  <behavior>
    - 删除 Shuangpin 枚举 (约 82-150 行)
    - 删除 ZeroShengmu 枚举 (约 179-193 行)
    - 删除 ShengmuList 常量 (约 153-177 行)
    - 保留 Quanpin 枚举完整
  </behavior>
  <action>
    1. 读取 src/core/Pinyin.ts 完整内容

    2. 删除以下内容:
       - `export enum Shuangpin { ... }` 整个枚举定义
       - `export enum ZeroShengmu { ... }` 整个枚举定义
       - `export const ShengmuList = [...]` 常量定义

    3. 保留 Quanpin 枚举不变

    4. 确保文件末尾的导出只保留 Quanpin

    关键修改:
    - 删除所有 `Shuangpin` 相关代码
    - 删除所有 `ZeroShengmu` 相关代码
    - 删除所有 `ShengmuList` 相关代码
    - 文件中应该只剩下 `Quanpin` 枚举
  </action>
  <verify>
    <automated>grep -c "enum Shuangpin" /root/my_typing/src/core/Pinyin.ts || echo "OK"</automated>
  </verify>
  <acceptance_criteria>
    - grep -c "enum Shuangpin" src/core/Pinyin.ts 返回 0 或报错（无匹配）
    - grep -c "enum ZeroShengmu" src/core/Pinyin.ts 返回 0 或报错（无匹配）
    - grep -c "ShengmuList" src/core/Pinyin.ts 返回 0 或报错（无匹配）
    - grep -c "enum Quanpin" src/core/Pinyin.ts 返回 1（保留）
    - 文件仍可正常编译
  </acceptance_criteria>
  <done>
    - Pinyin.ts 仅保留 Quanpin 枚举
    - 无双拼相关枚举残留
  </done>
</task>

<task type="auto">
  <name>Task 4: 简化 core/index.ts 导出</name>
  <files>src/core/index.ts</files>
  <read_first>
    - src/core/index.ts (查看当前导出)
  </read_first>
  <behavior>
    - 删除 Shuangpin 导出
    - 删除 ZeroShengmu 导出
    - 保留 Quanpin 导出
    - 保留 Registry 和其他必要导出
  </behavior>
  <action>
    1. 读取 src/core/index.ts 当前内容

    2. 删除以下行（如果存在）:
       ```typescript
       export { Shuangpin, ZeroShengmu } from './Pinyin';
       ```

    3. 确保保留:
       ```typescript
       export { Quanpin } from './Pinyin';
       export { default as Registry } from './registers/Registry';
       // 其他必要的导出
       ```

    注意: 只删除双拼相关的导出，保留其他所有导出
  </action>
  <verify>
    <automated>grep -E "Shuangpin|ZeroShengmu" /root/my_typing/src/core/index.ts && echo "FAIL" || echo "OK"</automated>
  </verify>
  <acceptance_criteria>
    - src/core/index.ts 不包含 "Shuangpin"
    - src/core/index.ts 不包含 "ZeroShengmu"
    - src/core/index.ts 包含 "Quanpin"
    - grep -c "export" src/core/index.ts 大于等于 1
  </acceptance_criteria>
  <done>
    - core/index.ts 仅导出全拼相关类型
    - 无双拼相关导出
  </done>
</task>

<task type="auto">
  <name>Task 5: 简化 PinyinSchemaRegister</name>
  <files>src/core/registers/PinyinSchemaRegister/index.ts</files>
  <read_first>
    - src/core/registers/PinyinSchemaRegister/index.ts (完整读取，理解当前结构)
    - src/core/registers/PinyinSchemaRegister/Quanpin.ts (查看全拼方案配置)
  </read_first>
  <behavior>
    - 删除 ShuangpinSchemaConfig 接口
    - 删除 shuangPinSchemas 数组
    - 删除 register() 方法（双拼专用）
    - 删除 getShuangPinSchema() 方法
    - 简化 getPinyin() 方法，直接返回 quanpin
    - 简化 getSchemaOptions()，只返回全拼选项
  </behavior>
  <action>
    1. 读取 src/core/registers/PinyinSchemaRegister/index.ts 完整内容

    2. 简化为以下结构:

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

      public getPinyin(_schemaType: string, quanpin: string): string {
        // 仅支持全拼，直接返回
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

    3. 删除所有双拼相关:
       - ShuangpinSchemaConfig 接口
       - shuangPinSchemas 数组
       - register() 方法
       - getShuangPinSchema() 方法
       - getShengmu() 静态方法（如果有）

    注意: 参数名 schemaType 改为 _schemaType 表示未使用，保持签名兼容
  </action>
  <verify>
    <automated>grep -E "ShuangpinSchemaConfig|shuangPinSchemas|getShuangPinSchema" /root/my_typing/src/core/registers/PinyinSchemaRegister/index.ts && echo "FAIL" || echo "OK"</automated>
  </verify>
  <acceptance_criteria>
    - 文件不包含 "ShuangpinSchemaConfig"
    - 文件不包含 "shuangPinSchemas"
    - 文件不包含 "getShuangPinSchema"
    - 文件包含 "getPinyin" 方法
    - 文件包含 "getSchemaOptions" 方法
    - getSchemaOptions 返回值只包含全拼选项
  </acceptance_criteria>
  <done>
    - PinyinSchemaRegister 仅支持全拼
    - 无双拼注册和查询逻辑
  </done>
</task>

<task type="auto">
  <name>Task 6: 清理 Hero 页面双拼相关代码</name>
  <files>src/pages/Hero/index.tsx</files>
  <read_first>
    - src/pages/Hero/index.tsx (完整读取，理解当前结构)
  </read_first>
  <behavior>
    - 删除 schemaType 状态选择（如果存在）
    - 删除拼音方案下拉框 UI（如果存在）
    - 简化 Registry.schema.getPinyin() 调用，使用固定 'QuanPin'
  </behavior>
  <action>
    1. 读取 src/pages/Hero/index.tsx 完整内容

    2. 进行以下修改:

       a. 如果存在 schemaType 状态，删除:
          ```typescript
          const [schemaType, setSchemaType] = useState('QuanPin');
          ```

       b. 如果存在拼音方案选择下拉框，删除相关 JSX

       c. 修改 getPinyin 调用:
          - 原代码: `Registry.schema.getPinyin(schemaType, quanpin)`
          - 改为: `Registry.schema.getPinyin('QuanPin', quanpin)`

       d. 如果 onChangeBin 等回调中有 schemaType 参数，移除或固定为 'QuanPin'

    注意:
    - 不要删除文本选择功能
    - 不要删除核心打字逻辑
    - 只删除双拼方案选择相关代码
  </action>
  <verify>
    <automated>grep -c "schemaType" /root/my_typing/src/pages/Hero/index.tsx || echo "OK"</automated>
  </verify>
  <acceptance_criteria>
    - src/pages/Hero/index.tsx 不包含 "schemaType" 状态变量
    - 文件不包含双拼方案选择的下拉框
    - getPinyin 调用使用固定 'QuanPin' 参数
    - 文件仍可正常编译
  </acceptance_criteria>
  <done>
    - Hero 页面无双拼选择功能
    - 仅使用全拼模式
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 7: 验证项目运行和功能正常</name>
  <files>无文件修改</files>
  <read_first>无</read_first>
  <what-built>
    已完成:
    1. Fork 参考项目并安装依赖
    2. 删除双拼方案配置文件 (XianHe.ts)
    3. 简化 Pinyin.ts 移除双拼枚举
    4. 简化 core/index.ts 导出
    5. 简化 PinyinSchemaRegister
    6. 清理 Hero 页面双拼相关代码
  </what-built>
  <behavior>
    - 启动开发服务器
    - 验证浏览器访问无报错
    - 验证基础打字功能
    - 验证无双拼代码残留
  </behavior>
  <action>
    执行以下验证步骤:

    1. 检查无双拼代码残留:
       ```bash
       cd /root/my_typing && grep -r "Shuangpin\|双拼\|XianHe\|ZeroShengmu" src/
       ```
       预期: 无结果输出

    2. 启动开发服务器:
       ```bash
       cd /root/my_typing && pnpm dev
       ```
       预期: 显示 "Local: http://localhost:8000/" 或类似输出

    3. 提示用户在浏览器中验证:
       - 访问 http://localhost:8000
       - 检查页面正常显示
       - 输入拼音测试打字功能（如输入 "ni" 匹配 "你"）
       - 检查浏览器控制台无报错
  </action>
  <verify>
    <automated>grep -r "Shuangpin\|XianHe\|ZeroShengmu" /root/my_typing/src/ 2>/dev/null | wc -l</automated>
  </verify>
  <acceptance_criteria>
    - grep -r "Shuangpin" src/ 无结果
    - grep -r "XianHe" src/ 无结果
    - grep -r "ZeroShengmu" src/ 无结果
    - pnpm dev 命令成功启动
    - 浏览器访问 localhost:8000 无报错
  </acceptance_criteria>
  <how-to-verify>
    1. 运行 `cd /root/my_typing && grep -r "Shuangpin\|XianHe\|ZeroShengmu" src/` 确认无输出
    2. 运行 `cd /root/my_typing && pnpm dev` 启动开发服务器
    3. 在浏览器中访问 http://localhost:8000
    4. 测试打字功能：选择一篇文章，输入拼音匹配汉字
    5. 检查浏览器控制台 (F12) 无红色错误
  </how-to-verify>
  <resume-signal>验证通过后输入 "approved"，如有问题请描述具体错误</resume-signal>
  <done>
    - 无双拼代码残留（grep 检查通过）
    - 项目可正常启动
    - 浏览器访问正常
    - 基础打字功能正常
  </done>
</task>

</tasks>

<verification>
## Phase 0 验证清单

### 自动化验证
- [ ] grep -r "Shuangpin" src/ 无结果
- [ ] grep -r "XianHe" src/ 无结果
- [ ] grep -r "ZeroShengmu" src/ 无结果
- [ ] grep -r "ShengmuList" src/ 无结果
- [ ] pnpm dev 启动成功

### 手动验证
- [ ] 浏览器访问 http://localhost:8000 正常显示
- [ ] 输入全拼可匹配汉字
- [ ] 标点符号可正常匹配
- [ ] 浏览器控制台无报错
</verification>

<success_criteria>
- 项目可本地启动 (pnpm dev)
- 基础打字功能正常（输入拼音匹配汉字）
- 代码中无双拼相关逻辑（grep 验证通过）
- 所有双拼相关文件已删除或清理
</success_criteria>

<output>
After completion, create `.planning/phases/00-project-init/00-01-SUMMARY.md`
</output>
