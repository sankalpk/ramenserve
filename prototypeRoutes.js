/* JSON Data */

/* required for image uploads */
var fs = require("fs");

module.exports = function(app, mongoExpressAuth, prototypeAPI){
    /* returns the creator that is currently logged in's prototypes data */
    app.get('/prototypes', function(req,res){
        getAccountInfo(mongoExpressAuth, req, res, function(result){
            prototypeAPI.getAll(result._id, makeSendResult(res));
        });
    });

    /* publicly accessible prototype object */
    app.get('/prototypes/:_id', function(req, res){
        var _id = req.params._id;
        var username = mongoExpressAuth.getUsername(req);
        prototypeAPI.get(_id, makeSendResult(res));
    });

    /* creator deletes prototype object, note: creator must be 
     * logged in for this to occur */
    app.delete('/prototypes/:_id', function(req, res){
        getAccountInfo(mongoExpressAuth, req, res, function(accountInfo){
            prototypeAPI.delete(""+accountInfo._id, req.params._id, makeSendResult(res))
        });
    }); 

    /* CREATING A PROTOTYPE
     * This section is split into many parts in line with the user flow */

    /* Step 1
     * Occurs once in the beginning
     * creator submits {"name": "<appname>"}
     * server returns {"_id": id, name: <appname>, "creator_id": <creator_id>, "screens":[empty array] } */
    app.post('/prototypes/init', function(req, res){
        getAccountInfo(mongoExpressAuth, req, res, function(accountInfo){
            console.log("Creator id", accountInfo._id);
            prototypeAPI.create(""+accountInfo._id, req.body.name, makeSendResult(res));
        });
    });

    /* Step 2
     * Occurs variable number of times for each image upload, first image is start screen for the application
     * creator submits { "screen_name": <name>, "image": <stringdata> }
     * server returns { "screen_id": <screen_id>, "image_path": <screen_path relative to host url> } */
    app.put('/prototypes/:_id/addScreen', function(req, res){
        getAccountInfo(mongoExpressAuth, req, res, function(accountInfo){
            prototypeAPI.addScreen(""+accountInfo._id, req.params._id, req.body.name, function(err, screen_id, image_path){
                if (err) res.send({ 'err': 'unknown err' });
                else 
                {
                    console.log("Image Path " + image_path);
                    writeFile(image_path, req.body.image);
                    res.send({screen_id: screen_id, image_path: image_path});
                }
            });
        });
     });

    /* Step 3
     * Occurs once for each screen in the application
     * creator submits { "screen_id": <screen_id>, clickable_areas:[<array of clickable areas>] }
     * clickableAreas are of the form {"x" : <x coord>, "y" : <y coord>, "width" : <width>, "height" : <height>, "destination_screen_id" : <screen_id>} */
     app.put('/prototypes/:_id/setClickableAreas', function(req,res){
        getAccountInfo(mongoExpressAuth, req, res, function(accountInfo){
            prototypeAPI.setClickableAreas(""+accountInfo._id, req.params._id, screen_id, makeSendResult(res))
        });

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

// Asynchronously read file contents, then call callbackFn
function readFile(filename, defaultData, callbackFn) {
  fs.readFile(filename, function(err, data) {
    if (err) {
      console.log("Error reading file: ", filename);
      data = defaultData;
    } else {
      console.log("Success reading file: ", filename);
    }
    if (callbackFn) callbackFn(err, data);
  });
}

// Asynchronously write file contents, then call callbackFn
function writeFile(filename, data, callbackFn) {
  fs.writeFile(filename, data, function(err) {
    if (err) {
      console.log("Error writing file: ", filename);
    } else {
      console.log("Success writing file: ", filename);
    }
    if (callbackFn) callbackFn(err);
  });
}