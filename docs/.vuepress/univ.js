var path = require('path');
var univs = require('../../constants/univ');
var travel = require('../../lib/travel');

var docs = path.resolve(__dirname, '..');

var target = {};

travel(docs, (v) => {
  for(var key in univs) {
    var regKey = `/${key}/`;
    if(new RegExp(regKey).test(v)) {
      var file = v.replace(new RegExp(`.+${key}/`), '').replace('.md', '');
      file = file === 'README' ? '' : file;
      if(!/^\d+$/.test(file) && file !== '') {
        return;
      }
      if(!target[regKey]) {
        target[regKey] = [{
          title: univs[key],
          collapsable: false,
          children: [file]
        }];
      } else {
        target[regKey][0].children.push(file);
      }
    }
  }
});

for(var key in target) {
  target[key][0].children = target[key][0].children.sort((a, b) => a - b);
}
// console.log(JSON.stringify(target['/cufe/']));

module.exports = target;