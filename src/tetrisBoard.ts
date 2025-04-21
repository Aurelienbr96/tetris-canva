import { ActivePiece, SPiece } from "./activePiece";
import { CollisionEvent, DomainEvent } from "./events/collisionEvent";

export type TetrisMatrixType = (string | null)[][];

export class TetrisBoard {
  private board: TetrisMatrixType;
  private activePiece: ActivePiece;
  private domainEvents: DomainEvent[] = [];

  constructor() {
    this.board = Array.from({ length: 20 }, () => Array(10).fill(null));
    this.activePiece = new SPiece(3, 0);
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

  public getCompletedRows() {
    const fullLines: number[] = [];
    for (let y = 0; y < this.board.length; y++) {
      if (this.board[y].every((cell) => cell !== null)) {
        fullLines.push(y);
      }
    }
    return fullLines;
  }

  public checkColision() {
    // for all the position of x y of the shape check the y - 1 of this position in the tetrisMatrix, if it is 1 then it will collide

    // col = y axis
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
            // this.activePiece.willColide = false;
          }
        }
      }
    }
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
