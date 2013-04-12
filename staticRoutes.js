/* Static Files */ 

module.exports = function(app){
	app.get('/prototypes/view/:id', function(req,res){

	});

	app.get('/tasks/view/:id', function(req,res){

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