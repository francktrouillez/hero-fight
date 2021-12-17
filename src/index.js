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
      variable: "u_sun",
      type: "point_light"
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

  /*
  var cube_2 = new Cube(gl, tex_cat, new Float32Array(tex_positions), 
    function() {
      return;
    }
  );*/

  var camera = new Camera({
    eye: {
      x: -5.0, y: 5.0, z: -5.0
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
  
  //Configure the Point lights
  var sun_pos = glMatrix.vec3.fromValues(0.0, 5.0, 0.0);
  var sun_list = [sun_pos, 0.0, 0.5, 0.0, 0.2, 1.0, 1.0];

  render_object_1 = new RenderObject(model_1, program, camera, {
    key_texture: model_1.texture_object.gl_texture,
    key_aspect_ratio: aspect.ratio,
    key_model: model_1.model,
    key_view: camera.view,
    key_projection: camera.projection,
    key_ITMatrix: model_1.model,
    key_view_pos: camera.position,
    key_point_ligths: sun_list
  });
/*
  render_object_2 = new RenderObject(cube_2, program, camera, {
    key_texture: cube_2.texture_object.gl_texture,
    key_aspect_ratio: aspect.ratio,
    key_model: cube_2.model,
    key_view: camera.view,
    key_projection: camera.projection,
    key_light_pos: light_pos,
    key_ITMatrix: cube_2.model
  });
  */

  //cube_1.setXYZ(-4.0, 0.0, 0.0);
  //cube_2.setXYZ(4.0, 0.0, 0.0);

  var render_objects = [render_object_1]; //render_object_2];

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
  
    for (const render_object of render_objects) {
      render_object.render();
    }    
    window.requestAnimationFrame(render); // While(True) loop!
  }
  
  render();


};

document.addEventListener('DOMContentLoaded', () => { main() });