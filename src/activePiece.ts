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
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
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

const Z = [
  [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 0, 1],
    [0, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1, 0],
    [1, 1, 0],
    [1, 0, 0],
  ],
];

const T = [
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 1, 0],
    [1, 1, 0],
    [0, 1, 0],
  ],
];

const L = [
  [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [1, 0, 0],
  ],
  [
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
];

const J = [
  [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ],
];

export abstract class ActivePiece {
  private currentShapeIndex = 0;

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

  getActivePieceInformations() {
    return {
      shapes: this.shapes,
      currentShape: this.shape,
      currentShapeIndex: this.currentShapeIndex,
    };
  }

  getX() {
    return this.x;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  getNextRotation(index?: number) {
    const nextRotationIndex = (index || this.currentShapeIndex) + 1;
    if (this.shapes[nextRotationIndex] === undefined) {
      return { nextShapeIndex: 0, nextShape: this.shapes[0] };
    } else {
      return {
        nextShapeIndex: nextRotationIndex,
        nextShape: this.shapes[nextRotationIndex],
      };
    }
  }

  rotate() {
    const nextRotationIndex = this.currentShapeIndex + 1;
    if (this.shapes[nextRotationIndex] === undefined) {
      this.currentShapeIndex = 0;
      const currentShape = this.shapes[0];
      this.shape = currentShape;
      return currentShape;
    } else {
      const currentShape = this.shapes[nextRotationIndex];
      this.currentShapeIndex = nextRotationIndex;
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
    const PIECES = [OPiece, IPiece, SPiece, JPiece, LPiece, TPiece, ZPiece];
    const RandomPieceClass = PIECES[Math.floor(Math.random() * PIECES.length)];
    return new RandomPieceClass(x, y);
  }

  public getXLength() {
    return this.shape[0].length;
  }
}

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
    super(S[0], x, y, "#01FF00", S);
  }

  public rorate() {}
}

export class JPiece extends ActivePiece {
  constructor(x: number, y: number) {
    super(J[0], x, y, "#0000FF", J);
  }

  public rorate() {}
}
export class LPiece extends ActivePiece {
  constructor(x: number, y: number) {
    super(L[0], x, y, "#FFAA01", L);
  }

  public rorate() {}
}
export class TPiece extends ActivePiece {
  constructor(x: number, y: number) {
    super(T[0], x, y, "#9900FE", T);
  }

  public rorate() {}
}
export class ZPiece extends ActivePiece {
  constructor(x: number, y: number) {
    super(Z[0], x, y, "#FF0000", Z);
  }

  public rorate() {}
}
