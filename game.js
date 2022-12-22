// extend the base functionality of JavaScript
Array.prototype.last = function () {
  return this[this.length - 1];
};

let phase = "waiting";
let lastTimestamp;

let guyX;
let guyY;
let sceneOffset;

let platforms = [];
let sticks = [];

const canvasWidth = 375;
const canvasHeight = 375;
const platformHeight = 100;
const guyDistFromEdge = 10;
const padX = 100;

// background moves slower than the guy
const backgroundSpeedMultiplier = 0.2;

const stretchingSpeed = 4; // milliseconds it takes to draw a pixel
const turningSpeed = 4; // milliseconds it takes to turn a degree
const walkingSpeed = 4;
const transitioningSpeed = 2;
const fallingSpeed = 2;

const guyWidth = 17;
const guyHeight = 30;

const canvas = document.getElementById("game");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d"); // declare global context

const introductionElement = document.getElementById("introduction");

resetGame();

// resets game variables and layouts (game starts on keypress)
function resetGame() {
  // Reset game progress
  phase = "waiting";
  lastTimestamp = undefined;
  sceneOffset = 0;

  introductionElement.style.opacity = 1;

  // the first platform is always the same
  // x + w has to match padX
  platforms = [{ x: 50, w: 50 }];
  generatePlatform();
  generatePlatform();
  generatePlatform();
  generatePlatform();

  sticks = [{ x: platforms[0].x + platforms[0].w, length: 0, rotation: 0 }];

  guyX = platforms[0].x + platforms[0].w - guyDistFromEdge;
  guyY = 0;
  draw();
}

function generatePlatform() {
  const minimumGap = 40;
  const maximumGap = 200;
  const minimumWidth = 20;
  const maximumWidth = 100;

  // x-coordinate of the right edge of the furthest platform
  const lastPlatform = platforms[platforms.length - 1];
  let furthestX = lastPlatform.x + lastPlatform.w;

  const x =
    furthestX +
    minimumGap +
    Math.floor(Math.random() * (maximumGap - minimumGap));
  const w =
    minimumWidth + Math.floor(Math.random() * (maximumWidth - minimumWidth));

  platforms.push({ x, w });
}

resetGame();

// space was pressed restart the game
window.addEventListener("keydown", function (event) {
  if (event.key == " ") {
    event.preventDefault();
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
<<<<<<< HEAD

// MAIN GAME LOOP
function animate(timestamp) {
  if (!lastTimestamp) {
    lastTimestamp = timestamp;
    window.requestAnimationFrame(animate);
    return;
  }

  switch (phase) {
    case "waiting":
      return; // stop loop
    case "stretching": {
      sticks.last().length += (timestamp - lastTimestamp) / stretchingSpeed;
      break;
    }
    case "turning": {
      sticks.last().rotation += (timestamp - lastTimestamp) / turningSpeed;

      if (sticks.last().rotation > 90) {
        sticks.last().rotation = 90;

        const [nextPlatform] = struckPlatform();
        if (nextPlatform) {
          generatePlatform();
        }
        phase = "walking";
      }
      break;
    }
    case "walking": {
      guyX += (timestamp - lastTimestamp) / walkingSpeed;

      const [nextPlatform] = struckPlatform();
      if (nextPlatform) {
        // If guy will reach another platform then limit it's position at it's edge
        const maxguyX = nextPlatform.x + nextPlatform.w - guyDistFromEdge;
        if (guyX > maxguyX) {
          guyX = maxguyX;
          phase = "transitioning";
        }
      } else {
        // If guy won't reach another platform then limit it's position at the end of the pole
        const maxguyX = sticks.last().x + sticks.last().length + guyWidth;
        if (guyX > maxguyX) {
          guyX = maxguyX;
          phase = "falling";
        }
      }
      break;
    }
    case "transitioning": {
      sceneOffset += (timestamp - lastTimestamp) / transitioningSpeed;

      const [nextPlatform] = struckPlatform();
      if (sceneOffset > nextPlatform.x + nextPlatform.w - padX) {
        // add the next step
        sticks.push({
          x: nextPlatform.x + nextPlatform.w, length: 0, rotation: 0
        });
        phase = "waiting";
      }
      break;
    }
    case "falling": {
      if (sticks.last().rotation < 180)
        sticks.last().rotation += (timestamp - lastTimestamp) / turningSpeed;

      guyY += (timestamp - lastTimestamp) / fallingSpeed;
      const maxguyY =
        platformHeight + 100 + (window.innerHeight - canvasHeight) / 2;
      break;
    }
    default:
      throw Error("Wrong phase");
  }

  draw();
  window.requestAnimationFrame(animate);
  lastTimestamp = timestamp;
}

// returns the platform the stick hit (if it didn't hit then return undefined)
function struckPlatform() {
  if (sticks.last().rotation != 90)
    throw Error(`Stick is ${sticks.last().rotation}°`);
  const stickFarX = sticks.last().x + sticks.last().length;

  const platformTheStickHits = platforms.find(
    (platform) => platform.x < stickFarX && stickFarX < platform.x + platform.w
  );
  
  return [platformTheStickHits, false];
}

function draw() {
  ctx.save();
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  // center main canvas area to the middle
  ctx.translate(
    (window.innerWidth - canvasWidth) / 2 - sceneOffset, (window.innerHeight - canvasHeight) / 2
  );

  drawPlatforms();
  drawguy();
  drawSticks();

  // restore transformation
  ctx.restore();
}

function drawPlatforms() {
  platforms.forEach(({ x, w }) => {
    // draw platform
    ctx.fillStyle = "black";
    ctx.fillRect(
      x, canvasHeight - platformHeight, w, platformHeight + (window.innerHeight - canvasHeight) / 2
    );
  });
}

function drawguy() {
  ctx.save();
  ctx.fillStyle = "black";
  ctx.translate(
    guyX - guyWidth / 2, guyY + canvasHeight - platformHeight - guyHeight / 2
  );

  // body
  drawRoundedRect(
    -guyWidth / 2, -guyHeight / 2, guyWidth, guyHeight - 4, 5
  );

  // legs
  const legDist = 5;
  ctx.beginPath();
  ctx.arc(legDist, 11.5, 3, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-legDist, 11.5, 3, 0, Math.PI * 2, false);
  ctx.fill();

  // eye
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.arc(5, -7, 3, 0, Math.PI * 2, false);
  ctx.fill();

  // restore transformations
  ctx.restore();
}

function drawRoundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.lineTo(x + width - radius, y + height);
  ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
  ctx.lineTo(x + width, y + radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.lineTo(x + radius, y);
  ctx.arcTo(x, y, x, y + radius, radius);
  ctx.fill();
}

function drawSticks() {
  sticks.forEach((stick) => {
    ctx.save();

    // move anchor point to start, rotate
    ctx.translate(stick.x, canvasHeight - platformHeight);
    ctx.rotate((Math.PI / 180) * stick.rotation);

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -stick.length);
    ctx.stroke();

    ctx.restore();
  });
}
