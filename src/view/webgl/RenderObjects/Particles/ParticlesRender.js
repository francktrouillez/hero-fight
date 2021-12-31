class ParticlesRender extends RenderObject {
  constructor(particle_generator_object, program, camera) {
    var uniform_map = {}
    super(
      particle_generator_object,
      program,
      camera,
      uniform_map
    )
    this.uniform_map.key_view = camera.get_view_matrix();
    this.uniform_map.key_projection = camera.get_projection_matrix();
    this.uniform_map.key_scale = this.object.scale;
  }

  render(need_to_be_updated = true) {
    if (need_to_be_updated) {
      this.object.update();
    }
    const gl = this.object.gl
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
    this.program.use();
    this.program.manage_uniforms(this.uniform_map);
    this.object.activate_and_draw(this.program.program);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

}