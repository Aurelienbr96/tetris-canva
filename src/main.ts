import { AudioHandler } from "./audioHandler";
import "./style.css";
import { TetrisBoard } from "./tetrisBoard";
import { TetrisUI } from "./tetrisUi";

/*
todo: fix calculus of full lines
add game over
add score
add next tetrimos
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
    const tetrisMatrix = new TetrisBoard();
    const audioHandler = new AudioHandler("../TetrisTheme.mp3");

    const tetrisUI = new TetrisUI(
      tetrisMatrix,
      ctx as CanvasRenderingContext2D,
      canva,
      audioHandler
    );

    document.addEventListener("keydown", (ev) => {
      switch (ev.key) {
        case "ArrowLeft":
          tetrisMatrix.moveActivePieceLeft();
          break;

        case "ArrowRight":
          tetrisMatrix.moveActivePieceRight();
          break;
        case "ArrowDown":
          tetrisMatrix.moveActivePieceDown();

          break;

        case " ":
          tetrisMatrix.hardDrop();
          break;

        case "ArrowUp":
          tetrisMatrix.rotateActivePiece();

          break;
      }
    });

    const startGameButton = document.getElementById("startGame");
    const onStartGameClick = () => {
      if (!tetrisMatrix.didGameStart()) {
        tetrisMatrix.startGame();
        requestAnimationFrame(() => tetrisUI.draw());
        // @ts-ignore dont worry
        startGameButton.textContent = "pause";
      } else if (tetrisMatrix.isGamePaused()) {
        tetrisMatrix.startGame();
        requestAnimationFrame(() => tetrisUI.draw());
        // @ts-ignore dont worry
        startGameButton.textContent = "pause";
      } else {
        tetrisMatrix.pauseGame();
        // @ts-ignore dont worry
        startGameButton.textContent = "play";
      }
    };

    startGameButton?.addEventListener("click", onStartGameClick);
  }
}
