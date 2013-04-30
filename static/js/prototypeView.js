var prototype;
var curr_screen;
var canvas, context;
var screenImg;
var idToIndex=new Object();
var screen_width = 320;
var screen_height = 480;
var scale_factor_width;
var scale_factor_height;
var task;
var taskAnalytics;

// 0 => prototype, 1 => task
var state;


/* Displays the screen from screen id */
function displayScreen(screen_id){
	/* If you're in a task and you've successfully completed it */
	if(state===1 && screen_id ==task.end_screen_id) 
		taskCompleted();
	else
	{
		displayStep(0);
		var index = idToIndex[screen_id];
		curr_screen = prototype.screens[index];
		getImageData(curr_screen.image_path, addImageToDom);
	}
}

function taskCompleted(){
	//show  task completed screen
	taskAnalytics.end_time = new Date();
	taskAnalytics.time = Math.round((taskAnalytics.end_time-taskAnalytics.start_time)/1000);
	console.log("Time completed: ",taskAnalytics.time);
	displayStep(3);
}

function displayFirstPrototypeScreen(){
	displayScreen(prototype.screens[0].screen_id);
}

function displayTaskStartScreen(){
	taskAnalytics.start_time = new Date();
	displayScreen(task.start_screen_id);
}

function displayQuestionnaire(){
	displayStep(4);
}

function displayThankYou(){
	console.log(taskAnalytics);
	displayStep(5);
}

/* ---------------------------------------------------------*/
/* Secondary methods */
function onTouchEnd(event){
	//if doing a task, record the tap in analytics
	if(state==1) recordTap(event);
	//go through each clickarea to see whether it was tapped on
	curr_screen.clickableAreas.forEach(function(clickarea){
		if(isOnClickarea(event,clickarea)){
			displayScreen(clickarea.destination_id);
		}
	});
}

function recordTap(event){
	var touch = event.changedTouches[0];
	var ev_x = (touch.pageX - canvas.offsetLeft)/scale_factor_width;
	var ev_y = (touch.pageY - canvas.offsetTop)/scale_factor_height;
	taskAnalytics.taps.push({screen_id: curr_screen.screen_id, x: ev_x,y: ev_y});
}

/* takes in the non-scaled clickarea and scales it */
function isOnClickarea(event,clickarea){
	var touch = event.changedTouches[0];
	var ev_x = touch.pageX - canvas.offsetLeft;
	var ev_y = touch.pageY - canvas.offsetTop;
	var ca_x = clickarea.x*scale_factor_width;
	var ca_y = clickarea.y*scale_factor_height;
	var ca_width = clickarea.width*scale_factor_width;
	var ca_height = clickarea.height*scale_factor_height;

	context.fillStyle = "rgba(186, 227, 224, .25)";
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

/* gets the task id from the current url */
function getTaskId(){
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

function displayTaskInstructions(){
	displayStep(1);
	console.log("Task: ", task);
	var name = task.name;
	var description = task.description;
	$("#1 .headline h1").html(name);
	$("#1 .description").append("<p>"+description+"</p>");
}


function addImageToDom(data){
    screenImg.src = data.imageData;
}

function onImageLoad(){
	scale_factor_width = screen_width/this.width;
	scale_factor_height = screen_height/this.height;
	context.drawImage(this,0,0, screen_width,screen_height);
}

/* AJAX */
/* get the prototype from the server*/
function getPrototype(_id, onSuccess){
	$.ajax({
		type: "get",
		url: "/prototypes/"+_id,
		success: function(data) {
		  prototype = data;
		  createIdToIndex();
		  if(onSuccess) onSuccess(data);
		}
	});
}

/* gets the image data from the server */
function getImageData(path, onSuccess){
	$.ajax({
	    type: "get",
	    url: "/"+path,
	    success: function(data) {
	    	if(onSuccess) onSuccess(data);
	    }
	});
}

/* gets the task data from the server */
function getTask(_id, onSuccess){
	$.ajax({
	    type: "get",
	    url: "/tasks/"+_id,
	    success: function(data) {
	    	task=data;
	    	getPrototype(data.prototype_id, onSuccess);
	    }
	});
}

/* send analytics data */
function sendAnalytics(analytics,onSuccess){
	console.log("Analytics: ",analytics);
    $.ajax({
        type: "put",
        data: analytics,
        url: RAMEN_PATH.server + "/tasks/analytics",
        success: function(data){
          console.log("uploaded analytics to the server");
          if(onSuccess) onSuccess(data);
        } 
    });
}

/* sets state based on url, prototype => 0, task => 1 */
function setState(){
	var path = window.location.pathname;
	if(path.indexOf("prototypes")!==-1)
		state = 0;
	else
		state = 1;
}

/* Form */

function updateSlider(slideAmount, sliderAmount) {
    var sliderDiv = document.getElementById(sliderAmount);
    if(slideAmount == 1) sliderDiv.innerHTML = "Strongly disagree";
    else if(slideAmount == 2) sliderDiv.innerHTML = "Disagree";
    else if(slideAmount == 3) sliderDiv.innerHTML = "Neutral";
    else if(slideAmount == 4) sliderDiv.innerHTML = "Agree";
    else if(slideAmount == 5) sliderDiv.innerHTML = "Strongly Agree";
}

function submitAnalytics(){
	addQuestionDataToAnalytics();
	sendAnalytics(taskAnalytics);
}

function addQuestionDataToAnalytics(){
	taskAnalytics.q1 = $("#q1").val();
	taskAnalytics.q2 = $("#q2").val();
	taskAnalytics.q3 = $("#q3").val();
	taskAnalytics.q4 = $("#q4").val();
	taskAnalytics.q5 = $("#q5").val();
}
/* Initialization */
$(document).ready(function(){
	displayStep(2);
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

	setState();
	if(state === 0) docInitPrototype();
	else if(state === 1) docInitTask();
});

function docInitPrototype(){
	/* get prototype data from the server then display first screen */
	getPrototype(getPrototypeId(),displayFirstPrototypeScreen);
}

function docInitTask(){
	taskAnalytics = new Object();
	taskAnalytics.taps = [];
	taskAnalytics._id = getTaskId();
	/* get task data from the server, then display first screen */
	getTask(taskAnalytics._id, displayTaskInstructions);
}