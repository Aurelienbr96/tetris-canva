import { Tetromino, TetrominoFactory } from "./activePiece";
import { DomainEvent } from "./events/collisionEvent";
import { StartGameEvent } from "./events/startGameEvent";
import { PauseGameEvent } from "./events/pauseGameEvent";
import { CompletedRowEvent } from "./events/completedRowEvent";

export type TetrisMatrixType = (string | null)[][];

function gameActionGuard() {
  return function logMethod(
    _target: TetrisBoard,
    key: any,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (this: TetrisBoard, ...args: any[]) {
      const isGamePlaying = this.isGamePlaying();

      if (!isGamePlaying) {
        console.log(`Game is not playing. Skipping ${key} call.`);
        return;
      }

      // Call the original method
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

export class TetrisBoard {
  private board: TetrisMatrixType;
  private gameState: "NOT_STARTED" | "PAUSE" | "PLAYING" | "GAMEOVER" =
    "NOT_STARTED";
  private activePiece: Tetromino;
  private tetrominoFactory: TetrominoFactory;
  private score: number = 0;
  private level: number = 1;
  private domainEvents: DomainEvent[] = [];

  constructor() {
    this.board = Array.from({ length: 22 }, () => Array(10).fill(null));
    this.tetrominoFactory = new TetrominoFactory();
    this.activePiece = this.tetrominoFactory.createTetromino("S", 3, 0);
  }

  isGamePlaying() {
    return this.gameState === "PLAYING";
  }

  getLevel() {
    return this.level;
  }

  getScore() {
    return this.score;
  }

  isGamePaused() {
    return this.gameState === "PAUSE";
  }

  isGameOver() {
    return this.gameState === "GAMEOVER";
  }

  didGameStart() {
    return this.gameState !== "NOT_STARTED";
  }

  pauseGame() {
    this.gameState = "PAUSE";
    this.domainEvents.push(new PauseGameEvent());
  }

  startGame() {
    this.domainEvents.push(new StartGameEvent());
    this.gameState = "PLAYING";
  }

  generateNewActivePiece() {
    const PIECES = ["O", "I", "S", "J", "L", "T", "Z"] as const;
    const randomPiece = PIECES[Math.floor(Math.random() * PIECES.length)];
    this.activePiece = this.tetrominoFactory.createTetromino(randomPiece, 3, 0);
  }

  pullDomainEvents() {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }

  getActivePieceShape() {
    return this.activePiece.getShape();
  }

  getActivePieceColor() {
    return this.activePiece.getColor();
  }

  /**
   * Returns the current position of the active piece on the board.
   *
   * @returns {Object} The position of the active piece, typically as an object
   *                   with `x` and `y` coordinates, top left of the position of the shape inside the board
   */
  getActivePiecePosition() {
    return this.activePiece.getPosition();
  }

  getBoard() {
    return this.board;
  }

  getTetrisWidth() {
    return this.board[0].length;
  }

  getTetrisHeight() {
    return this.board.length;
  }

  getValue(x: number, y: number) {
    return this.board?.[y]?.[x];
  }

  setValue(x: number, y: number, value: string) {
    this.board[y][x] = value;
  }

  private canMoveRight() {
    let canMove = true;
    for (const [y, val] of this.activePiece.getShape().entries()) {
      for (let x = val.length - 1; x > 0; x--) {
        const nextX = x + 1;
        if (val[x] !== 0) {
          if (
            this.getValue(
              this.activePiece.getX() + nextX,
              this.activePiece.getY() + y
            ) !== null
          ) {
            canMove = false;
          }
          break;
        }
      }
    }

    return canMove;
  }

  private canMoveLeft() {
    let canMove = true;
    for (const [y, val] of this.activePiece.getShape().entries()) {
      for (let x = 0; x < val.length; x++) {
        const nextX = x - 1;
        if (val[x] !== 0) {
          if (
            this.getValue(
              this.activePiece.getX() + nextX,
              this.activePiece.getY() + y
            ) !== null
          ) {
            canMove = false;
          }
          break;
        }
      }
    }

    return canMove;
  }

  @gameActionGuard()
  public moveActivePieceLeft() {
    if (this.canMoveLeft()) {
      this.activePiece.setX(this.activePiece.getX() - 1);
    }
  }

  @gameActionGuard()
  public moveActivePieceRight() {
    if (this.canMoveRight()) {
      this.activePiece.setX(this.activePiece.getX() + 1);
    }
  }

  @gameActionGuard()
  public moveActivePieceDown() {
    const willColide = this.checkCollision();
    if (willColide && this.checkIsGameOver()) {
      this.gameState = "GAMEOVER";
      return;
    }
    if (willColide) {
      this.insertActivePieceIntoBoard();
      this.generateNewActivePiece();
      const completedRows = this.getCompletedRows();
      if (completedRows.length > 0) {
        this.removeTetrisLines(completedRows);
      }
    } else {
      this.activePiece.setY(this.activePiece.getY() + 1);
    }
  }

  @gameActionGuard()
  rotateActivePiece() {
    if (this.canRotate()) {
      this.activePiece.rotate();
    }
  }

  removeTetrisLines = (toshift: number[]) => {
    const toUnshift = new Array(10).fill(null);

    for (let i = 0; i < toUnshift.length; i++) {
      this.board.splice(toshift[i], 1);
    }
    for (let i = 0; i < toUnshift.length; i++) {
      this.board.unshift(toUnshift);
    }
  };

  private calculateScore(clearedLines: number) {
    this.score = this.score + clearedLines * 40 * this.level;
  }

  public hardDrop() {
    while (!this.checkCollision()) {
      this.moveActivePieceDown();
    }
  }

  public getCompletedRows() {
    const fullLines: number[] = [];
    for (let y = 0; y < this.board.length; y++) {
      if (this.board[y].every((cell) => cell !== null)) {
        fullLines.push(y);
        this.domainEvents.push(new CompletedRowEvent());
      }
    }
    if (fullLines.length > 0) {
      this.calculateScore(fullLines.length);
    }
    return fullLines;
  }

  private isPositionFree(x: number, y: number) {
    if (this.getValue(x, y) !== null) {
      return false;
    }
    return true;
  }

  public canRotate() {
    // const shapes = this.activePiece.getActivePieceInformations();
    const nextRotation = this.activePiece.getNextRotation();
    let canRotate = true;
    for (const [y, line] of nextRotation.nextShape.entries()) {
      if (!canRotate) {
        break;
      }
      for (const [x] of line.entries()) {
        if (
          !this.isPositionFree(
            this.activePiece.getX() + x,
            this.activePiece.getY() + y
          )
        ) {
          canRotate = false;
          break;
        }
      }
    }

    return canRotate;
  }

  public checkCollision() {
    let willColide = false;
    for (const [innerY, col] of this.activePiece.getShape().entries()) {
      if (willColide) {
        break;
      }
      // x axis
      for (const [innerX, c] of col.entries()) {
        // skip unused case
        if (c === 0) {
          continue;
        }
        const { x, y } = this.activePiece.getPosition();

        const posX = x + innerX;
        const posY = y + innerY;
        const OneBelowTetriminosPosY = posY + 1;
        const tetrisVal = this.getValue(posX, OneBelowTetriminosPosY);

        if (tetrisVal === undefined) {
          willColide = true;
        } else if (this.getTetrisHeight() > OneBelowTetriminosPosY) {
          if (tetrisVal !== null) {
            willColide = true;

            break;
          } else if (tetrisVal === null) {
            willColide = false;
          }
        }
      }
    }
    return willColide;
  }

  checkIsGameOver() {
    if (this.activePiece.getY() < 2) {
      return true;
    }
    return false;
  }

  insertActivePieceIntoBoard() {
    for (const [y, row] of this.activePiece.getShape().entries()) {
      for (const [x, c] of row.entries()) {
        if (c !== 0) {
          this.setValue(
            this.activePiece.getX() + x,
            this.activePiece.getY() + y,
            this.activePiece.getColor()
          );
        }
      }
    }
  }
}
