class RenderObject {
  constructor(object, program, camera, uniform_map) {
    this.object = object;
    this.program = program;
    this.camera = camera;
    this.uniform_map = uniform_map;
  }

  update_uniform(key, new_value){
    this.uniform_map[key] = new_value;
  }

  render() {
    this.object.update();
    this.program.use();
    this.object.activate(this.program.program);
    this.program.manage_uniforms(this.uniform_map);
    this.object.draw();
  }
}