import { describe, it, expect, beforeEach } from "vitest";
import { TetrisBoard } from "../tetrisBoard";
import { IPiece, OPiece, SPiece } from "../activePiece";

describe("TetrisBoard", () => {
  let board: TetrisBoard;

  beforeEach(() => {
    board = new TetrisBoard();

    const customPiece = new OPiece(3, 0);
    // @ts-ignore - override private for test purpose
    board.activePiece = customPiece;
  });

  it("should correctly init the board", () => {
    const b = board.getBoard();
    const expected = Array.from({ length: 20 }, () => Array(10).fill(null));

    expect(b).toStrictEqual(expected);
  });

  it("should move the active piece down by 1 if no collision", () => {
    const { y: initialY } = board.getActivePiecePosition();
    board.moveActivePieceDown();
    const { y: newY } = board.getActivePiecePosition();

    expect(newY).toBe(initialY + 1);
  });
  it("X position should be 1 less if moving left", () => {
    const { x: initialX } = board.getActivePiecePosition();
    board.moveActivePieceLeft();
    const { x: newX } = board.getActivePiecePosition();

    expect(newX).toBe(initialX - 1);
  });
  it("X position should be 1 more if moving right", () => {
    const { x: initialX } = board.getActivePiecePosition();
    board.moveActivePieceRight();
    const { x: newX } = board.getActivePiecePosition();

    expect(newX).toBe(initialX + 1);
  });

  it("Should insert the tetriminos into the board in case of colision", () => {
    board = new TetrisBoard();

    const newS = new SPiece(0, 0);
    // @ts-ignore - override private for test purpose
    board.activePiece = newS;
    const scolor = board.getActivePieceColor();

    for (let i = 0; i < 25; i++) {
      board.moveActivePieceDown();
    }
    board.insertActivePieceIntoBoard();

    const customPiece = new IPiece(0, 0);
    // @ts-ignore - override private for test purpose
    board.activePiece = customPiece;

    const matrix = board.getBoard();

    for (let i = 0; i < 25; i++) {
      board.moveActivePieceDown();
    }
    board.insertActivePieceIntoBoard();

    const newC = new IPiece(0, 0);
    // @ts-ignore - override private for test purpose
    board.activePiece = newC;

    for (let i = 0; i < 25; i++) {
      board.moveActivePieceDown();
    }
    board.insertActivePieceIntoBoard();

    const newO = new IPiece(0, 0);
    // @ts-ignore - override private for test purpose
    board.activePiece = newO;

    for (let i = 0; i < 25; i++) {
      board.moveActivePieceDown();
    }
    board.insertActivePieceIntoBoard();

    const color = board.getActivePieceColor();
    const expected = Array.from({ length: 20 }, () => Array(10).fill(null));

    expected[7][1] = color;
    expected[8][1] = color;
    expected[9][1] = color;
    expected[10][1] = color;

    expected[11][1] = color;
    expected[12][1] = color;
    expected[13][1] = color;
    expected[14][1] = color;

    expected[15][1] = color;
    expected[16][1] = color;
    expected[17][1] = color;
    expected[18][1] = color;

    expected[19][0] = scolor;
    expected[19][1] = scolor;
    expected[18][2] = scolor;
    expected[18][1] = scolor;

    console.log("matrix", matrix);
    console.log("expected", expected);

    expect(matrix).toStrictEqual(expected);
  });
});
