import { TetrisMatrixType } from "./tetrisBoard";

export abstract class ActivePiece {
  public willColide = false;
  private currentShape = 0;

  constructor(
    private shape: number[][],
    private x: number,
    private y: number,
    private color: string,
    private shapes: Array<number[][]>
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

  rotate() {
    const nextStep = this.currentShape + 1;
    if (this.shapes[nextStep] === undefined) {
      this.currentShape = 0;
      const currentShape = this.shapes[0];
      this.shape = currentShape;
      return currentShape;
    } else {
      const currentShape = this.shapes[nextStep];
      this.currentShape = nextStep;
      this.shape = currentShape;
      return currentShape;
    }
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
}

const O = [
  [
    [1, 1],
    [1, 1],
  ],
];
const S = [
  [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 1],
    [0, 0, 1],
  ],
  [
    [0, 0, 0],
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0],
  ],
];
const I = [
  [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
  ],
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
  ],
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
];

export class OPiece extends ActivePiece {
  constructor(x: number, y: number) {
    super(O[0], x, y, "#FEF84B", O);
  }
}
export class IPiece extends ActivePiece {
  constructor(x: number, y: number) {
    super(I[0], x, y, "#51E1FB", I);
  }
}
export class SPiece extends ActivePiece {
  constructor(x: number, y: number) {
    super(S[0], x, y, "#E93D1E", S);
  }

  public rorate() {}
}

export function getRandomPiece(x: number, y: number): ActivePiece {
  const PIECES = [OPiece, IPiece, SPiece];
  const RandomPieceClass = PIECES[Math.floor(Math.random() * PIECES.length)];
  return new RandomPieceClass(x, y);
}
