import { Cell } from "../types/types";
import { isCheckMate } from "../usefulFunctions/checkFor";
import {
  possibleMoves,
  ProveCastle,
  proveSaveMoves,
} from "../usefulFunctions/possibleMoves";

type FiguresThatCanMove = {
  figure: string;
  fromCell: string;
  toCell: string[];
};

const getRandom = (maxValue: number) => {
  return Math.floor(Math.random() * (maxValue + 1));
};

// точнее можна только массив  [ figureToMove, cellFromMove, cellToMove]
export const blackMoveAI = (
  currentBoard: Cell[],
  proveToCastle: ProveCastle
): [string, string, string] => {
  if (isCheckMate('black', currentBoard)) {
    return ['move', 'move', 'move'];
  }
  
  const figuresThatCanMove: FiguresThatCanMove[] = [];

  currentBoard.forEach((cell) => {
    if (cell.figureInside.includes("black")) {
      const posMoves = possibleMoves(
        cell.figureInside,
        cell.name,
        currentBoard,
        proveToCastle
      );
      const posSaveMoves = proveSaveMoves(
        posMoves,
        currentBoard,
        cell.name,
        cell.figureInside
      );

      if (posSaveMoves.length > 0) {
        figuresThatCanMove.push({
          figure: cell.figureInside,
          fromCell: cell.name,
          toCell: posSaveMoves,
        });
      }
    }
  });

  const randomFigureIndex = getRandom(figuresThatCanMove.length - 1);
  const randomFigure = figuresThatCanMove[randomFigureIndex];

  if (
    randomFigure.fromCell === "e-8" &&
    randomFigure.figure === "king-black" &&
    randomFigure.toCell.includes("g-8") &&
    !randomFigure.toCell.includes("f-8")
  ) {
    randomFigure.toCell = randomFigure.toCell.filter((x) => x !== "g-8");
  }

  if (
    randomFigure.fromCell === "e-8" &&
    randomFigure.figure === "king-black" &&
    randomFigure.toCell.includes("c-8") &&
    !randomFigure.toCell.includes("d-8")
  ) {
    randomFigure.toCell = randomFigure.toCell.filter((x) => x !== "c-8");
  }

  const randomMoveIndex = getRandom(randomFigure.toCell.length - 1);
  const randomMove = randomFigure.toCell[randomMoveIndex];

  return [randomFigure.figure, randomFigure.fromCell, randomMove];
};
