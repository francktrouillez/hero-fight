class FPSCounter {
  constructor() {
    this.prev = 0;
    this.fps = 60;
    this.fps_raw = []
    this.sample_size = 21;
  }

  update(now) {
    now *= 0.001;
		const delta_time = now - this.prev;
		this.prev = now;
    const fps = 1 / delta_time
    this.fps_raw.push(fps);
    if (this.fps_raw.length > this.sample_size) {
      this.fps_raw.shift();
    }
		this.fps = this.sample_fps();
  }

  sample_fps() {
    var fps_sample = [...this.fps_raw];
    fps_sample.sort(function(a,b){
      return a-b;
    });
    const half = Math.floor(fps_sample.length / 2);
    return fps_sample[half]
  }

  get_fps() {
    return this.fps
  }
}