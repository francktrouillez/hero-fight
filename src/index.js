async function main() {

  images = await charge_images([
    "./src/view/assets/textures/cat.jpg",
    "./src/view/assets/textures/Warrior_Full_Texture.png"
  ]);

  // Boilerplate code
  const canvas = document.getElementById('webgl_canvas');
  const gl = canvas.getContext('webgl');
  
  var aspect = {
    ratio: [1.0, 1.0]
  }

  auto_resize_window(window, canvas, gl, aspect);

  const sourceV = await read_file("./src/view/glsl/vertexShaderLight.vert");
  const sourceF = await read_file("./src/view/glsl/fragmentShaderLight.frag");


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
    key_aspect_ratio: {
      variable: "u_aspect_ratio",
      type: "vec2"
    },
    key_ITMatrix: {
      variable:"itM",
      type: "mat4"
    },
    key_view_pos:{
      variable:"u_view_pos",
      type: "vec3"
    },
    key_point_ligths:{
      variable: "u_point_ligths_list",
      type: "point_lights"
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

  const model_obj = await read_file("./src/view/assets/models/Full_Warrior.obj")

  var model_1 = new ComplexObject(gl, model_obj, 
    function() {
      return;
    }
  );

  var model_2 = new ComplexObject(gl, model_obj, 
    function() {
      return;
    }
  );

  model_1.translate(0.0, 0.0, -4.0);
  model_2.setXYZ(0.0, 0.0 , 4.0);
  model_2.rotate(Math.PI, 0.0, 1.0, 0.0);

  //cube_1.setXYZ(-4.0, 0.0, 0.0);
  //cube_2.setXYZ(4.0, 0.0, 0.0);

  var camera = new Camera({
    eye: {
      x: -5.0, y: 4.0, z: -5.0
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

  //var camera_controller = new CameraController(document, camera);
  
  //Configure the Point lights
  var sun_pos = glMatrix.vec3.fromValues(0.0, 10.0, 0.0);
  var sun_ambient = glMatrix.vec3.fromValues(0.3,0.3,0.3);
  var sun_diffuse = glMatrix.vec3.fromValues(0.5,0.5,0.5);
  var null_vec = glMatrix.vec3.fromValues(0.0,0.0,0.0);
  //             pos, constant, linear, quadratic, ambient, diffuse, specular
  var sun = new PointLight(sun_pos, 0.0, 0.0, 0.0, sun_ambient, sun_diffuse, null_vec);

  var teta_light1 = 0.0;
  var radius_light1 = 8.0;
  //var light1_pos = glMatrix.vec3.fromValues(radius_light1*Math.cos(teta_light1), 0.0,radius_light1*Math.sin(teta_light1));
  var light1_pos = glMatrix.vec3.fromValues(radius_light1*Math.cos(teta_light1), 0.0,radius_light1*Math.sin(teta_light1));
  var light1_color = glMatrix.vec3.fromValues(0.6,0.6,0.6);
  var light1_specular = glMatrix.vec3.fromValues(50.0,50.0,200.0);
  var light1 = new PointLight(light1_pos, 0.0, 2.0, 0.0, null_vec, light1_color, light1_specular);

  var teta_light2 = Math.PI;
  var radius_light2 = 8.0;
  var light2_pos = glMatrix.vec3.fromValues(radius_light2*Math.cos(teta_light2), 0.0,radius_light2*Math.sin(teta_light2));
  var light2_color = glMatrix.vec3.fromValues(0.6,0.6,0.6);
  var light2_specular = glMatrix.vec3.fromValues(200.0,50.0,50.0);
  var light2 = new PointLight(light2_pos, 0.0, 2.0, 0.0, null_vec, light2_color, light2_specular);

  var light3_pos = glMatrix.vec3.fromValues(0.0,6.0,0.0);
  var light3_color = glMatrix.vec3.fromValues(0.6,0.6,0.6);
  var light3_specular = glMatrix.vec3.fromValues(50.0,200.0,50.0);
  var light3 = new PointLight(light3_pos, 0.0, 2.0, 0.0, null_vec, light3_color, light3_specular);

  console.log("Blue");
  console.log(light1_pos);
  console.log("Red");
  console.log(light2_pos);
  console.log("Green");
  console.log(light3_pos);
  console.log("Cam");
  console.log(camera.get_position());

  //Fill the list used to regroup all the light and send it to the render object dict to update the uniform accordingly
  let point_lights_list = [sun.get_values_list(), light1.get_values_list(), light2.get_values_list(), light3.get_values_list()];

  render_object_1 = new RenderObject(model_1, program, camera, {
    key_texture: model_1.texture_object.gl_texture,
    key_aspect_ratio: aspect.ratio,
    key_model: model_1.model,
    key_view: camera.get_view_matrix(),
    key_projection: camera.get_projection(),
    key_ITMatrix: model_1.model,
    key_view_pos: camera.get_position(),
    key_point_ligths: point_lights_list
  });

  render_object_2 = new RenderObject(model_2, program, camera, {
    key_texture: model_2.texture_object.gl_texture,
    key_aspect_ratio: aspect.ratio,
    key_model: model_2.model,
    key_view: camera.get_view_matrix(),
    key_projection: camera.get_projection(),
    key_ITMatrix: model_2.model,
    key_view_pos: camera.get_position(),
    key_point_ligths: point_lights_list
  });
  

  var render_objects = [render_object_1, render_object_2];

  var game_controller = new GameController(document, render_objects);

  function render() {
    // Model update
    game_controller.update();

    //Draw loop
    gl.clearColor(0.2, 0.2, 0.2, 1);
    gl.clearDepth(1.0);                 // Clear everything
  
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    // Update the uniforms
    teta_light1 += 0.0;
    teta_light2 += 0.0;
    if(teta_light1 >= 2*Math.PI){teta_light1 = 0.0;}
    if(teta_light2 >= 2*Math.PI){teta_light2 = 0.0;}
    light1.set_position(glMatrix.vec3.fromValues(radius_light1*Math.cos(teta_light1), 0.0,radius_light1*Math.sin(teta_light1)));
    light2.set_position(glMatrix.vec3.fromValues(radius_light2*Math.cos(teta_light2), 0.0,radius_light2*Math.sin(teta_light2)));
    point_lights_list = [sun.get_values_list(), light1.get_values_list(), light2.get_values_list(), light3.get_values_list()];

    for (const render_object of render_objects) {
      render_object.update_uniform("key_point_ligths", point_lights_list);
      render_object.render();
    }    
    window.requestAnimationFrame(render); // While(True) loop!
  }
  
  render();


};

document.addEventListener('DOMContentLoaded', () => { main() });