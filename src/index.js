async function main() {

  var fps = 60;

  images = await load_images([
    "./src/view/assets/textures/Warrior_Full_Texture.png",
    "./src/view/assets/textures/Slime_Texture.png",
    "./src/view/assets/textures/Skeleton_Texture.png",
    "./src/view/assets/textures/Dragon_Texture.png",
    "./src/view/assets/textures/Wisp_Texture.png",
    "./src/view/assets/textures/blue_fire.jpeg",
    "./src/view/assets/textures/Blue_fire.png",
    "./src/view/assets/textures/bumpmap/floor_DIFFUSE.jpg",
    "./src/view/assets/textures/bumpmap/floor_NORMAL.jpg",
    "./src/view/assets/textures/grass_floor.jpg",
    "./src/view/assets/textures/bumpmap/brickwall_DIFFUSE.jpg",
    "./src/view/assets/textures/bumpmap/brickwall_NORMAL.jpg"
  ]);

  audios = load_audios([
    "./src/view/assets/sounds/sword_slash.mp3",
  ])

  shaders = await load_shaders([
    "./src/view/glsl/vertexShaderLight.vert",
    "./src/view/glsl/fragmentShaderLight4.frag",
    "./src/view/glsl/fragmentShaderLight1.frag",
    "./src/view/glsl/vertexShader.vert",
    "./src/view/glsl/fragmentShader.frag",
    "./src/view/glsl/vertexShader_cubemap.vert",
    "./src/view/glsl/fragmentShader_cubemap.frag",
    "./src/view/glsl/bumpmap/fragmentShaderBump.frag",
    "./src/view/glsl/bumpmap/vertexShaderBump.vert"
  ])
  
  obj_files = await load_objs([
    /*"./src/view/assets/models/Warrior/Warrior.obj",
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
    ["./src/view/assets/models/Dragon/attack/", 40],*/
    "./src/view/assets/models/Wisp/Wisp.obj",
    "./src/view/assets/models/cube.obj",
    "./src/view/assets/models/sphere_smooth.obj"
  ])

  // Boilerplate code
  const canvas = document.getElementById('webgl_canvas');
  const gl = canvas.getContext('webgl');
 
  var program_full_lights = generate_program_lights(gl, 4);

  var program_only_sun = generate_program_lights(gl, 1);

  var cubemap_program = generate_program_cubemap(gl);

  var bumpmap_program = generate_program_bumpmap(gl);

  // Definition of the camera
  var camera = generate_camera(gl, canvas);

  var camera_controller = new CameraController(document, camera);

  var sun = new Sun()

 // Create the model of the wisp and the multiple values as a pointlight
 var wisp_1 = new WispRender(gl, program_only_sun, camera, [sun]);
 wisp_1.object.setXYZ(0.0, 1.0, 0.0)
 wisp_1.object.update_data = {
   t: 0,
   speed: 0.01
 }
 wisp_1.object.update = function() {
   this.update_data.t = (this.update_data.t + this.update_data.speed)%(2*Math.PI);
   this.setXYZ(0.0, Math.sin(this.update_data.t) + 1.0, 0.0);
   //this.rotate(this.update_data.speed, 0.0, 1.0, 0.0);
 }

 var wisp_2 = new WispRender(gl, program_only_sun, camera, [sun]);
 wisp_2.object.setXYZ(0.0, 2.0, 8.0)
 wisp_2.object.update_data = {
   t: 0,
   speed: 0.01,
   radius: 8.0
 }
 wisp_2.object.update = function() {
   this.update_data.t = (this.update_data.t + this.update_data.speed)%(2*Math.PI)
   const radius = this.update_data.radius
   this.setXYZ(radius*Math.sin(this.update_data.t), 2.0 , radius*Math.cos(this.update_data.t))
   //this.rotate(this.update_data.speed, 0.0, 1.0, 0.0);
 }

 var wisp_3 = new WispRender(gl, program_only_sun, camera, [sun]);
 wisp_3.object.setXYZ(8.0, 2.0, 0.0)
 wisp_3.object.update_data = {
   t: Math.PI,
   speed: 0.01,
   radius: 8.0
 }
 wisp_3.object.update = function() {
   this.update_data.t = (this.update_data.t + this.update_data.speed)%(2*Math.PI)
   const radius = this.update_data.radius
   this.setXYZ(radius*Math.sin(this.update_data.t), 2.0 , radius*Math.cos(this.update_data.t));
   //this.rotate(this.update_data.speed, 0.0, 1.0, 0.0);
 }
  
  //Fill the list used to regroup all the light and send it to the render object dict to update the uniform accordingly
  let lights_list = [sun, wisp_1.object.light, wisp_2.object.light, wisp_3.object.light];
  
  var render_objects = {
    //"hero": new HeroRender(gl, program_full_lights, camera, lights_list),
    //"slime": new SlimeRender(gl, program_full_lights, camera, lights_list),
    //"skeleton": new SkeletonRender(gl, program_full_lights, camera, lights_list),
    //"dragon": new DragonRender(gl, program_full_lights, camera, lights_list),
    "cubemap": await generate_cubemap(gl, cubemap_program, camera),
    //"floor": generate_floor(gl, program_full_lights, camera, lights_list),
    "bumpmap": await generate_bumpmap(gl,bumpmap_program,camera, lights_list),
    "wisp1": wisp_1,
    "wisp2": wisp_2,
    "wisp3": wisp_3,
  }
  //var game_controller = new GameController(document, render_objects);

  function render() {
    // Model update
   //game_controller.update(fps);

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