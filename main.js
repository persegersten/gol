import {Grid, Model} from './model.js';

// The grid model
var model = null;

class RuntimeContext {
    repeater;
    nofThreads = 0;
    currentTheme = 1;

    currentMouseOverStrategy = interactionClickOnMouseOver;
    currentClickStrategy = interactionNop;
    
    theme = {1:["black", "white", "red"],
             2:["white", "black", "green"],
             3:["#DD0000", "#0000DD", "#00DD00"]};

    getCurrentLivingColor() {
        return this.theme[this.currentTheme][0];
    }

    getCurrentDeadColor() {
        return this.theme[this.currentTheme][1];
    }

    getCurrentFocusColor() {
        return this.theme[this.currentTheme][2];
    }

    speedName = ["Super fast", "Extemely fast", "Fast", "Normal", "Slow", "Super slow", "Almost still"];
    speedIteration = [0, 200, 200, 200, 200, 200, 200];
    speedMod = [-1, -1, 2, 4, 10, 50, 250];
    currentSpeedMod = -1;
}

var context = new RuntimeContext();

function createInteractionMenu() {
    const interactStrategy = [
        ["moverD", "Drag", interactionClickOnMouseOver, interactionNop],
        ["moverM", "Missil", interactionNop, interactionGliderOnClick],
        ["moverB", "Blinkare", interactionNop, interactionBlinkOnClick]
    ];

    interactStrategy.forEach(function(s) {
        $("#interaction").append("<button id='"+ s[0] + "'>"+s[1]+"</button>");
        $( "#" + s[0] ).click(function () {
            console.log("Change to " + s[1]);
            context.currentMouseOverStrategy = s[2];
            context.currentClickStrategy = s[3];
            $("#currentPattern").text(s[1]);
        })
    });

    $("#interaction").append("&nbsp;<span id='currentPattern'>Drag</span>&nbsp;");

    $("#settings").click(function () {
        console.log("Settings toggle");
        $("#interaction").toggle(); 
    });    
}

var currentFocusLocation = [0,0];
var lastFocusLocation = [0,0];
function currentFocus(r,c) {
    currentFocusLocation = [r,c];
   var direction = getDirection(currentFocusLocation, lastFocusLocation);
   
   // console.log("Direction: " + direction + " " 
   // + JSON.stringify(currentFocusLocation)+ " " 
   // + JSON.stringify(lastFocusLocation));

   $("#direction").text(direction);
}

function currentFocusElapse() {
    lastFocusLocation = currentFocusLocation;
}

function getDirection(curr, last) {
    if (curr[0] < last[0]) {
        if (curr[1] < last[1]) {
            return "upper-left";
        } else if (curr[1] == last[1]) {
            return "up";
        } else { // curr[1] > last[1]
            return "upper-right";
        }
    } else if (curr[0] == last[0]) {
        if (curr[1] < last[1]) {
            return "left";
        } else if (curr[1] == last[1]) {
            return "center";
        } else { // curr[1] > last[1]
            return "right";
        }
    } else { // curr[0] > last[0]
        if (curr[1] < last[1]) {
            return "lower-left";
        } else if (curr[1] == last[1]) {
            return "down";
        } else { // curr[1] > last[1]
            return "lower-rigth";
        }
    }
}

