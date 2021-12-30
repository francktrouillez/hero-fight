function generate_program_cubemap(gl) {
  const cubemapV = shaders["./src/view/glsl/vertexShader_cubemap.vert"];
  const cubemapF = shaders["./src/view/glsl/fragmentShader_cubemap.frag"];

  var cubemap_program = new Program(gl, cubemapV, cubemapF, {
    key_model: {
      variable:"M",
      type: "mat4"
    },
    key_view: {
      variable:"V",
      type: "mat4"
    },
    key_projection: {
      variable:"P",
      type: "mat4"
    },
    key_texture: {
      variable: "u_cubemap",
      type: "samplerCube"
    }
  })

  return cubemap_program;
}

async function generate_cubemap(gl, program, camera) {
   // Construct the cubemap
   const cubemap_model = obj_files["./src/view/assets/models/Cube/Cube.obj"];
   var cubemap_object = new ComplexObject(gl, cubemap_model);
   //var cubemap_object = new Cubemap(gl, './src/view/assets/textures/cubemaps/day')
 
   // Cubemap texture
   var texCube = new CubemapTexture(gl, './src/view/assets/textures/cubemaps/day');//await make_texture_cubemap(gl, './src/view/assets/textures/cubemaps/day');
   cubemap_object.texture_object = texCube;

   render_object_cubemap = new RenderObject(cubemap_object, program, camera, {
    key_texture: cubemap_object.texture_object.gl_texture,
    key_model: cubemap_object.model,
    key_view: camera.get_view_matrix(),
    key_projection: camera.get_projection_matrix()
  });

  return render_object_cubemap;
}