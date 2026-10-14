const fs = require('node:fs')
const path = require('node:path')
const area = require('./area')
const univs = require('../../constants/univ')

const docsDir = path.resolve(__dirname, '..')

function pageTitle (route) {
  const source = route.endsWith('/')
    ? path.join(docsDir, route, 'index.md')
    : route === '/'
      ? path.join(docsDir, 'index.md')
      : path.join(docsDir, `${route.replace(/^\//, '')}.md`)
  if (!fs.existsSync(source)) return route.split('/').filter(Boolean).at(-1) || '首页'

  const content = fs.readFileSync(source, 'utf8')
  const frontmatterTitle = content.match(/^title:\s*["']?(.*?)["']?\s*$/m)?.[1]
  return frontmatterTitle || content.match(/^#\s+(.+)$/m)?.[1]?.trim() || path.basename(source, '.md')
}

function pageItem (base, target = '') {
  const link = target ? `${base}${target}` : base
  return { text: pageTitle(link), link }
}

function group (text, items) {
  return { text, collapsed: false, items }
}

function createSchoolSidebar (key) {
  const base = `/${key}/`
  const articles = fs.readdirSync(path.join(docsDir, key))
    .filter((file) => /^\d+\.md$/.test(file))
    .map((file) => path.basename(file, '.md'))
    .sort((left, right) => Number(left) - Number(right))

  return [group(univs[key], [pageItem(base), ...articles.map((article) => pageItem(base, article))])]
}

module.exports = function createSidebar () {
  const guidePage = (name = '') => pageItem('/guide/', name)
  const usPage = (name = '') => pageItem('/us/', name)
  const universityPage = (name = '') => pageItem('/university/', name)
  const sidebar = {
    '/guide/': [
      group('引导', ['', 'version', 'contribute', 'content-schema', 'content-migration-plan'].map(guidePage)),
      group('序言', ['preface_0', 'preface_1', 'preface_2'].map(guidePage)),
      group('志愿', ['0', '1', '2'].map(guidePage)),
      group('感想', ['a0', 'a1', 'a2', 'a3', 'a4'].map(guidePage))
    ],
    '/university/': [
      group('大学', [universityPage()]),
      ...area.map(({ title, children }) => group(title, children.map((name) => universityPage(name))))
    ],
    '/us/': [
      group('我们', ['', 'song', 'contributors'].map(usPage)),
      group('足迹', ['file_past', 'preface_past', 'instruction_past'].map(usPage))
    ],
    '/feedback/': [group('反馈', [pageItem('/feedback/')])]
  }

  for (const key of Object.keys(univs)) sidebar[`/${key}/`] = createSchoolSidebar(key)
  return sidebar
}
