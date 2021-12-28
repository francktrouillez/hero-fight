class WispRender extends RenderObject {
  constructor(gl, program, camera, lights_list) {

    var uniform_map = {}

    super(
      new EnlightedObject(gl, obj_files["./src/view/assets/models/Wisp/Wisp.obj"], {
        constant: 0.0,
        linear: 1.0,
        quadratic: 0.0,
        ambient: 0.0,
        diffuse: 0.01,
        specular: 0.05,
        light_color: [255.0, 255.0, 255.0]
      }),
      program,
      camera,
      uniform_map
    )

    this.object.scale(0.05);

    this.uniform_map.key_texture = this.object.texture_object.gl_texture;
    this.uniform_map.key_model = this.object.model;
    this.uniform_map.key_ITMatrix = this.object.model;
    this.uniform_map.key_view = camera.get_view_matrix();
    this.uniform_map.key_projection = camera.get_projection_matrix();
    this.uniform_map.key_view_pos = camera.get_position();
    this.uniform_map.key_point_ligths = lights_list;
    this.uniform_map.key_material = new Material([1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], 32.0);
  }
}