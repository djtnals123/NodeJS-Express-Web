var init = async function(app, config){

    var database = require('./container/db-container');
    await database.init(app);
    require('./container/service-container').init();
}

module.exports = init;