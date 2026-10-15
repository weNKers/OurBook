import { defineConfig } from 'vitepress'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { createPageSeo } from './seo.mts'

const require = createRequire(import.meta.url)
const sidebar = require('./sidebar.js')
const editBranch = process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || (() => {
  try {
    return execFileSync('git', ['branch', '--show-current'], { encoding: 'utf8' }).trim() || 'master'
  } catch {
    return 'master'
  }
})()

export default defineConfig({
  lang: 'zh-CN',
  title: '我们眼中的大学',
  description: '从高中毕业开始，关于未来的书',
  base: '/',
  outDir: '../dist',
  lastUpdated: true,
  srcExclude: ['**/superpowers/**'],
  transformHead: ({ page, title, description }) => createPageSeo(page, title, description),
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '大学', link: '/universities/' },
      { text: '我们', link: '/us/' },
      { text: '反馈', link: '/feedback/' }
    ],
    sidebar: sidebar(),
    editLink: {
      pattern: `https://github.com/weNKers/OurBook/edit/${editBranch}/docs/:path`,
      text: '在 GitHub 上编辑此页'
    },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '上次更新' },
    outline: { label: '目录' },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索学校、专业、学院、关键词', buttonAriaLabel: '搜索' },
          modal: {
            displayDetails: '显示详细列表',
            resetButtonTitle: '清空搜索',
            backButtonTitle: '关闭搜索',
            noResultsText: '没有结果',
            footer: {
              selectText: '选择',
              selectKeyAriaLabel: '回车',
              navigateText: '导航',
              navigateUpKeyAriaLabel: '上箭头',
              navigateDownKeyAriaLabel: '下箭头',
              closeText: '关闭',
              closeKeyAriaLabel: '退出'
            }
          }
        },
        _render: (source, env, markdown) => {
          const html = markdown.render(source, env)
          const route = env.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '.html')
          const frontmatter = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] || ''
          const searchableMetadata = `${frontmatter} ${route}`
          return `${html}\n<p>${markdown.utils.escapeHtml(searchableMetadata)}</p>`
        }
      }
    }
  }
})
