import { updateSimulation, getSimulationImageData } from "./simulator.js";

let inputType = null;

const cameraPositions = [];

fileInput.onchange = function (event) {
  const file = event.target.files[0];
  inputVideo.src = URL.createObjectURL(file);
  inputVideo.play();
};

inputVideo.onloadeddata = function () {
  inputType = "video";
  videoCanvas.width = inputVideo.videoWidth;
  videoCanvas.height = inputVideo.videoHeight;
  segmentationCanvas.width = inputVideo.videoWidth;
  segmentationCanvas.height = inputVideo.videoHeight;
  loop();
};

simulationButton.onclick = function () {
  inputType = "simulation";
  segmentationCanvas.width = simulationCanvas.width;
  segmentationCanvas.height = simulationCanvas.height;
  loop();
}


function loop() {
  let imgData = null;

  if (inputType == "simulation") {
    updateSimulation();
    imgData = getSimulationImageData();

  } else if (inputType == "video") {
    const { width, height } = videoCanvas;
    const ctx = videoCanvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(inputVideo, 0, 0);

    imgData = ctx.getImageData(0, 0, width, height);
  }

  const rgbCounts = segmentImage(imgData);

  const distancesToBalls = estimateDistancesToBalls(rgbCounts);

  const cameraPosition = estimateCameraPosition(distancesToBalls);
  cameraPositions.push(cameraPosition);

  drawOutput(distancesToBalls, cameraPositions);

  requestAnimationFrame(loop);
}
