import React, {useRef} from 'react';
import './cell.css';

export enum CellState {empty = 0, grayed33 = 0.33, grayed66 = 0.66, filled = 1}

// @ts-ignore
const Cell = ({ isFilled, onDraw }) => {

  let cName = 'cell';
  if (isFilled === CellState.grayed33) cName += ' grayed33';
  if (isFilled === CellState.grayed66) cName += ' grayed66';
  if (isFilled === CellState.filled) cName += ' selected';
  return (
    <div
      className={cName}
      onPointerDown={(e) => {e.currentTarget.releasePointerCapture(e.pointerId); onDraw()}}
      onPointerMove={onDraw}
      onPointerEnter={onDraw}>
    </div>
  );
}

export default Cell;
