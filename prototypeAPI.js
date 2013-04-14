var g = {
    mongoClient: null,
    prototypesCollection: null
}

exports.init = function(done){
    initMongo(done);
}

exports.getAll = function(username, done){
    g.prototypesCollection.find({ username: username }, { content: 1, _id: 1 }).toArray(done);
}

exports.get = function(_id, done){
    var query = { _id : new mongo.ObjectID(_id)};
    g.prototypesCollection.findOne(query, { a: 1, b:1,c:1, _id: 1 }, done);
}

exports.create = function(username, content, done){
    g.prototypesCollection.insert(
        {    
            username: username,
            content: content
        },
        function(err, result){
            if (err)
                done(err, null);
            else
                done(null, result[0]._id);
        }
    );
}

exports.update = function(username, _id, content, done){
    g.prototypesCollection.find(
        { 
            username: username,
            _id: new mongo.ObjectID(_id)
        },
        {
            $set: {
                content: content
            }
        },
        { 
            multi: true 
        },
        done
    );
}

exports.deleteAll = function(username, done){
    g.prototypesCollection.remove({ 'username': username }, done);
}

exports.delete = function(username, _id, done){
    g.prototypesCollection.remove({ 'username': username, _id: new mongo.ObjectID(_id) }, done);
}

//===========================
//  MONGO INIT
//===========================

var mongo = require('mongodb');

var mongoConfig = {
    host: global.mongoConfig.host,
    port: global.mongoConfig.port,
    dbName: global.mongoConfig.dbName,
    collectionName: 'prototypes'
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

        g.prototypesCollection = collection;

        done();
    }
}