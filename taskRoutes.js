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

    /* Creates a new task 
       creator submits {prototype_id: <id>, name: <name>, description: <desc>, start_screen_id: <id>,end_screen_id:<id>}
       server returns {creator_id: <id>, prototype_id: <id>, name: <name>, description: <desc>, start_screen_id: <id>,end_screen_id:<id>, analytics: {taps: [], num_people: 0,average_time: 0, q1_average: 0, q2_average: 0, q3_average: 0, q4_average: 0, q5_average: 0}}*/ 

    app.post('/tasks', function (req, res){
        getAccountInfo(mongoExpressAuth, req, res, function(accountInfo){
            var task = req.body;
            //sets creator_id according to whoever is logged in
            task.creator_id = ""+accountInfo._id;
            taskAPI.create(task, makeSendResult(res));
        });
    });


    /* Update analytics with an array of taps, time (in seconds), and questionairre results(0-5) */
    app.put('/tasks/:_id/analytics', function (req,res){
        var a = req.body;
        taskAPI.updateAnalytics(a._id, a.taps, a.time, a.q1, a.q2, a.q3, a.q4, a.q5, makeSendResult(res));
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