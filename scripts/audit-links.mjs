import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const docsRoot = path.join(root, 'docs')
const strict = process.argv.includes('--strict')
const markdownFiles = []

function collect (directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) collect(target)
    else if (entry.isFile() && entry.name.endsWith('.md')) markdownFiles.push(target)
  }
}

function resolveCandidates (sourceFile, target) {
  const cleanTarget = target.split('#')[0].split('?')[0]
  if (!cleanTarget) return []

  const sourceDir = path.dirname(sourceFile)
  const relative = cleanTarget.startsWith('/')
    ? path.join(docsRoot, cleanTarget.slice(1))
    : path.resolve(sourceDir, cleanTarget)

  if (path.extname(relative)) return [relative]
  return [relative, `${relative}.md`, path.join(relative, 'README.md')]
}

function isInternal (target) {
  return !/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(target) && !target.startsWith('#')
}

collect(docsRoot)
const broken = []
const markdownLink = /!?\[[^\]]*\]\(([^)\s]+)(?:\s+[^)]*)?\)/g

for (const file of markdownFiles) {
  const source = fs.readFileSync(file, 'utf8')
  for (const match of source.matchAll(markdownLink)) {
    const target = match[1]
    if (!isInternal(target)) continue

    if (!resolveCandidates(file, target).some((candidate) => fs.existsSync(candidate))) {
      broken.push({ file: path.relative(root, file), target })
    }
  }
}

console.log(`链接审计：扫描 ${markdownFiles.length} 个 Markdown 文件`)
console.log(`内部链接：${broken.length === 0 ? '全部可解析' : `发现 ${broken.length} 个疑似失效链接`}`)

for (const item of broken.slice(0, 100)) {
  console.log(`- ${item.file}: ${item.target}`)
}
if (broken.length > 100) console.log(`- 其余 ${broken.length - 100} 个链接省略`)
if (strict && broken.length > 0) process.exitCode = 1
