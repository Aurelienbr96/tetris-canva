import { AudioHandler } from "./audioHandler";
import "./style.css";
import { TetrisBoard } from "./tetrisBoard";
import { TetrisUI } from "./tetrisUi";

/*
todo: fix calculus of full lines
add game over
add levels
add next tetrimos (bags of 7 tetrimos)
add rotation
add more shape into the tetris
make the tetrimos appear 2 steps above the board
wall kick rotation
speed up game per 50 points

*/

const canva = document.querySelector<HTMLCanvasElement>("#myCanvas");

if (canva) {
  const ctx = canva.getContext("2d");
  if (ctx) {
    const tetrisBoard = new TetrisBoard();
    const audioHandler = new AudioHandler("../TetrisTheme.mp3");

    const tetrisUI = new TetrisUI(
      tetrisBoard,
      ctx as CanvasRenderingContext2D,
      canva,
      audioHandler
    );

    document.addEventListener("keydown", (ev) => {
      switch (ev.key) {
        case "ArrowLeft":
          tetrisBoard.moveActivePieceLeft();
          break;

        case "ArrowRight":
          tetrisBoard.moveActivePieceRight();
          break;
        case "ArrowDown":
          tetrisBoard.moveActivePieceDown();
          break;

        case " ":
          tetrisBoard.hardDrop();
          break;

        case "ArrowUp":
          tetrisBoard.rotateActivePiece();

          break;
      }
    });

    const startGameButton = document.getElementById("startGame");
    const onStartGameClick = () => {
      if (!tetrisBoard.didGameStart()) {
        tetrisBoard.startGame();
        requestAnimationFrame(() => tetrisUI.draw());
        // @ts-ignore dont worry
        startGameButton.textContent = "pause";
      } else if (tetrisBoard.isGamePaused()) {
        tetrisBoard.startGame();
        requestAnimationFrame(() => tetrisUI.draw());
        // @ts-ignore dont worry
        startGameButton.textContent = "pause";
      } else {
        tetrisBoard.pauseGame();
        // @ts-ignore dont worry
        startGameButton.textContent = "play";
      }
    };

    startGameButton?.addEventListener("click", onStartGameClick);
  }
}
