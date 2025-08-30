import { loop } from "./main.js";
import { getSimulationImageData, updateSimulation } from "./simulator.js";

let inputType = null;


const videoButton = document.getElementById("videoButton");
const simulationButton = document.getElementById("simulationButton");

const fileInput = document.getElementById("fileInput");
const inputVideo = document.getElementById("inputVideo");

const videoCanvas = document.getElementById("videoCanvas");
const segmentationCanvas = document.getElementById("segmentationCanvas");
const simulationCanvas = document.getElementById("simulationCanvas");


videoButton.onclick = function () {
  fileInput.click();
}

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

  simulationCanvas.style.display = "none";
  mainInterface.style.display = "flex";
  startPanel.style.display = "none";

  loop();
};

simulationButton.onclick = function () {
  inputType = "simulation";
  segmentationCanvas.width = simulationCanvas.width;
  segmentationCanvas.height = simulationCanvas.height;

  videoCanvas.style.display = "none";
  mainInterface.style.display = "flex";
  startPanel.style.display = "none";

  loop();
}


export function getInputImageData() {
  let imgData = null;
  let trueCameraPosition = null;

  if (inputType == "simulation") {
    trueCameraPosition = updateSimulation();
    imgData = getSimulationImageData();

  } else if (inputType == "video") {
    const { width, height } = videoCanvas;
    const ctx = videoCanvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(inputVideo, 0, 0);

    imgData = ctx.getImageData(0, 0, width, height);
  }

  return { imgData, trueCameraPosition };
}
