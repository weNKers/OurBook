import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const strict = process.argv.includes('--strict')
const docsDir = path.join(root, 'docs')
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(dir, entry.name)
  return entry.isDirectory() ? walk(file) : [file]
})

const files = walk(docsDir).filter((file) => file.endsWith('.md'))
const missingFrontmatter = []
const missingHeading = []
const fields = new Set()

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8')
  const relative = path.relative(root, file)
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---(?:\n|$)/)
  if (!frontmatter) missingFrontmatter.push(relative)
  else for (const match of frontmatter[1].matchAll(/^([\w-]+):/gm)) fields.add(match[1])
  const isHome = /^home:\s*true\s*$/m.test(frontmatter?.[1] || '')
  if (!isHome && !/^#\s+.+/m.test(content.replace(frontmatter?.[0] || '', ''))) missingHeading.push(relative)
}

console.log(`文本审计：${files.length} 个 Markdown 文件`)
console.log(`已有 frontmatter：${files.length - missingFrontmatter.length}，建议补充：${missingFrontmatter.length}`)
console.log(`已有一级标题：${files.length - missingHeading.length}，建议补充：${missingHeading.length}`)
console.log(`当前 frontmatter 字段：${[...fields].sort().join(', ') || '暂无'}`)
if (missingFrontmatter.length) console.log(`首批待整理：\n${missingFrontmatter.slice(0, 20).join('\n')}`)
if (missingHeading.length) console.log(`缺少一级标题：\n${missingHeading.slice(0, 20).join('\n')}`)
if (strict && (missingFrontmatter.length || missingHeading.length)) process.exitCode = 1
