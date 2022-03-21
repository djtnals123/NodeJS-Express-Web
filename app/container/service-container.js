services = {}

services.init = function(){
    config = require('../config/service-config');
    config.forEach(function(item){
        service = require(item.file);
        services[item.service] = new service();
        console.log("서비스 등록: [" + item.service + "] " + item.file);
    });
}

module.exports = services;