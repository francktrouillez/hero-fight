async function main() {
  images = await load_images([
    "./src/view/assets/textures/Warrior_Full_Texture.png",
    "./src/view/assets/textures/Slime_Texture.png",
    "./src/view/assets/textures/Skeleton_Texture.png",
    "./src/view/assets/textures/Dragon_Texture.png",
    "./src/view/assets/textures/Wisp_Texture.png",
    "./src/view/assets/textures/Floor.png",
    "./src/view/assets/textures/Underground_Texture.png",
    "./src/view/assets/textures/Fish_Texture.png",
    "./src/view/assets/textures/Tree_Texture.png",
    ["./src/view/assets/textures/cubemaps/day", "cubemap"],
  ]);

  audios = load_audios([
    ["./src/view/assets/sounds/sword_slash.mp3", 0.7],
    ["./src/view/assets/sounds/background.mp3", 0.1],
    ["./src/view/assets/sounds/buff.mp3", 0.2],
    ["./src/view/assets/sounds/slime.mp3", 0.7],
    ["./src/view/assets/sounds/skeleton.mp3", 0.8],
    ["./src/view/assets/sounds/dragon_attack.mp3", 0.6],
    ["./src/view/assets/sounds/dragon_flying.mp3", 0.4],
  ])

  shaders = await load_shaders([
    "./src/view/glsl/cubemap/cubemap.frag",
    "./src/view/glsl/cubemap/cubemap.vert",
    "./src/view/glsl/lights/light.vert",
    "./src/view/glsl/lights/light1.frag",
    "./src/view/glsl/lights/light4.frag",
    "./src/view/glsl/mirror/water_light4.frag",
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
  const gl = canvas.getContext('webgl');
 
  // Programs
  var program_full_lights = new LightProgram(gl, 4);
  var program_water = new WaterProgram(gl, 4);
  var program_only_sun = new LightProgram(gl, 1);
  var program_cubemap = new CubemapProgram(gl);

  // Definition of the camera
  var camera = new MainCamera(gl, canvas, window);
  var camera_controller = new CameraController(document, camera);

  // Lights
  var sun = new Sun()
  var wisp_horde = new WispHordeRender(gl, program_only_sun, camera, [sun])

  //Fill the list used to regroup all the lights and send it to the render object dict to update the uniform accordingly
  let lights_list = [];
  lights_list.push(sun)
  for (const wisp_render of wisp_horde.elements) {
    lights_list.push(wisp_render.object.light)  
  }
  
  // Render objects
  var render_objects = {
    "hero": new HeroRender(gl, program_full_lights, camera, lights_list),
    "slime": new SlimeRender(gl, program_full_lights, camera, lights_list),
    "skeleton": new SkeletonRender(gl, program_full_lights, camera, lights_list),
    "dragon": new DragonRender(gl, program_full_lights, camera, lights_list),
    "cubemap": new CubemapRender(gl, program_cubemap, camera, "./src/view/assets/textures/cubemaps/day"),
    "floor": new FloorRender(gl, program_full_lights, camera, lights_list),//generate_floor(gl, program_full_lights, camera, lights_list),
    "underground": new UndergroundRender(gl, program_only_sun, camera, [sun]),
    "fish": new FishRender(gl, program_only_sun, camera, [sun]),
    "forest": new ForestRender(gl, program_full_lights, camera, lights_list),
    "wisp_horde": wisp_horde
  }

  // Mirror objects
  var render_mirrors = {
    "lake": new WaterRender(gl, program_water, camera, lights_list)
  }

  var game_controller = new GameController(document, render_objects);

  var fps_counter = new FPSCounter()

  function render(time) {
    fps_counter.update(time)
    // Model update
    game_controller.update(fps_counter.get_fps());

    //Draw loop
    gl.clearColor(0.2, 0.2, 0.2, 1);
    gl.clearDepth(1.0);                 // Clear everything
  
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    camera.update();

    for (var render_id in render_mirrors) {
      render_mirrors[render_id].render_mirror(
        render_objects,
        ["floor", "underground", "fish"],
        ["underground", "cubemap", "fish"]
      );
    }
  
    for (var render_id in render_objects) {
      render_objects[render_id].render();
    }
    for (var render_id in render_mirrors) {
      render_mirrors[render_id].render();
    }

    window.requestAnimationFrame(render); // While(True) loop!
  }
  
  document.getElementById('loading_screen').style.visibility = "hidden";
  audios["./src/view/assets/sounds/background.mp3"].play();
  audios["./src/view/assets/sounds/background.mp3"].loop = true;

  render(0);
};

document.addEventListener('DOMContentLoaded', () => { main() });