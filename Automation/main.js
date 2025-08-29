const BALL_RADIUS = 3;
const DISTANCE_BETWEEN_BALLS = 9;
const PEN_HEIGHT = 18;
const INITIAL_Z_OFFSET = 18;

const INITIAL_CAMERA_POSITION = {
  x: 0,
  y: PEN_HEIGHT,
  z: INITIAL_Z_OFFSET,
};

const BALLS = initializeBalls();

const INITIAL_DISTANCES_TO_BALLS = BALLS.map((ball) => distance(ball, INITIAL_CAMERA_POSITION));

let initialApparentRadii = null;



fileInput.onchange = function (event) {
  const file = event.target.files[0];
  inputVideo.src = URL.createObjectURL(file);
  inputVideo.play();
};

inputVideo.onloadeddata = function () {
  inputCanvas.width = inputVideo.videoWidth;
  inputCanvas.height = inputVideo.videoHeight;
  segmentationCanvas.width = inputVideo.videoWidth;
  segmentationCanvas.height = inputVideo.videoHeight;
  loop();
};

function loop() {
  const { width, height } = inputCanvas;
  const ctx = inputCanvas.getContext("2d");
  ctx.drawImage(inputVideo, 0, 0);

  const imgData = ctx.getImageData(0, 0, width, height);
  const rgbCounts = segmentImage(imgData);
  const apparentRadii = rgbCounts.map((area) => Math.sqrt(area / Math.PI));

  if (!initialApparentRadii) {
    initialApparentRadii = apparentRadii;
  }

  const distancesToBalls = [];
  for (let i = 0; i < apparentRadii.length; i++) {
    const ratio = initialApparentRadii[i] / apparentRadii[i];
    distancesToBalls[i] = INITIAL_DISTANCES_TO_BALLS[i] * ratio;
  }

  drawOutput(distancesToBalls);

  requestAnimationFrame(loop);
}

function segmentImage(imgData, threshold = 50) {
  const { width, height, data } = imgData;
  const ctx = segmentationCanvas.getContext("2d");

  const outputData = ctx.createImageData(width, height);

  const rgbCounts = [0, 0, 0, 0];

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // const a = data[i + 3];

    const diffR = r - (g + b) / 2;
    const diffG = g - (r + b) / 2;
    const diffB = b - (r + g) / 2;

    const newR = diffR > threshold ? 255 : 0;
    const newG = diffG > threshold ? 255 : 0;
    const newB = diffB > threshold ? 255 : 0;

    rgbCounts[0] += newR / 255;
    rgbCounts[1] += newG / 255;
    rgbCounts[2] += newB / 255;

    outputData.data.set([newR, newG, newB, 255], i);
  }

  ctx.putImageData(outputData, 0, 0);
  return rgbCounts;
}


function initializeBalls() {
  const triangleLength = DISTANCE_BETWEEN_BALLS;
  const left = -triangleLength / 2;
  const right = triangleLength / 2;

  const triangleHeight = triangleLength * Math.sqrt(3) / 2;
  const bottom = PEN_HEIGHT - triangleHeight / 3;
  const top = PEN_HEIGHT + triangleHeight * 2 / 3;

  const radius = BALL_RADIUS;

  return [
    { x: 0,     y: top,     z: 0, radius, color: "#ff0000" },
    { x: right, y: bottom,  z: 0, radius, color: "#00ff00" },
    { x: left,  y: bottom,  z: 0, radius, color: "#0000ff" },
  ];
}


function drawOutput(distanceToBalls) {
  const { width, height } = outputCanvas;
  const ctx = outputCanvas.getContext("2d");

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "black";
  ctx.textBaseline = "top";
  ctx.font = "20px Arial";
  ctx.fillText("Top View", 5, 5);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(5, 5);
  for (let i = BALLS.length - 1; i >= 1; i--) {
    const {x, z, radius, color} = BALLS[i];
    ctx.beginPath();
    ctx.arc(x, z, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.lineWidth = 0.2;
    ctx.beginPath();
    ctx.arc(x, z, distanceToBalls[i], 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  ctx.beginPath();
  const { x, z } = INITIAL_CAMERA_POSITION;
  ctx.arc(x, z, 0.5, 0, Math.PI * 2);
  ctx.fillStyle = "black";
  ctx.fill();

  ctx.restore();
}


function distance(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y, p1.z - p2.z);
}
