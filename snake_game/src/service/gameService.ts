import {Position} from "../model/position";
import {Snapshot} from "../model/snapshot";

export function createStartPosition(width: number, height: number) : Position {
  let set = new Set<number>();
  for (let i=0; i<5; i++) {
    set.add((height-10+i)*width + 5);
  }
  let cell = 0;
  do {
    cell = Math.floor(Math.random() * (width*height));
  } while (set.has(cell));
  return {snake: set, food: cell, width: width, height: height}
}

export function createSnapshot(position: Position) : Snapshot {
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

