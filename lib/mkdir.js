var fs = require('fs');
var path = require('path');

module.exports = function mkdir(dirpath,dirname) {
    //判断第二个参数可以不传入
    //判断第二个参数是否正常，避免调用时传入错误参数  
    if (dirname !== path.dirname(dirpath)) {
        mkdir(dirpath);
        return;
    }
    if (fs.existsSync(dirname)) {
        fs.mkdirSync(dirpath)
    } else {
        mkdir(dirname, path.dirname(dirname));
        fs.mkdirSync(dirpath);
    }
}