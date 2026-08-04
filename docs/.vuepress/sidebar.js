var area = require('./area');
var univ = require('./univ');

const genSidebar = () => {
  const sidebar = {
    '/guide/': [{
      title: '引导',
      collapsable: false,
      children: [
        '',
        'version',
        'contribute',
        'content-schema',
        'content-migration-plan'
      ]
    }, {
      title: '序言',
      collapsable: false,
      children: [
        'preface_0',
        'preface_1',
        'preface_2'
      ]
    }, {
      title: '志愿',
      collapsable: false,
      children: [
        '0',
        '1',
        '2'
      ]
    }, {
      title: '感想',
      collapsable: false,
      children: [
        'a0',
        'a1',
        'a2',
        'a3',
        'a4'
      ]
    }],
    '/university/': [{
      title: '大学',
      collapsable: false,
      children: [
        '',
      ]
    }, ...area],
    '/us/': [{
      title: '我们',
      collapsable: false,
      children: [
        '',
        'song',
        'contributors'
      ]
    }, {
      title: '足迹',
      collapsable: false,
      children: [
        'file_past',
        'preface_past',
        'instruction_past'
      ]
    }],
    '/feedback/': [{
      title: '反馈',
      collapsable: false,
      children: ['']
    }],
    ...univ
  };

  // VuePress 2 renamed these default-theme fields.
  const migrate = (item) => {
    if (Array.isArray(item)) return item.map(migrate)
    if (!item || typeof item !== 'object') return item
    const next = { ...item }
    if (next.title !== undefined) {
      next.text = next.title
      delete next.title
    }
    if (next.collapsable !== undefined) {
      next.collapsible = next.collapsable
      delete next.collapsable
    }
    if (next.children) next.children = migrate(next.children)
    return next
  }

  return migrate(sidebar)
}

module.exports = genSidebar;
