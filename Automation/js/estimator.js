import { DISTANCE_BETWEEN_BALLS, INITIAL_DISTANCES_TO_BALLS } from "./parameters.js";

let initialApparentRadii = null;

export function estimateDistancesToBalls(rgbCounts) {
  const apparentRadii = rgbCounts.map((area) => Math.sqrt(area / Math.PI));

  if (!initialApparentRadii) {
    initialApparentRadii = apparentRadii;
  }

  const distancesToBalls = [];

  for (let i = 0; i < apparentRadii.length; i++) {
    const ratio = initialApparentRadii[i] / apparentRadii[i];
    distancesToBalls[i] = INITIAL_DISTANCES_TO_BALLS[i] * ratio;
  }

  return distancesToBalls;
}

export function estimateCameraPosition(distancesToBalls) {
  const d = DISTANCE_BETWEEN_BALLS;

  const a = distancesToBalls[0];
  const b = distancesToBalls[1];
  const c = distancesToBalls[2];

  const x = (c ** 2 - d ** 2 - b ** 2) / (2 * d);
  const z = Math.sqrt(b ** 2 - x ** 2);

  const xOffset = d / 2;
  return { x: x + xOffset, z };
}
