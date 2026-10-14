import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputDir = path.join(root, 'dist')
const hostname = 'https://www.wenkers.cn'

function collectHtml (directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) return collectHtml(target)
    if (entry.isFile() && entry.name.endsWith('.html')) return [target]
    return []
  })
}

function routeFor (file) {
  const relative = path.relative(outputDir, file).split(path.sep).join('/')
  if (relative === '404.html') return null
  if (relative === 'index.html') return '/'
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'index.html'.length)}`
  return `/${relative}`
}

const routes = collectHtml(outputDir)
  .map(routeFor)
  .filter((route) => route && !route.startsWith('/feedback/'))
  .sort()

const escapeXml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const urls = routes.map((route) => `  <url><loc>${escapeXml(new URL(route, `${hostname}/`).href)}</loc></url>`)
fs.writeFileSync(
  path.join(outputDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
)
fs.writeFileSync(
  path.join(outputDir, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${hostname}/sitemap.xml\n`
)
