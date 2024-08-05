import { Cell } from "../types/types";

export type Action =
  | { type: "setSelectedFigure"; payload: string }
  | { type: "deleteSelectedFigure" }
  | { type: "setPossibleMoves"; payload: string[] }
  | { type: "makeMove"; payload: [string, string, string] };

/* что можно делать ? 
  type: 'setSelectedFigure',
  payload: 'c-3',
  ---------------
  type: 'setPossibleMoves',
  payload: ['c-4', 'c-5'],
  -----------------------
  type: 'makeMove',
  payload: ['pawn-white', 'c-3', 'c-4']
*/
export function reducer(board: Cell[], action: Action) {
  switch (action.type) {
    case "setSelectedFigure":
      return board.map((cell) => {
        if (cell.name === action.payload && cell.figureInside) {
          return { ...cell, selectedFigure: true };
        } else {
          return { ...cell, selectedFigure: false };
        }
      });

    case "deleteSelectedFigure":
      return board.map((cell) => ({
        ...cell,
        selectedFigure: false,
        possibleMove: false,
      }));

    case "setPossibleMoves":
      return board.map((cell) => {
        if (action.payload?.includes(cell.name)) {
          return { ...cell, possibleMove: true };
        } else {
          return { ...cell, possibleMove: false };
        }
      });

    case "makeMove":
      const isMoveToQueen =
        action.payload[0].includes("pawn") &&
        (action.payload[2].includes("8") || action.payload[2].includes("1"));

      //castle white right
      if (
        action.payload[0] === "king-white" &&
        action.payload[1] === "e-1" &&
        action.payload[2] === "g-1"
      ) {
        return board.map((cell) => {
          if (cell.name === action.payload[1]) {
            return { ...cell, figureInside: "", selectedFigure: false };
          }

          if (cell.name === action.payload[2]) {
            return {
              ...cell,
              figureInside: action.payload[0],
              possibleMove: false,
              selectedFigure: true,
            };
          }

          if (cell.name === "f-1") {
            return {
              ...cell,
              figureInside: "rook-white",
              possibleMove: false,
              selectedFigure: false,
            };
          }

          if (cell.name === "h-1") {
            return {
              ...cell,
              figureInside: "",
              possibleMove: false,
              selectedFigure: false,
            };
          }

          return { ...cell, selectedFigure: false, possibleMove: false };
        });
      }

      //castle white left
      if (
        action.payload[0] === "king-white" &&
        action.payload[1] === "e-1" &&
        action.payload[2] === "c-1"
      ) {
        return board.map((cell) => {
          if (cell.name === action.payload[1]) {
            return { ...cell, figureInside: "", selectedFigure: false };
          }

          if (cell.name === action.payload[2]) {
            return {
              ...cell,
              figureInside: action.payload[0],
              possibleMove: false,
              selectedFigure: true,
            };
          }

          if (cell.name === "d-1") {
            return {
              ...cell,
              figureInside: "rook-white",
              possibleMove: false,
              selectedFigure: false,
            };
          }

          if (cell.name === "a-1") {
            return {
              ...cell,
              figureInside: "",
              possibleMove: false,
              selectedFigure: false,
            };
          }

          return { ...cell, selectedFigure: false, possibleMove: false };
        });
      }

      //castle black left
      if (
        action.payload[0] === "king-black" &&
        action.payload[1] === "e-8" &&
        action.payload[2] === "c-8"
      ) {
        return board.map((cell) => {
          if (cell.name === action.payload[1]) {
            return { ...cell, figureInside: "", selectedFigure: false };
          }

          if (cell.name === action.payload[2]) {
            return {
              ...cell,
              figureInside: action.payload[0],
              possibleMove: false,
              selectedFigure: true,
            };
          }

          if (cell.name === "d-8") {
            return {
              ...cell,
              figureInside: "rook-black",
              possibleMove: false,
              selectedFigure: false,
            };
          }

          if (cell.name === "a-8") {
            return {
              ...cell,
              figureInside: "",
              possibleMove: false,
              selectedFigure: false,
            };
          }

          return { ...cell, selectedFigure: false, possibleMove: false };
        });
      }

      //castle black right
      if (
        action.payload[0] === "king-black" &&
        action.payload[1] === "e-8" &&
        action.payload[2] === "g-8"
      ) {
        return board.map((cell) => {
          if (cell.name === action.payload[1]) {
            return { ...cell, figureInside: "", selectedFigure: false };
          }

          if (cell.name === action.payload[2]) {
            return {
              ...cell,
              figureInside: action.payload[0],
              possibleMove: false,
              selectedFigure: true,
            };
          }

          if (cell.name === "f-8") {
            return {
              ...cell,
              figureInside: "rook-black",
              possibleMove: false,
              selectedFigure: false,
            };
          }

          if (cell.name === "h-8") {
            return {
              ...cell,
              figureInside: "",
              possibleMove: false,
              selectedFigure: false,
            };
          }

          return { ...cell, selectedFigure: false, possibleMove: false };
        });
      }

      return board.map((cell) => {
        if (cell.name === action.payload[1]) {
          return { ...cell, figureInside: "", selectedFigure: false };
        }

        if (cell.name === action.payload[2]) {
          return {
            ...cell,
            figureInside: isMoveToQueen
              ? action.payload[0].replace("pawn", "queen")
              : action.payload[0],
            possibleMove: false,
            selectedFigure: true,
          };
        }

        return { ...cell, selectedFigure: false, possibleMove: false };
      });

    default:
      return board;
  }
}
