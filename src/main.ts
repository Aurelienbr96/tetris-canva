import { ActivePiece, getRandomPiece } from "./activePiece";
import { CollisionEvent } from "./events/collisionEvent";
import "./style.css";
import { TetrisBoard, TetrisMatrixType } from "./tetrisBoard";

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

/* const createTetrisMatrix = (
  width: number = 10,
  height: number = 20
): TetrisMatrixType => {
  if (width < 10 || height < 20) {
    throw new Error("matrix too small");
  }

  let matrix: TetrisMatrixType = [];

  for (let i = 0; i < height - 1; i++) {
    matrix.push([]);
    for (let wIndex = 0; wIndex < width - 1; wIndex++) {
      matrix[i].push(null);
    }
  }
  return matrix;
}; */

/* const insertShapeIntoMatrix = (
  input: ActivePiece,
  matrix: TetrisMatrixType,
  startX: number = 0,
  startY: number = 0
) => {
  // replace all 0 by 1
  for (const [lineNum, line] of input.shape.entries()) {
    for (const [cIndex, c] of line.entries()) {
      if (c !== 0) {
        matrix[startY + lineNum][startX + cIndex] = input.color;
      }
    }
  }
}; */

function drawActivePiece(tetris: TetrisBoard, ctx: CanvasRenderingContext2D) {
  for (const [index, col] of tetris.getActivePieceShape().entries()) {
    // init x
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

const fromMatrixToDraw = (
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

function calculateLines(board: (string | null)[][]): number[] {
  const fullLines: number[] = [];
  for (let y = 0; y < board.length; y++) {
    if (board[y].every((cell) => cell !== null)) {
      fullLines.push(y);
    }
  }
  return fullLines;
}

const removeTetrisLines = (tetrisMatrix: TetrisBoard, toshift: number[]) => {
  /* const toUnshift = new Array(9).fill(null);

  for (const [, nToShift] of toshift.entries()) {
    tetrisMatrix.board.splice(nToShift);
    tetrisMatrix.board.unshift(toUnshift);
  } */
  // until we reach index inside to shift
};

// if 1 then its a case if not 1 then its empty

const canva = document.querySelector<HTMLCanvasElement>("#myCanvas");

if (canva) {
  const ctx = canva.getContext("2d");

  let tetrisMatrix = new TetrisBoard();

  let activePiece = getRandomPiece(3, 0);

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
    }
  });

  let i = 0;

  function draw() {
    if (ctx && canva) {
      i = i + 1;

      // activePiece.checkColision(tetrisMatrix);

      const toshift = calculateLines(tetrisMatrix.getBoard());

      if (toshift.length > 1) {
        removeTetrisLines(tetrisMatrix, toshift);
      }

      if (i === 35) {
        const domainEvents = tetrisMatrix.pullDomainEvents();
        let didColide = false;
        for (const domainEvent of domainEvents) {
          if (domainEvent instanceof CollisionEvent) {
            didColide = true;
            tetrisMatrix.insertActivePieceIntoBoard();
            tetrisMatrix.generateNewActivePiece();
          }
        }
        if (!didColide) {
          // tetrisMatrix.moveActivePieceDown();
          didColide = false;
        }

        i = 0;
      }

      ctx.clearRect(0, 0, canva.width, canva.height);
      const todraw = fromMatrixToDraw(tetrisMatrix);

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
