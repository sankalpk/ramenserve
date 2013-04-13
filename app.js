var express = require("express");
var mongoExpressAuth = require('mongo-express-auth');
var app = express();

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'this is supposed to be secret, change it' }));


/* Initialization
 * --------------------------------------------------------------------------*/
function init(){
    require('./dataRoutes')(app);
    require('./loginRoutes')(app);
    require('./staticRoutes')(app);
}

init();


/* Mongo Setup Initialization
 * --------------------------------------------------------------------------*/

var mongo = require('mongodb');
var host = 'localhost';
var port = mongo.Connection.DEFAULT_PORT;
var optionsWithEnableWriteAccess={ w:1 };
var dbname = 'ramen';

var client = new mongo.Db(
    dbname,
    new mongo.Server(host,port),
    optionsWithEnableWriteAccess
)

/*Access these from other files using require("./app.js")*/
exports.mongo = mongo;
exports.host =  host;
exports.port = port;
exports.client = client;
exports.dbname = dbname;



/* User Authorization Initialization
 * --------------------------------------------------------------------------*/
mongoExpressAuth.init({
    mongo: { 
        dbName: dbname,
        collectionName: 'accounts'
    }
}, function(){
    console.log('mongo ready!');
    app.listen(3000);
});

