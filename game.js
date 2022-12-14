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

// background moves slower than man
const backgroundSpeedMult = 0.2;

const hill1BaseHeight = 100;
const hill1Amp = 10;
const hill1Stretch = 1;
const hill2BaseHeight = 70;
const hilll2Amp = 20;
const hill2Stretch = 0.5;

const stretchingSpeed = 4; // ms it takes to draw a px
const turningVelo = 4;
const walkingSpeed = 4;
const transSpeed = 2;
const fallingSpeed = 2;

const manWidth = 17;
const manHeight = 30;

const canvas = document.getElementById("game");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

const introductionElement = document.getElementById("introduction");
const doubleElement = document.getElementById("double");
const restartButton = document.getElementById("restart");
const scoreElement = document.getElementById("score")
// layout init - does not reset entire game, which starts on keypress
resetGame();
function resetGame() {
  phase = "waiting";
  lastTimestamp = undefined;
  sceneOffset = 0;
  score = 0;

  introductionElement.style.opacity = 1;
  doubleElement.style.opacity = 0;
  restartButton.style.opactiy = "none";
  scoreElement.innerText = score;

  // x + w has to match padX
  platforms = [{x: 50, w: 50}];
  generatePlatform();
  generatePlatform();
  generatePlatform();
  generatePlatform();

  sticks = [{x: platforms[0].x + platforms[0].w, length: 0, rotation: 0}];

  trees = [];
  generateTree();
  generateTree();
  generateTree();
  generateTree();
  generateTree();
  generateTree();
  generateTree();
  generateTree();
  generateTree();
  generateTree();

  manX = platforms[0].x + platforms[0].w - manDistFromEdge;
  manY = 0;

  draw();
}

function generateTree() {
  const minimumGap = 30;
  const maximumGap = 150;

  // x-coord of furthest tree's right edge
  const lastTree = trees[trees.length-1];
  let furthestX = lastTree ? lastTree.x : 0;

  const x = furthestX + minimumGap + Math.floor(Math.random() * (maximumGap-minimumGap));
  const treeColors = ["#6D8821", "#8FAC34", "#98B333"];
  const color = treeColors[Math.floor(Math.random() * 3)];

  trees.push({x, color});
}

function generatePlatform() {
  const minimumGap = 40;
  const maximumGap = 200;
  const minimumWidth = 20;
  const maximumWidth = 100;

  // x-coord of furthest platform's right edge
  const lastPlatform = platforms[platforms.length-1];
  let furthestW = lastPlatform.x + lastPlatform.w;
  const x = furthestX + minimumGap + Math.floor(Math.random() * (maximumGap-minimumGap));
  const w = minimumWidth + Math.floor(Math.random() * (maximumWidth-minimumWidth));

  platforms.push({x, w});
}

resetGame();

// if user presses space... reset game
window.addEventListener("keydown", function (event) {
  if (even.key == " ") {
    pevent.preventDefault();
    resetGame();
    return;
  }
});

window.addEventListener("mousedown", function (event) {
  if (phase == "waiting") {
    lastTimestamp = undefined;
    introductionElement.style.opacity = 0;
    phase = "stretching";
    window.requestAnimationFrame(animate);
  }
});

window.addEventListener("mouseup", function (event) {
  if (phase == "stretching") {
    phase = "turning";
  }
});

window.addEventListener("resize", function (event) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
});

window.requestAnimationFrame(animate);
