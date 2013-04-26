var prototype;


$(document).ready(function(){
	/* get prototype data from the server the display first screen */
	getPrototype(getPrototypeId(),displayFirstScreen);
});

/* gets the prototypes id from the current url */
function getPrototypeId(){
	var path = window.location.pathname;
	var index = path.lastIndexOf("/");
	var id = path.slice(index+1);
	return id;
}

/* get the prototype from the server*/
function getPrototype(id, onSuccess){
	$.ajax({
		type: "get",
		url: "/prototypes/"+id,
		success: function(data) {
		  prototype = data;
		  if(onSuccess) onSuccess(data);
		}
	});
}

/* gets the prototype data from the server */
function getImageData(path, onSuccess){
	$.ajax({
    type: "get",
    url: "/"+path,
    success: function(data) {
      if(onSuccess) onSuccess(data);
    }
  });
}

function displayFirstScreen(){
	displayScreen(0);
}

/* Displays the screen from prototype.screens[index] */
function displayScreen(index){
	console.log('Prototype: ', prototype);
	var image_path = prototype.screens[index].image_path;
	getImageData(image_path, addImageToDom);
	/* add clickareas */
}

function addImageToDom(data){
	/* clear current image */
	/* display new image */
	var screenImg = new Image();
    screenImg.src = data.imageData;  
    screenImg.onload = function(){
    	$("body").append(screenImg);
    }
}