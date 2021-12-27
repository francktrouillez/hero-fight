function generate_camera(gl, canvas) {
  var camera = new Camera({
    eye: {
      x: 15.0, y: 4.0, z: 0.0
    },
    center: {
      x: 0.0, y: 0.0, z: 0.0
    },
    up: {
      x: 0.0, y: 1.0, z: 0.0
    },
    fov: 45.0,
    aspect: 1.0,
    near: 0.01,
    far: 100.0
  });

  auto_resize_window(window, canvas, gl, camera);
  return camera;
}

function generate_program_lights(gl, number_of_lights) {
  const sourceV = shaders["./src/view/glsl/vertexShaderLight.vert"];
  const sourceF = shaders["./src/view/glsl/fragmentShaderLight" + number_of_lights + ".frag"];

  var program = new Program(gl, sourceV, sourceF, {
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
      variable: "u_texture",
      type: "sampler2D"
    },
    key_ITMatrix: {
      variable:"itM",
      type: "mat4"
    },
    key_view_pos:{
      variable:"u_view_pos",
      type: "vec3"
    },
    key_material:{
      variable:"u_material",
      type: "material"
    },
    key_point_ligths:{
      variable: "u_point_ligths_list",
      type: "point_lights"
    }
  })

  return program;
}


function generate_program_simple(gl) {
  const sourceSimpleV = shaders["./src/view/glsl/vertexShader.vert"];
  const sourceSimpleF = shaders["./src/view/glsl/fragmentShader.frag"];

  var simple_program = new Program(gl, sourceSimpleV, sourceSimpleF, {
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
      variable: "u_texture",
      type: "sampler2D"
    }
  })

  return simple_program;
}

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
   const cubemap_model = obj_files["./src/view/assets/models/cube.obj"];
   var cubemap_object = new ComplexObject(gl, cubemap_model);
 
   // Cubemap texture
   var texCube = await make_texture_cubemap(gl, './src/view/assets/textures/cubemaps/Sky');
   cubemap_object.setTexture(texCube);

   render_object_cubemap = new RenderObject(cubemap_object, program, camera, {
    key_texture: cubemap_object.texture_object.gl_texture,
    key_model: cubemap_object.model,
    key_view: camera.get_view_matrix(),
    key_projection: camera.get_projection_matrix()
  });

  return render_object_cubemap;
}

function generate_floor(gl, program, camera, point_lights_list) {
  // Construct a base floor
  const floor_material = new Material(glMatrix.vec3.fromValues(1.0, 1.0, 1.0),
                                      glMatrix.vec3.fromValues(1.0, 1.0, 1.0),
                                      glMatrix.vec3.fromValues(0.0, 0.0, 0.0),
                                      32.0 );
  var tex_grass = new Texture(gl, images["./src/view/assets/textures/grass_floor.jpg"]);

  var tex_face = [
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,

    0.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
  ]

  var floor = new Floor(gl, tex_grass, new Float32Array(tex_face), 
    function() {
      return;
    }
  );

  floor.setXYZ(0.0,0.0,0.0);

  render_object_floor = new RenderObject(floor, program, camera, {
    key_texture: floor.texture_object.gl_texture,
    key_model: floor.model,
    key_view: camera.get_view_matrix(),
    key_projection: camera.get_projection_matrix(),
    key_ITMatrix: floor.model,
    key_view_pos: camera.get_position(),
    key_material: floor_material,
    key_point_ligths: point_lights_list
  });

  return render_object_floor;
}
