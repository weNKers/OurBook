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
const pattern = /https:\/\/upload\.wikimedia\.org\/wikipedia\/(commons|zh)\/([^\s)>'"]+)/g
const urls = new Set()
for (const file of files) for (const match of fs.readFileSync(file, 'utf8').matchAll(pattern)) urls.add(match[0])

const candidateFor = (url) => {
  const parsed = new URL(url)
  const parts = parsed.pathname.split('/').filter(Boolean)
  const area = parts[1]
  const isThumb = parts[2] === 'thumb'
  const fileName = isThumb ? parts.at(-2) : parts.at(-1)
  if (!fileName) return null
  const sourceHost = area === 'commons' ? 'commons.wikimedia.org' : 'zh.wikipedia.org'
  const cleanName = decodeURIComponent(fileName).replace(/^\d+px-/, '')
  return `https://${sourceHost}/wiki/Special:FilePath/${encodeURIComponent(cleanName)}?width=200`
}

const replacements = new Map()
let cursor = 0
const targets = [...urls]
const worker = async () => {
  while (cursor < targets.length) {
    const source = targets[cursor++]
    const target = candidateFor(source)
    if (!target) continue
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 12000)
      const response = await fetch(target, { redirect: 'follow', headers: { 'User-Agent': 'OurBook-image-audit/1.0' }, signal: controller.signal })
      clearTimeout(timer)
      if (response.ok && response.headers.get('content-type')?.startsWith('image/')) replacements.set(source, target)
      else console.log(`保留 ${response.status}: ${source}`)
    } catch (error) {
      console.log(`跳过 ${error.name === 'AbortError' ? 'TIMEOUT' : 'ERROR'}: ${source}`)
    }
  }
}
await Promise.all(Array.from({ length: 2 }, worker))
console.log(`Wikimedia 可稳定替换：${replacements.size}/${targets.length}`)

if (apply && replacements.size) {
  for (const file of files) {
    const before = fs.readFileSync(file, 'utf8')
    const after = before.replace(/https:\/\/upload\.wikimedia\.org\/wikipedia\/(?:commons|zh)\/[^\s)>'"]+/g, (url) => replacements.get(url) || url)
    if (after !== before) fs.writeFileSync(file, after)
  }
  console.log('已写回 Markdown 图片引用。')
} else if (!apply) {
  console.log('预览模式：使用 npm run normalize:images -- --apply 写回替换结果。')
}
