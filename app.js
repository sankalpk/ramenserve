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

/* Mturk
 * --------------------------------------------------------------------------*/
var config = {
    url: "https://mechanicalturk.sandbox.amazonaws.com",
    receptor: { port: 8080, host: 'http://128.237.199.102' },
    poller: { frequency_ms: 10000 },
    accessKeyId: "AKIAJDXPUCWCTOTDSM4Q",
    secretAccessKey: "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" 
};

app.post("/sendHit", function (request,response){
    console.log("Body: ", request.body);
    var reward = request.body.reward;
    var maxAssignments = request.body.maxAssignments;
    var taskURL = request.body.taskURL;
    sendHit(reward, maxAssignments, taskURL);
    response.send({
        message:"Yay",
        success:true
    });
});

//paying is a string of the form "3.50"
var sendHit = function(rewards, maxAssignments, taskURL){
    var mturk = require('mturk')(config);

    var jade = require('jade')
      , path = __dirname + '/questionform.xml.jade'
      , str = require('fs').readFileSync(path, 'utf8')
      , fn = jade.compile(str, { filename: path, pretty: true });

    var questionXML = fn({taskURL: taskURL});

    var reward; //defaults to 1 USD
    if(rewards===undefined) reward = new mturk.Price("1.00","USD");
    else reward = new mturk.Price(rewards, "USD");

    var hitOptions;
    if(maxAssignments === undefined) hitOptions = {maxAssignments:1 };
    else hitOptions = {maxAssignments: maxAssignments};

    var title = "Test a Mobile Application";
    var description = "Go to the URL on your smartphone, complete the task, and submit.";
    var duration = 60 * 10; // #seconds Worker has to complete after accepting
    var typeOptions = { keywords: "testing, design", autoApprovalDelayInSeconds: 3600 };
    var lifeTimeInSeconds = 3600;

    //Create HITType
    mturk.HITType.create(title, description, reward, duration, typeOptions, function(err, hitType) {
        if(err)
            throw err;
        //Create HIT
        mturk.HIT.create(hitType.id, questionXML, lifeTimeInSeconds, hitOptions, function(err, hit){
            console.log("Created HIT "+hit.id);
        });
    });
}
