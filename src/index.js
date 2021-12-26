async function main() {

  var fps = 60;

  images = await charge_images([
    "./src/view/assets/textures/cat.jpg",
    "./src/view/assets/textures/Warrior_Full_Texture.png",
    "./src/view/assets/textures/Slime_Texture.png",
    "./src/view/assets/textures/Skeleton_Texture.png",
    "./src/view/assets/textures/Dragon_Texture.png",
    "./src/view/assets/textures/Wisp_Texture.png"
  ]);

  audios = charge_audios([
    "./src/view/assets/sounds/sword_slash.mp3",
  ])

  // Boilerplate code
  const canvas = document.getElementById('webgl_canvas');
  const gl = canvas.getContext('webgl');
  
  var aspect = {
    ratio: [1.0, 1.0]
  }

  auto_resize_window(window, canvas, gl, aspect);

  const sourceV = await read_file("./src/view/glsl/vertexShader.vert");
  const sourceF = await read_file("./src/view/glsl/fragmentShader.frag");

  var program = new Program(gl, sourceV, sourceF, {
    "model": {
      variable:"M",
      type: "mat4",
    },
    "view": {
      variable:"V",
      type: "mat4",
    },
    "proj": {
      variable:"P",
      type: "mat4"
    },
    "tex0": {
      variable: "u_texture",
      type: "sampler2D"
    },
    "aspect_ratio": {
      variable: "u_aspect_ratio",
      type: "vec2"
    }
  })

  var tex_cat = new Texture(gl, images["./src/view/assets/textures/cat.jpg"]);

  var tex_face = [
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
  ]
  var tex_positions = []
  for (let i = 0; i < 6; i++) {
    tex_positions = tex_positions.concat(tex_face);
  }

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

  const wisp_obj = await read_file("./src/view/assets/models/Wisp/Wisp.obj");

  var model_wisp = new ComplexObject(gl, wisp_obj);


  var camera = new Camera({
    eye: {
      x: -5.0, y: 5.0, z: 5.0
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

  var camera_controller = new CameraController(document, camera);

  hero_render_object = new RenderObject(model_hero, program, camera, {
    "tex0": model_hero.texture_object.gl_texture,
    "aspect_ratio": aspect.ratio,
    "model": model_hero.model,
    "view": camera.view,
    "proj": camera.projection
  });

  slime_render_object = new RenderObject(model_slime, program, camera, {
    "tex0": model_slime.texture_object.gl_texture,
    "aspect_ratio": aspect.ratio,
    "model": model_slime.model,
    "view": camera.view,
    "proj": camera.projection
  });

  skeleton_render_object = new RenderObject(model_skeleton, program, camera, {
    "tex0": model_skeleton.texture_object.gl_texture,
    "aspect_ratio": aspect.ratio,
    "model": model_skeleton.model,
    "view": camera.view,
    "proj": camera.projection
  });

  dragon_render_object = new RenderObject(model_dragon, program, camera, {
    "tex0": model_dragon.texture_object.gl_texture,
    "aspect_ratio": aspect.ratio,
    "model": model_dragon.model,
    "view": camera.view,
    "proj": camera.projection
  });

  wisp_render_object = new RenderObject(model_wisp, program, camera, {
    "tex0": model_wisp.texture_object.gl_texture,
    "aspect_ratio": aspect.ratio,
    "model": model_wisp.model,
    "view": camera.view,
    "proj": camera.projection
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

  model_wisp.scale(0.05, 0.05, 0.05)


  var render_objects = {
    "hero": hero_render_object,
    "slime": slime_render_object,
    "skeleton": skeleton_render_object,
    "dragon": dragon_render_object,
    "wisp": wisp_render_object
  }
  var game_controller = new GameController(document, render_objects);

  function render() {
    // Model update
    game_controller.update(fps);

    //Draw loop
    gl.clearColor(0.2, 0.2, 0.2, 1);
    gl.clearDepth(1.0);                 // Clear everything
  
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    for (var render_id in render_objects) {
      render_objects[render_id].render();
    }
    
    window.requestAnimationFrame(render); // While(True) loop!
  }
  
  document.getElementById('loading_screen').style.visibility = "hidden";

  render();


};

document.addEventListener('DOMContentLoaded', () => { main() });