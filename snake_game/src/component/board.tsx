import * as brain from 'brain.js';
import './board.css';
import {createSnapshot, createStartPosition} from "../service/gameService";
import {network} from '../service/trainedData';
import React, {ReactNode, useEffect, useState} from 'react';
import {Position} from "../model/position";

const width = 40;
const height = 40;
const net = new brain.NeuralNetwork();

interface SnakeState {
  board: Position;
  isAlive: boolean;
}

const Board = function() {

  const [cells, setCells] = useState(() => new Array<ReactNode>());

  const [snakeState, setSnakeState] = useState(function() {
    return {board: createStartPosition(width, height), isAlive: true}
  });

  useEffect(() => {
    net.fromJSON(JSON.parse(network));
    const timer = setInterval(() => {
      setSnakeState(oldState => makeMove(oldState));
    }, 30);
    return () => clearInterval(timer);
  }, []);

  function makeMove(oldState: SnakeState): SnakeState {
    if (!oldState.isAlive) return oldState;

    let arr = Array.from(oldState.board.snake);
    let head = arr[0];
    let snapshot = createSnapshot(oldState.board);
    let input = [...snapshot.obstacles, ...snapshot.food];

    let directions = net.run(input) as number[];
    let max = Math.max(...directions);
    let direction = directions.map((next) => next === max? 1 : 0).indexOf(1);

    let x = head % width;
    let y = Math.floor(head / width);

    let live = true;

    if (direction === 0) {
      arr = ([head-1, ...arr]);
      if (x === 0) live = false;
    }

    if (direction === 1) {
      arr = ([head-width, ...arr]);
      if (y === 0) live = false;
    }

    if (direction === 2) {
      arr = ([head+1, ...arr]);
      if (x === width-1) live = false;
    }

    if (direction === 3) {
      arr = ([head+width, ...arr]);
      if (y === height-1) live = false;
    }

    if (oldState.board.snake.has(arr[0])) live = false;

    let newFood = oldState.board.food;
    if (arr[0] === oldState.board.food) {
      do {
        newFood = Math.floor(Math.random() * width*height);
      } while (oldState.board.snake.has(newFood) || arr[0] === newFood);
    }
    else {
      arr.pop();
    }

    let newBoard = {...oldState.board, snake: new Set<number>(arr), food: newFood};
    return {board: newBoard, isAlive: live};
  }

  useEffect(() => {
    let cells = [];
    let head = Array.from(snakeState.board.snake)[0];
    for (let i=0; i< width*height; i++) {
      let cellClass = 'empty';
      if (snakeState.board.snake.has(i)) cellClass = 'snake';
      if (snakeState.board.food === i) cellClass = 'food';
      if (head === i) cellClass = 'head';
      cells.push(<div className={cellClass} key={i}/>);
    }
    setCells(cells);
  }, [snakeState]);

  return (
    <div>
      <div className={'board'}>
        { cells }
      </div>
    </div>
  );
}

export default Board;
