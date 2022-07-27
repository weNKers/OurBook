var fs = require('fs');
var path = require('path');

var mkdir = require('../lib/mkdir');

var univ = require('../constants/univ');

var docs = path.resolve(__dirname, '../docs/');

function search(dir, callback) {
  fs.readdirSync(dir).forEach(function (file) {
    var pathname = path.join(dir, file);
    callback(pathname);
  });
}

var emptyTemplate = (title) =>
`
# ${title}

页面正在迁移中，还请等待迁移完成后查看。

![404](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527103067269&di=598d5e023065cd6f7e8116da743f3ccb&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F015c4357764df30000012e7e576eae.jpg%401280w_1l_2o_100sh.jpg)

`;

for(var key in univ) {
  var dirpath = `${docs}/${key}`;
  if (!fs.existsSync(dirpath)) {
    fs.mkdirSync(dirpath);
    fs.writeFileSync(`${dirpath}/README.md`, emptyTemplate(univ[key]));
  } else {
    var filepath = `${dirpath}/README.md`;
    if(!fs.existsSync(filepath)) {
      fs.writeFileSync(filepath, emptyTemplate(univ[key]));
    }
  }
}
