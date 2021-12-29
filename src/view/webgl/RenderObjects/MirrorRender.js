class MirrorRender extends RenderObject {
  constructor(gl, program, camera, lights_list) {

    var uniform_map = {}
    var mirror = new Mirror(gl, obj_files["./src/view/assets/models/Disk/Disk.obj"], camera)

    super(
      mirror,
      program,
      camera,
      uniform_map
    )
    this.mirror = mirror;
    mirror.setXYZ(0.0, 0.01, 0.0);
    //mirror.rotate(-Math.PI/2, 0.0, 0.0, 1.0);

    this.uniform_map.key_texture = this.mirror.gl_texture;
    this.uniform_map.key_model = this.object.model;
    this.uniform_map.key_ITMatrix = this.object.model;
    this.uniform_map.key_view = camera.get_view_matrix();
    this.uniform_map.key_projection = camera.get_projection_matrix();
    this.uniform_map.key_view_pos = camera.get_position();
    this.uniform_map.key_point_ligths = lights_list;
    this.uniform_map.key_material = new Material([1.0, 1.0, 1.0], [0.5, 0.5, 0.5], [0.0, 0.0, 0.0], 32.0);
  }

  render_mirror(render_objects, excluded_objects) {
    this.mirror.update_mirror("reflexion");
    this.mirror.activate_frame_buffer();
    for (var render_id in render_objects) {
      if (excluded_objects.includes(render_id)){
        continue;
      }
      render_objects[render_id].update_uniform("key_view", this.mirror.mirror_camera.get_view_matrix());
      render_objects[render_id].update_uniform("key_projection", this.mirror.mirror_camera.get_projection_matrix());
      render_objects[render_id].update_uniform("key_view_pos", this.mirror.mirror_camera.get_position());
      render_objects[render_id].render(false);
      render_objects[render_id].update_uniform("key_view", this.camera.get_view_matrix());
      render_objects[render_id].update_uniform("key_projection", this.camera.get_projection_matrix());
      render_objects[render_id].update_uniform("key_view_pos", this.camera.get_position());
    }
    this.mirror.disable_frame_buffer();
  }

  render(need_to_be_updated = true) {
    if (need_to_be_updated) {
      this.object.update();
    }
    this.program.use();

    this.mirror.gl.bindTexture(this.mirror.gl.TEXTURE_2D, this.mirror.gl_texture);

    this.object.activate(this.program.program);
    this.program.manage_uniforms(this.uniform_map);
    this.object.draw();
  }
}