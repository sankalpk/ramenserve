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