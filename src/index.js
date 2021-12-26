async function main() {

  var fps = 60;

  images = await charge_images([
    "./src/view/assets/textures/Warrior_Full_Texture.png",
    "./src/view/assets/textures/Slime_Texture.png",
    "./src/view/assets/textures/Skeleton_Texture.png",
    "./src/view/assets/textures/Dragon_Texture.png",
    "./src/view/assets/textures/Wisp_Texture.png",
    "./src/view/assets/textures/blue_fire.jpeg",
    "./src/view/assets/textures/Blue_fire.png",
    "./src/view/assets/textures/grass_floor.jpg",
  ]);

  audios = charge_audios([
    "./src/view/assets/sounds/sword_slash.mp3",
  ])

  // Boilerplate code
  const canvas = document.getElementById('webgl_canvas');
  const gl = canvas.getContext('webgl');
  
  const sourceV = await read_file("./src/view/glsl/vertexShaderLight.vert");
  const sourceF = await read_file("./src/view/glsl/fragmentShaderLight.frag");

  const sourceSimpleV = await read_file("./src/view/glsl/vertexShader.vert");
  const sourceSimpleF = await read_file("./src/view/glsl/fragmentShader.frag");

  const cubemapV = await read_file("./src/view/glsl/vertexShader_cubemap.vert");
  const cubemapF = await read_file("./src/view/glsl/fragmentShader_cubemap.frag");


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

  const hero_obj = await read_file("./src/view/assets/models/Warrior/Warrior.obj")
  var obj_animation_map_hero = {
    "idle": [],
    "attack": [],
    "buff": []
  
  }
  for (let i = 0; i <= 15; i++) {
    obj_animation_map_hero["idle"].push(await(read_file("./src/view/assets/models/Warrior/idle/" + i + ".obj")))
  }
  for (let i = 0; i <= 20; i++) {
    obj_animation_map_hero["attack"].push(await(read_file("./src/view/assets/models/Warrior/attack/" + i + ".obj")))
  }
  for (let i = 0; i <= 18; i++) {
    obj_animation_map_hero["buff"].push(await(read_file("./src/view/assets/models/Warrior/punch/" + i + ".obj")))
  }

  var model_hero = new AnimatedObject(gl, hero_obj, obj_animation_map_hero);

  const slime_obj = await read_file("./src/view/assets/models/Slime/Slime.obj")
  var obj_animation_map_slime = {
    "idle": [],
    "attack": []
  
  }
  for (let i = 0; i <= 20; i++) {
    obj_animation_map_slime["idle"].push(await(read_file("./src/view/assets/models/Slime/idle/" + i + ".obj")))
  }
  for (let i = 0; i <= 15; i++) {
    obj_animation_map_slime["attack"].push(await(read_file("./src/view/assets/models/Slime/attack/" + i + ".obj")))
  }

  var model_slime = new AnimatedObject(gl, slime_obj, obj_animation_map_slime);

  const skeleton_obj = await read_file("./src/view/assets/models/Skeleton/Skeleton.obj")
  var obj_animation_map_skeleton = {
    "idle": [],
    "attack": []
  
  }
  for (let i = 0; i <= 80; i++) {
    obj_animation_map_skeleton["idle"].push(await(read_file("./src/view/assets/models/Skeleton/idle/" + i + ".obj")))
  }
  for (let i = 0; i <= 28; i++) {
    obj_animation_map_skeleton["attack"].push(await(read_file("./src/view/assets/models/Skeleton/attack/" + i + ".obj")))
  }

  var model_skeleton = new AnimatedObject(gl, skeleton_obj, obj_animation_map_skeleton);


  const dragon_obj = await read_file("./src/view/assets/models/Dragon/Dragon.obj")
  var obj_animation_map_dragon = {
    "idle": [],
    "attack": []
  
  }
  for (let i = 0; i <= 40; i++) {
    obj_animation_map_dragon["idle"].push(await(read_file("./src/view/assets/models/Dragon/idle/" + i + ".obj")))
  }
  for (let i = 0; i <= 40; i++) {
    obj_animation_map_dragon["attack"].push(await(read_file("./src/view/assets/models/Dragon/attack/" + i + ".obj")))
  }

  var model_dragon = new AnimatedObject(gl, dragon_obj, obj_animation_map_dragon);    

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


  // Construct the cubemap
  const cubemap_model = await read_file("./src/view/assets/models/cube.obj");
  var cubemap_object = new ComplexObject(gl, cubemap_model, 
   function() {
     return;
   }
  );

  // Cubemap texture
  var texCube = await make_texture_cubemap(gl, './src/view/assets/textures/cubemaps/Sky');
  cubemap_object.setTexture(texCube);

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

 // Create the model of the wisp and the multiple values as a pointlight
 const wisp_model = await read_file("./src/view/assets/models/sphere_smooth.obj");
 var wisp1_object = new ComplexObject(gl, wisp_model, 
   function() {
     return;
   }
 );
 //Wisp 1
 var wisp_pos = glMatrix.vec3.fromValues(0.0,1.0,0.0);
 var wisp_color = glMatrix.vec3.fromValues(0.0,255.0,0.0);
 var wisp1 = new Wisp(wisp_pos, 0.0, 3.0, 0.0, 0.0, 0.05, 0.1, wisp_color, wisp1_object);

 //Wisp 2
 var wisp2_object = new ComplexObject(gl, wisp_model, 
  function() {
    return;
  }
);
 var teta_wisp2 = 0.0;
 var radius_wisp2 = 8.0;
 var wisp2_pos = glMatrix.vec3.fromValues(radius_wisp2*Math.cos(teta_wisp2), 0.0,radius_wisp2*Math.sin(teta_wisp2));
 var wisp2_color = glMatrix.vec3.fromValues(0.0,0.0,255.0);
 var wisp2 = new Wisp(wisp2_pos, 0.0, 1.0, 0.0, 0.0, 0.05, 0.1, wisp2_color, wisp2_object);

 //Wisp 3
 var wisp3_object = new ComplexObject(gl, wisp_model, 
  function() {
    return;
  }
);
 var teta_wisp3 = Math.PI;
 var radius_wisp3 = 8.0;
 var wisp3_pos = glMatrix.vec3.fromValues(radius_wisp3*Math.cos(teta_wisp3), 0.0,radius_wisp3*Math.sin(teta_wisp3));
 var wisp3_color = glMatrix.vec3.fromValues(255.0,0.0,0.0);
 var wisp3 = new Wisp(wisp3_pos, 0.0, 1.0, 0.0, 0.0, 0.05, 0.1, wisp3_color, wisp3_object);


  // Creation of warriors objects and material
  const warrior_material = new Material(glMatrix.vec3.fromValues(1.0, 1.0, 1.0),
                                        glMatrix.vec3.fromValues(1.0, 1.0, 1.0),
                                        glMatrix.vec3.fromValues(1.0, 1.0, 1.0),
                                        32.0 );

  const model_obj = await read_file("./src/view/assets/models/Full_Warrior.obj")

  var model_1 = new ComplexObject(gl, model_obj, 
    function() {
      return;
    }
  );

  model_1.translate(0.0, 0.0, -4.0);

  // Definition of the camera
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

  var camera_controller = new CameraController(document, camera);
  
  //Configure the Point lights
  var sun_pos = glMatrix.vec3.fromValues(0.0, 10.0, 0.0);
  var sun_ambient = 0.15;
  var sun_diffuse = 0.6;
  var sun_color = glMatrix.vec3.fromValues(1.0,1.0,1.0);
  //             pos, constant, linear, quadratic, ambient, diffuse, specular, color
  var sun = new PointLight(sun_pos, 0.0, 0.0, 0.0, sun_ambient, sun_diffuse, 0.0, sun_color);


  

  
  //Fill the list used to regroup all the light and send it to the render object dict to update the uniform accordingly
  let point_lights_list = [sun, wisp1, wisp2, wisp3];

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

  render_object_wisp1 = new RenderObject(wisp1.object, simple_program, camera, {
    key_texture: wisp1.object.texture_object.gl_texture,
    key_model: wisp1.object.model,
    key_view: camera.get_view_matrix(),
    key_projection: camera.get_projection_matrix()
  });
  
  render_object_wisp2 = new RenderObject(wisp2.object, simple_program, camera, {
    key_texture: wisp2.object.texture_object.gl_texture,
    key_model: wisp2.object.model,
    key_view: camera.get_view_matrix(),
    key_projection: camera.get_projection_matrix()
  });

  render_object_wisp3 = new RenderObject(wisp3.object, simple_program, camera, {
    key_texture: wisp3.object.texture_object.gl_texture,
    key_model: wisp3.object.model,
    key_view: camera.get_view_matrix(),
    key_projection: camera.get_projection_matrix()
  });

  render_object_cubemap = new RenderObject(cubemap_object, cubemap_program, camera, {
    key_texture: cubemap_object.texture_object.gl_texture,
    key_model: cubemap_object.model,
    key_view: camera.get_view_matrix(),
    key_projection: camera.get_projection_matrix()
  });

  slime_render_object = new RenderObject(model_slime, program, camera, {
    key_texture: model_slime.texture_object.gl_texture,
    key_model: model_slime.model,
    key_view: camera.get_view_matrix(),
    key_projection: camera.get_projection_matrix(),
    key_ITMatrix: model_slime.model,
    key_view_pos: camera.get_position(),
    key_material: warrior_material,
    key_point_ligths: point_lights_list
  });

  skeleton_render_object = new RenderObject(model_skeleton, program, camera, {
    key_texture: model_skeleton.texture_object.gl_texture,
    key_model: model_skeleton.model,
    key_view: camera.get_view_matrix(),
    key_projection: camera.get_projection_matrix(),
    key_ITMatrix: model_skeleton.model,
    key_view_pos: camera.get_position(),
    key_material: warrior_material,
    key_point_ligths: point_lights_list
  });

  dragon_render_object = new RenderObject(model_dragon, program, camera, {
    key_texture: model_dragon.texture_object.gl_texture,
    key_model: model_dragon.model,
    key_view: camera.get_view_matrix(),
    key_projection: camera.get_projection_matrix(),
    key_ITMatrix: model_dragon.model,
    key_view_pos: camera.get_position(),
    key_material: warrior_material,
    key_point_ligths: point_lights_list
  });

  model_hero.setXYZ(-4.0, 0.0, 0.0);
  model_hero.rotate(90*3.14/180, 0.0, 1.0, 0.0);

  model_slime.setXYZ(4.0, 0.0, 0.0);
  model_slime.rotate(180*3.14/180, 0.0, 1.0, 0.0);
  model_slime.scale(0.5, 0.5, 0.5);

  model_skeleton.setXYZ(4.0, 0.0, 0.0);
  model_skeleton.rotate(270*3.14/180, 0.0, 1.0, 0.0);
  model_skeleton.scale(0.5, 0.5, 0.5);

  model_dragon.setXYZ(4.0, 0.0, 0.0);
  model_dragon.rotate(270*3.14/180, 0.0, 1.0, 0.0);
  model_dragon.scale(0.9, 0.9, 0.9);



  var render_objects = {
    "hero": hero_render_object,
    "slime": slime_render_object,
    "skeleton": skeleton_render_object,
    "dragon": dragon_render_object,
    "cubemap": render_object_cubemap,
    "floor":render_object_floor
  }

  var render_simple_objects = {
    "wisp1": render_object_wisp1,
    "wisp2": render_object_wisp2,
    "wisp3": render_object_wisp3,
  }
  var game_controller = new GameController(document, render_objects);

  var sign = 1.0;
  function render() {
    // Model update
    game_controller.update(fps);

    //Draw loop
    gl.clearColor(0.2, 0.2, 0.2, 1);
    gl.clearDepth(1.0);                 // Clear everything
  
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    
    // Move the light around and change the uniform accordingly
    wisp1.move( glMatrix.vec3.fromValues(0.0,sign*0.01,0.0) );
    teta_wisp2 += 0.01;
    teta_wisp3 += 0.01;
    if(teta_wisp3 >= 2*Math.PI){teta_wisp3 = 0.0;}
    if(teta_wisp2 >= 2*Math.PI){teta_wisp2 = 0.0; sign=-sign;}
    wisp2.set_position(glMatrix.vec3.fromValues(radius_wisp2*Math.cos(teta_wisp2), 2.0,radius_wisp2*Math.sin(teta_wisp2)));
    wisp3.set_position(glMatrix.vec3.fromValues(radius_wisp3*Math.cos(teta_wisp3), 2.0 ,radius_wisp3*Math.sin(teta_wisp3)));
    point_lights_list = [sun, wisp1, wisp2, wisp3];


    for (var render_id in render_objects) {
      render_objects[render_id].render();
    }  
    // Same loop but for displaying simple object without light
    for (var render_id in render_simple_objects) {
      render_simple_objects[render_id].render();
    }    
    window.requestAnimationFrame(render); // While(True) loop!
  }
  
  document.getElementById('loading_screen').style.visibility = "hidden";

  render();


};

document.addEventListener('DOMContentLoaded', () => { main() });