function createGrid() {
    var cellSize = 25
    var box = document.querySelector('#container');
    var width = box.offsetWidth - 50;
    var height = box.offsetHeight - 150;
    
    var nofRows = Math.ceil(height/cellSize + 1);
    var nofCols = Math.ceil(width/cellSize + 1);

    for (var row = 0; row < nofRows; row++) {
        $("#container").append("<br>");
        for (var column = 0; column < nofCols; column++) {
            $("#container").append("<div class='cell' id='" + row + "_" + column + "' row='" + row + "' col='" + column + "'></div>");
        };
    };

    $(".cell").width(cellSize);
    $(".cell").height(cellSize);
    $(".cell").css("background-color", context.getCurrentDeadColor());

    model = new Model(nofRows, nofCols);

    $(".cell").mouseover(function(e, h) {
        var r = parseInt($(this).attr("row"));
        var c = parseInt($(this).attr("col"));
        context.currentMouseOverStrategy(r,c);

        currentFocus(r,c);

        $(this).css("background-color", context.getCurrentFocusColor());
    });

    $(".cell").mouseout(function(e, h) {
        var r = parseInt($(this).attr("row"));
        var c = parseInt($(this).attr("col"));
        if (model.grid.value(r, c)) {
            $(this).css("background-color", context.getCurrentLivingColor());   
        } else {
            $(this).css("background-color", context.getCurrentDeadColor());
        }
    });

    $(".cell").click(function(e, h) {
        var r = parseInt($(this).attr("row"));
        var c = parseInt($(this).attr("col"));
        context.currentClickStrategy(r,c);
    
    });
};

function interactionClickOnMouseOver(r, c) {
    model.click(r, c);
}

function interactionNop(r, c) {
    // Do nothing
}

function interactionGliderOnClick(r, c) {
    model.clicks([
        [r-1, c-1],
        [r-1, c],
        [r-1, c+1],
        [r, c-1],
        [r+1, c]
    ]);
}

function interactionBlinkOnClick(r, c) {
    model.clicks([
        [r, c-4],
        [r, c-3],
        [r, c-2],
        [r, c-1],
        [r, c-0],
        [r, c+1],
        [r, c+2],
        [r, c+3],
        [r, c+4]
    ]);
}

// function that clears the grid
function clearGrid(){
    $(".cell").remove();
};  

var doit;
$(window).resize((event) => {
  createRuntimeContext();
  clearTimeout(doit);
  clearGrid();
  doit = setTimeout(resizedw, 500);    
});

function createRuntimeContext() {
    let theme = document.getElementById("theme-selector").value;
    context.currentTheme = theme;
}

function resizedw(){
    clearInterval(context.repeater);
    createGrid();
    context.repeater = setInterval(sessionTick, getSpeed());
}

$(document).ready(function() {
    createInteractionMenu();
    createGrid();
    context.repeater = setInterval(sessionTick, getSpeed());
});

var globalCounter = 0;
var counter = 0;
export function sessionTick(){
    if (context.nofThreads > 0) {
        console.log("WARNING nofThreads=" + context.nofThreads);
    }
    currentFocusElapse();
    context.nofThreads++;
    counter++;
    globalCounter++;
    var result;
    if (counter >= context.currentSpeedMod) {
        //console.log("Do iteration2 " + counter%context.currentSpeedMod);
        result = model.iterate();
        counter = 0;
    } else {
        result = model.iterateEvents();
    }
    //console.log("tick " + JSON.stringify(result));
    result[0].forEach(myFunctionLive);
    result[1].forEach(myFunctionDie);
    context.nofThreads--;
}

function myFunctionLive(value) {  
    var r = value[0];
    var c = value[1];
    $("#"+r+"_"+c).css("background-color", context.getCurrentLivingColor());
}

function myFunctionDie(value) {
    var r = value[0];
    var c = value[1];
    $("#"+r+"_"+c).css("background-color", context.getCurrentDeadColor());
}



$('#chanceSlider').on('change', function(){
    clearInterval(context.repeater);
    context.repeater = setInterval(sessionTick, getSpeed());
});

function getSpeed() {
    const index = $('#chanceSlider').val();
    context.currentSpeedMod = context.speedMod[index];
    $('#speedName').text(context.speedName[index]);
    return context.speedIteration[index];
}

export function switchTheme(e) {
    let theme = document.getElementById("theme-selector").value;
    context.currentTheme = theme;
    console.log('Change theme to: ' + theme)

    $(".cell").css("background-color", context.getCurrentDeadColor());
    model.getLivingCells().forEach(function (value, index) {
        $("#"+ value[0]+"_"+value[1]).css("background-color", context.getCurrentLivingColor()); 
    });

  }
   

