import { updateSimulation, getSimulationImageData } from "./simulator.js";

const cameraPositions = [];

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

segmentationCanvas.width = simulationCanvas.width;
segmentationCanvas.height = simulationCanvas.height;
loop();

function loop() {
  updateSimulation();

  const imgData = getSimulationImageData();
  /*
  const { width, height } = inputCanvas;
  const ctx = inputCanvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(inputVideo, 0, 0);

  const imgData = ctx.getImageData(0, 0, width, height);
  */

  const rgbCounts = segmentImage(imgData);

  const distancesToBalls = estimateDistancesToBalls(rgbCounts);

  const cameraPosition = estimateCameraPosition(distancesToBalls);
  cameraPositions.push(cameraPosition);

  drawOutput(distancesToBalls, cameraPositions);

  requestAnimationFrame(loop);
}
