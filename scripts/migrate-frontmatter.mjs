import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const batch = process.argv[2]
const apply = process.argv.includes('--apply')
const batches = {
  'university-regions': path.join(root, 'docs', 'university'),
  guide: path.join(root, 'docs', 'guide'),
  us: path.join(root, 'docs', 'us'),
  all: path.join(root, 'docs')
}
if (!batches[batch]) {
  console.error(`用法：node scripts/migrate-frontmatter.mjs <${Object.keys(batches).join('|')}> [--apply]`)
  process.exit(1)
}

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(dir, entry.name)
  return entry.isDirectory() ? walk(file) : [file]
})
const files = walk(batches[batch]).filter((file) => file.endsWith('.md'))
const quote = (value) => String(value).replaceAll('"', '\\"')
const changes = []

for (const file of files) {
  const before = fs.readFileSync(file, 'utf8')
  if (/^---\n[\s\S]*?\n---(?:\n|$)/.test(before)) continue
  const relative = path.relative(root, file).replaceAll(path.sep, '/')
  const isUniversityHome = relative === 'docs/university/README.md'
  const isRegionIndex = relative.startsWith('docs/university/') && relative.split('/').length === 3
  const title = isUniversityHome
    ? '大学地区索引'
    : before.match(/^#\s+(.+)$/m)?.[1]?.trim() || path.basename(file, '.md')
  const type = isRegionIndex
    ? 'university-index'
    : relative.startsWith('docs/guide/')
      ? 'guide'
      : relative.startsWith('docs/us/')
        ? 'about'
        : 'university-article'
  const description = isUniversityHome
    ? '按地区浏览我们收录的大学信息。'
    : isRegionIndex
      ? `${title}地区高校信息索引。`
      : `${title}相关内容。`
  const frontmatter = `---\ntitle: "${quote(title)}"\ndescription: "${quote(description)}"\ncontentType: ${type}\nkeywords:\n  - "${quote(title)}"\n---\n\n`
  changes.push({ file, before, after: frontmatter + before })
}

console.log(`frontmatter 批次 ${batch}：计划处理 ${changes.length}/${files.length} 个文件`)
for (const change of changes) console.log(`- ${path.relative(root, change.file)}`)
if (apply) {
  for (const change of changes) fs.writeFileSync(change.file, change.after)
  console.log('已写入。')
} else console.log('预览模式：追加 --apply 才会写入文件。')
