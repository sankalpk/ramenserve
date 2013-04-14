/* JSON Data */
module.exports = function(app, mongoExpressAuth, prototypeAPI){
    /* returns the creator that is currently logged in's prototypes data */
    app.get('/prototypes', function(req,res){
        getAccountInfo(mongoExpressAuth, req, res, function(result){
            prototypeAPI.getAll(result._id, makeSendResult(res));
        });
    });

    // /* creator submits object to create one prototype */
    // app.post('/prototypes', function(req, res){
    //     mongoExpressAuth.checkLogin(req, res, function(err){
    //         if (err)
    //             res.send(err);
    //         else {
    //             mongoExpressAuth.getAccount(req, function(err, result){
    //                 if (err)
    //                     res.send(err);
    //                 else
    //                     res.send(result); // NOTE: direct access to the database is a bad idea in a real app
    //             });
    //         }
    //     });
    // });

    /*publicly accessible prototype object */
    app.get('/prototypes/:_id', function(req, res){
        var _id = req.params._id;
        var username = mongoExpressAuth.getUsername(req);
        prototypeAPI.get(_id, makeSendResult(res));
    });

    // /* creator deletes prototype object, note: creator must be logged in for this to occur */
    // app.delete('/prototypes/:_id', function(req, res){
    //     mongoExpressAuth.checkLogin(req, res, function(err){
    //         if (err)
    //             res.send(err);
    //         else {
    //             mongoExpressAuth.getAccount(req, function(err, result){
    //                 if (err)
    //                     res.send(err);
    //                 else{
    //                     res.send(result); // NOTE: direct access to the database is a bad idea in a real app
    //             });
    //         }
    //     });
    // }); 

}

function makeSendResult(res){
    return function(err, result){
        if (typeof result === 'number')
            result = String(result);
        if (err)
            res.send({ 'err': 'unknown err' });
        else
            res.send(result);
    }
}

/* Based on the request, returns a logged in users object of the form
*  {username": "sankalp","hashedPassword": "rKnHBdssI535e94315921228ad36a58416e7ad9a0e", 
*  "_id": "51686dd9de61933d2f000001"}
*/
function getAccountInfo(mongoExpressAuth, req, res, onSucess){
    mongoExpressAuth.checkLogin(req, res, function(err)
    {
        if (err) res.send(err);
        else 
        {
            mongoExpressAuth.getAccount(req, function(err, result)
            {
                if (err) res.send(err);
                else onSucess(result);
            });
        }
    });
}