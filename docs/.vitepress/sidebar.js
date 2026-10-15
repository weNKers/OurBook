const fs = require('node:fs')
const path = require('node:path')
const directory = require('./university-directory.json')
const docsDir = path.resolve(__dirname, '..')

function pageTitle (route) {
  const source = route.endsWith('/')
    ? path.join(docsDir, route, 'index.md')
    : route === '/'
      ? path.join(docsDir, 'index.md')
      : path.join(docsDir, route.replace(/^\//, '').replace(/\.html$/, '.md'))
  if (!fs.existsSync(source)) return route.split('/').filter(Boolean).at(-1) || '首页'
  const content = fs.readFileSync(source, 'utf8')
  return content.match(/^title:\s*["']?(.*?)["']?\s*$/m)?.[1] || content.match(/^#\s+(.+)$/m)?.[1]?.trim() || path.basename(source, '.md')
}

function item (link, text = pageTitle(link)) { return { text, link } }
function group (text, items, link, docFooterText) { return { text, link, collapsed: false, docFooterText, items } }
function frontmatterValue (source, key) {
  const match = source.match(new RegExp(`^${key}:\\s*(?:"([^"]*)"|'([^']*)'|([^\\n#]+))\\s*$`, 'm'))
  return match?.[1] || match?.[2] || match?.[3]?.trim()
}
function createSchoolSidebar (entry) {
  const route = `/universities/${entry.region}/${entry.city}/${entry.school}/`
  const source = path.join(docsDir, route)
  const articles = fs.readdirSync(source).filter((file) => /^\d+\.md$/.test(file))
    .map((file) => {
      const content = fs.readFileSync(path.join(source, file), 'utf8')
      const number = path.basename(file, '.md')
      return {
        number: Number(number),
        item: item(`${route}${number}.html`, frontmatterValue(content, 'sidebarTitle')),
        section: frontmatterValue(content, 'sidebarGroup')
      }
    }).sort((a, b) => a.number - b.number)

  if (articles.some(({ section }) => section)) {
    const sections = new Map()
    for (const article of articles) {
      const section = article.section || '其他文章'
      sections.set(section, [...(sections.get(section) || []), article.item])
    }
    const navigation = [...sections].map(([title, items]) => group(title, items))
    return [
      item(`/universities/${entry.region}/${entry.city}/`, `← ${entry.cityTitle}目录`),
      group(entry.schoolTitle, navigation, route, pageTitle(route))
    ]
  }

  return [
    item(`/universities/${entry.region}/${entry.city}/`, `← ${entry.cityTitle}目录`),
    group(entry.schoolTitle, articles.map(({ item }) => item), route, pageTitle(route))
  ]
}

module.exports = function createSidebar () {
  const sidebar = {
    '/guide/': [group('引导', ['', 'version', 'contribute'].map((name) => item(name ? `/guide/${name}.html` : '/guide/'))), group('序言', ['preface_0', 'preface_1', 'preface_2'].map((name) => item(`/guide/${name}.html`))), group('志愿', ['0', '1', '2'].map((name) => item(`/guide/${name}.html`))), group('感想', ['a0', 'a1', 'a2', 'a3', 'a4'].map((name) => item(`/guide/${name}.html`)))],
    '/us/': [group('我们', ['', 'song', 'contributors'].map((name) => item(name ? `/us/${name}.html` : '/us/'))), group('足迹', ['file_past', 'preface_past', 'instruction_past'].map((name) => item(`/us/${name}.html`)))],
    '/feedback/': [group('反馈', [item('/feedback/')])],
    '/universities/': [group('大学', [item('/universities/')]), ...directory.regions.map((region) => group(region.title, [...new Map(directory.schools.filter((school) => school.region === region.slug).map((school) => [school.city, school])).values()].map((school) => item(`/universities/${region.slug}/${school.city}/`, school.cityTitle))))]
  }
  for (const region of directory.regions) {
    const route = `/universities/${region.slug}/`
    const cities = [...new Map(directory.schools.filter((school) => school.region === region.slug).map((school) => [school.city, school])).values()]
    sidebar[route] = [
      item('/universities/', '← 大学目录'),
      group(region.title, cities.map((school) => item(`/universities/${region.slug}/${school.city}/`, school.cityTitle)), route, pageTitle(route))
    ]
  }
  for (const entry of directory.schools) {
    const cityRoute = `/universities/${entry.region}/${entry.city}/`
    const regionRoute = `/universities/${entry.region}/`
    const schools = directory.schools.filter((school) => school.region === entry.region && school.city === entry.city)
    sidebar[cityRoute] = [
      item(regionRoute, `← ${entry.regionTitle}目录`),
      group(entry.cityTitle, schools.map((school) => item(`/universities/${entry.region}/${entry.city}/${school.school}/`, school.schoolTitle)), cityRoute, pageTitle(cityRoute))
    ]
    sidebar[`/universities/${entry.region}/${entry.city}/${entry.school}/`] = createSchoolSidebar(entry)
  }
  return sidebar
}
