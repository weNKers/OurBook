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
const multipleHeadings = []
const titleMismatches = []
const fields = new Set()

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8')
  const relative = path.relative(root, file)
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---(?:\n|$)/)
  if (!frontmatter) missingFrontmatter.push(relative)
  else for (const match of frontmatter[1].matchAll(/^([\w-]+):/gm)) fields.add(match[1])
  const isHome = /^home:\s*true\s*$/m.test(frontmatter?.[1] || '') || /^layout:\s*home\s*$/m.test(frontmatter?.[1] || '')
  const body = content.replace(frontmatter?.[0] || '', '')
  const headings = []
  let fence = null
  for (const line of body.split('\n')) {
    const fenceLine = line.match(/^\s*(`{3,}|~{3,})/)
    if (fenceLine) {
      if (!fence) fence = fenceLine[1]
      else if (fenceLine[1][0] === fence[0] && fenceLine[1].length >= fence.length) fence = null
      continue
    }
    if (!fence) {
      const heading = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/)
      if (heading) headings.push({ level: heading[1].length, text: heading[2].trim() })
    }
  }
  if (!isHome && !headings.some(({ level }) => level === 1)) missingHeading.push(relative)
  const levelOneHeadings = headings.filter(({ level }) => level === 1)
  const publishedPage = !relative.startsWith('docs/superpowers/')
  if (publishedPage && levelOneHeadings.length > 1) multipleHeadings.push({ file: relative, headings: levelOneHeadings.map(({ text }) => text) })
  const title = frontmatter?.[1].match(/^title:\s*["']?(.*?)["']?\s*$/m)?.[1]
  if (publishedPage && title && levelOneHeadings[0] && title !== levelOneHeadings[0].text) {
    titleMismatches.push({ file: relative, title, heading: levelOneHeadings[0].text })
  }
}

console.log(`文本审计：${files.length} 个 Markdown 文件`)
console.log(`已有 frontmatter：${files.length - missingFrontmatter.length}，建议补充：${missingFrontmatter.length}`)
console.log(`已有一级标题：${files.length - missingHeading.length}，建议补充：${missingHeading.length}`)
console.log(`重复一级标题：${multipleHeadings.length}`)
console.log(`标题与主标题不一致：${titleMismatches.length}`)
console.log(`当前 frontmatter 字段：${[...fields].sort().join(', ') || '暂无'}`)
if (missingFrontmatter.length) console.log(`首批待整理：\n${missingFrontmatter.slice(0, 20).join('\n')}`)
if (missingHeading.length) console.log(`缺少一级标题：\n${missingHeading.slice(0, 20).join('\n')}`)
if (multipleHeadings.length) console.log(`重复一级标题：\n${multipleHeadings.map(({ file, headings }) => `${file}: ${headings.join(' / ')}`).join('\n')}`)
if (titleMismatches.length) console.log(`标题不一致：\n${titleMismatches.map(({ file, title, heading }) => `${file}: title=${title}; h1=${heading}`).join('\n')}`)
if (strict && (missingFrontmatter.length || missingHeading.length || multipleHeadings.length || titleMismatches.length)) process.exitCode = 1
