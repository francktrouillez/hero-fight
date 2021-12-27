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
    "./src/view/assets/textures/grass_floor.jpg",
  ]);

  audios = load_audios([
    "./src/view/assets/sounds/sword_slash.mp3",
  ])

  shaders = await load_shaders([
    "./src/view/glsl/vertexShaderLight.vert",
    "./src/view/glsl/fragmentShaderLight.frag",
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
    "./src/view/assets/models/cube.obj",
    "./src/view/assets/models/sphere_smooth.obj"
  ])

  // Boilerplate code
  const canvas = document.getElementById('webgl_canvas');
  const gl = canvas.getContext('webgl');
 
  var program = generate_program_lights(gl);

  var simple_program = generate_program_simple(gl);

  var cubemap_program = generate_program_cubemap(gl);

  

 // Create the model of the wisp and the multiple values as a pointlight
 const wisp_model = obj_files["./src/view/assets/models/sphere_smooth.obj"];
 var wisp1_object = new ComplexObject(gl, wisp_model);
 //Wisp 1
 var wisp_pos = glMatrix.vec3.fromValues(0.0,1.0,0.0);
 var wisp_color = glMatrix.vec3.fromValues(0.0,255.0,0.0);
 var wisp1 = new Wisp(wisp_pos, 0.0, 3.0, 0.0, 0.0, 0.05, 0.1, wisp_color, wisp1_object);

 //Wisp 2
 var wisp2_object = new ComplexObject(gl, wisp_model);
 var teta_wisp2 = 0.0;
 var radius_wisp2 = 8.0;
 var wisp2_pos = glMatrix.vec3.fromValues(radius_wisp2*Math.cos(teta_wisp2), 0.0,radius_wisp2*Math.sin(teta_wisp2));
 var wisp2_color = glMatrix.vec3.fromValues(0.0,0.0,255.0);
 var wisp2 = new Wisp(wisp2_pos, 0.0, 1.0, 0.0, 0.0, 0.05, 0.1, wisp2_color, wisp2_object);

 //Wisp 3
 var wisp3_object = new ComplexObject(gl, wisp_model);
 var teta_wisp3 = Math.PI;
 var radius_wisp3 = 8.0;
 var wisp3_pos = glMatrix.vec3.fromValues(radius_wisp3*Math.cos(teta_wisp3), 0.0,radius_wisp3*Math.sin(teta_wisp3));
 var wisp3_color = glMatrix.vec3.fromValues(255.0,0.0,0.0);
 var wisp3 = new Wisp(wisp3_pos, 0.0, 1.0, 0.0, 0.0, 0.05, 0.1, wisp3_color, wisp3_object);


  // Definition of the camera
  var camera = generate_camera(gl, canvas);

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

  var render_objects = {
    "hero": generate_hero(gl, program, camera, point_lights_list),
    "slime": generate_slime(gl, program, camera, point_lights_list),
    "skeleton": generate_skeleton(gl, program, camera, point_lights_list),
    "dragon": generate_dragon(gl, program, camera, point_lights_list),
    "cubemap": await generate_cubemap(gl, cubemap_program, camera),
    "floor": generate_floor(gl, program, camera, point_lights_list),
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
    window.requestAnimationFrame(render); // While(True) loop!
  }
  
  document.getElementById('loading_screen').style.visibility = "hidden";

  render();


};

document.addEventListener('DOMContentLoaded', () => { main() });