import { Cell } from "../types/types";
import { isCheckForBlack, isCheckForWhite } from "./checkFor";
import {
  transformCoordsToNumbs,
  transformCoordsToStr,
} from "./transformCoords";

type AllFutureBoards = {
  move: string;
  boardAfterMove: Cell[];
};

export type ProveCastle = {
  castleWhite: boolean;
  castleBlack: boolean;
  nowCheck: boolean;
};

export const proveSaveMoves = (
  movesTo: string[],
  currentBoard: Cell[],
  moveFrom: string,
  figureMoves: string
) => {
  if (movesTo.length === 0) {
    return [];
  }

  const myColor = figureMoves.split("-")[1];
  const allFutureBoards: AllFutureBoards[] = [];

  movesTo.forEach((futureMoveTo) => {
    allFutureBoards.push({
      move: futureMoveTo,
      boardAfterMove: currentBoard.map((cell) => {
        if (cell.name === moveFrom) {
          return { ...cell, figureInside: "", selectedFigure: false };
        }

        if (cell.name === futureMoveTo) {
          return {
            ...cell,
            figureInside: figureMoves,
            possibleMove: false,
            selectedFigure: false,
          };
        }

        return { ...cell, selectedFigure: false, possibleMove: false };
      }),
    });
  });

  const saveMoves: string[] = [];

  allFutureBoards.forEach((moveAndBoard) => {
    if (
      myColor === "white"
        ? !isCheckForWhite(moveAndBoard.boardAfterMove).includes("white")
        : !isCheckForBlack(moveAndBoard.boardAfterMove).includes("black")
    ) {
      saveMoves.push(moveAndBoard.move);
    }
  });

  return saveMoves;
};

export const possibleMoves = (
  figure: string,
  figureCell: string,
  currentBoard: Cell[],
  proveCastle?: ProveCastle
) => {
  switch (figure) {
    case "pawn-white":
      return possibleMovesPawnWhite(figureCell, currentBoard);

    case "pawn-black":
      return possibleMovesPawnBlack(figureCell, currentBoard);

    case "knight-white":
    case "knight-black":
      return possibleMovesKnight(figure, figureCell, currentBoard);

    case "rook-white":
    case "rook-black":
      return possibleMovesRook(figure, figureCell, currentBoard);

    case "bishop-white":
    case "bishop-black":
      return possibleMovesBishop(figure, figureCell, currentBoard);

    case "queen-white":
    case "queen-black":
      return possibleMovesQueen(figure, figureCell, currentBoard);

    case "king-white":
    case "king-black":
      return possibleMovesKing(figure, figureCell, currentBoard, proveCastle);

    default:
      return [];
  }
};

const possibleMovesPawnWhite = (currentCell: string, currentBoard: Cell[]) => {
  const currCellCoords = transformCoordsToNumbs(currentCell);
  const possibleMovesVerified: string[] = [];

  const moveForwardOne = transformCoordsToStr({
    ...currCellCoords,
    y: currCellCoords.y + 1,
  });

  const moveForwardTwo = transformCoordsToStr({
    ...currCellCoords,
    y: currCellCoords.y + 2,
  });

  const moveHitLeft = transformCoordsToStr({
    y: currCellCoords.y + 1,
    x: currCellCoords.x - 1,
  });

  const moveHitRight = transformCoordsToStr({
    y: currCellCoords.y + 1,
    x: currCellCoords.x + 1,
  });

  const figuresOnPossibleMoves = {
    figureOnMoveForwardOne: "",
    figureOnMoveForwardTwo: "",
    figureOnMoveHitLeft: "",
    figureOnMoveHitRight: "",
  };

  currentBoard.forEach((cell) => {
    if (cell.name === moveForwardOne) {
      figuresOnPossibleMoves.figureOnMoveForwardOne = cell.figureInside;
    }
    if (cell.name === moveForwardTwo) {
      figuresOnPossibleMoves.figureOnMoveForwardTwo = cell.figureInside;
    }
    if (cell.name === moveHitLeft) {
      figuresOnPossibleMoves.figureOnMoveHitLeft = cell.figureInside;
    }
    if (cell.name === moveHitRight) {
      figuresOnPossibleMoves.figureOnMoveHitRight = cell.figureInside;
    }
  });

  if (!figuresOnPossibleMoves.figureOnMoveForwardOne) {
    possibleMovesVerified.push(moveForwardOne);
  }

  if (
    !figuresOnPossibleMoves.figureOnMoveForwardOne &&
    !figuresOnPossibleMoves.figureOnMoveForwardTwo &&
    currCellCoords.y === 2
  ) {
    possibleMovesVerified.push(moveForwardTwo);
  }

  if (figuresOnPossibleMoves.figureOnMoveHitLeft.includes("black")) {
    possibleMovesVerified.push(moveHitLeft);
  }

  if (figuresOnPossibleMoves.figureOnMoveHitRight.includes("black")) {
    possibleMovesVerified.push(moveHitRight);
  }

  return possibleMovesVerified;
};

