class DynamicCubemapRender extends RenderObject {
  constructor(gl, program, camera, texture_folders) {

    var uniform_map = {}

    super(
      new DynamicCubemap(gl, texture_folders),
      program,
      camera,
      uniform_map
    )

    this.uniform_map.key_texture = this.object.texture_object.gl_texture;
    this.uniform_map.key_model = this.object.model;
    this.uniform_map.key_view = camera.get_view_matrix();
    this.uniform_map.key_view_pos = camera.get_position();
  }


  set_texture_time(time) {
    if (time == Scene.DAY) {
      this.object.current_texture = this.object.day_texture;
    } else if (time == Scene.EVENING) {
      this.object.current_texture = this.object.evening_texture;
    } else if (time == Scene.NIGHT) {
      this.object.current_texture = this.object.night_texture;
    }
    this.object.texture_object = new CubemapTexture(this.object.gl, this.object.current_texture)
    this.update_uniform("key_texture", this.object.texture_object.gl_texture);
  }

}