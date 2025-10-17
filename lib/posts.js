import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeRaw from 'rehype-raw'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
    .filter(name => name.endsWith('.md') || name.endsWith('.mdx'))
  const allPostsData = fileNames.map(fileName => {
    // Remove extension (".md" or ".mdx") from file name to get id
    const id = fileName.replace(/\.(md|mdx)$/i, '')

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
      id,
      ...matterResult.data
    }
  })
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)
    .filter(name => name.endsWith('.md') || name.endsWith('.mdx'))
  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.(md|mdx)$/i, '')
      }
    }
  })
}

export async function getPostData(id) {
  // Support both .mdx and .md, prefer .mdx when both exist
  const mdxPath = path.join(postsDirectory, `${id}.mdx`)
  const mdPath = path.join(postsDirectory, `${id}.md`)
  const fullPath = fs.existsSync(mdxPath) ? mdxPath : mdPath
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  const isMdx = fullPath.toLowerCase().endsWith('.mdx')

  if (isMdx) {
    // Serialize content to MDX so JSX/React components are supported
    const mdxSource = await serialize(matterResult.content, {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }]
        ]
      },
      parseFrontmatter: false
    })

    return {
      id,
      mdxSource,
      ...matterResult.data
    }
  } else {
    // For plain Markdown, keep previous HTML pipeline
    const processedContent = await unified()
      .use(remarkParse)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(matterResult.content)
    const contentHtml = processedContent.toString()

    return {
      id,
      contentHtml,
      ...matterResult.data
    }
  }
}
