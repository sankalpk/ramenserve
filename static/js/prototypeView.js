var prototype;
var curr_screen;
var canvas, context;
var screenImg;
var idToIndex=new Object();
var screen_width = 320;
var screen_height = 480;
var scale_factor_width;
var scale_factor_height;


/* Displays the screen from screen id */
function displayScreen(screen_id){
	var index = idToIndex[screen_id];
	curr_screen = prototype.screens[index];
	getImageData(curr_screen.image_path, addImageToDom);
}

function displayFirstScreen(){
	displayScreen(prototype.screens[0].screen_id);
}


/* ---------------------------------------------------------*/
/* Secondary methods */
function onTouchEnd(event){
	curr_screen.clickableAreas.forEach(function(clickarea){
		if(isOnClickarea(event,clickarea)){
			displayScreen(clickarea.destination_id);
		} 
	});
}

function isOnClickarea(event,clickarea){
	var touch = event.changedTouches[0];
	var ev_x = touch.pageX - canvas.offsetLeft;
	var ev_y = touch.pageY - canvas.offsetTop;
	var ca_x = clickarea.x*scale_factor_width;
	var ca_y = clickarea.y*scale_factor_height;
	var ca_width = clickarea.width*scale_factor_width;
	var ca_height = clickarea.height*scale_factor_height;

	context.fillStyle = "white";
	context.fillRect(ca_x,ca_y,ca_width,ca_height);

	//if tap is inside clickarea
	if(ev_x>=ca_x&&ev_x<=(ca_x+ca_width)&&ev_y>=ca_y&&ev_y<=(ca_y+ca_height)){
		return true;
	}
	else return false;

}

/* gets the prototype id from the current url */
function getPrototypeId(){
	var path = window.location.pathname;
	var index = path.lastIndexOf("/");
	var id = path.slice(index+1);
	return id;
}

function createIdToIndex(){
	prototype.screens.forEach(function(screen,index){
		idToIndex[screen.screen_id] = index;
	});
}


function addImageToDom(data){
    screenImg.src = data.imageData;
}

function onImageLoad(){
	scale_factor_width = screen_width/this.width;
	scale_factor_height = screen_height/this.height;
	context.drawImage(this,0,0, screen_width,screen_height);
}

function addClickareas(screen){
	screen.clickableAreas.forEach(function(clickarea){
		addClickarea(clickarea);
	});
}

/* AJAX */
/* get the prototype from the server*/
function getPrototype(id, onSuccess){
	$.ajax({
		type: "get",
		url: "/prototypes/"+id,
		success: function(data) {
		  prototype = data;
		  createIdToIndex();
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

/* Initialization */
$(document).ready(function(){
	/* get prototype data from the server the display first screen */
	getPrototype(getPrototypeId(),displayFirstScreen);


	/* set variables */
    screenImg = new Image();
    screenImg.onload = onImageLoad;
    screen_width = 320;//$(window).width();
    screen_height = 480;//$(window).height();

	/* set the canvas width and height according to the phone size */
	canvas = document.getElementById("application");
	context = canvas.getContext("2d");
	canvas.width = screen_width;
	canvas.height = screen_height;
	canvas.addEventListener("touchend", onTouchEnd);
});