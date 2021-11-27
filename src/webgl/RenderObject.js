class RenderObject {
  constructor(object, program, camera, uniform_map) {
    this.object = object;
    this.program = program;
    this.camera = camera;
    this.uniform_map = uniform_map;
  }

  render() {
    this.program.use();
    this.object.activate(this.program);
    this.program.manage_uniforms(this.uniform_map)
    this.object.draw();
  }
}