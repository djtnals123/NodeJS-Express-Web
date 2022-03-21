var routLoader = {};
var config = require('../config/route-config');

routLoader.init = function(app) {
    for(const item of config){
        app.use(item.path, require(item.file));
        console.log('루트 등록: [' + item.path + '] ' + item.file);   
    }
}

module.exports = routLoader;