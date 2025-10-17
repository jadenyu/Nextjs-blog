Language: English | [Chinese](README_zh.md)

# Next.js Blog

A personal blog built with Next.js that supports both Markdown (.md) and MDX (.mdx). You can write with plain Markdown for speed, or use MDX to embed JSX/React components for richer interactive content.

## Features
- Supports posts in .md and .mdx under the posts/ directory
- When both .md and .mdx exist with the same name, .mdx takes precedence
- Markdown is processed through the same MDX pipeline to keep rendering consistent
- Built-in GitHub Flavored Markdown (GFM), heading slugs (rehype-slug) and autolinked headings (rehype-autolink-headings)
- Custom code block toolbar (language badge and copy button) for one-click code copying
- Global element rendering can be customized via components/mdx-components.js (links, code blocks, etc.)
- Tailwind CSS styling support

## Tech Stack
- Next.js ^15 (React 18)
- MDX: @mdx-js/mdx, @mdx-js/react, next-mdx-remote
- Markdown/HTML processing & plugins: remark, remark-gfm, remark-parse, remark-rehype, rehype-raw, rehype-stringify, rehype-slug, rehype-autolink-headings
- Styling: Tailwind CSS, PostCSS
- Others: gray-matter (Frontmatter parsing), date-fns, highlight.js (optional)
- Node requirement: 22.x (see package.json engines)

## Project Structure (excerpt)
- components/      — Components and MDX component mapping (mdx-components.js)
- lib/             — Data and processing logic (e.g., posts.js)
- pages/           — Next.js pages (including _app.js)
- posts/           — Post content (.md/.mdx supported)
- public/          — Static assets
- styles/          — Global styles and Tailwind config
- tailwind.config.js / postcss.config.js / package.json

## Getting Started
1) Install dependencies
- npm install

2) Start development server
- npm run dev
- Visit: http://localhost:3000

3) Build & start production
- npm run build
- npm start

## Writing Guide
- Put your posts in the posts/ directory. The file name becomes the post id (route). Both .md and .mdx are supported.
- Frontmatter example:

```md
---
title: Web Scraping in R
date: 2024-09-01
---

# Title
Body content...
```

- When using MDX (.mdx), you can write JSX or import components directly:

```mdx
---
title: My Interactive Post
date: 2025-10-01
---

# Hello
<button onClick={() => alert('Hi!')}>Click me</button>
```

Or import and use a local component:

```mdx
import Fancy from '../components/fancy'

<Fancy />
```

## Global Rendering & Styling
- Edit components/mdx-components.js to override default rendering for a, pre, code, etc.
- The code block language badge and copy button are enhanced in pages/_app.js via client-side script—no extra setup required.
- Styling is powered by Tailwind; adjust in styles/ and tailwind.config.js.

## Data & Rendering Flow (brief)
- lib/posts.js reads .md/.mdx files under posts/ and parses Frontmatter.
- When generating routes, a same-named .mdx file is preferred.
- .mdx content is serialized with next-mdx-remote and rendered on the page; .md content goes through a remark/rehype pipeline to HTML.

## NPM Scripts
- dev: local development (with Turbo)
- build: production build
- start: start in production

## FAQ
- Can I write only Markdown? Yes. Even without JSX, .md posts render properly.
- How about syntax highlighting? No theme is enforced by default. If needed, add highlight.js or extend styles/components in mdx-components.js.

— Feel free to customize and build upon this project.