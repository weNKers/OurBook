import { createRequire } from 'node:module'
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default'
import { slimsearchPlugin } from '@vuepress/plugin-slimsearch'
import { seoPlugin } from '@vuepress/plugin-seo'
import { sitemapPlugin } from '@vuepress/plugin-sitemap'

const require = createRequire(import.meta.url)
const genSidebar = require('./sidebar.js')

export default defineUserConfig({
  lang: 'zh-CN',
  title: '我们眼中的大学',
  description: '从高中毕业开始，关于未来的书',
  base: '/',
  dest: 'dist',
  shouldPrefetch: false,
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#700f80' }],
    ['meta', { name: 'site', content: 'https://www.wenkers.cn' }]
  ],
  bundler: viteBundler(),
  plugins: [
    slimsearchPlugin({
      indexContent: true,
      sortStrategy: 'total',
      searchDelay: 150,
      hotKeys: [{ key: 's' }, { key: '/' }],
      locales: {
        '/': { placeholder: '搜索学校、专业、学院、关键词' }
      },
      customFields: [
        {
          name: 'description',
          getter: (page) => page.frontmatter?.description,
          formatter: '描述：$content'
        },
        {
          name: 'keywords',
          getter: (page) => page.frontmatter?.keywords,
          formatter: '关键词：$content'
        },
        {
          name: 'contentType',
          getter: (page) => page.frontmatter?.contentType,
          formatter: '类型：$content'
        },
        {
          name: 'path',
          getter: (page) => page.filePathRelative,
          formatter: '路径：$content'
        }
      ]
    }),
    seoPlugin({
      hostname: 'https://www.wenkers.cn',
      author: '我们眼中的大学',
      autoDescription: true,
      fallBackImage: 'https://www.wenkers.cn/hero.jpg'
    }),
    sitemapPlugin({
      hostname: 'https://www.wenkers.cn',
      changefreq: 'monthly',
      excludePaths: ['/feedback/']
    })
  ],
  theme: defaultTheme({
    repo: 'https://github.com/weNKers/OurBook',
    logo: '/logo.png',
    navbar: [
      { text: '指南', link: '/guide/' },
      { text: '大学', link: '/university/' },
      { text: '我们', link: '/us/' },
      { text: '反馈', link: '/feedback/' }
    ],
    editLink: true,
    docsDir: 'docs',
    docsBranch: 'master',
    lastUpdated: true,
    locales: {
      '/': {
        selectLanguageName: '简体中文',
        editLinkText: '帮助我们改善此页面！',
        lastUpdatedText: '上次更新',
        sidebar: genSidebar()
      }
    }
  })
})
