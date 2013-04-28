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
    g.prototypesCollection.find(query, {_id: 1, creator_id: 1, name: 1, screens: 1}).toArray(done);
}

//gets a prototype by _id
exports.get = function(_id, done){
    var query = { _id : new mongo.ObjectID(_id)};
    g.prototypesCollection.findOne(query, { }, done);
    //_id: 1, creator_id:1, last_modified_date:1, screens: 1 
}

//creates a new prototype in the mongo with "name" for the creator
exports.create = function(creator_id, name, done){
    g.prototypesCollection.insert(
        {
            creator_id: new mongo.ObjectID(creator_id),
            name: name,
            screens: []
        },
        function(err, result){
            if (err)
                done(err, null);
            else
                done(null, result[0]);
        }
    );
}

//adds a screen to a given prototype
exports.addScreen = function(creator_id, prototype_id, screen_name, done){
    var query = { creator_id: new mongo.ObjectID(creator_id), _id: new mongo.ObjectID(prototype_id)};
    var screen_id = new mongo.ObjectID();
    var image_path = "screens/" + prototype_id + "_" + screen_id;
    var partialUpdate = 
    { 
        $push: 
        {
            screens: 
            { 
                name: screen_name,
                image_path: image_path,
                screen_id: screen_id
            }
        } 
    }
    g.prototypesCollection.update(query, partialUpdate, {multi: false, safe: true}, function(err,result){
        if(err) done(err,null, null);
        else done(null, screen_id, image_path);
    }); 
}

exports.setClickableAreas = function(creator_id, prototype_id, screen_id, clickableAreas, done){
    var query = {creator_id: new mongo.ObjectID(creator_id), 
                _id: new mongo.ObjectID(prototype_id),
                screens: {
                    $elemMatch:{
                        screen_id: new mongo.ObjectID(screen_id)
                    }
                } 
                //'screens._id': new mongo.ObjectID(screen_id)};
                }
    var action = 
    {
        $set: 
        {
            'screens.$.clickableAreas': clickableAreas

        }
    }
    g.prototypesCollection.update(query, action, done);   
}

//deletes a prototypes data (note: does not delete the images from the server
exports.delete = function(creator_id, _id, done){
    var query = { 'creator_id': new mongo.ObjectID(creator_id), _id: new mongo.ObjectID(_id) };
    g.prototypesCollection.remove(query, done);
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