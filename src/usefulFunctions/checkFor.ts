import { Cell } from "../types/types";
import { possibleMoves, proveSaveMoves } from "./possibleMoves";

export const isCheckForWhite = (board: Cell[]) => {
  let allPossibleEnemyMoves: string[] = [];
  let result = "";

  board.forEach((cell) => {
    if (cell.figureInside) {
      const allMovesForThisFigure = possibleMoves(
        cell.figureInside,
        cell.name,
        board
      );

      allPossibleEnemyMoves = [
        ...allPossibleEnemyMoves,
        ...allMovesForThisFigure,
      ];
    }
  });

  board.forEach((cell) => {
    if (cell.figureInside.includes("king-white")) {
      if (allPossibleEnemyMoves.includes(cell.name)) {
        result = `check for white`;
      }
    }
  });

  return result;
};

export const isCheckForBlack = (board: Cell[]) => {
  let allPossibleEnemyMoves: string[] = [];
  let result = "";

  board.forEach((cell) => {
    if (cell.figureInside) {
      const allMovesForThisFigure = possibleMoves(
        cell.figureInside,
        cell.name,
        board
      );

      allPossibleEnemyMoves = [
        ...allPossibleEnemyMoves,
        ...allMovesForThisFigure,
      ];
    }
  });

  board.forEach((cell) => {
    if (cell.figureInside.includes("king-black")) {
      if (allPossibleEnemyMoves.includes(cell.name)) {
        result = `check for black`;
      }
    }
  });

  return result;
};

export const isCheckMate = (nextMoveOf: string, board: Cell[]) => {
  let result = true;

  let allAllMoves: string[] = [];

  board.forEach((cell) => {
    if (cell.figureInside.includes(nextMoveOf)) {
      const currentPossibleMoves = possibleMoves(
        cell.figureInside,
        cell.name,
        board
      );
      const currentSaveMoves = proveSaveMoves(
        currentPossibleMoves,
        board,
        cell.name,
        cell.figureInside
      );

      if (currentSaveMoves.length > 0) {
        result = false;
      }

      allAllMoves = [...allAllMoves, ...currentSaveMoves];
    }
  });

  return result;
};
