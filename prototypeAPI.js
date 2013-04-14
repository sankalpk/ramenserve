var g = {
    mongoClient: null,
    prototypesCollection: null
}

exports.init = function(done){
    initMongo(done);
}

//gets all the prototypes for the creator's _id
exports.getAll = function(creator_id, done){
    var query = { creator_id: creator_id };
    g.prototypesCollection.find(query, {_id: 1, creator_id: 1, last_modified_date: 1, screens: 1}).toArray(done);
}

//gets a prototype by _id
exports.get = function(_id, done){
    var query = { _id : new mongo.ObjectID(_id)};
    g.prototypesCollection.findOne(query, { _id: 1, creator_id:1, last_modified_date:1, screens: 1 }, done);
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