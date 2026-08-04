import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const docsDir = path.join(root, 'docs')
const publicDir = path.join(docsDir, '.vuepress', 'public')
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(dir, entry.name)
  return entry.isDirectory() ? walk(file) : [file]
})

const markdownFiles = walk(docsDir).filter((file) => file.endsWith('.md'))
const missing = []
const pattern = /!\[[^\]]*\]\(([^)\s]+)(?:\s+[^)]*)?\)|<img[^>]+src=["']([^"']+)["']/gi

for (const file of markdownFiles) {
  const content = fs.readFileSync(file, 'utf8')
  for (const match of content.matchAll(pattern)) {
    const target = match[1] || match[2]
    if (!target || /^(?:https?:|mailto:|data:|#|\/\/)/i.test(target)) continue
    const clean = target.split('#')[0].split('?')[0]
    if (!clean || !/\.(?:avif|gif|jpe?g|png|svg|webp|ico|pdf|mp4|webm|mp3|zip|csv)$/i.test(clean)) continue
    const candidates = clean.startsWith('/')
      ? [path.join(publicDir, clean.slice(1)), path.join(docsDir, clean.slice(1))]
      : [path.resolve(path.dirname(file), clean), path.join(publicDir, clean)]
    if (!candidates.some((candidate) => fs.existsSync(candidate))) missing.push(`${path.relative(root, file)} -> ${target}`)
  }
}

const external = markdownFiles.reduce((count, file) => {
  const content = fs.readFileSync(file, 'utf8')
  return count + (content.match(/(?:https?:)?\/\/[^\s)>'"]+/g) || []).length
}, 0)

console.log(`资源审计：${markdownFiles.length} 个 Markdown 文件，${external} 个外部资源/链接`)
if (missing.length) {
  console.error(`发现 ${missing.length} 个疑似缺失的本地资源：`)
  console.error(missing.slice(0, 100).join('\n'))
  if (missing.length > 100) console.error(`…其余 ${missing.length - 100} 个未展开`)
  process.exitCode = 1
} else console.log('本地图片、媒体和下载资源引用检查通过。')
