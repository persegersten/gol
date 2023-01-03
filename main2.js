import {update, draw, createGrid, setGridContext} from './model2.js';

const canvas = document.getElementById("golCanvas");
const ctx = canvas.getContext("2d");

var repeater;
var grid;
const CELL_WIDTH = 10;
const FAST = 20;
const SLOW = 200;
var speed_millis = SLOW;

document.addEventListener("DOMContentLoaded", function() {
  adjustToCanvas();
  initGrid();
});

var width =-1;
var height =-1;

function updateMenuIcons() {
  let speed = document.getElementById("turbo_speed");
  if (speed_millis == FAST) {
    speed.classList.remove("mdi-run-fast");
    speed.classList.add("mdi-walk");
  } else {
    speed.classList.add("mdi-run-fast");
    speed.classList.remove("mdi-walk");
  }

  let onOff = document.getElementById("btn_onoff");
  if (repeater == null) {
    onOff.classList.remove("mdi-pause");
    onOff.classList.add("mdi-play");
  } else {
    onOff.classList.add("mdi-pause");
    onOff.classList.remove("mdi-play");
  }
}

function adjustToCanvas() {
  const newWidth = canvas.offsetWidth - canvas.offsetWidth%CELL_WIDTH; 
  canvas.style.width = newWidth;
  canvas.width = newWidth;
  canvas.height = canvas.offsetHeight;
  width = Math.floor(canvas.offsetWidth/CELL_WIDTH);
  height = Math.floor(canvas.offsetHeight/CELL_WIDTH);
  setGridContext(CELL_WIDTH, width, height);
}

function initGrid() {
  grid = createGrid();
  repeater = setInterval(sessionTick, speed_millis);
  updateMenuIcons();
}

function sessionTick() {
  grid = update(grid);
  draw(ctx, grid);
}

const button_turbo_speed = document.getElementById('turbo_speed');
button_turbo_speed.addEventListener('click', (event) => {
    clearInterval(repeater);
    if (speed_millis == SLOW) {
      speed_millis = FAST;
    } else {
      speed_millis = SLOW;
    }
    if (repeater != null) {
      repeater = setInterval(sessionTick, speed_millis);
    }
    updateMenuIcons();
  });

  const button_onoff = document.getElementById('btn_onoff');
  button_onoff.addEventListener('click', (event) => {
    if (repeater == null) {
      repeater = setInterval(sessionTick, speed_millis); 
    } else {
      clearInterval(repeater);
      repeater = null;
    }
    updateMenuIcons();
  });

  const button_refresh = document.getElementById('btn_refresh');
  button_refresh.addEventListener('click', (event) => {
      if (repeater == null) {
        grid = createGrid();
        draw(ctx, grid);
      } else {
        clearInterval(repeater);
        initGrid();
      }
      
  });

  window.addEventListener('resize', () => {
    var newWidth = Math.floor(canvas.offsetWidth/10);
    var newHeight = Math.floor(canvas.offsetHeight/10);
    if (newWidth != width || newHeight != height) {
      adjustToCanvas();
      initGrid();
    }
  });
