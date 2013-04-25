var g = {
    mongoClient: null,
    tasksCollection: null
}

exports.init = function(done){
    initMongo(done);
}

/*gets a task by _id */
exports.getById = function(_id, done){
    var query = { _id : new mongo.ObjectID(_id)};
    var filter = { _id: 1,prototype_id: 1, name: 1, description: 1, start_screen_id: 1, end_screen_id: 1, analytics: 1}
    g.tasksCollection.findOne(query, filter, done);
}

/*gets all the tasks for a given prototype */
exports.getByPrototype  = function(prototype_id, done){
    var query = { prototype_id : new mongo.ObjectID(_id)};
    var filter = { _id: 1,prototype_id: 1, name: 1, description: 1, start_screen_id: 1, end_screen_id: 1, analytics: 1}
    g.tasksCollection.find(query, filter).toArray(done);
}



//===========================
//  MONGO INIT
//===========================

var mongo = require('mongodb');

var mongoConfig = {
    host: global.mongoConfig.host,
    port: global.mongoConfig.port,
    dbName: global.mongoConfig.dbName,
    collectionName: 'tasks'
};

function initMongo(done){

    var host = mongoConfig.host;
    var port = mongoConfig.port;

    var optionsWithEnableWriteAccess = { w: 1 };

    g.mongoClient = new mongo.Db(
        mongoConfig.dbName,
        new mongo.Server(host, port),
        optionsWithEnableWriteAccess
    );

    openCollection(mongoConfig.collectionName, done);
}

function openCollection(collectionName, done){
    g.mongoClient.open(onDbReady);

    function onDbReady(error){
        if (error)
            done(error)

        g.mongoClient.collection(collectionName, onCollectionReady);
    }

    function onCollectionReady(error, collection){
        if (error)
            done(error)

        g.tasksCollection = collection;

        done();
    }
}