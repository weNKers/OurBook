import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const docsDir = path.join(root, 'docs')
const apply = process.argv.includes('--apply')
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(dir, entry.name)
  return entry.isDirectory() ? walk(file) : [file]
})
const files = walk(docsDir).filter((file) => file.endsWith('.md'))
const pattern = /!\[([^\]]*)\]\((https:\/\/upload\.wikimedia\.org\/[^)\s]+)\)/g
const refs = new Map()
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8')
  for (const match of content.matchAll(pattern)) refs.set(match[2], { alt: match[1], files: [...(refs.get(match[2])?.files || []), file] })
}

const dead = new Map()
let cursor = 0
const urls = [...refs.keys()]
const worker = async () => {
  while (cursor < urls.length) {
    const url = urls[cursor++]
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 10000)
      const response = await fetch(url, { headers: { 'User-Agent': 'OurBook-image-audit/1.0' }, redirect: 'follow', signal: controller.signal })
      clearTimeout(timer)
      if (response.status === 400 || response.status === 404) dead.set(url, response.status)
    } catch {}
  }
}
await Promise.all(Array.from({ length: 2 }, worker))
console.log(`确认失效 Wikimedia 图片：${dead.size}/${urls.length}`)
for (const [url, status] of dead) console.log(`${status} ${url}`)

if (apply && dead.size) {
  for (const file of files) {
    const before = fs.readFileSync(file, 'utf8')
    const after = before.replace(/!\[([^\]]*)\]\((https:\/\/upload\.wikimedia\.org\/[^)\s]+)\)/g, (full, alt, url) => {
      if (!dead.has(url)) return full
      const label = alt || '原图片'
      return `<span class="image-unavailable" role="img" aria-label="图片暂缺：${label}">图片暂缺：${label}</span>\n<!-- 原图片已失效，来源记录保留在 Git 历史。 -->`
    })
    const cleaned = after.replace(/<!-- 原图片地址：https:\/\/upload\.wikimedia\.org\/[^>]+ -->/g, '<!-- 原图片已失效，来源记录保留在 Git 历史。 -->')
    if (cleaned !== before) fs.writeFileSync(file, cleaned)
  }
  console.log('已将确认失效图片替换为可访问的占位文本。')
} else if (!apply) console.log('预览模式：追加 --apply 才会写入。')
