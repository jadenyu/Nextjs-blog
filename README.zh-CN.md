语言 Language: [English](./README.md) | 中文

# Next.js Blog

一个基于 Next.js 构建的个人博客，支持 Markdown（.md）与 MDX（.mdx）双格式写作。你既可以用纯 Markdown 快速写作，也可以在 MDX 中使用 JSX/React 组件，实现更丰富的交互内容。

## 功能概览
- 支持 .md 与 .mdx 两种后缀的文章，放置在 posts/ 目录下即可被自动识别
- 当同名 .md 与 .mdx 同时存在时，优先渲染 .mdx
- Markdown 也走 MDX 管线处理，保持现有渲染效果一致
- 内置 GitHub 风格 Markdown（GFM）、标题锚点（rehype-slug）与自动链接（rehype-autolink-headings）
- 自定义代码块工具栏（显示语言、复制按钮），便于一键复制代码
- 可通过 components/mdx-components.js 自定义全局元素渲染（链接、代码块等）
- Tailwind CSS 样式支持

## 技术栈
- Next.js ^15（React 18）
- MDX：@mdx-js/mdx、@mdx-js/react、next-mdx-remote
- Markdown/HTML 处理与插件：remark、remark-gfm、remark-parse、remark-rehype、rehype-raw、rehype-stringify、rehype-slug、rehype-autolink-headings
- 样式：Tailwind CSS、PostCSS
- 其他：gray-matter（Frontmatter 解析）、date-fns、highlight.js（可选）
- Node 版本要求：22.x（见 package.json engines）

## 目录结构（节选）
- components/      —— 组件与 MDX 组件映射（mdx-components.js）
- lib/             —— 数据与处理逻辑（如 posts.js）
- pages/           —— Next.js 页面（含 _app.js）
- posts/           —— 文章内容（支持 .md/.mdx）
- public/          —— 静态资源
- styles/          —— 全局样式与 Tailwind 配置
- tailwind.config.js / postcss.config.js / package.json

## 快速开始
1) 安装依赖
- npm install

2) 开发运行
- npm run dev
- 本地访问：http://localhost:3000

3) 构建与启动
- npm run build
- npm start

## 写作指南
- 将文章放在 posts/ 目录下，文件名即为文章 id（路由）。支持 .md 与 .mdx。
- Frontmatter 示例：

```md
---
title: Web Scraping in R
date: 2024-09-01
---

# 标题
正文内容……
```

- 使用 MDX（.mdx）时，你可以直接写 JSX/引入组件：

```mdx
---
title: My Interactive Post
date: 2025-10-01
---

# Hello
<button onClick={() => alert('Hi!')}>Click me</button>
```

或导入并使用本地组件：

```mdx
import Fancy from '../components/fancy'

<Fancy />
```

## 全局渲染与样式定制
- 编辑 components/mdx-components.js，可以重写 a、pre、code 等标签的默认渲染。
- 代码块的语言徽章与复制按钮在 pages/_app.js 中以前端脚本方式增强，无需改动即可使用。
- 样式由 Tailwind 提供，可在 styles/ 与 tailwind.config.js 内调整。

## 数据与渲染流程（简述）
- lib/posts.js 会读取 posts/ 下的 .md/.mdx 文件并解析 Frontmatter。
- 路由生成时优先选择同名的 .mdx 文件进行渲染。
- .mdx 内容通过 next-mdx-remote 序列化并在页面端渲染；.md 内容经 remark/rehype 管线转成 HTML。

## NPM Scripts
- dev：本地开发（含 Turbo）
- build：生产构建
- start：生产环境启动

## 常见问题
- 我只想写 Markdown，可以吗？可以。即便不使用 JSX，.md 也会被正常渲染。
- 语法高亮如何处理？项目未强制启用高亮主题，若需要可结合 highlight.js 或自定义样式在 mdx-components.js 中扩展。

—— 欢迎基于本项目进行二次开发与个性化定制。