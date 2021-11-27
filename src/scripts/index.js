async function main() {
  // Boilerplate code
  const canvas = document.getElementById('webgl_canvas');
  const gl = canvas.getContext('webgl');
  
  var aspect = {
    ratio: [1.0, 1.0]
  }

  auto_resize_window(window, canvas, gl, aspect);

  const sourceV = await read_file("./src/glsl/vertexShader.vert");
  const sourceF = await read_file("./src/glsl/fragmentShader.frag");

  var program = new Program(gl, sourceV, sourceF, {
    "model": {
      variable:"M",
      type: "mat4"
    },
    "view": {
      variable:"V",
      type: "mat4"
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

  var tex_cat = new Texture(gl, "./src/assets/textures/cat.jpg");

  var obj1 = new SimpleObject(gl, new Float32Array([
    // Front face
    -1.0, -1.0,  1.0,
    1.0, -1.0,  1.0,
    1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

  // Back face
  -1.0, -1.0, -1.0,
  -1.0,  1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0, -1.0, -1.0,

  // Top face
  -1.0,  1.0, -1.0,
  -1.0,  1.0,  1.0,
    1.0,  1.0,  1.0,
    1.0,  1.0, -1.0,

  // Bottom face
  -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0,  1.0,
  -1.0, -1.0,  1.0,

  // Right face
    1.0, -1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0,  1.0,  1.0,
    1.0, -1.0,  1.0,

  // Left face
  -1.0, -1.0, -1.0,
  -1.0, -1.0,  1.0,
  -1.0,  1.0,  1.0,
  -1.0,  1.0, -1.0,
  ]), new Float32Array([
    0.0, 0.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,  
    0.0, 0.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,  
    0.0, 0.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,  
    0.0, 0.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,  
    0.0, 0.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,  
    0.0, 0.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,  
  ]), new Uint16Array([
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
  ]), 36,
  function() {
    this.rotate(0.01, 0.5, 1.0, 0.0);
  });

  var obj2 = new SimpleObject(gl, new Float32Array([
    // Front face
    -1.0, -1.0,  1.0,
    1.0, -1.0,  1.0,
    1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

  // Back face
  -1.0, -1.0, -1.0,
  -1.0,  1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0, -1.0, -1.0,

  // Top face
  -1.0,  1.0, -1.0,
  -1.0,  1.0,  1.0,
    1.0,  1.0,  1.0,
    1.0,  1.0, -1.0,

  // Bottom face
  -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0,  1.0,
  -1.0, -1.0,  1.0,

  // Right face
    1.0, -1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0,  1.0,  1.0,
    1.0, -1.0,  1.0,

  // Left face
  -1.0, -1.0, -1.0,
  -1.0, -1.0,  1.0,
  -1.0,  1.0,  1.0,
  -1.0,  1.0, -1.0,
  ]), new Float32Array([
    0.0, 0.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,  
    0.0, 0.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,  
    0.0, 0.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,  
    0.0, 0.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,  
    0.0, 0.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,  
    0.0, 0.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,  
  ]), new Uint16Array([
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
  ]), 36,
  function() {
    this.rotate(0.01, 0.5, 1.0, 0.0);
  }
  );

  var camera = new Camera(document, {
    eye: {
      x: 0.0, y: 0.0, z: 4.0
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

  render_object_1 = new RenderObject(obj1, program, camera, {
    "tex0": tex_cat.gl_texture,
    "aspect_ratio": aspect.ratio,
    "model": obj1.model,
    "view": camera.view,
    "proj": camera.projection
  });

  render_object_2 = new RenderObject(obj2, program, camera, {
    "tex0": tex_cat.gl_texture,
    "aspect_ratio": aspect.ratio,
    "model": obj2.model,
    "view": camera.view,
    "proj": camera.projection
  });

  obj1.translate(-2.0, 0.0, 0.0);
  obj2.translate(2.0, 0.0, 0.0);

  var render_objects = [render_object_1, render_object_2];

  function render() {
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

document.addEventListener('DOMContentLoaded', () => {main()});