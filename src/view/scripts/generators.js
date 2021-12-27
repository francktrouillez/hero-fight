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

function generate_program_lights(gl) {
  const sourceV = shaders["./src/view/glsl/vertexShaderLight.vert"];
  const sourceF = shaders["./src/view/glsl/fragmentShaderLight.frag"];

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

function generate_hero(gl, program, camera, point_lights_list) {
  const hero_obj = obj_files["./src/view/assets/models/Warrior/Warrior.obj"]

  var obj_animation_map_hero = {
    "idle": [],
    "attack": [],
    "buff": []
  
  }
  for (let i = 0; i <= 15; i++) {
    obj_animation_map_hero["idle"].push(obj_files["./src/view/assets/models/Warrior/idle/" + i + ".obj"])
  }
  for (let i = 0; i <= 20; i++) {
    obj_animation_map_hero["attack"].push(obj_files["./src/view/assets/models/Warrior/attack/" + i + ".obj"])
  }
  for (let i = 0; i <= 18; i++) {
    obj_animation_map_hero["buff"].push(obj_files["./src/view/assets/models/Warrior/punch/" + i + ".obj"])
  }

  var model_hero = new AnimatedObject(gl, hero_obj, obj_animation_map_hero);
  
  // Creation of warriors objects and material
  const warrior_material = new Material(glMatrix.vec3.fromValues(1.0, 1.0, 1.0),
                                        glMatrix.vec3.fromValues(1.0, 1.0, 1.0),
                                        glMatrix.vec3.fromValues(1.0, 1.0, 1.0),
                                        32.0 );
  
  // Creating render objects link to the objects created above
  hero_render_object = new RenderObject(model_hero, program, camera, {
    key_texture: model_hero.texture_object.gl_texture,
    key_model: model_hero.model,
    key_view: camera.get_view_matrix(),
    key_projection: camera.get_projection_matrix(),
    key_ITMatrix: model_hero.model,
    key_view_pos: camera.get_position(),
    key_material: warrior_material,
    key_point_ligths: point_lights_list
  });

  model_hero.setXYZ(-4.0, 0.0, 0.0);
  model_hero.rotate(90*3.14/180, 0.0, 1.0, 0.0);

  return hero_render_object
}

function generate_slime(gl, program, camera, point_lights_list) {
  const slime_obj = obj_files["./src/view/assets/models/Slime/Slime.obj"]
  var obj_animation_map_slime = {
    "idle": [],
    "attack": []
  
  }
  for (let i = 0; i <= 20; i++) {
    obj_animation_map_slime["idle"].push(obj_files["./src/view/assets/models/Slime/idle/" + i + ".obj"])
  }
  for (let i = 0; i <= 15; i++) {
    obj_animation_map_slime["attack"].push(obj_files["./src/view/assets/models/Slime/attack/" + i + ".obj"])
  }

  var model_slime = new AnimatedObject(gl, slime_obj, obj_animation_map_slime);

  const slime_material = new Material(glMatrix.vec3.fromValues(1.0, 1.0, 1.0),
                                        glMatrix.vec3.fromValues(1.0, 1.0, 1.0),
                                        glMatrix.vec3.fromValues(1.0, 1.0, 1.0),
                                        32.0 );

  slime_render_object = new RenderObject(model_slime, program, camera, {
    key_texture: model_slime.texture_object.gl_texture,
    key_model: model_slime.model,
    key_view: camera.get_view_matrix(),
    key_projection: camera.get_projection_matrix(),
    key_ITMatrix: model_slime.model,
    key_view_pos: camera.get_position(),
    key_material: slime_material,
    key_point_ligths: point_lights_list
  });

  model_slime.setXYZ(4.0, 0.0, 0.0);
  model_slime.rotate(180*3.14/180, 0.0, 1.0, 0.0);
  model_slime.scale(0.5, 0.5, 0.5);

  return slime_render_object;
}

function generate_skeleton(gl, program, camera, point_lights_list) {
  const skeleton_obj = obj_files["./src/view/assets/models/Skeleton/Skeleton.obj"]
  var obj_animation_map_skeleton = {
    "idle": [],
    "attack": []
  
  }
  for (let i = 0; i <= 80; i++) {
    obj_animation_map_skeleton["idle"].push(obj_files["./src/view/assets/models/Skeleton/idle/" + i + ".obj"])
  }
  for (let i = 0; i <= 28; i++) {
    obj_animation_map_skeleton["attack"].push(obj_files["./src/view/assets/models/Skeleton/attack/" + i + ".obj"])
  }

  var model_skeleton = new AnimatedObject(gl, skeleton_obj, obj_animation_map_skeleton);

  const skeleton_material = new Material(glMatrix.vec3.fromValues(1.0, 1.0, 1.0),
                                        glMatrix.vec3.fromValues(1.0, 1.0, 1.0),
                                        glMatrix.vec3.fromValues(1.0, 1.0, 1.0),
                                        32.0 );
  
  skeleton_render_object = new RenderObject(model_skeleton, program, camera, {
    key_texture: model_skeleton.texture_object.gl_texture,
    key_model: model_skeleton.model,
    key_view: camera.get_view_matrix(),
    key_projection: camera.get_projection_matrix(),
    key_ITMatrix: model_skeleton.model,
    key_view_pos: camera.get_position(),
    key_material: skeleton_material,
    key_point_ligths: point_lights_list
  });


  model_skeleton.setXYZ(4.0, 0.0, 0.0);
  model_skeleton.rotate(270*3.14/180, 0.0, 1.0, 0.0);
  model_skeleton.scale(0.5, 0.5, 0.5);

  return skeleton_render_object;

}

function generate_dragon(gl, program, camera, point_lights_list) {
  const dragon_obj = obj_files["./src/view/assets/models/Dragon/Dragon.obj"]
  var obj_animation_map_dragon = {
    "idle": [],
    "attack": []
  
  }
  for (let i = 0; i <= 40; i++) {
    obj_animation_map_dragon["idle"].push(obj_files["./src/view/assets/models/Dragon/idle/" + i + ".obj"])
  }
  for (let i = 0; i <= 40; i++) {
    obj_animation_map_dragon["attack"].push(obj_files["./src/view/assets/models/Dragon/attack/" + i + ".obj"])
  }

  var model_dragon = new AnimatedObject(gl, dragon_obj, obj_animation_map_dragon);

  const dragon_material = new Material(glMatrix.vec3.fromValues(1.0, 1.0, 1.0),
                                        glMatrix.vec3.fromValues(1.0, 1.0, 1.0),
                                        glMatrix.vec3.fromValues(1.0, 1.0, 1.0),
                                        32.0 );

  dragon_render_object = new RenderObject(model_dragon, program, camera, {
    key_texture: model_dragon.texture_object.gl_texture,
    key_model: model_dragon.model,
    key_view: camera.get_view_matrix(),
    key_projection: camera.get_projection_matrix(),
    key_ITMatrix: model_dragon.model,
    key_view_pos: camera.get_position(),
    key_material: dragon_material,
    key_point_ligths: point_lights_list
  });

  model_dragon.setXYZ(4.0, 0.0, 0.0);
  model_dragon.rotate(270*3.14/180, 0.0, 1.0, 0.0);
  model_dragon.scale(0.9, 0.9, 0.9);

  return dragon_render_object;


}