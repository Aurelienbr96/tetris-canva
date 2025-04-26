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

export class Tetromino {
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

  public getXLength() {
    return this.shape[0].length;
  }
}
type PossibleTetromino = "O" | "I" | "S" | "J" | "L" | "T" | "Z";
export class TetrominoFactory {
  constructor() {}

  createTetromino(name: PossibleTetromino, x: number, y: number) {
    const mapNameToClass: Record<
      PossibleTetromino,
      {
        color: string;
        shape: number[][][];
      }
    > = {
      O: {
        shape: O,
        color: "#FEF84B",
      },
      S: {
        shape: S,
        color: "#01FF00",
      },
      I: {
        shape: I,
        color: "#51E1FB",
      },
      J: {
        shape: J,
        color: "#0000FF",
      },
      L: {
        shape: L,
        color: "#FFAA01",
      },
      T: {
        shape: T,
        color: "#9900FE",
      },
      Z: {
        shape: Z,
        color: "#FF0000",
      },
    };
    const { shape, color } = mapNameToClass[name];

    return new Tetromino(shape[0], x, y, color, shape);
  }
}
