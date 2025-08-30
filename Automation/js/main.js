import { estimateCameraPosition, estimateDistancesToBalls } from "./estimator.js";
import { segmentImage } from "./imageProcessing.js";
import { getInputImageData } from "./input.js";
import { drawOutput } from "./output.js";

const cameraPositions = [];

export function loop() {
  const { imgData, trueCameraPosition } = getInputImageData();

  const rgbCounts = segmentImage(imgData);

  const distancesToBalls = estimateDistancesToBalls(rgbCounts);

  const cameraPosition = estimateCameraPosition(distancesToBalls);
  cameraPositions.push(cameraPosition);

  drawOutput(distancesToBalls, cameraPositions, trueCameraPosition);

  requestAnimationFrame(loop);
}
