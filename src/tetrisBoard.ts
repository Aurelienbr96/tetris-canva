import { ActivePiece, SPiece } from "./activePiece";
import { CollisionEvent, DomainEvent } from "./events/collisionEvent";
import { StartGameEvent } from "./events/startGameEvent";
import { PauseGameEvent } from "./events/pauseGameEvent";
import { CompletedRowEvent } from "./events/completedRowEvent";

export type TetrisMatrixType = (string | null)[][];

export class TetrisBoard {
  private board: TetrisMatrixType;
  private gameState: "NOT_STARTED" | "PAUSE" | "PLAYING" | "GAMEOVER" =
    "NOT_STARTED";
  private activePiece: ActivePiece;
  private score: number = 0;
  private level: number = 1;
  private domainEvents: DomainEvent[] = [];

  constructor() {
    this.board = Array.from({ length: 22 }, () => Array(10).fill(null));
    this.activePiece = new SPiece(3, 0);
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
    this.activePiece = ActivePiece.getRandomPiece(3, 0);
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

  public moveActivePieceLeft() {
    this.activePiece.willColide = false;

    if (this.canMoveLeft()) {
      this.activePiece.setX(this.activePiece.getX() - 1);
    }
  }

  public moveActivePieceRight() {
    this.activePiece.willColide = false;

    if (this.canMoveRight()) {
      this.activePiece.setX(this.activePiece.getX() + 1);
    }
  }

  public moveActivePieceDown() {
    this.checkColision();
    if (this.activePiece.willColide && this.checkIsGameOver()) {
      this.gameState = "GAMEOVER";
      return;
    }
    if (this.activePiece.willColide) {
      const colEvent = new CollisionEvent();
      this.domainEvents.push(colEvent);

      this.insertActivePieceIntoBoard();
    } else {
      this.activePiece.setY(this.activePiece.getY() + 1);
    }
  }

  rotateActivePiece() {
    this.activePiece.rotate();
  }

  removeTetrisLines = (toshift: number[]) => {
    const toUnshift = new Array(10).fill(null);

    for (const [, nToShift] of toshift.entries()) {
      this.board.splice(nToShift, 1);
    }
    for (const [] of toshift.entries()) {
      this.board.unshift(toUnshift);
    }
  };

  private calculateScore(clearedLines: number) {
    this.score = this.score + clearedLines * 40 * this.level;
  }

  public hardDrop() {
    while (!this.activePiece.willColide) {
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

  public checkColision() {
    for (const [innerY, col] of this.activePiece.getShape().entries()) {
      if (this.activePiece.willColide) {
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
          this.activePiece.willColide = true;
        } else if (this.getTetrisHeight() > OneBelowTetriminosPosY) {
          if (tetrisVal !== null) {
            this.activePiece.willColide = true;

            break;
          } else if (tetrisVal === null) {
            this.activePiece.willColide = false;
          }
        }
      }
    }
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
