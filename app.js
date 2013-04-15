/* Initialization
 * --------------------------------------------------------------------------*/
var mongo = require('mongodb');

global.mongoConfig = {
    host: 'localhost',
    port: mongo.Connection.DEFAULT_PORT,
    dbName: 'ramen'
}



var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

var express = require("express");
var app = express();
var mongoExpressAuth = require('mongo-express-auth');

var prototypeAPI = require('./prototypeAPI.js');

mongoExpressAuth.init({
    mongo: { 
        host: global.mongoConfig.host,
        port: global.mongoConfig.port,
        dbName: global.mongoConfig.dbName,
        collectionName: 'accounts'
    }
}, function(){
    prototypeAPI.init(function(){
        console.log('ready on port 3000');
        app.listen(3000);
    });
});

// mongoExpressAuth.init({
//     mongo: { 
//         dbName: 'ramen',
//         collectionName: 'accounts'
//     }
// }, function(){
//     console.log('mongo ready!');
//     app.listen(3000);
// });


app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'this is supposed to be secret, change it' }));
app.use(allowCrossDomain);


/* Routes
 * --------------------------------------------------------------------------*/
require('./loginRoutes')(app, mongoExpressAuth);
require('./staticRoutes')(app, mongoExpressAuth);
require('./prototypeRoutes')(app, mongoExpressAuth, prototypeAPI);


 /* User Authentication and Mongo
 * --------------------------------------------------------------------------*/
/*var mongo = require('mongodb');
var host = 'localhost';
var port = mongo.Connection.DEFAULT_PORT;
var optionsWithEnableWriteAccess={ w:1 };
var dbname = 'ramen';

var client = new mongo.Db(
    dbname,
    new mongo.Server(host,port),
    optionsWithEnableWriteAccess
)*/

/* Gets a collection object from mongo based on 'collectionName' */
/* and should have callback of the form */
/* onCollectionSuccessSuccess(collection)*/
// function openCollection(collectionName,onOpen){
//     client.open(onDbReady);

//     function onDbReady(error){
//         if (error)
//             throw error;
//         console.log("Mongo ready");
//         client.collection(collectionName, onCollectionReady);
//     }

//     function onCollectionReady(error, collection){
//         if (error)
//             throw error;
//         console.log("Collection ready");
//         console.log(collection);
//         onOpen(collection);
//     }
// }

// function closeDb(){
//     client.close();
// }

// function insertDocuments(collection, docs, onSuccess){
//     if (docs.length === 0){
//         onSuccess(null);
//         return;
//     }
//     var docHead = docs.shift(); //shift removes first element from docs
//     collection.insert(docHead, function onInserted(err){
//         if (err){
//             onSuccess(err);
//             return;
//         }
//         insertDocuments(collection, docs, onSuccess);
//     });
// }

// function insertTestDocuments(collection, onSuccess){
//     console.log("Inserting test documents");
//     docs = [{"a":1, "b":2, "c":3},{"sankalp":"kulshreshtha","devendra":"gurjar"}];
//     insertDocuments(collection, docs, onSuccess);
// }

// function onTestDocumentsSuccess(){
//     console.log("Test documents should have been inserted");
// }

// //Want to specify collection name and get returned the collection object
// function onTestCollectionSuccess(error, collection){
//     console.log("hello");
//     console.log(error);
//     if(error)
//         throw error;
//     insertTestDocuments(collection, onTestDocumentsSuccess);
// }
// openCollection("testCollection", onTestCollectionSuccess);

// /*Access these from other files using require("./app.js")*/
// exports.mongo = mongo;
// exports.host =  host;
// exports.port = port;
// exports.client = client;
// exports.dbname = dbname;




