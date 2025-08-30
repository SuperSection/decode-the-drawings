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
