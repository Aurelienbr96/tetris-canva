import { AudioHandler } from "./audioHandler";
import { CollisionEvent } from "./events/collisionEvent";
import { PauseGameEvent } from "./events/pauseGameEvent";
import { StartGameEvent } from "./events/startGameEvent";
import { TetrisBoard } from "./tetrisBoard";

export class TetrisUI {
  private heightBlock = 30;
  private widthBlock = 30;
  private uiframe = 0;

  constructor(
    private tetris: TetrisBoard,
    private ctx: CanvasRenderingContext2D,
    private canva: HTMLCanvasElement,
    private audioHandler: AudioHandler
  ) {
    canva.width = tetris.getTetrisWidth() * this.widthBlock;
    canva.height = tetris.getTetrisHeight() * this.heightBlock;
    this.draw = this.draw.bind(this);
  }

  drawActivePiece() {
    for (const [index, col] of this.tetris.getActivePieceShape().entries()) {
      for (const [cIndex, c] of col.entries()) {
        if (c !== 0) {
          const { x, y } = this.tetris.getActivePiecePosition();
          this.ctx.fillStyle = this.tetris.getActivePieceColor();
          this.ctx.fillRect(
            (cIndex + x) * this.heightBlock,
            (index + y) * this.widthBlock,
            this.heightBlock,
            this.widthBlock
          );
        }
      }
    }
  }

  mapBoardToDrawableBlocks(): Array<{ x: number; y: number; color: string }> {
    let pos = 0;
    const initPos = [];
    for (
      let lineIndex = 2;
      lineIndex < this.tetris.getTetrisHeight();
      lineIndex++
    ) {
      for (
        let blockIndex = 0;
        blockIndex < this.tetris.getTetrisWidth();
        blockIndex++
      ) {
        const value = this.tetris.getValue(blockIndex, lineIndex);
        let x = blockIndex * this.widthBlock;
        let y = lineIndex * this.heightBlock;

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
  }

  async draw() {
    if (this.ctx && this.canva) {
      this.uiframe = this.uiframe + 1;
      if (this.tetris.isGameOver()) {
        this.ctx.clearRect(0, 0, this.canva.width, this.canva.height);
        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.fillText(`GAME OVER`, 100, 400);
      } else {
        if (this.uiframe === 35) {
          const domainEvents = this.tetris.pullDomainEvents();
          let didColide = false;
          for (const domainEvent of domainEvents) {
            if (domainEvent instanceof CollisionEvent && !didColide) {
              didColide = true;
              this.tetris.generateNewActivePiece();
              const completedRows = this.tetris.getCompletedRows();
              if (completedRows.length > 0) {
                this.tetris.removeTetrisLines(completedRows);
              }
            }
            if (domainEvent instanceof StartGameEvent) {
              this.tetris.isGamePaused();
              await this.audioHandler.startAudio();
            }

            if (domainEvent instanceof PauseGameEvent) {
              this.audioHandler.stopAudio();
            }
          }
          if (!didColide) {
            this.tetris.moveActivePieceDown();
            didColide = false;
          }

          this.uiframe = 0;
        }

        this.ctx.clearRect(0, 0, this.canva.width, this.canva.height);
        const todraw = this.mapBoardToDrawableBlocks();

        for (const draw of todraw) {
          this.ctx.fillStyle = draw.color;
          this.ctx.fillRect(draw.x, draw.y, this.heightBlock, this.widthBlock);
        }
        this.drawActivePiece();

        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.fillText(`Score: ${this.tetris.getScore()}`, 10, 25);

        if (!this.tetris.isGamePaused()) requestAnimationFrame(this.draw);
      }
    }
  }
}
