async function main() {

  var fps = 144;

  images = await load_images([
    "./src/view/assets/textures/Warrior_Full_Texture.png",
    "./src/view/assets/textures/Slime_Texture.png",
    "./src/view/assets/textures/Skeleton_Texture.png",
    "./src/view/assets/textures/Dragon_Texture.png",
    "./src/view/assets/textures/Wisp_Texture.png",
    "./src/view/assets/textures/blue_fire.jpeg",
    "./src/view/assets/textures/Blue_fire.png",
    "./src/view/assets/textures/grass_floor.jpg",
    "./src/view/assets/textures/Floor.png",
    "./src/view/assets/textures/Underground_Texture.png",
    "./src/view/assets/textures/Fish_Texture.png",
    "./src/view/assets/textures/Tree_Texture.png",
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
    "./src/view/glsl/vertexShaderLight.vert",
    "./src/view/glsl/fragmentShaderLight4.frag",
    "./src/view/glsl/fragmentShaderMirrorLight4.frag",
    "./src/view/glsl/fragmentShaderLight1.frag",
    "./src/view/glsl/vertexShader.vert",
    "./src/view/glsl/fragmentShader.frag",
    "./src/view/glsl/vertexShader_cubemap.vert",
    "./src/view/glsl/fragmentShader_cubemap.frag"
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
    "./src/view/assets/models/cube.obj",
    "./src/view/assets/models/sphere_smooth.obj"
  ])

  // Boilerplate code
  const canvas = document.getElementById('webgl_canvas');
  const gl = canvas.getContext('webgl');
 
  var program_full_lights = generate_program_lights(gl, 4);

  var program_mirror = generate_program_mirror(gl, 4);

  var program_only_sun = generate_program_lights(gl, 1);

  var cubemap_program = generate_program_cubemap(gl);

  // Definition of the camera
  var camera = generate_camera(gl, canvas);

  var camera_controller = new CameraController(document, camera);

  var sun = new Sun()

 // Create the model of the wisp and the multiple values as a pointlight
 var wisp_1 = new WispRender(gl, program_only_sun, camera, [sun]);
 wisp_1.object.update_data = {
  t: 0,
  speed: 0.005,
  angle: 0.0,
  speed_rotation: Math.PI/200,
  radius: 2
}

wisp_1.object.update = function() {
  this.update_data.t = (this.update_data.t + this.update_data.speed)%(2*Math.PI);
  this.update_data.angle += this.update_data.speed_rotation
  const radius = this.update_data.radius
  this.setXYZ(radius*Math.sin(this.update_data.t), 0.5*Math.sin(this.update_data.t * 5) + 1.5, radius*Math.cos(this.update_data.t));
  this.setAngle(this.update_data.angle, 0.0, 1.0, 0.0)
}

 var wisp_2 = new WispRender(gl, program_only_sun, camera, [sun]);
 wisp_2.object.update_data = {
  t: Math.PI/2,
  speed: 0.005,
  angle: 0.0,
  speed_rotation: Math.PI/200,
  radius: 8
}

wisp_2.object.update = function() {
  this.update_data.t = (this.update_data.t + this.update_data.speed)%(2*Math.PI);
  this.update_data.angle += this.update_data.speed_rotation
  const radius = this.update_data.radius
  this.setXYZ(radius*Math.sin(this.update_data.t), 0.5*Math.sin(this.update_data.t * 5) + 1.5, radius*Math.cos(this.update_data.t));
  this.setAngle(this.update_data.angle, 0.0, 1.0, 0.0)
}

 var wisp_3 = new WispRender(gl, program_only_sun, camera, [sun]);
 wisp_3.object.update_data = {
  t: 3*Math.PI/2,
  speed: 0.005,
  angle: 0.0,
  speed_rotation: Math.PI/200,
  radius: 8
}

wisp_3.object.update = function() {
  this.update_data.t = (this.update_data.t + this.update_data.speed)%(2*Math.PI);
  this.update_data.angle += this.update_data.speed_rotation
  const radius = this.update_data.radius
  this.setXYZ(radius*Math.sin(this.update_data.t), 0.5*Math.sin(this.update_data.t * 5) + 1.5, radius*Math.cos(this.update_data.t));
  this.setAngle(this.update_data.angle, 0.0, 1.0, 0.0)
}
  
  //Fill the list used to regroup all the light and send it to the render object dict to update the uniform accordingly
  let lights_list = [
    sun,
    wisp_1.object.light,
    wisp_2.object.light,
    wisp_3.object.light
  ];
  
  var render_objects = {
    "hero": new HeroRender(gl, program_full_lights, camera, lights_list),
    "slime": new SlimeRender(gl, program_full_lights, camera, lights_list),
    "skeleton": new SkeletonRender(gl, program_full_lights, camera, lights_list),
    "dragon": new DragonRender(gl, program_full_lights, camera, lights_list),
    "cubemap": await generate_cubemap(gl, cubemap_program, camera),
    "floor": new FloorRender(gl, program_full_lights, camera, lights_list),//generate_floor(gl, program_full_lights, camera, lights_list),
    "underground": new UndergroundRender(gl, program_only_sun, camera, [sun]),
    "fish": new FishRender(gl, program_only_sun, camera, [sun]),
    "forest": new ForestRender(gl, program_full_lights, camera, lights_list),
    "wisp1": wisp_1,
    "wisp2": wisp_2,
    "wisp3": wisp_3,
  }

  var render_mirrors = {
    "mirror_1": new MirrorRender(gl, program_mirror, camera, lights_list)
  }

  var game_controller = new GameController(document, render_objects);

  var test_controller = new TestController(document)

  function render() {
    // Model update
    game_controller.update(fps);

    //Draw loop
    gl.clearColor(0.2, 0.2, 0.2, 1);
    gl.clearDepth(1.0);                 // Clear everything
  
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    camera.update();

    for (var render_id in render_mirrors) {
      render_mirrors[render_id].render_mirror(render_objects , ["floor", "underground", "fish"], ["underground", "cubemap", "fish"]);
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



  render();


};

document.addEventListener('DOMContentLoaded', () => { main() });