const possibleMovesPawnBlack = (currentCell: string, currentBoard: Cell[]) => {
  const currCellCoords = transformCoordsToNumbs(currentCell);
  const possibleMovesVerified: string[] = [];

  const moveForwardOne = transformCoordsToStr({
    ...currCellCoords,
    y: currCellCoords.y - 1,
  });

  const moveForwardTwo = transformCoordsToStr({
    ...currCellCoords,
    y: currCellCoords.y - 2,
  });

  const moveHitLeft = transformCoordsToStr({
    y: currCellCoords.y - 1,
    x: currCellCoords.x + 1,
  });

  const moveHitRight = transformCoordsToStr({
    y: currCellCoords.y - 1,
    x: currCellCoords.x - 1,
  });

  const figuresOnPossibleMoves = {
    figureOnMoveForwardOne: "",
    figureOnMoveForwardTwo: "",
    figureOnMoveHitLeft: "",
    figureOnMoveHitRight: "",
  };

  currentBoard.forEach((cell) => {
    if (cell.name === moveForwardOne) {
      figuresOnPossibleMoves.figureOnMoveForwardOne = cell.figureInside;
    }
    if (cell.name === moveForwardTwo) {
      figuresOnPossibleMoves.figureOnMoveForwardTwo = cell.figureInside;
    }
    if (cell.name === moveHitLeft) {
      figuresOnPossibleMoves.figureOnMoveHitLeft = cell.figureInside;
    }
    if (cell.name === moveHitRight) {
      figuresOnPossibleMoves.figureOnMoveHitRight = cell.figureInside;
    }
  });

  if (!figuresOnPossibleMoves.figureOnMoveForwardOne) {
    possibleMovesVerified.push(moveForwardOne);
  }

  if (
    !figuresOnPossibleMoves.figureOnMoveForwardOne &&
    !figuresOnPossibleMoves.figureOnMoveForwardTwo &&
    currCellCoords.y === 7
  ) {
    possibleMovesVerified.push(moveForwardTwo);
  }

  if (figuresOnPossibleMoves.figureOnMoveHitLeft.includes("white")) {
    possibleMovesVerified.push(moveHitLeft);
  }

  if (figuresOnPossibleMoves.figureOnMoveHitRight.includes("white")) {
    possibleMovesVerified.push(moveHitRight);
  }

  return possibleMovesVerified;
};

const possibleMovesKnight = (
  currentFigure: string,
  currentCell: string,
  currentBoard: Cell[]
) => {
  const myColor = currentFigure.split("-")[1];
  const currCellCoords = transformCoordsToNumbs(currentCell);
  const existedCells = currentBoard.map((cell) => cell.name);
  const allPossibleMoves: string[] = [];

  allPossibleMoves.push(
    transformCoordsToStr({
      x: currCellCoords.x - 2,
      y: currCellCoords.y + 1,
    })
  );

  allPossibleMoves.push(
    transformCoordsToStr({
      x: currCellCoords.x - 1,
      y: currCellCoords.y + 2,
    })
  );

  allPossibleMoves.push(
    transformCoordsToStr({
      x: currCellCoords.x + 1,
      y: currCellCoords.y + 2,
    })
  );

  allPossibleMoves.push(
    transformCoordsToStr({
      x: currCellCoords.x + 2,
      y: currCellCoords.y + 1,
    })
  );

  allPossibleMoves.push(
    transformCoordsToStr({
      x: currCellCoords.x + 2,
      y: currCellCoords.y - 1,
    })
  );

  allPossibleMoves.push(
    transformCoordsToStr({
      x: currCellCoords.x + 1,
      y: currCellCoords.y - 2,
    })
  );

  allPossibleMoves.push(
    transformCoordsToStr({
      x: currCellCoords.x - 1,
      y: currCellCoords.y - 2,
    })
  );

  allPossibleMoves.push(
    transformCoordsToStr({
      x: currCellCoords.x - 2,
      y: currCellCoords.y - 1,
    })
  );

  const allPossibleMovesInsideBoard = allPossibleMoves.filter((move) =>
    existedCells.includes(move)
  );

  const myFiguresOnPossibleCells = currentBoard
    .map((cell) => {
      if (
        allPossibleMovesInsideBoard.includes(cell.name) &&
        cell.figureInside.includes(myColor)
      ) {
        return cell.name;
      } else {
        return undefined;
      }
    })
    .filter((x) => x !== undefined);

  const possibleMovesVerified = allPossibleMovesInsideBoard.filter(
    (x) => !myFiguresOnPossibleCells.includes(x)
  );

  return possibleMovesVerified;
};

