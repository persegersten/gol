import {Grid, Model} from './model.js';

// The grid model
var model = null;

class RuntimeContext {
    repeater;
    nofThreads = 0;
    currentTheme = 1;

    currentMouseOverStrategy = interactionNop;
    currentClickStrategy = interactionDirectionAwareGliderOnClick;
    
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

    speedName = ["Super fast", "Fast", "Normal", "Slow", "Super slow"];
    speedIteration = [0, 200, 200, 200, 200];
    speedMod = [-1, -1, 2, 3, 10];
    currentSpeedMod = -1;
    currentDirection = "center";
    theSpeedIndex = 1;

    createName = ["Wild", "Intense", "Normal", "Breeze", "Break"];
    createValues = [0.3, 0.07, 0.03, 0.02, -1];
    theCreateIndex = 1;
    createFunctions = [glider_expander, glider_nw, glider_sw, glider_n, glider_s];
}

var context = new RuntimeContext();

function createInteractionMenu() {
    const interactStrategy = [
        ["moverD", "Drag", interactionClickOnMouseOver, interactionNop],
        ["moverM", "Missil", interactionNop, interactionGliderOnClick],
        ["moverB", "Blinkare", interactionNop, interactionBlinkOnClick],
        ["moverDir", "Direction", interactionNop, interactionDirectionAwareGliderOnClick]
    ];
    //console.log("Hi there");
    interactStrategy.forEach(function(s) {
        //console.log(s[0]);
        $("#interaction").append("<button id='"+ s[0] + "'>"+s[1]+"</button>");
        $( "#" + s[0] ).click(function () {
            //console.log("Change to " + s[1]);
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
    
    $("#speedrange").change(function () {
        context.theSpeedIndex = 4 - Math.floor($('#speedrange').val()/100*5);
        $("#speed").text(context.speedName[context.theSpeedIndex]);
        console.log("Speed set to: " + context.theSpeedIndex + " - " + context.speedName[context.theSpeedIndex]); 
        updateSpeed();
    });

    $("#autocreaterange").change(function () {
        context.theCreateIndex = 4 - Math.floor($('#autocreaterange').val()/100*5);
        $("#autocreate").text(context.createName[context.theCreateIndex]);
        console.log("Autocreate set to: " + context.theCreateIndex + " - " + context.createName[context.theCreateIndex]); 
    });

    $("#speed").text(context.speedName[context.theSpeedIndex]);
    $("#autocreate").text(context.createName[context.theSpeedIndex]);

    // Handler for the toggle button.
    $("#btn_onoff").on("click", function(){
        console.log("Clicked on/off toggle");
        $(this).toggleClass("active");
        if($(this).hasClass("active")){
            $(this).find('img').attr("src", "icons8-start-50.png");
            clearInterval(context.repeater);
            context.repeater = null;
         } else {
            $(this).find('img').attr("src", "icons8-pause-50.png");
            context.repeater = setInterval(sessionTick, getSpeed());
         }
    });

    $("#btn_refresh").on("click", function(){
        console.log("Refresh");
        resetModel();
    });
}

var currentFocusLocation = [0,0];
var lastFocusLocation = [0,0];
function currentFocus(r,c) {
   currentFocusLocation = [r,c];
   context.currentDirection = getDirection(currentFocusLocation, lastFocusLocation);
   $("#direction").text(context.currentDirection);
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
            return "lower-right";
        }
    }
}

var nofRows;
var nofCols;

function createGrid() {
    var cellSize = 25
    var box = document.querySelector('#container');
    var width = box.offsetWidth - 50;
    var height = box.offsetHeight - 150;
    
    nofRows = Math.ceil(height/cellSize + 1);
    nofCols = Math.ceil(width/cellSize + 1);

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

    randomCreate();
};

function interactionClickOnMouseOver(r, c) {
    model.click(r, c);
}

function interactionNop(r, c) {
    // Do nothing
}

function glider_nw(r,c) {
    model.clicks (
[
    [r-1, c-1], [r-1, c], [r-1, c+1],
    [r, c-1]  ,    
                [r+1, c]
]); 
}

function glider_ne(r,c) {
    model.clicks ( 
[
    [r-1, c-1], [r-1, c], [r-1, c+1],
                          [r, c+1] ,    
                [r+1, c]
]);
}

function glider_sw(r,c) {
    model.clicks (  
[
                [r-1, c],
    [r, c-1]  ,
    [r+1, c-1], [r+1, c], [r+1, c+1]
]);
}

function glider_se(r,c) {
    model.clicks ( 
[
                [r-1, c],
                          [r, c+1],
    [r+1, c-1], [r+1, c], [r+1, c+1]
]);
}

function glider_w(r,c) {
    model.clicks ( 
[
                [r-1, c-1],                 [r-1, c+2],
    [r, c-2],
    [r+1, c-2],                             [r+1, c+2],
    [r+2, c-2], [r+2, c-1],[r+2, c],[r+2, c+1]
]);
}

function glider_e(r,c) {
    model.clicks ( 
[
    [r-1, c-2],                     [r-1, c+1],
                                               [r, c+2],
    [r+1, c-2],                                [r+1, c+2],
               [r+2, c-1], [r+2, c],[r+2, c+1],[r+2, c+2]
]);
}

function glider_expander(r,c) {
    model.clicks ( 
[
    [r-2, c-1],                      [r-2, c+1],
                                     [r-1, c+2],
                                     [r, c+2],
    [r+2, c-1],                      [r+2, c+2],
                [r+3, c], [r+3, c+1],[r+3, c+2]
]);
}

function glider_s(r,c) {
    model.clicks ( 
[
    [r-2, c-1],           [r-2, c+1],
                                     [r-1, c+2],
                                     [r, c+2],
    [r+1, c-1],                      [r+1, c+2],
                [r+2, c], [r+2, c+1],[r+2, c+2]
]);
}

function glider_n(r,c) {
    model.clicks ( 
[
    [r-2, c-1],[r-2, c],[r-2, c+1],
    [r-1, c-1],                     [r-1, c+2],
    [r, c-1],
    [r+1, c-1],                      
               [r+2, c],            [r+2, c+2]
]);
}

function blinker(r,c) {
    model.clicks ( 
        [
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

const directionMap = { 'upper-left':glider_nw,
                       'up':glider_n,
                       'upper-right':glider_ne,
                    
                       'left':glider_w,
                       'center':blinker,
                       'right':glider_e,

                       'lower-left':glider_sw,
                       'down':glider_s,
                       'lower-right':glider_se
                    };

function interactionDirectionAwareGliderOnClick(r, c) {
    var currDir = context.currentDirection;
    //console.log('currDir = ' + currDir);
    directionMap[currDir](r,c);
}

function interactionGliderOnClick(r, c) {
    model.clicks([
        [r-1, c-1], [r-1, c], [r-1, c+1],
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
    if ($("theme-selector").length) {
        let theme = document.getElementById("theme-selector").value;
        context.currentTheme = theme;
    } 
}

function resizedw(){
    clearInterval(context.repeater);
    createGrid();
    context.repeater = setInterval(sessionTick, getSpeed());
}

$(document).ready(function() {
    //console.log("Document ready");
    createInteractionMenu();
    createGrid();
    context.repeater = setInterval(sessionTick, getSpeed());
});

function resetModel() {
    clearInterval(context.repeater);
    var result = model.resetAllGrids();
    result.forEach(myFunctionDie);
    //console.log("Killed cells - " + JSON.stringify(result));
    //console.log("Living cells - " + JSON.stringify(model.getLivingCells()));
    if (context.repeater!=null) {
        context.repeater = setInterval(sessionTick, getSpeed());
    }
}

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
        result = model.iterate();
        counter = 0;
    } else {
        result = model.iterateEvents();
    }
    result[0].forEach(myFunctionLive);
    result[1].forEach(myFunctionDie);

    var r = Math.random();
    var p = context.createValues[context.theCreateIndex];
    
    if (r < p) {
        randomCreate();
    } else {
    }

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
    updateSpeed();
});

function updateSpeed() {
    if (context.repeater!=null) {
        clearInterval(context.repeater);
        context.repeater = setInterval(sessionTick, getSpeed());
    }
}

function randomCreate() {
    var index = getRandomInt(5);
    var x = getRandomInt(nofCols);
    var y = getRandomInt(nofRows);
    // console.log("Create nofCols="+ nofCols + " nofRows=" + nofRows + " index=" + index + " x="+ x + " y=" + y);
    context.createFunctions[index](y,x);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

function getSpeed() {
    if ($('#chanceSlider').exists) {
        context.theSpeedIndex = $('#chanceSlider').val();
        $('#speedName').text(context.speedName[context.theSpeedIndex]);
        console.log("Got speed, sets to " + context.theSpeedIndex);
    } else {
        console.log("Alreday got speed, was set to " + context.theSpeedIndex);
    }

    context.currentSpeedMod = context.speedMod[context.theSpeedIndex];
    return context.speedIteration[context.theSpeedIndex];
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
   

