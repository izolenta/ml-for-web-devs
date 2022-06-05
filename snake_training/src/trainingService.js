import * as fs from 'fs';
import * as brain from "brain.js";

const config = {
  hiddenLayers: [30],
  activation: 'sigmoid',
};

const neighbors = [
  {x: -1, y: 0},
  {x: 0, y: -1},
  {x: 1, y: 0},
  {x: 0, y: 1},
]

const net = new brain.NeuralNetwork(config);

const w = 20;
const h = 20;

let trainData = [];
for (let i=0; i<500000; i++) {
  let pos = createPosition();
  let snap = createSnapshot(pos);
  let move = getCorrectMove(pos);
  let input = [];
  input.push(...snap.obstacles, ...snap.food);
  trainData.push({
    input: input,
    output: move
  });
}
console.log('training');
net.train(trainData, {
  callback: (status) => {console.log('iterations: '+status.iterations+', error: '+status.error)},
  callbackPeriod: 1
});

fs.writeFileSync('snake.json', JSON.stringify(net.toJSON()), {encoding: 'utf8'})

function createPosition() {
  let set = new Set();
  let cell = 0;
  for (let i=0; i<h*w/3; i++) {
    do {
      cell = Math.floor(Math.random() * w*h);
    } while (set.has(cell));
    set.add(cell);
    do {
      cell = Math.floor(Math.random() * w*h);
    } while (set.has(cell));
  }
  return {snake: set, food: cell, width: w, height: h}
}

export function getCorrectMove(position) {
  let prefMoves = new Array(4).fill(0.5);
  let arr = Array.from(position.snake);
  let x = arr[0] % position.width;
  let y = Math.floor(arr[0] / position.width);
  let foodx = position.food % position.width;
  let foody = Math.floor(position.food / position.width);
  if (foodx > x) prefMoves[2] = 1;
  if (foodx < x) prefMoves[0] = 1;
  if (foody > y) prefMoves[3] = 1;
  if (foody < y) prefMoves[1] = 1;

  for (let i=0; i<4; i++) {
    let dist = checkAvailableMoves(position, neighbors[i].x, neighbors[i].y)
    if (dist === 0) prefMoves[i] = -10;
  }

  let result = new Array(4).fill(0);
  let maxValue = Math.max(...prefMoves);

  for (let i=0; i<4; i++) {
    if (prefMoves[i] === maxValue) {
      result[i] = 1;
      break;
    }
  }
  return result;
}

function checkAvailableMoves(position, deltaX, deltaY) {
  let arr = Array.from(position.snake);
  let x = arr[0] % position.width + deltaX;
  let y = Math.floor(arr[0] / position.width)+deltaY;
  let distance = 0;
  while (true) {
    if (x === -1 || y === -1 || x === position.width || y === position.height || position.snake.has(x + y*position.width)) {
      break;
    }
    distance++;
    x+=deltaX;
    y+=deltaY;
  }
  return distance;
}

function createSnapshot(position) {
  let foodArray = new Array(4).fill(0);
  let obstacleArray = new Array(4).fill(0);
  let arr = Array.from(position.snake);
  let x = arr[0] % position.width;
  let y = Math.floor(arr[0] / position.width);
  let foodx = position.food % position.width;
  let foody = Math.floor(position.food / position.width);
  if (foodx >= x) foodArray[2] = 1;
  if (foodx <= x) foodArray[0] = 1;
  if (foody >= y) foodArray[3] = 1;
  if (foody <= y) foodArray[1] = 1;
  if (x-1 === -1 || position.snake.has(x-1+y*position.width)) {
    obstacleArray[0] = 1;
  }
  if (x+1 === position.width || position.snake.has(x+1+y*position.width)) {
    obstacleArray[2] = 1;
  }
  if (y-1 === -1 || position.snake.has(x+(y-1)*position.width)) {
    obstacleArray[1] = 1;
  }
  if (y+1 === position.height || position.snake.has(x+(y+1)*position.width)) {
    obstacleArray[3] = 1;
  }
  return {obstacles: obstacleArray, food: foodArray};
}