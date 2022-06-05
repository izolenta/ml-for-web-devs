import React, {ReactNode, useEffect, useState} from 'react';
import './board.css';
import Cell, {CellState} from "./cell/cell";
import {initModelTf, processDataTf} from "../service/tfService";

const width = 28;
const height = 28;

const emptyCells = new Array<CellState>(width*height).fill(CellState.empty);

const drawPattern = [
  CellState.grayed33, CellState.grayed66, CellState.grayed33,
  CellState.grayed66, CellState.filled, CellState.grayed66,
  CellState.grayed33, CellState.grayed66, CellState.grayed33,
]
interface ProcessedResult {
  type: number;
  score: number;
}

const Board = () => {

  let cells = [];

  const [isDrawing, setDrawing] = useState(false);
  const [cellState, setCellState] = useState(() => emptyCells);
  const [processedData, setProcessedData] = useState(() => new Array<number>(10).fill(0));
  const [processedResult, setProcessedResult] = useState(-1);
  const [isInitialized, setInitialized] = useState(false);
  const [bars, setBars] = useState(() => new Array<ReactNode>());

  useEffect(() => {
    initModelTf().then(() => {
      setInitialized(true);
    });
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    let processed = processDataTf(cellState);
    setProcessedData(processed);

    let b = [];
    let lengths = new Array<ProcessedResult>();

    for (let i=0; i<10; i++) {
      lengths.push({type: i, score: processedData[i] * 560});
    }

    lengths.sort((a, b) => Math.sign(b.score - a.score));

    for (let i=0; i<5; i++) {
      let barStyle = {width: lengths[i].score};
      const elem = <div className={'bar'} key={i}>
        <div className={'bar-digit'}>{lengths[i].type}:</div>
        <div className={'bar-graph'} style={barStyle}></div>
      </div>;
      b.push(elem);
    }
    setBars(b);
  }, [cellState, isInitialized]);

  function drawCell(index: number) {
    if (isDrawing) {

      let newCells = [...cellState];
      let isModified = false;
      let y = Math.floor(index/width);
      let x = index % width;

      for (let i=-1; i<=1; i++) {
        for (let j=-1; j<=1; j++) {
          if (isOnPicture(y+i, x+j)) {
            const valueToFill = drawPattern[j+1+(i+1)*3];
            const indexToFill = x+j+(y+i)*28;
            if (newCells[indexToFill] < valueToFill) {
              isModified = true;
              newCells[indexToFill] = valueToFill;
            }
          }
        }
      }
      if (isModified) {
        setCellState(newCells);
      }
    }
  }

  function isOnPicture(x: number, y: number) {
    return x>=0 && x<28 && y>=0 && y<28;
  }

  for (let i=0; i<width*height; i++) {
    cells.push(<Cell
      key={i}
      isFilled={cellState[i]}
      onDraw={() => drawCell(i)}
    />)
  }

  let processed = <div></div>;

  if (processedResult >= 0) {
    processed = <div className={'processed'}>
      { processedResult }
    </div>
  }

  return (
    <div>
      <div className={"board"}
           onContextMenu={(e) => e.preventDefault()}
           onPointerDown={() => setDrawing(true)}
           onPointerUp={() => {
             setDrawing(false);
             let result = -1;
             let maxValue = 0;
             for (let i =0; i<10; i++) {
               if (processedData[i] > maxValue) {
                 maxValue = processedData[i];
                 result = i;
               }
             }
             setProcessedResult(result)
           }}>
        { cells }
      </div>
      <button className={'clearButton'} onClick={() => {
        setCellState(emptyCells);
        setProcessedResult(-1);}}>
        Clear
      </button>
      <div className={'bars'}>
        { bars }
      </div>
      { processed }
    </div>
  );
}

export default Board;

