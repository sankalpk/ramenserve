/* Static Files */ 
var fs = require("fs");

module.exports = function(app){
	app.get('/prototypes/view/:id', function(request,response){
		response.sendfile("static/prototypeView.html");
	});

	app.get('/tasks/view/:id', function(request,response){
		response.sendfile("static/prototypeView.html")
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

	app.get("/static/css/:staticFilename", function (request, response) {
	    response.sendfile("static/css/" + request.params.staticFilename);
	});

	app.get("/static/js/:staticFilename", function (request, response) {
	    response.sendfile("static/js/" + request.params.staticFilename);
	});

	app.get("/static/img/:staticFilename", function (request, response) {
	    response.sendfile("static/img/" + request.params.staticFilename);
	});

	app.post("/sendHit", function (request,response){
		sendHit();
	});
}