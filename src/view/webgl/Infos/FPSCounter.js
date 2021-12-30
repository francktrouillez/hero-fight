class FPSCounter {
  constructor() {
    this.prev = 0;
    this.fps = 60;
  }

  update(now) {
    now *= 0.001;
		const deltaTime = now - this.prev;
		this.prev = now;
		this.fps = 1 / deltaTime;
  }

  get_fps() {
    return this.fps
  }
}