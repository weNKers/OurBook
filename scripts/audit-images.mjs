import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const docsDir = path.join(root, 'docs')
const publicDir = path.join(docsDir, '.vuepress', 'public')
const checkRemote = process.argv.includes('--remote')
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(dir, entry.name)
  return entry.isDirectory() ? walk(file) : [file]
})

const files = walk(docsDir).filter((file) => file.endsWith('.md'))
const imagePattern = /!\[[^\]]*\]\(([^)\s]+)(?:\s+[^)]*)?\)|<img[^>]+src=["']([^"']+)["']/gi
const referenceImagePattern = /!\[[^\]]*\]\[([^\]]*)\]/gi
const definitionPattern = /^\s*\[([^\]]+)\]:\s*(\S+)/gmi
const refs = new Map()

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8')
  const definitions = new Map([...content.matchAll(definitionPattern)].map((match) => [match[1].trim().toLowerCase(), match[2]]))
  const addRef = (url) => {
    const clean = url.split('#')[0].split('?')[0]
    if (clean) refs.set(clean, [...(refs.get(clean) || []), path.relative(root, file)])
  }
  for (const match of content.matchAll(imagePattern)) {
    addRef(match[1] || match[2])
  }
  for (const match of content.matchAll(referenceImagePattern)) {
    const label = match[1].trim().toLowerCase()
    if (definitions.has(label)) addRef(definitions.get(label))
  }
}

const external = [...refs.keys()].filter((url) => /^(?:https?:)?\/\//i.test(url))
const local = [...refs.keys()].filter((url) => !/^(?:https?:)?\/\//i.test(url))
const missingLocal = local.filter((url) => {
  if (url.startsWith('#') || url.startsWith('data:')) return false
  const clean = url.startsWith('/') ? url.slice(1) : url
  const sources = refs.get(url).map((relative) => path.resolve(root, path.dirname(relative), clean))
  return ![...sources, path.join(publicDir, clean), path.join(docsDir, clean)].some((file) => fs.existsSync(file))
})

console.log(`图片审计：${refs.size} 个唯一引用，${local.length} 个本地，${external.length} 个外链`)
if (missingLocal.length) {
  console.log(`缺失本地图片：${missingLocal.length}`)
  for (const url of missingLocal.slice(0, 100)) console.log(`LOCAL_MISSING ${url} <- ${refs.get(url).slice(0, 3).join(', ')}`)
}

if (!checkRemote || external.length === 0) {
  console.log(checkRemote ? '没有外链图片需要检查。' : '未执行远程检查；使用 npm run audit:images:remote 执行。')
  process.exitCode = missingLocal.length ? 1 : 0
} else {
  const failures = []
  let cursor = 0
  const worker = async () => {
    while (cursor < external.length) {
      const url = external[cursor++]
      const target = url.startsWith('//') ? `https:${url}` : url
      try {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), 10000)
        const response = await fetch(target, {
          method: 'GET',
          headers: { Range: 'bytes=0-0', Accept: 'image/*,*/*;q=0.8' },
          redirect: 'follow',
          signal: controller.signal
        })
        clearTimeout(timer)
        if (!response.ok) failures.push({ url: target, status: response.status, files: refs.get(url) })
      } catch (error) {
        failures.push({ url: target, status: error.name === 'AbortError' ? 'TIMEOUT' : 'ERROR', files: refs.get(url) })
      }
    }
  }
  await Promise.all(Array.from({ length: 8 }, worker))
  console.log(`远程检查完成：${external.length - failures.length} 个通过，${failures.length} 个失败或超时`)
  for (const failure of failures) console.log(`REMOTE_${failure.status} ${failure.url} <- ${failure.files.slice(0, 3).join(', ')}`)
  process.exitCode = missingLocal.length || failures.length ? 1 : 0
}
