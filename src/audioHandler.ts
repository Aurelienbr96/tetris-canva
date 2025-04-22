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

class pubsub {
  constructor(private event: Map<string, () => {}>) {}

  emit(eventName: string) {
    const callback = this.event.get(eventName);
    if (callback) {
      callback();
    }
  }

  subscribe(eventName: string, callBack: () => {}) {
    this.event.set(eventName, callBack);
  }

  unsubscribe(eventName: string) {
    this.event.delete(eventName);
  }
}
