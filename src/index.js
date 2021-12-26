async function main() {

  var fps = 60;

  images = await charge_images([
    "./src/view/assets/textures/cat.jpg",
    "./src/view/assets/textures/Warrior_Full_Texture.png",
    "./src/view/assets/textures/Slime_Texture.png"
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

  var model_1 = new AnimatedObject(gl, hero_obj, obj_animation_map_hero);

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

  var model_2 = new AnimatedObject(gl, slime_obj, obj_animation_map_slime);


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

  hero_render_object = new RenderObject(model_1, program, camera, {
    "tex0": model_1.texture_object.gl_texture,
    "aspect_ratio": aspect.ratio,
    "model": model_1.model,
    "view": camera.view,
    "proj": camera.projection
  });

  opponent_render_object = new RenderObject(model_2, program, camera, {
    "tex0": model_2.texture_object.gl_texture,
    "aspect_ratio": aspect.ratio,
    "model": model_2.model,
    "view": camera.view,
    "proj": camera.projection
  });

  model_1.setXYZ(-4.0, 0.0, 0.0);
  model_1.rotate(90*3.14/180, 0.0, 1.0, 0.0);
  model_2.setXYZ(4.0, 0.0, 0.0);
  model_2.rotate(180*3.14/180, 0.0, 1.0, 0.0);

  var render_objects = {
    "hero": hero_render_object,
    "opponent": opponent_render_object
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