const possibleMovesRook = (
  currentFigure: string,
  currentCell: string,
  currentBoard: Cell[]
) => {
  const myColor = currentFigure.split("-")[1];
  const enemysColor = myColor === "white" ? "black" : "white";

  const currCellCoords = transformCoordsToNumbs(currentCell);
  const allPossibleMoves: string[] = [];
  const myFiguresOnCell = currentBoard
    .filter((cell) => cell.figureInside.includes(myColor))
    .map((cell) => cell.name);

  const enemysFiguresOnCell = currentBoard
    .filter((cell) => cell.figureInside.includes(enemysColor))
    .map((cell) => cell.name);

  // up
  for (let i = currCellCoords.y + 1; i <= 8; i++) {
    const move = transformCoordsToStr({
      y: i,
      x: currCellCoords.x,
    });

    if (myFiguresOnCell.includes(move)) {
      break;
    } else if (enemysFiguresOnCell.includes(move)) {
      allPossibleMoves.push(move);
      break;
    } else {
      allPossibleMoves.push(move);
    }
  }

  // right
  for (let i = currCellCoords.x + 1; i <= 8; i++) {
    const move = transformCoordsToStr({
      x: i,
      y: currCellCoords.y,
    });

    if (myFiguresOnCell.includes(move)) {
      break;
    } else if (enemysFiguresOnCell.includes(move)) {
      allPossibleMoves.push(move);
      break;
    } else {
      allPossibleMoves.push(move);
    }
  }

  // down
  for (let i = currCellCoords.y - 1; i >= 1; i--) {
    const move = transformCoordsToStr({
      y: i,
      x: currCellCoords.x,
    });

    if (myFiguresOnCell.includes(move)) {
      break;
    } else if (enemysFiguresOnCell.includes(move)) {
      allPossibleMoves.push(move);
      break;
    } else {
      allPossibleMoves.push(move);
    }
  }

  // left
  for (let i = currCellCoords.x - 1; i >= 1; i--) {
    const move = transformCoordsToStr({
      x: i,
      y: currCellCoords.y,
    });

    if (myFiguresOnCell.includes(move)) {
      break;
    } else if (enemysFiguresOnCell.includes(move)) {
      allPossibleMoves.push(move);
      break;
    } else {
      allPossibleMoves.push(move);
    }
  }

  return allPossibleMoves;
};

const possibleMovesBishop = (
  currentFigure: string,
  currentCell: string,
  currentBoard: Cell[]
) => {
  const myColor = currentFigure.split("-")[1];
  const enemysColor = myColor === "white" ? "black" : "white";

  const existedCells = currentBoard.map((cell) => cell.name);
  const currCellCoords = transformCoordsToNumbs(currentCell);
  const allPossibleMoves: string[] = [];
  const myFiguresOnCell = currentBoard
    .filter((cell) => cell.figureInside.includes(myColor))
    .map((cell) => cell.name);

  const enemysFiguresOnCell = currentBoard
    .filter((cell) => cell.figureInside.includes(enemysColor))
    .map((cell) => cell.name);

  // up-right
  for (let i = 1; i <= 8; i++) {
    const move = transformCoordsToStr({
      y: currCellCoords.y + i,
      x: currCellCoords.x + i,
    });

    if (myFiguresOnCell.includes(move)) {
      break;
    } else if (enemysFiguresOnCell.includes(move)) {
      allPossibleMoves.push(move);
      break;
    } else {
      allPossibleMoves.push(move);
    }
  }

  // down-right [3.3] => 4.2 => 5.1
  for (let i = 1; i <= 8; i++) {
    const move = transformCoordsToStr({
      x: currCellCoords.x + i,
      y: currCellCoords.y - i,
    });

    if (myFiguresOnCell.includes(move)) {
      break;
    } else if (enemysFiguresOnCell.includes(move)) {
      allPossibleMoves.push(move);
      break;
    } else {
      allPossibleMoves.push(move);
    }
  }

  // down-left
  for (let i = 1; i <= 8; i++) {
    const move = transformCoordsToStr({
      x: currCellCoords.x - i,
      y: currCellCoords.y - i,
    });

    if (myFiguresOnCell.includes(move)) {
      break;
    } else if (enemysFiguresOnCell.includes(move)) {
      allPossibleMoves.push(move);
      break;
    } else {
      allPossibleMoves.push(move);
    }
  }

  // up-left
  for (let i = 1; i <= 8; i++) {
    const move = transformCoordsToStr({
      x: currCellCoords.x - i,
      y: currCellCoords.y + i,
    });

    if (myFiguresOnCell.includes(move)) {
      break;
    } else if (enemysFiguresOnCell.includes(move)) {
      allPossibleMoves.push(move);
      break;
    } else {
      allPossibleMoves.push(move);
    }
  }

  const possibleMovesVerified = allPossibleMoves.filter((move) =>
    existedCells.includes(move)
  );

  return possibleMovesVerified;
};

