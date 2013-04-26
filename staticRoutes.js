/* Static Files */ 
var fs = require("fs");

module.exports = function(app){
	app.get('/prototypes/view/:id', function(request,response){
		response.sendfile("static/prototypeView.html");
	});

	app.get('/tasks/view/:id', function(request,response){

	});

	app.get("/screens/:staticFilename", function (request, response) {
		var imageData = fs.readFileSync("screens/"+request.params.staticFilename, "utf8");
		response.send({
			imageData: imageData,
			success: true
		});
		/*readFile("screens/"+request.params.staticFilename, 'utf8', function(err, data) {
		    imageData = data;
		    response.send({
		    	imageData: imageData,
		    	success: true
		    });
		});*/
	});

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