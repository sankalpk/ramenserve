/* JSON Data */
module.exports = function(app){
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

}