const possibleMovesQueen = (
  currentFigure: string,
  currentCell: string,
  currentBoard: Cell[]
) => {
  const rookMoves = possibleMovesRook(currentFigure, currentCell, currentBoard);
  const bishopMoves = possibleMovesBishop(
    currentFigure,
    currentCell,
    currentBoard
  );

  const allQueenMoves = [...rookMoves, ...bishopMoves];

  return allQueenMoves;
};

const possibleMovesKing = (
  currentFigure: string,
  currentCell: string,
  currentBoard: Cell[],
  proveCastle?: ProveCastle
) => {
  const myColor = currentFigure.split("-")[1];
  const currCellCoords = transformCoordsToNumbs(currentCell);
  const existedCells = currentBoard.map((cell) => cell.name);
  const allPossibleMoves: string[] = [];

  if (
    myColor === "white" &&
    currentCell === "e-1" &&
    proveCastle?.castleWhite &&
    !proveCastle.nowCheck
  ) {
    allPossibleMoves.push("g-1");
    allPossibleMoves.push("c-1");
  }

  if (
    myColor === "black" &&
    currentCell === "e-8" &&
    proveCastle?.castleBlack &&
    !proveCastle.nowCheck
  ) {
    allPossibleMoves.push("g-8");
    allPossibleMoves.push("c-8");
  }

  allPossibleMoves.push(
    transformCoordsToStr({
      x: currCellCoords.x,
      y: currCellCoords.y + 1,
    })
  );

  allPossibleMoves.push(
    transformCoordsToStr({
      x: currCellCoords.x + 1,
      y: currCellCoords.y + 1,
    })
  );

  allPossibleMoves.push(
    transformCoordsToStr({
      x: currCellCoords.x + 1,
      y: currCellCoords.y,
    })
  );

  allPossibleMoves.push(
    transformCoordsToStr({
      x: currCellCoords.x + 1,
      y: currCellCoords.y - 1,
    })
  );

  allPossibleMoves.push(
    transformCoordsToStr({
      x: currCellCoords.x,
      y: currCellCoords.y - 1,
    })
  );

  allPossibleMoves.push(
    transformCoordsToStr({
      x: currCellCoords.x - 1,
      y: currCellCoords.y - 1,
    })
  );

  allPossibleMoves.push(
    transformCoordsToStr({
      x: currCellCoords.x - 1,
      y: currCellCoords.y,
    })
  );

  allPossibleMoves.push(
    transformCoordsToStr({
      x: currCellCoords.x - 1,
      y: currCellCoords.y + 1,
    })
  );

  const allPossibleMovesInsideBoard = allPossibleMoves.filter((move) =>
    existedCells.includes(move)
  );

  const myFiguresOnPossibleCells = currentBoard
    .map((cell) => {
      if (
        allPossibleMovesInsideBoard.includes(cell.name) &&
        cell.figureInside.includes(myColor)
      ) {
        return cell.name;
      } else {
        return undefined;
      }
    })
    .filter((x) => x !== undefined);

  const possibleMovesVerified = allPossibleMovesInsideBoard.filter(
    (x) => !myFiguresOnPossibleCells.includes(x)
  );

  return possibleMovesVerified;
};
