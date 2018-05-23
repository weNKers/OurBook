var path = require('path');
var fs = require('fs');
var univs = require('./univs');

var docs = path.resolve(__dirname, '..');

function travel(dir, callback) {
  fs.readdirSync(dir).forEach(function (file) {
      var pathname = path.join(dir, file);

      if (fs.statSync(pathname).isDirectory()) {
          travel(pathname, callback);
      } else {
          callback(pathname);
      }
  });
}

var target = {};

travel(docs, (v) => {
  for(var key in univs) {
    var regKey = `/${key}/`;
    if(new RegExp(regKey).test(v)) {
      var file = v.replace(new RegExp(`.+${key}/`), '').replace('.md', '');
      file = file === 'README' ? '' : file;
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
console.log(JSON.stringify(target));

module.exports = target;