import classNames from "classnames";
import "./App.scss";
import { useEffect, useReducer, useState } from "react";
import {
  blockLetters,
  blockNumbers,
  initionalChessBoard,
} from "./data/initionalChessBoard";
import { Cell } from "./types/types";
import { reducer } from "./hooks/useReducer";
import { possibleMoves, proveSaveMoves } from "./usefulFunctions/possibleMoves";
import {
  isCheckForBlack,
  isCheckForWhite,
  isCheckMate,
} from "./usefulFunctions/checkFor";
import { blackMoveAI } from "./AILogic/blackMoveAI";

export const App = () => {
  const [nextMoveOf, setNextMoveOf] = useState("white");
  const [chessBoard, dispatch] = useReducer(reducer, initionalChessBoard);
  const [selectedFigureCell, setSelectedFigureCell] = useState("");
  const [selectedFigure, setSelectedFigure] = useState("");
  const [messageCheck, setMessageCheck] = useState("");
  const [messageCheckMate, setMessageCheckMate] = useState("");
  const [isWhiteKingMoves, setIsWhiteKingMoves] = useState(false);
  const [isBlackKingMoves, setIsBlackKingMoves] = useState(false);
  const [isNowCheck, setNowIsCheck] = useState(false);
  const [gameWhithAI, setGameWhithAI] = useState(false);

  // AI
  useEffect(() => {
    if (nextMoveOf === "black" && !messageCheckMate && gameWhithAI) {
      const [figure, moveFrom, moveTo] = blackMoveAI(chessBoard, {
        castleWhite: isWhiteKingMoves,
        castleBlack: isBlackKingMoves,
        nowCheck: isNowCheck,
      });

      setTimeout(() => {
        dispatch({
          type: "makeMove",
          payload: [figure, moveFrom, moveTo],
        });
      }, 1000);

      if (figure === "king-black" && moveFrom === "e-8") {
        setIsBlackKingMoves(true);
      }

      setNextMoveOf((prev) => (prev === "white" ? "black" : "white"));
    }
  }, [
    nextMoveOf,
    messageCheckMate,
    isBlackKingMoves,
    isWhiteKingMoves,
    isNowCheck,
    chessBoard,
    gameWhithAI,
  ]);

  // is check now?
  useEffect(() => {
    isCheckForWhite(chessBoard) || isCheckForBlack(chessBoard)
      ? setNowIsCheck(true)
      : setNowIsCheck(false);
  }, [nextMoveOf]);

  // set Check message
  useEffect(() => {
    const isCheck =
      (!!isCheckForWhite(chessBoard) || !!isCheckForBlack(chessBoard)) &&
      !isCheckMate(nextMoveOf, chessBoard);

    isCheck &&
      setTimeout(() => {
        setMessageCheck(
          isCheckForWhite(chessBoard) + " " + isCheckForBlack(chessBoard)
        );
      }, 500);

    isCheck &&
      setTimeout(() => {
        setMessageCheck("");
      }, 1500);
  }, [nextMoveOf]);

  // set Check Mate
  useEffect(() => {
    if (isCheckMate(nextMoveOf, chessBoard)) {
      setMessageCheckMate(
        `Check Mate! ${nextMoveOf === "white" ? "balck" : "white"} wins!`
      );
    }
  }, [nextMoveOf]);

  const handleClickOnCell = (currCell: Cell) => {
    const { figureInside, name: nameCell, possibleMove } = currCell;
    const allPosibleMoves: string[] = possibleMoves(
      figureInside,
      nameCell,
      chessBoard,
      {
        castleWhite: !isWhiteKingMoves,
        castleBlack: !isBlackKingMoves,
        nowCheck: isNowCheck,
      }
    );

    let allSavePossibleMoves = proveSaveMoves(
      allPosibleMoves,
      chessBoard,
      nameCell,
      figureInside
    );

    // prove Castle
    if (
      nameCell === "e-1" &&
      figureInside === "king-white" &&
      allSavePossibleMoves.includes("g-1") &&
      !allSavePossibleMoves.includes("f-1")
    ) {
      allSavePossibleMoves = allSavePossibleMoves.filter((x) => x !== "g-1");
    }
    // prove Castle
    if (
      nameCell === "e-1" &&
      figureInside === "king-white" &&
      allSavePossibleMoves.includes("c-1") &&
      !allSavePossibleMoves.includes("d-1")
    ) {
      allSavePossibleMoves = allSavePossibleMoves.filter((x) => x !== "c-1");
    }
    // prove Castle
    if (
      nameCell === "e-8" &&
      figureInside === "king-black" &&
      allSavePossibleMoves.includes("g-8") &&
      !allSavePossibleMoves.includes("f-8")
    ) {
      allSavePossibleMoves = allSavePossibleMoves.filter((x) => x !== "g-8");
    }
    // prove Castle
    if (
      nameCell === "e-8" &&
      figureInside === "king-black" &&
      allSavePossibleMoves.includes("c-8") &&
      !allSavePossibleMoves.includes("d-8")
    ) {
      allSavePossibleMoves = allSavePossibleMoves.filter((x) => x !== "c-8");
    }

    if (figureInside && figureInside.includes(nextMoveOf)) {
      setSelectedFigure(figureInside);
      setSelectedFigureCell(nameCell);
      dispatch({ type: "setSelectedFigure", payload: nameCell });
      dispatch({
        type: "setPossibleMoves",
        payload: allSavePossibleMoves,
      });
    } else {
      dispatch({ type: "deleteSelectedFigure" });
    }

    if (possibleMove) {
      dispatch({
        type: "makeMove",
        payload: [selectedFigure, selectedFigureCell, nameCell],
      });

      setNextMoveOf((prev) => (prev === "white" ? "black" : "white"));

      if (selectedFigure === "king-white" && selectedFigureCell === "e-1") {
        setIsWhiteKingMoves(true);
      }
      if (selectedFigure === "king-black" && selectedFigureCell === "e-8") {
        setIsBlackKingMoves(true);
      }
    }
  };

  return (
    <div className="container-lett">
      {/* to delete !!!*/}
      <div className="info-container">
        {!gameWhithAI && (
          <div className="count-of-moves">{`Next move of ${nextMoveOf}`}</div>
        )}
        <button
          className="AI-button"
          onClick={() => setGameWhithAI((prev) => !prev)}
        >
          {gameWhithAI ? "Play 1 vs 1" : "Play whit AI"}
        </button>
      </div>
      {messageCheck && (
        <>
          <div className="modal-window"></div>
          <div className="modal-container">{messageCheck}</div>
        </>
      )}
      {messageCheckMate && (
        <>
          <div className="modal-window"></div>
          <div className="modal-container">{messageCheckMate}</div>
        </>
      )}
      <div className="block-letters">
        {blockLetters.map((ch) => (
          <div key={ch} className="board-letter">
            {ch}
          </div>
        ))}
      </div>
      <div className="container-nums">
        <div className="block-numbers">
          {blockNumbers.map((num) => (
            <div key={num} className="board-number">
              {num}
            </div>
          ))}
        </div>
        <div className="board">
          {chessBoard.map((cell) => {
            const { name, color, figureInside, possibleMove, selectedFigure } =
              cell;

            return (
              <div
                onClick={() => handleClickOnCell(cell)}
                key={name}
                className={classNames(
                  `${name} cell cell--${color} figure ${
                    figureInside ? "figure-" + figureInside : ""
                  } ${possibleMove ? "possible-move" : ""} ${
                    selectedFigure ? "selected-figure" : ""
                  }`,
                  {
                    "possible-move": possibleMove,
                  }
                )}
              ></div>
            );
          })}
        </div>
        <div className="block-numbers">
          {blockNumbers.map((num) => (
            <div key={num} className="board-number">
              {num}
            </div>
          ))}
        </div>
      </div>
      <div className="block-letters">
        {blockLetters.map((ch) => (
          <div key={ch} className="board-letter">
            {ch}
          </div>
        ))}
      </div>
    </div>
  );
};
