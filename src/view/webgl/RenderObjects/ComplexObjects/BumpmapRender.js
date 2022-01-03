class BumpmapRender extends RenderObject {

  constructor(gl, program, camera, lights_list) {

    var uniform_map = {}

    super(
      new ComplexObject(gl, obj_files["./src/view/assets/models/Floor/Floor.obj"]),
      program,
      camera,
      uniform_map
    )

    this.uniform_map.key_texture = this.object.texture_object.gl_texture;
    this.uniform_map.key_model = this.object.model;
    this.uniform_map.key_ITMatrix = this.object.model;
    this.uniform_map.key_view = camera.get_view_matrix();
    this.uniform_map.key_projection = camera.get_projection_matrix();
    this.uniform_map.key_view_pos = camera.get_position();
    this.uniform_map.key_point_ligths = lights_list;
    this.uniform_map.key_material = new Material([1.0, 1.0, 1.0], [0.5, 0.5, 0.5], [0.5, 0.5, 0.5], 32.0);
  }
}



async function generate_bumpmap(gl, program, camera, point_lights_list) {
  const bumpmap_material = new Material(glMatrix.vec3.fromValues(1.0, 1.0, 1.0),
                                      glMatrix.vec3.fromValues(0.5, 0.5, 0.5),
                                      glMatrix.vec3.fromValues(0.5, 0.5, 0.5),
                                      32.0 );                                 
  var tex_diffuse = new Texture(gl, images["./src/view/assets/textures/bumpmap/floor_DIFFUSE.jpg"]);
  var tex_normal = new Texture(gl,images["./src/view/assets/textures/bumpmap/floor_NORMAL.jpg"] );

  var bumpmap = new FloorBumpmapping(gl, tex_diffuse, tex_normal, 
    function() {
      return;
    }
  );
  bumpmap.rotate(-Math.PI/2, 1.0, 0.0, 0.0);

  render_object_bumpmap = new RenderObject(bumpmap, program, camera, {
    key_texture_diffuse: bumpmap.texture_diffuse.gl_texture,
    key_texture_normal: bumpmap.texture_normals.gl_texture,
    key_model: bumpmap.model,
    key_view: camera.get_view_matrix(),
    key_projection: camera.get_projection_matrix(),
    key_view_pos: camera.get_position(),
    key_material: bumpmap_material,
    key_point_ligths: point_lights_list
  });

  return render_object_bumpmap;
}