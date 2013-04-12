var express = require("express");
var app = express();

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'this is supposed to be secret, change it' }));


//REPLACE THE REQUIRE WITH "require('mongo-express-auth');" if installed as a node module
var mongoExpressAuth = require('mongo-express-auth');

/* Mongo Initialization
 * --------------------------------------------------------------------------*/
mongoExpressAuth.init({
    mongo: { 
        dbName: 'ramen',
        collectionName: 'accounts'
    }
}, function(){
    console.log('mongo ready!');
    app.listen(3000);
});


/* Routes
 * --------------------------------------------------------------------------*/
app.get('/me', function(req, res){
    mongoExpressAuth.checkLogin(req, res, function(err){
        if (err)
            res.send(err);
        else {
            mongoExpressAuth.getAccount(req, function(err, result){
                if (err)
                    res.send(err);
                else
                    res.send(result); // NOTE: direct access to the database is a bad idea in a real app
            });
        }
    });
});

app.post('/login', function(req, res){
    mongoExpressAuth.login(req, res, function(err){
        if (err)
            res.send(err);
        else
            res.send('ok');
    });
});

app.post('/logout', function(req, res){
    mongoExpressAuth.logout(req, res);
    res.send('ok');
});

app.post('/register', function(req, res){
    mongoExpressAuth.register(req, function(err){
        if (err)
            res.send(err);
        else
            res.send('ok');
    });
});

/* Static Files */ 
app.get('/prototypes/view/:id', function(req,res){

});

app.get('/tasks/view/:id', function(req,res){

});

/* JSON Data */

/* returns the creator that is currently logged in's prototypes data */
app.get('/prototypes', function(req,res){
    mongoExpressAuth.checkLogin(req, res, function(err){
        if (err)
            res.send(err);
        else {
            mongoExpressAuth.getAccount(req, function(err, result){
                if (err)
                    res.send(err);
                else
                    res.send(result); // NOTE: direct access to the database is a bad idea in a real app
            });
        }
    });
})

/* creator submits object to create one prototype */
app.post('/prototypes', function(req, res){
    mongoExpressAuth.checkLogin(req, res, function(err){
        if (err)
            res.send(err);
        else {
            mongoExpressAuth.getAccount(req, function(err, result){
                if (err)
                    res.send(err);
                else
                    res.send(result); // NOTE: direct access to the database is a bad idea in a real app
            });
        }
    });
});

/*publicly accessible prototype object */
app.get('/prototypes/:id', function(req, res){

});

/* creator deletes prototype object */
app.delete('/prototypes/:id', function(req, res){
    mongoExpressAuth.checkLogin(req, res, function(err){
        if (err)
            res.send(err);
        else {
            mongoExpressAuth.getAccount(req, function(err, result){
                if (err)
                    res.send(err);
                else
                    res.send(result); // NOTE: direct access to the database is a bad idea in a real app
            });
        }
    });
});

//

/* Static File Server
 * --------------------------------------------------------------------------*/
app.get("/static/:staticFilename", function (request, response) {
    response.sendfile("static/" + request.params.staticFilename);
});
app.get("/css/:staticFilename", function (request, response) {
    response.sendfile("static/css/" + request.params.staticFilename);
});
app.get("/js/:staticFilename", function (request, response) {
    response.sendfile("static/js/" + request.params.staticFilename);
});
app.get("/img/:staticFilename", function (request, response) {
    response.sendfile("static/img/" + request.params.staticFilename);
});