var g = {
    mongoClient: null,
    tasksCollection: null
}

exports.init = function(done){
    initMongo(done);
}

/*gets a task by _id */
exports.getById = function(_id, done){
    var query = { _id : new mongo.ObjectID(_id)};
    var filter = { _id: 1,prototype_id: 1, name: 1, description: 1, start_screen_id: 1, end_screen_id: 1, analytics: 1}
    g.tasksCollection.findOne(query, filter, done);
}

/*gets all the tasks for a given prototype */
exports.getByPrototype  = function(prototype_id, done){
    var query = { prototype_id : new mongo.ObjectID(prototype_id)};
    var filter = { _id: 1,prototype_id: 1, name: 1, description: 1, start_screen_id: 1, end_screen_id: 1, analytics: 1}
    g.tasksCollection.find(query, filter).toArray(done);
}

/* creates a new task 
   the task argument should be of the form
   {creator_id: <id>, prototype_id: <id>, name: <name>, description: <desc>, start_screen_id: <id>,end_screen_id:<id>} */
exports.create = function(task, done){
    g.tasksCollection.insert(
        {
            creator_id: new mongo.ObjectID(task.creator_id),
            prototype_id: new mongo.ObjectID(task.prototype_id),
            name: task.name,
            description: task.description,
            start_screen_id: new mongo.ObjectID(task.start_screen_id),
            end_screen_id: new mongo.ObjectID(task.end_screen_id),
            analytics: {"taps": [],"num_people": 0, "average_time": 0, "q1_average": 0, "q2_average": 0, "q3_average": 0,"q4_average": 0,"q5_average": 0 }
        },
        function(err,result)
        {
            if(err)
                done(err, null);
            else
                done(null,result[0]);
        }
    );
}

/* Updates the analytics with a new set of data points */
exports.updateAnalytics = function(_id, taps, time,q1,q2,q3,q4,q5, done)
{
    //gets the given task
    exports.getById(_id, function(err, result)
    {
        if (err)
            done(err);
        else
            computeAndSetAnalytics(result, taps,parseFloat(time),parseFloat(q1),parseFloat(q2),parseFloat(q3),parseFloat(q4),parseFloat(q5),done);   
    });
}

computeAndSetAnalytics = function(task, taps,time,q1,q2,q3,q4,q5,done)
{
    //resetAnalytics(task, taps,time,q1,q2,q3,q4,q5,done);
    var analytics = task.analytics;
    var new_num_people = analytics.num_people+1;
    task.analytics.taps = analytics.taps.concat(taps);
    task.analytics.average_time = ((analytics.average_time*analytics.num_people)+time)/new_num_people;
    task.analytics.q1_average = ((analytics.q1_average*analytics.num_people)+q1)/new_num_people;
    task.analytics.q2_average = ((analytics.q2_average*analytics.num_people)+q2)/new_num_people;
    task.analytics.q3_average = ((analytics.q3_average*analytics.num_people)+q3)/new_num_people;
    task.analytics.q4_average = ((analytics.q4_average*analytics.num_people)+q4)/new_num_people;
    task.analytics.q5_average = ((analytics.q5_average*analytics.num_people)+q5)/new_num_people;
    task.analytics.num_people = new_num_people;
    setAnalytics(task,done);
}

resetAnalytics = function(task, taps,time,q1,q2,q3,q4,q5,done)
{
    var analytics = task.analytics;
    task.analytics.taps = [];
    task.analytics.average_time = 0;
    task.analytics.q1_average = 0;
    task.analytics.q2_average = 0;
    task.analytics.q3_average = 0;
    task.analytics.q4_average = 0;
    task.analytics.q5_average = 0;
    task.analytics.num_people = 0;
    setAnalytics(task,done);
}

setAnalytics = function (task, done)
{
    var query = {_id: task._id};
    var update = { $set: { analytics: task.analytics } };
    var options = {multi: false, safe: true};
    var onSuccess = function(err,result)
    {
        if(err)
            done(err)
        else done(null, result);
    }
    g.tasksCollection.update(query, update, onSuccess);
}



//===========================
//  MONGO INIT
//===========================

var mongo = require('mongodb');

var mongoConfig = {
    host: global.mongoConfig.host,
    port: global.mongoConfig.port,
    dbName: global.mongoConfig.dbName,
    collectionName: 'tasks'
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

        g.tasksCollection = collection;

        done();
    }
}