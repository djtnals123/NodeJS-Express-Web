
var config = require('../config/db-config');
var mongoose = require('mongoose');
var database = {};

database.init = async function(app){
    await connect();
    createSchema(app);
}


async function connect(){
    mongoose.Promise = global.Promise;
    await mongoose.connect(config.db_url);
    database.db = mongoose.connection;
    console.log('db 연결: ' + config.db_url);
    database.db.on('disconnected', function(){
        console.log('db 연결끊김');
    });
    database.db.on('error', console.error.bind(console, 'mongose 연결 에러'));
}

function createSchema(app) {

    for(var i = 0; i < config.db_schemas.length; i++){
        var curItem = config.db_schemas[i];
        var curSchema = require(curItem.file).createSchema(mongoose);
        var curModel = mongoose.model(curItem.collection, curSchema);
        database[curItem.schemaName] = curSchema;
        database[curItem.modelName] = curModel;
        console.log(`모델 등록: [이름: ${curItem.modelName}, 컬렉션: ${curItem.collection}]` );
    }

    app.set('database', database);
}

module.exports = database;