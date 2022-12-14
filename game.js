// extend base functionality of JS
Array.prototype.last = function () {
  return this[this.length-1];
};

// accept deg instead of rad thru sine function
Math.sinus = function (degree) {
  return Math.sin((degree/180) * Math.PI);
};

// gameData
let phase = "waiting"
let lastTimestamp;

let manX;
let manY;
let sceneOffset;

let platforms = [];
let sticks = [];
let trees = [];

let score = 0;

// config
const canvasWidth = 375;
const canvasHeight = 375;
const platformHeight = 100;
const manDistFromEdge = 10;
const padX = 100;
const perfectAreaSize = 10;
