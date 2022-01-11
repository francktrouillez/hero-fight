class BumpmapRender extends RenderObject {

  constructor(gl, obj_content, tex_normal, program, camera, uniform_map) {                             

    // Bummap is an object different from a complex one because of the two different textures
    super(
      new BumpmappingObject(gl, obj_content, tex_normal),
      program,
      camera,
      uniform_map
    );
  }
}
