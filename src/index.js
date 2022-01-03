async function main() {
  images = await load_images([
    "./src/view/assets/textures/Warrior_Full_Texture.png",
    "./src/view/assets/textures/Slime_Texture.png",
    "./src/view/assets/textures/Skeleton_Texture.png",
    "./src/view/assets/textures/Dragon_Texture.png",
    "./src/view/assets/textures/Wisp_Texture.png",
    "./src/view/assets/textures/Floor.png",
    "./src/view/assets/textures/Floor_normal.png",
    "./src/view/assets/textures/Underground_Texture.png",
    "./src/view/assets/textures/Fish_Texture.png",
    "./src/view/assets/textures/Tree_Texture.png",
    ["./src/view/assets/textures/cubemaps/day", "cubemap"],
    ["./src/view/assets/textures/cubemaps/evening", "cubemap"],
    ["./src/view/assets/textures/cubemaps/night", "cubemap"],
  ]);

  audios = load_audios([
    ["./src/view/assets/sounds/sword_slash.mp3", 0.7],
    ["./src/view/assets/sounds/background.mp3", 0.1],
    ["./src/view/assets/sounds/buff.mp3", 0.2],
    ["./src/view/assets/sounds/slime.mp3", 0.7],
    ["./src/view/assets/sounds/skeleton.mp3", 0.8],
    ["./src/view/assets/sounds/dragon_fire.mp3", 0.8],
    ["./src/view/assets/sounds/dragon_flying.mp3", 0.4],
    ["./src/view/assets/sounds/game_over.mp3", 0.5],
    ["./src/view/assets/sounds/kill.mp3", 0.4],
  ])

  shaders = await load_shaders([
    "./src/view/glsl/cubemap/cubemap.frag",
    "./src/view/glsl/cubemap/cubemap.vert",
    "./src/view/glsl/bumpmap/bumpmap.vert",
    "./src/view/glsl/bumpmap/bumpmap1.frag",
    "./src/view/glsl/bumpmap/bumpmap4.frag",
    "./src/view/glsl/explosion/light.vert",
    "./src/view/glsl/explosion/light1.frag",
    "./src/view/glsl/explosion/light4.frag",
    "./src/view/glsl/lights/light.vert",
    "./src/view/glsl/lights/light1.frag",
    "./src/view/glsl/lights/light4.frag",
    "./src/view/glsl/mirror/water_light1.frag",
    "./src/view/glsl/mirror/water_light4.frag",
    "./src/view/glsl/particle/particle.frag",
    "./src/view/glsl/particle/particle.vert",
    "./src/view/glsl/simple/simple.frag",
    "./src/view/glsl/simple/simple.vert"
  ])
  
  obj_files = await load_objs([
    "./src/view/assets/models/Warrior/Warrior.obj",
    ["./src/view/assets/models/Warrior/idle/", 15],
    ["./src/view/assets/models/Warrior/attack/", 20],
    ["./src/view/assets/models/Warrior/punch/", 18],
    "./src/view/assets/models/Slime/Slime.obj",
    ["./src/view/assets/models/Slime/idle/", 20],
    ["./src/view/assets/models/Slime/attack/", 15],
    "./src/view/assets/models/Skeleton/Skeleton.obj",
    ["./src/view/assets/models/Skeleton/idle/", 80],
    ["./src/view/assets/models/Skeleton/attack/", 28],
    "./src/view/assets/models/Dragon/Dragon.obj",
    ["./src/view/assets/models/Dragon/idle/", 40],
    ["./src/view/assets/models/Dragon/attack/", 40],
    "./src/view/assets/models/Wisp/Wisp.obj",
    "./src/view/assets/models/Disk/Disk.obj",
    "./src/view/assets/models/Floor/Floor.obj",
    "./src/view/assets/models/Fish/Fish.obj",
    "./src/view/assets/models/Underground/Underground.obj",
    "./src/view/assets/models/Tree/Tree1.obj",
    "./src/view/assets/models/Tree/Tree2.obj",
    "./src/view/assets/models/Tree/Tree3.obj",
    "./src/view/assets/models/Cube/Cube.obj"
  ])

  const canvas = document.getElementById('webgl_canvas');
  const gl = canvas.getContext('webgl', { premultipliedAlpha: false });
 
  // Programs
  var program_manager = new ProgramManager(
    gl,
    {
      "lights_1": new LightProgram(gl, 1),
      "lights_4": new LightProgram(gl, 4),
      "water_1": new WaterProgram(gl, 1),
      "water_4": new WaterProgram(gl, 4),
      "cubemap": new CubemapProgram(gl),
      "bumpmap1": new BumpmapProgram(gl,1),
      "bumpmap4": new BumpmapProgram(gl,4),
      "particles": new ParticleProgram(gl),
      "monsters_1": new MonsterExplodingProgram(gl, 1),
      "monsters_4": new MonsterExplodingProgram(gl, 4)
    }  
  )

  // Definition of the camera
  var camera = new MainCamera(gl, canvas, window);
  new CameraController(document, camera);

  // Lights
  var sun = new Sun()
  var wisp_horde = new WispHordeRender(gl, program_manager.get("lights_1"), camera, [sun])

  //Fill the list used to regroup all the lights and send it to the render object dict to update the uniform accordingly
  let lights_list = [];
  lights_list.push(sun)
  for (const wisp_render of wisp_horde.elements) {
    lights_list.push(wisp_render.object.light)  
  }


  
  // Render objects
  var render_objects = {
    "hero": new HeroRender(gl, program_manager.get("lights_4"), camera, lights_list),
    "cubemap": new DynamicCubemapRender(gl, program_manager.get("cubemap"), camera, [
        "./src/view/assets/textures/cubemaps/day",
        "./src/view/assets/textures/cubemaps/evening",
        "./src/view/assets/textures/cubemaps/night",
      ]
    ),
    "floor": new BumpmapRender(gl, program_manager.get("bumpmap1"),camera, lights_list),
    "underground": new UndergroundRender(gl, program_manager.get("lights_1"), camera, [sun]),
    "fish": new FishRender(gl, program_manager.get("lights_1"), camera, [sun]),
    "forest": new ForestRender(gl, program_manager.get("lights_4"), camera, lights_list),
    "wisp_horde": wisp_horde,  
  }

  var render_exploding_objects = {
    "slime": new SlimeRender(gl, program_manager.get("monsters_4"), camera, lights_list),
    "skeleton": new SkeletonRender(gl, program_manager.get("monsters_4"), camera, lights_list),
    "dragon": new DragonRender(gl, program_manager.get("monsters_4"), camera, lights_list),
  }

  // Mirror objects
  var render_mirrors = {
    "lake": new WaterRender(gl, program_manager.get("lights_4"), camera, lights_list)
  }

  var render_particles = {
    "buff": new BuffRender(gl, render_objects["hero"].object, program_manager.get("particles"), camera),
    "fish_water": new FishWaterRender(gl, render_objects["fish"].object, program_manager.get("particles"), camera),
    "dragon_fire": new DragonFireRender(gl, render_exploding_objects["dragon"].object, program_manager.get("particles"), camera)
  }

  var scene = new Scene(
    {...render_objects, ...render_mirrors, ...render_exploding_objects},
    {
      "sun": sun
    },
    {
      "only_sun": {
        program: program_manager.get("lights_1"),
        bumpmap: program_manager.get("bumpmap1"),
        lights: [sun],
        monsters_program: program_manager.get("monsters_1"), 
        mirror_program: program_manager.get("water_1")
      },
      "full_lights": {
        program: program_manager.get("lights_4"),
        bumpmap: program_manager.get("bumpmap4"),
        lights: lights_list,
        monsters_program: program_manager.get("monsters_4"), 
        mirror_program: program_manager.get("water_4")
      }
    }
  )

  var game_controller = new GameController(document, {...render_objects, ...render_particles, ...render_exploding_objects}, scene);

  var fps_counter = new FPSCounter()

  function render(time) {
    fps_counter.update(time)
    // Model update
    game_controller.update(fps_counter.get_fps());

    //Draw loop
    gl.clearColor(0.0, 0.0, 0.0, 1);
    gl.clearDepth(1.0);         // Clear everything

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);        
  
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    camera.update();

    for (var render_id in render_particles) {
      render_particles[render_id].object.update_time(time);
      render_particles[render_id].object.update();
    }

    for (var render_id in render_exploding_objects) {
      render_exploding_objects[render_id].update_t(time);
    }

    for (var render_id in render_mirrors) {
      if (!scene.contains(render_id)) {
        continue;
      }
      render_mirrors[render_id].render_mirror(
        {...render_objects, ...render_particles, ...render_exploding_objects},
        ["floor", "underground", "fish", "fish_water"],
        ["underground", "cubemap", "fish", "fish_water"]
      );
    }
  
    for (var render_id in render_objects) {
      if (!scene.contains(render_id)) {
        continue;
      }
      render_objects[render_id].render();
    }
    for (var render_id in render_mirrors) {
      if (!scene.contains(render_id)) {
        continue;
      }
      render_mirrors[render_id].render();
    }
    for (var render_id in render_exploding_objects) {
      if (!scene.contains(render_id)) {
        continue;
      }
      render_exploding_objects[render_id].render();
    }
    for (var render_id in render_particles) {
      render_particles[render_id].render();
    }
    

    window.requestAnimationFrame(render); // While(True) loop!
  }

  new MainMenuController(document, game_controller.game)
  
  document.getElementById('loading_screen').style.visibility = "hidden";

  render(0);
};

document.addEventListener('DOMContentLoaded', () => { main() });