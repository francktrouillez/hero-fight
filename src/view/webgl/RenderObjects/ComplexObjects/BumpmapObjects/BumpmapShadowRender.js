class BumpmapShadowRender extends RenderObject {

  constructor(gl, obj_content, tex_normal, program, camera, uniform_map) {
    super(
      new BumpmappingShadowObject(gl, obj_content, tex_normal),
      program,
      camera,
      uniform_map
    );
    this.light_view_matrix = glMatrix.mat4.create();
    this.light_projection_matrix = glMatrix.mat4.create();
    this.texture_matrix = glMatrix.mat4.create();
    this.field_of_view_light = 45.0;

    this.depth_program = new SimpleProgram(gl);
  }

  render_from_light(light, render_objects, render_ids) {
    const gl = this.object.gl;

    var target_pos = [0.0, 0.0, 0.0]
    if (light.pos[0] == 0 && light.pos[2] == 0) {
      target_pos = [0.001, 0.0, 0.001]
    }
    this.light_view_matrix = glMatrix.mat4.lookAt(
      this.light_view_matrix,
      glMatrix.vec3.fromValues(light.pos[0], light.pos[1], light.pos[2]), 
      glMatrix.vec3.fromValues(target_pos[0], target_pos[1], target_pos[2]), 
      glMatrix.vec3.fromValues(0.0, 1.0, 0.0)
    )

    this.light_projection_matrix = glMatrix.mat4.perspective(
      this.light_projection_matrix,
      this.field_of_view_light,
      1,
      0.5,
      100.0
    )

    const save_buffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
    this.object.activate_frame_buffer();
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    for (const render_id of render_ids) {
      const save_program = render_objects[render_id].program;
      render_objects[render_id].set_program(this.depth_program);
      render_objects[render_id].update_uniform("key_view", this.light_view_matrix);
      render_objects[render_id].update_uniform("key_projection", this.light_projection_matrix);
      render_objects[render_id].render(false);
      render_objects[render_id].update_uniform("key_view", this.camera.get_view_matrix());
      render_objects[render_id].update_uniform("key_projection", this.camera.get_projection_matrix());
      render_objects[render_id].set_program(save_program);
    }
    this.texture_matrix = glMatrix.mat4.identity(this.texture_matrix);
    const save_program = this.program;
    this.set_program(this.depth_program);
    this.update_uniform("key_view", this.light_view_matrix);
    this.update_uniform("key_projection", this.light_projection_matrix);
    this.render(false);
    this.update_uniform("key_view", this.camera.get_view_matrix());
    this.update_uniform("key_projection", this.camera.get_projection_matrix());
    this.set_program(save_program);
    this.object.disable_frame_buffer(save_buffer);
  }

  render(need_to_be_updated = true) {
    if (need_to_be_updated) {
      this.object.update();
    }
    this.program.use();
    this.object.activate(this.program.program);

    if (need_to_be_updated) {
      this.update_texture_matrix();
    }

    this.program.manage_uniforms(this.uniform_map);
    this.object.draw();
  }

  update_texture_matrix() {
    this.texture_matrix = glMatrix.mat4.identity(this.texture_matrix);
    this.texture_matrix = glMatrix.mat4.multiply(this.texture_matrix, this.texture_matrix, this.light_projection_matrix);
    this.texture_matrix = glMatrix.mat4.multiply(this.texture_matrix, this.texture_matrix, this.light_view_matrix);
  }
}
