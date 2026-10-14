const fs = require('node:fs')
const path = require('node:path')
const directory = require('./university-directory.json')
const docsDir = path.resolve(__dirname, '..')

function pageTitle (route) {
  const source = route.endsWith('/')
    ? path.join(docsDir, route, 'index.md')
    : route === '/'
      ? path.join(docsDir, 'index.md')
      : path.join(docsDir, `${route.replace(/^\//, '')}.md`)
  if (!fs.existsSync(source)) return route.split('/').filter(Boolean).at(-1) || '首页'
  const content = fs.readFileSync(source, 'utf8')
  return content.match(/^title:\s*["']?(.*?)["']?\s*$/m)?.[1] || content.match(/^#\s+(.+)$/m)?.[1]?.trim() || path.basename(source, '.md')
}

function item (link, text = pageTitle(link)) { return { text, link } }
function group (text, items) { return { text, collapsed: false, items } }
function createSchoolSidebar (entry) {
  const route = `/universities/${entry.region}/${entry.city}/${entry.school}/`
  const source = path.join(docsDir, route)
  const articles = fs.readdirSync(source).filter((file) => /^\d+\.md$/.test(file))
    .map((file) => path.basename(file, '.md')).sort((a, b) => Number(a) - Number(b))
  return [group(entry.schoolTitle, [item(`/universities/${entry.region}/${entry.city}/`, `${entry.cityTitle}目录`), item(route), ...articles.map((number) => item(`${route}${number}.html`))])]
}

module.exports = function createSidebar () {
  const sidebar = {
    '/guide/': [group('引导', ['', 'version', 'contribute', 'content-schema', 'content-migration-plan'].map((name) => item(name ? `/guide/${name}.html` : '/guide/'))), group('序言', ['preface_0', 'preface_1', 'preface_2'].map((name) => item(`/guide/${name}.html`))), group('志愿', ['0', '1', '2'].map((name) => item(`/guide/${name}.html`))), group('感想', ['a0', 'a1', 'a2', 'a3', 'a4'].map((name) => item(`/guide/${name}.html`)))],
    '/us/': [group('我们', ['', 'song', 'contributors'].map((name) => item(name ? `/us/${name}.html` : '/us/'))), group('足迹', ['file_past', 'preface_past', 'instruction_past'].map((name) => item(`/us/${name}.html`)))],
    '/feedback/': [group('反馈', [item('/feedback/')])],
    '/universities/': [group('大学', [item('/universities/')]), ...directory.regions.map((region) => group(region.title, [...new Map(directory.schools.filter((school) => school.region === region.slug).map((school) => [school.city, school])).values()].map((school) => item(`/universities/${region.slug}/${school.city}/`, school.cityTitle))))]
  }
  for (const region of directory.regions) sidebar[`/universities/${region.slug}/`] = [group(region.title, [item('/universities/'), ...[...new Map(directory.schools.filter((school) => school.region === region.slug).map((school) => [school.city, school])).values()].map((school) => item(`/universities/${region.slug}/${school.city}/`, school.cityTitle))])]
  for (const entry of directory.schools) {
    const cityRoute = `/universities/${entry.region}/${entry.city}/`
    sidebar[cityRoute] = [group(entry.cityTitle, [item(`/universities/${entry.region}/`, `${entry.regionTitle}目录`), ...directory.schools.filter((school) => school.region === entry.region && school.city === entry.city).map((school) => item(`/universities/${entry.region}/${entry.city}/${school.school}/`, school.schoolTitle))])]
    sidebar[`/universities/${entry.region}/${entry.city}/${entry.school}/`] = createSchoolSidebar(entry)
  }
  return sidebar
}
