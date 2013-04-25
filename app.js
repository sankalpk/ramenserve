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

var taskAPI = require('./taskAPI.js');
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
        taskAPI.init(function(){
            console.log('ready on port 3000');
            app.listen(3000);
        });
    });
});

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'this is supposed to be secret, change it' }));
app.use(allowCrossDomain);


/* Routes
 * --------------------------------------------------------------------------*/
require('./loginRoutes')(app, mongoExpressAuth);
require('./staticRoutes')(app, mongoExpressAuth);
require('./prototypeRoutes')(app, mongoExpressAuth, prototypeAPI);
require('./taskRoutes')(app, mongoExpressAuth, prototypeAPI, taskAPI);