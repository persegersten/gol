import {Grid, Model} from './model.js';

// The grid model
var model = null;

class RuntimeContext {
    repeater;
    nofThreads = 0;
    currentTheme = 1;
    theme = {1:["black", "white"],
             2:["white", "black"],
             3:["#DD0000", "#0000DD"]};

    getCurrentLivingColor() {
        return this.theme[this.currentTheme][0];
    }

    getCurrentDeadColor() {
        return this.theme[this.currentTheme][1];
    }

    speed = [0, 200, 400, 600, 1000, 2000, 5000];
}

var context = new RuntimeContext();

// function that builds a grid in the "container"
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
        model.click(r, c);
        console.log("Click living color " + context.getCurrentLivingColor());
        $(this).css("background-color", context.getCurrentLivingColor());
    });
};

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
    createGrid();
    context.repeater = setInterval(sessionTick, getSpeed());
});

export function sessionTick(){
    if (context.nofThreads > 0) {
        console.log("WARNING nofThreads=" + context.nofThreads);
    }
    context.nofThreads++;
    var result = model.iterate()
    //console.log("tick " + JSON.stringify(result));
    result[0].forEach(myFunctionLive);
    result[1].forEach(myFunctionDie);
    context.nofThreads--;
}

function myFunctionLive(value) {  
    var r = value[0];
    var c = value[1];
    console.log("Update living color " + context.getCurrentLivingColor());
    $("#"+r+"_"+c).css("background-color", context.getCurrentLivingColor());
    //console.log("myFunctionLive " + r + " " + c);
}

function myFunctionDie(value) {
    var r = value[0];
    var c = value[1];
    console.log("Update dead color " + context.getCurrentDeadColor());
    $("#"+r+"_"+c).css("background-color", context.getCurrentDeadColor());
    //console.log("myFunctionDie " + r + " " + c);
}



$('#chanceSlider').on('change', function(){
    clearInterval(context.repeater);
    context.repeater = setInterval(sessionTick, getSpeed());
});

function getSpeed() {
    return context.speed[$('#chanceSlider').val()];
}

export function switchTheme(e) {
    let theme = document.getElementById("theme-selector").value;
    context.currentTheme = theme;
    console.log('Change theme to: ' + theme)

    // $("#container").append("<div class='cell' id='" + row + "_" + column + "' row='" + row + "' col='" + column + "'></div>");
    console.log(" rs:" + model.grid.rows + " cs:" + model.grid.cols)
    $(".cell").css("background-color", context.getCurrentDeadColor());
    model.getLivingCells().forEach(function (value, index) {
        console.log(" r:" + value[0] + " c:" + value[1])
        $("#"+row+"_"+column).css("background-color", context.getCurrentLivingColor()); 
    });

  }

