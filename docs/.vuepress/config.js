var genSidebar = require('./sidebar');
var path = require('path');

module.exports = {
  dest: 'dist',
  base: '/',
  locales: {
    '/': {
      title: '我们眼中的大学',
      description: '从高中毕业开始，关于未来的书'
    }
  },
  head: [
    ['link', { rel: 'icon', href: `/logo.png` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#700f80' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png` }],
    ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#700f80' }],
    ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }],
    ['meta', { name: 'site', content: 'https://www.wenkers.cn' }]
  ],
  evergreen: true,
  serviceWorker: true,
  // theme: 'vue',
  ga: 'UA-119932255-2',
  configureWebpack: {
    resolve: {
      alias: {
        'constants': path.resolve(__dirname, '../../constants')
      }
    }
  },
  themeConfig: {
    repo: 'https://github.com/weNKers/OurBook',
    editLinks: true,
    docsDir: 'docs',
    docsBranch: 'master',
    lastUpdated: '最后更新时间',
    search: true,
    searchMaxSuggestions: 15,
    // algolia: {
    //   appId: '80O6AKDU0C',
    //   apiKey: '0ecf2c0c8a4869541fc8002301d2dc4e',
    //   indexName: 'prod_ourbook'
    // },
    locales: {
      '/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '帮助我们改善此页面！',
        lastUpdated: '上次更新',
        nav: [
          {
            text: '指南',
            link: '/guide/',
          },
          {
            text: '大学',
            link: '/university/'
          },
          {
            text: '我们',
            link: '/us/'
          },
          {
            text: '反馈',
            link: '/feedback/'
          }
        ],
        sidebar: genSidebar()
      }
    }
  }
}