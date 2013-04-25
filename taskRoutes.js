/* JSON Data */

/* required for image uploads */
var fs = require("fs");

module.exports = function(app, mongoExpressAuth, prototypeAPI, taskAPI){

    /* get a task by it's id */
    app.get('/tasks/:_id', function(req, res){
        var _id = req.params._id;
        taskAPI.getById(_id, makeSendResult(res));
    });

    /* gets all the tasks for a given prototype */
    app.get('/tasks/prototype/:prototype_id', function(req,res){
        var prototype_id = req.params.prototype_id;
        taskAPI.getByPrototype(prototype_id, makeSendResult(res));
    });
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