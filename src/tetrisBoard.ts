import { ActivePiece } from "./activePiece";
import { CollisionEvent, DomainEvent } from "./events/collisionEvent";

export type TetrisMatrixType = (string | null)[][];

export class TetrisBoard {
  private board: TetrisMatrixType;
  private activePiece: ActivePiece;
  private domainEvents: DomainEvent[] = [];

  constructor() {
    this.board = Array.from({ length: 10 }, () => Array(20).fill(null));
    this.activePiece = ActivePiece.getRandomPiece(3, 0);
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

  getActivePiecePosition() {
    return this.activePiece.getPosition();
  }

  getBoard() {
    return this.board;
  }

  getTetrisWidth() {
    return this.board.length;
  }

  getTetrisHeight() {
    return this.board[0].length;
  }

  getValue(x: number, y: number) {
    return this.board?.[x]?.[y];
  }

  setValue(x: number, y: number, value: string) {
    this.board[x][y] = value;
  }

  public moveActivePieceLeft() {
    this.activePiece.willColide = false;

    this.activePiece.setX(this.activePiece.getX() - 1);
  }

  public moveActivePieceRight() {
    this.activePiece.willColide = false;
    this.activePiece.setX(this.activePiece.getX() + 1);
  }

  public moveActivePieceDown() {
    this.checkColision();

    if (this.activePiece.willColide) {
      const colEvent = new CollisionEvent();
      this.domainEvents.push(colEvent);
    } else {
      this.activePiece.setY(this.activePiece.getY() + 1);
    }
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
        } else if (this.getTetrisHeight() - 1 > OneBelowTetriminosPosY) {
          // console.log("values", posX, posY, tetrisVal, this.activePiece.willColide);
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

  insertActivePieceIntoBoard() {
    // replace all 0 by 1
    for (const [x, row] of this.activePiece.getShape().entries()) {
      for (const [y, c] of row.entries()) {
        if (c !== 0) {
          this.setValue(
            this.activePiece.getX() + x,
            this.activePiece.getY() + y,
            this.activePiece.getColor()
          );
          console.log(
            "setvalue",
            this.activePiece.getX() + x,
            this.activePiece.getY() + y,
            this.activePiece.getColor()
          );
          console.log(this.board);
        }
      }
    }
  }
}
