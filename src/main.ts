import { CollisionEvent } from "./events/collisionEvent";
import "./style.css";
import { TetrisBoard } from "./tetrisBoard";

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

const heightBlock = 30;
const widthBlock = 30;

function drawActivePiece(tetris: TetrisBoard, ctx: CanvasRenderingContext2D) {
  for (const [index, col] of tetris.getActivePieceShape().entries()) {
    for (const [cIndex, c] of col.entries()) {
      if (c !== 0) {
        const { x, y } = tetris.getActivePiecePosition();
        ctx.fillStyle = tetris.getActivePieceColor();
        ctx.fillRect(
          (cIndex + x) * heightBlock,
          (index + y) * widthBlock,
          heightBlock,
          widthBlock
        );
      }
    }
  }
}

const mapBoardToDrawableBlocks = (
  tetrisMatrix: TetrisBoard
): Array<{ x: number; y: number; color: string }> => {
  let pos = 0;
  const initPos = [];
  for (
    let lineIndex = 0;
    lineIndex < tetrisMatrix.getTetrisHeight();
    lineIndex++
  ) {
    for (
      let blockIndex = 0;
      blockIndex < tetrisMatrix.getTetrisWidth();
      blockIndex++
    ) {
      const value = tetrisMatrix.getValue(blockIndex, lineIndex);
      let x = blockIndex * widthBlock;
      let y = lineIndex * heightBlock;

      if (value !== null) {
        pos = pos + 1;
        initPos.push({
          x,
          y,
          color: value,
        });
      }
    }
  }
  return initPos;
};

const canva = document.querySelector<HTMLCanvasElement>("#myCanvas");

if (canva) {
  const ctx = canva.getContext("2d");

  let tetrisMatrix = new TetrisBoard();

  canva.width = tetrisMatrix.getTetrisWidth() * widthBlock;
  canva.height = tetrisMatrix.getTetrisHeight() * heightBlock;

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
        tetrisMatrix.rotateActivePiece();

        break;
        break;
    }
  });

  let i = 0;

  function draw() {
    if (ctx && canva) {
      i = i + 1;

      if (i === 35) {
        const domainEvents = tetrisMatrix.pullDomainEvents();
        let didColide = false;
        for (const domainEvent of domainEvents) {
          if (domainEvent instanceof CollisionEvent && !didColide) {
            didColide = true;
            tetrisMatrix.insertActivePieceIntoBoard();
            tetrisMatrix.generateNewActivePiece();
            const completedRows = tetrisMatrix.getCompletedRows();
            if (completedRows.length > 0) {
              tetrisMatrix.removeTetrisLines(completedRows);
            }
          }
        }
        if (!didColide) {
          // tetrisMatrix.moveActivePieceDown();
          didColide = false;
        }

        i = 0;
      }

      ctx.clearRect(0, 0, canva.width, canva.height);
      const todraw = mapBoardToDrawableBlocks(tetrisMatrix);

      for (const draw of todraw) {
        ctx.fillStyle = draw.color;
        ctx.fillRect(draw.x, draw.y, heightBlock, widthBlock);
      }
      drawActivePiece(tetrisMatrix, ctx);

      requestAnimationFrame(draw);
    }
  }

  requestAnimationFrame(draw);
}
