export class AudioHandler {
  private audio: HTMLAudioElement;
  constructor(private readonly src: string) {
    this.audio = new Audio(this.src);
    this.audio.loop = true;
  }

  async startAudio() {
    await this.audio.play();
  }

  async stopAudio() {
    await this.audio.pause();
  }
}
