class BumpmapRender extends RenderObject {

  constructor(gl, program, camera, lights_list) {

    var uniform_map = {}                               
    var tex_diffuse = new Texture(gl, images["./src/view/assets/textures/bumpmap/floor_DIFFUSE.jpg"]);
    var tex_normal = new Texture(gl,images["./src/view/assets/textures/bumpmap/floor_NORMAL.jpg"] );

    // Bummap is an object different from a complex one because of the two different textures
    var bumpmap = new FloorBumpmapping(gl, tex_diffuse, tex_normal, 
      function() {
        return;
      }
    );
    bumpmap.rotate(-Math.PI/2, 1.0, 0.0, 0.0);

    super(
      bumpmap,
      program,
      camera,
      uniform_map
    )

    this.uniform_map.key_texture = this.object.texture_object.gl_texture;
    this.uniform_map.key_normal = this.object.texture_normals.gl_texture;
    this.uniform_map.key_model = this.object.model;
    this.uniform_map.key_view = camera.get_view_matrix();
    this.uniform_map.key_projection = camera.get_projection_matrix();
    this.uniform_map.key_view_pos = camera.get_position();
    this.uniform_map.key_point_ligths = lights_list;
    this.uniform_map.key_material = new Material([1.0, 1.0, 1.0], [0.5, 0.5, 0.5], [0.5, 0.5, 0.5], 32.0);
  }
}
