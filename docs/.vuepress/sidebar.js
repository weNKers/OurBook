var area = require('./area');
var univ = require('./univ');

const genSidebar = () => {
  return {
    '/guide/': [{
      title: '引导',
      collapsable: false,
      children: [
        '',
        'version',
        'contribute'
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
        'preface_past',
        'instruction_past'
      ]
    }],
    ...univ
  };
}

module.exports = genSidebar;