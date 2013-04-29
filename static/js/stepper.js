/* Displays the specified screen, and hides all of the others */
function displayStep(stepNum){
    var steps = document.getElementsByClassName("step");
    for(var i=0; i<steps.length; i++){
        if(steps[i].id == stepNum)
            steps[i].style.display = "block";
        else
            steps[i].style.display = "none";
    }
}