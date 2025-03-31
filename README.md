# 模仿Z2H学帖 - 汉字书写练习应用

一款专注于汉字书写练习的Web应用，支持生成自定义字帖和控笔练习。

## 功能特点

- **文字练习基础功能**
  - 基于用户输入生成字帖
  - 支持田字格、米字格、回宫格等多种背景
  - 字体样式调整（大小、颜色、透明度）
  - 支持描红和临摹模式

- **笔画显示功能**
  - 根据用户输入的文字显示笔画顺序（非交互式）
  - 通过开关控制是否在字帖中显示笔画信息

- **拼音显示功能**
  - 为字帖中的汉字添加准确的拼音标注
  - 支持多音字的准确处理
  - 通过开关控制是否显示拼音

- **字帖生成与打印**
  - 生成适合打印的页面
  - 可调整打印参数

- **字体管理**
  - 支持多种内置字体
  - 支持用户上传自定义字体

- **控笔练习**
  - 提供多种图形的控笔练习模板

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite + Bun
- **包管理器**: pnpm
- **UI组件库**: Naive UI
- **样式工具**: Tailwind CSS 4.0
- **状态管理**: Pinia
- **汉字处理**: cnchar + pinyin-pro

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

## 项目结构

```
z2h-calligraphy/
├── src/                       # 源代码
│   ├── assets/                # 静态资源
│   ├── components/            # 通用组件
│   ├── pages/                 # 页面组件
│   ├── services/              # 服务层
│   ├── stores/                # 状态管理
│   ├── types/                 # 类型定义
│   └── utils/                 # 工具函数
└── [其他配置文件]
```

## 贡献指南

欢迎为本项目做出贡献！请遵循以下步骤：

1. Fork本仓库
2. 创建新的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开Pull Request

## 许可证

根据MIT许可证分发。更多信息请参见 `LICENSE` 文件。

## 联系方式

如有任何问题或建议，请通过项目Issue提交。