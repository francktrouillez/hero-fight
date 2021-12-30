class CubemapRender extends RenderObject {
  constructor(gl, program, camera, texture_folder) {

    var uniform_map = {}

    super(
      new Cubemap(gl, texture_folder),
      program,
      camera,
      uniform_map
    )

    this.uniform_map.key_texture = this.object.texture_object.gl_texture;
    this.uniform_map.key_model = this.object.model;
    this.uniform_map.key_view = camera.get_view_matrix();
    this.uniform_map.key_view_pos = camera.get_position();
  }
}