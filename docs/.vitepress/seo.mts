import type { HeadConfig } from 'vitepress'

const hostname = 'https://www.wenkers.cn'
const siteName = '我们眼中的大学'
const fallbackImage = `${hostname}/hero.jpg`

function pageUrl (page: string) {
  const route = page
    .replace(/(^|\/)index\.md$/, '$1')
    .replace(/\.md$/, '.html')
  return new URL(route ? `/${route}` : '/', `${hostname}/`).href
}

export function createPageSeo (page: string, title: string, description: string): HeadConfig[] {
  const url = pageUrl(page)
  const isHome = page === 'index.md'
  const schema = {
    '@context': 'https://schema.org',
    '@type': isHome ? 'WebSite' : 'Article',
    name: title,
    ...(isHome ? {} : { headline: title }),
    description,
    url,
    image: [fallbackImage],
    author: { '@type': 'Organization', name: siteName }
  }

  return [
    ['link', { rel: 'canonical', href: url }],
    ['meta', { property: 'og:url', content: url }],
    ['meta', { property: 'og:site_name', content: siteName }],
    ['meta', { property: 'og:type', content: isHome ? 'website' : 'article' }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:image', content: fallbackImage }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['script', { type: 'application/ld+json' }, JSON.stringify(schema)]
  ]
}
