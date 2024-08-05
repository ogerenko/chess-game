import { Coordinates } from "../types/types";

export const transformCoordsToNumbs = (coord: string) => {
  const alphabet = "abcdefgh";

  const coorX = alphabet.indexOf(coord[0]) + 1;
  const coorY = +coord[2];

  return {
    x: coorX,
    y: coorY,
  };
};

export const transformCoordsToStr = (coord: Coordinates) => {
  const alphabet = "abcdefgh";

  const coorX = alphabet.charAt(coord.x - 1);

  return `${coorX}-${coord.y}`;
};