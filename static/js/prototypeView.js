var prototype;


$(document).ready(function(){
	getPrototype(getPrototypeId());
});

/* gets the prototypes id from the url */
function getPrototypeId(){
	var path = window.location.pathname;
	var index = path.lastIndexOf("/");
	var id = path.slice(index+1);
	return id;
}

/* get the prototype from the server based on id */
function getPrototype(id){
  $.ajax({
    type: "get",
    url: "/prototypes/"+id,
    success: function(data) {
      prototype = data;
      /* displays first screen */
      displayScreen(index);
    }
  });
}

/* Displays the screen from prototype.screens[index] */
function displayScreen(index){
	addImageToDom(prototype.screens[0].image_path);
	/* add clickareas */
}

function addImageToDom(path){
	/* clear current image */
	/* display new image */
}