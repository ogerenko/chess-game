export type Cell = {
  name: string;
  color: string;
  figureInside: string;
  possibleMove: boolean;
  selectedFigure: boolean;
};

export type FutureMove = {
  possibleFutureMove: string,
  boardAfterThisMove: Cell[],
};

export type Coordinates = {
  x: number;
  y: number;
};
