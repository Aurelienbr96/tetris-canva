import { TetrisMatrixType } from "./tetrisBoard";

export abstract class ActivePiece {
  public willColide = false;

  constructor(
    private readonly shape: number[][],
    private x: number,
    private y: number,
    private color: string
  ) {}

  getShape() {
    return this.shape;
  }

  getX() {
    return this.x;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  getY() {
    return this.y;
  }

  getColor() {
    return this.color;
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  setX(x: number) {
    this.x = x;
  }
  setY(y: number) {
    this.y = y;
  }

  public static getRandomPiece(x: number, y: number): ActivePiece {
    const PIECES = [OPiece, IPiece, SPiece];
    const RandomPieceClass = PIECES[Math.floor(Math.random() * PIECES.length)];
    return new RandomPieceClass(x, y);
  }

  public getXLength() {
    return this.shape[0].length;
  }

  private canMoveRight(tetrisMatrix: TetrisMatrixType) {
    // check last X of the piece vs tetris matrix, if !== null is
  }

  public rotate() {}
}

const O = [
  [1, 1],
  [1, 1],
];
const S = [
  [0, 1, 1],
  [1, 1, 0],
  [0, 0, 0],
];
const I = [[1], [1], [1], [1]];

export class OPiece extends ActivePiece {
  constructor(x: number, y: number) {
    super(O, x, y, "#FEF84B");
  }
}
export class IPiece extends ActivePiece {
  constructor(x: number, y: number) {
    super(I, x, y, "#51E1FB");
  }
}
export class SPiece extends ActivePiece {
  constructor(x: number, y: number) {
    super(S, x, y, "#E93D1E");
  }

  public rorate() {}
}

export function getRandomPiece(x: number, y: number): ActivePiece {
  const PIECES = [OPiece, IPiece, SPiece];
  const RandomPieceClass = PIECES[Math.floor(Math.random() * PIECES.length)];
  return new RandomPieceClass(x, y);
}
