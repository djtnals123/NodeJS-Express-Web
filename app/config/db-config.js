module.exports = {
    server_port:3000,
    db_url:'mongodb://localhost:27017/sumin',
    db_schemas: [
        {
            file:'../models/account-schema', 
            collection: 'account', 
            schemaName: 'AccountSchema',
            modelName: 'AccountModel'
        },
        {
            file:'../models/board-schema', 
            collection: 'board', 
            schemaName: 'BoardSchema',
            modelName: 'BoardModel'
        }
    ]
}
