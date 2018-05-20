module.exports = {
  dest: 'ourbook',
  base: '/OurBook/',
  locales: {
    '/': {
      title: '我们眼中的大学',
      description: '从高中毕业开始，关于过去、现在、与未来的书'
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
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  serviceWorker: true,
  // theme: 'vue',
  themeConfig: {
    repo: 'https://github.com/weNKers/OurBook.git',
    editLinks: true,
    docsDir: 'docs',
    docsBranch: 'master',
    locales: {
      '/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
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
        sidebar: {
          '/guide/': [{
            title: '指南',
            collapsable: false,
            children: [
              '',
              'preface_1',
              'preface_2',
              'instruction'
            ]
          }],
          '/university/': [{
            title: '大学',
            collapsable: false,
            children: [
              '',
              'huabei'
            ]
          }],
          '/us/': [{
            title: '我们',
            collapsable: false,
            children: [
              '',
              'contributors'
            ]
          }]
        },
      }
    }
  }
}