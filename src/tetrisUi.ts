import { AudioHandler } from "./audioHandler";
import { PauseGameEvent } from "./events/pauseGameEvent";
import { StartGameEvent } from "./events/startGameEvent";
import { TetrisBoard } from "./tetrisBoard";

export class TetrisUI {
  private heightBlock = 30;
  private widthBlock = 30;
  private uiframe = 0;
  private squareBackgroundColor = "#444444";
  private textColor = "white";

  constructor(
    private tetris: TetrisBoard,
    private ctx: CanvasRenderingContext2D,
    private canva: HTMLCanvasElement,
    private audioHandler: AudioHandler
  ) {
    //const width = tetris.getTetrisWidth() * this.widthBlock;
    // canva.height = tetris.getTetrisHeight() * this.heightBlock;
    const dpr = window.devicePixelRatio || 1;

    // Get the CSS size
    const rect = canva.getBoundingClientRect();

    // Set the actual pixel size
    canva.width = rect.width * dpr;
    canva.height = rect.height * dpr;

    // Scale the context to match
    ctx.scale(dpr, dpr);
    this.draw = this.draw.bind(this);
  }

  drawActivePiece() {
    for (const [index, col] of this.tetris.getActivePieceShape().entries()) {
      for (const [cIndex, c] of col.entries()) {
        if (c !== 0) {
          const { x, y } = this.tetris.getActivePiecePosition();
          this.ctx.beginPath();

          this.ctx.fillStyle = this.tetris.getActivePieceColor();
          this.ctx.lineWidth = 0.5;
          this.ctx.strokeStyle = "black";
          this.ctx.rect(
            (cIndex + x) * this.widthBlock,
            (index + y) * this.heightBlock,
            this.widthBlock,
            this.heightBlock
          );
          this.ctx.fill();
          this.ctx.stroke();
        }
      }
    }
  }

  mapBoardToDrawableBlocks(): Array<{
    x: number;
    y: number;
    color: string | null;
  }> {
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

        pos = pos + 1;
        initPos.push({
          x,
          y,
          color: value,
        });
      }
    }
    return initPos;
  }

  private drawScoreText() {
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = this.textColor;
    this.ctx.fillText(`Score: ${this.tetris.getScore()}`, 10, 25);
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
        if (this.uiframe === 150) {
          const domainEvents = this.tetris.pullDomainEvents();
          let didColide = false;
          for (const domainEvent of domainEvents) {
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
      }
      this.ctx.clearRect(0, 0, this.canva.width, this.canva.height);

      const todraw = this.mapBoardToDrawableBlocks();

      for (const draw of todraw) {
        this.ctx.beginPath();

        this.ctx.rect(draw.x, draw.y, this.widthBlock, this.heightBlock);
        this.ctx.lineWidth = 0.5;
        this.ctx.strokeStyle = "black";
        this.ctx.fillStyle = draw.color || this.squareBackgroundColor;
        this.ctx.fill();
        this.ctx.stroke();
      }
      this.drawActivePiece();

      this.drawScoreText();

      if (!this.tetris.isGamePaused()) requestAnimationFrame(this.draw);
    }
  }
}
