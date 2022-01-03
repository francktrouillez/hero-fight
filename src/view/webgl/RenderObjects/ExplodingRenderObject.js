class ExplodingRenderObject extends RenderObject {
  constructor(object, program, camera, uniform_map) {
    super(object, program, camera, uniform_map);
    this.t = 0;
    this.offset = 0;
    this.is_exploding = false;
  }

  explodes() {
    this.is_exploding = true;
  }

  reset() {
    this.is_exploding = false;
    this.t = 0,
    this.offset = 0;
    this.update_uniform("key_t", this.t);
  }

  update_t(now) {
    if (this.is_exploding) {
      this.t = (now - this.offset)/1000;
      this.update_uniform("key_t", this.t);
    } else {
      this.offset = now;
    }
  }

}