# 模仿Z2H学帖 - (小神龙字帖)汉字书写练习应用

一款专注于汉字书写练习的Web应用，提供田字格、米字格、回宫格等多种背景，支持自定义文本生成字帖和控笔练习。

## 项目特性

- 🖌️ **多种字帖格式**：支持田字格、米字格、回宫格等多种练习格式
- 📝 **汉字练习**：支持描红、临摹、标准笔顺展示
- 🔠 **拼音标注**：自动为汉字添加拼音标注，便于学习
- 🖨️ **打印导出**：优化的打印布局，支持导出PDF
- 📊 **控笔练习**：提供波浪线、螺旋线等多种控笔练习图形
- 🎨 **自定义样式**：可调整字体、大小、颜色、布局等

## 项目结构

```
z2h-calligraphy/
├── src/
│   ├── assets/               # 静态资源
│   │   ├── images/           # 图片资源
│   │   └── styles/           # 样式文件
│   │       └── main.css      # 主样式文件
│   │
│   ├── components/           # 通用组件
│   │   ├── AppHeader.vue     # 应用头部组件
│   │   ├── AppFooter.vue     # 应用底部组件
│   │   ├── SheetContainer.vue # 字帖页面容器
│   │   ├── SheetPreview.vue  # 字帖预览区组件
│   │   ├── ControlPanel.vue  # 控制面板组件
│   │   ├── SettingItem.vue   # 设置项组件
│   │   ├── ToggleSetting.vue # 开关设置组件
│   │   ├── StrokeDisplay.vue # 笔画显示组件
│   │   └── PinyinDisplay.vue # 拼音显示组件
│   │
│   ├── constants/            # 常量定义
│   │   └── index.ts          # 统一的常量定义中心
│   │
│   ├── pages/                # 页面组件
│   │   ├── HomePage.vue      # 首页
│   │   ├── CharacterSheet.vue # 汉字练习页
│   │   ├── PoetrySheet.vue   # 诗词练习页
│   │   └── PenControl.vue    # 控笔练习页
│   │
│   ├── services/             # 服务层
│   │   ├── cncharService.ts  # 汉字处理服务
│   │   └── pinyinService.ts  # 拼音处理服务
│   │
│   ├── stores/               # 状态管理
│   │   ├── index.ts          # Store导出中心
│   │   ├── sheet.ts          # 字帖设置Store
│   │   ├── fonts.ts          # 字体管理Store
│   │   └── settings.ts       # 应用设置Store
│   │
│   ├── types/                # 类型定义
│   │   └── index.ts          # 统一的类型定义中心
│   │
│   ├── utils/                # 工具函数
│   │   ├── fontLoader.ts     # 字体加载工具
│   │   ├── grid.ts           # 网格生成工具
│   │   ├── printer.ts        # 打印工具
│   │   └── sheetUtils.ts     # 字帖工具函数
│   │
│   ├── App.vue               # 根组件
│   ├── main.ts               # 入口文件
│   └── router/               # 路由配置
│       └── index.ts          # 路由定义
│
├── public/                   # 公共资源
├── index.html                # HTML模板
├── tsconfig.json             # TypeScript配置
├── vite.config.ts            # Vite配置
├── package.json              # 项目依赖
└── README.md                 # 项目说明
```

## 组件设计

### 核心组件

我们通过将原本在页面中的重复代码抽象成了多个可复用组件：

1. **SheetContainer**：
   - 布局容器组件，提供应用的整体布局结构
   - 包含页眉、页脚和内容区域
   - 提供预览区和控制面板的插槽

2. **SheetPreview**：
   - 字帖预览组件，处理分页和打印预览
   - 提供内容插槽，允许各类型字帖定制内容显示
   - 统一处理打印样式和行为

3. **ControlPanel**：
   - 控制面板容器，提供一致的设置界面
   - 包含导出、打印按钮及设置项插槽
   - 统一处理面板样式和行为

4. **SettingItem** 和 **ToggleSetting**：
   - 设置项组件，提供一致的设置项布局和样式
   - 支持各种设置控件（滑块、选择器等）
   - 简化设置项的实现和维护

### 页面组件

页面组件使用上述核心组件进行组合，实现各自的功能：

1. **CharacterSheet**：汉字书写练习，支持单字重复练习
2. **PoetrySheet**：诗词临摹练习，支持多行文本
3. **PenControl**：控笔练习，提供多种基础图形练习

## 工具类设计

为提高代码复用度，我们提取了多个工具类：

1. **sheetUtils.ts**：
   - 字帖相关计算和处理函数
   - 处理分页、布局和样式计算
   - 提供统一的字帖生成逻辑

2. **grid.ts**：
   - 网格生成工具
   - 支持多种字帖格式（田字格、米字格等）
   - 提供SVG网格生成函数

3. **printer.ts**：
   - 打印和导出功能
   - 优化打印布局和样式
   - 支持PDF导出

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite + Bun
- **包管理器**: pnpm
- **UI组件库**: Naive UI
- **样式工具**: Tailwind CSS 4.0
- **状态管理**: Pinia

## 开发指南

### 环境要求

- Bun 1.0.0 或更高版本
- pnpm 8.15.0 或更高版本
- Node.js 18.0.0 或更高版本（兼容性支持）

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 预览构建结果

```bash
pnpm preview
```

## 联系方式

如有任何问题或建议，请通过项目Issue提交。