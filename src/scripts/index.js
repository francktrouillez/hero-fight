async function main() {
  // Boilerplate code
  const canvas = document.getElementById('webgl_canvas');
  const gl = canvas.getContext('webgl');
  
  var aspect_ratio = [1.0, 1.0];

  auto_resize_window(window, canvas, gl, aspect_ratio);

  var make_object = function(positions, textures, indexes, num_triangles) {
    const position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const texture_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texture_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, textures, gl.STATIC_DRAW);

    const index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexes, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    
    var Model = glMatrix.mat4.create();
    Model = glMatrix.mat4.translate(Model, Model, glMatrix.vec3.fromValues(0.5,-0.5,-1.0));
    
    function activate(shader) {
      // these object have all 3 positions

      const sizeofFloat = Float32Array.BYTES_PER_ELEMENT;
      
      //Vertex positions
      gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
      const att_pos = gl.getAttribLocation(shader.program, 'aPosition');
      gl.enableVertexAttribArray(att_pos);
      gl.vertexAttribPointer(att_pos, 3, gl.FLOAT, false, 0*sizeofFloat, 0*sizeofFloat);

      // Texture
      gl.bindBuffer(gl.ARRAY_BUFFER, texture_buffer);
      const att_textcoord = gl.getAttribLocation(shader.program, 'aTexcoord');
      gl.enableVertexAttribArray(att_textcoord);
      gl.vertexAttribPointer(att_textcoord, 2, gl.FLOAT, false, 0*sizeofFloat, 0*sizeofFloat);

      // Indexes
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    }
    
    function draw() {
      gl.drawElements(gl.TRIANGLES, num_triangles, gl.UNSIGNED_SHORT, 0);
    }
    
    return {
      position_buffer: position_buffer,
      texture_buffer: texture_buffer,
      index_buffer: index_buffer,
      model: Model,
      activate: activate,
      draw:draw,
    }

  }

  const sourceV = await read_file("./src/glsl/vertexShader.vert");
  const sourceF = await read_file("./src/glsl/fragmentShader.frag");

  var program = new Program(gl, sourceV, sourceF, {
    "model": "M",
    "view": "V",
    "proj": "P",
    "tex0": "u_texture",
    "aspect_ratio": "u_aspect_ratio"
  })

  var tex_cat = new Texture(gl, "./src/assets/textures/cat.jpg");

  var obj = make_object(new Float32Array([
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
  ]), 36);

  var camera = new Camera(document, {
    eye: {
      x: 0.0, y: 0.0, z: 2.0
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

  function animate () {
    //Draw loop
    gl.clearColor(0.2, 0.2, 0.2, 1);
    gl.clearDepth(1.0);                 // Clear everything

    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    program.use();
    obj.activate(program);
    
    var unif = program.get_uniforms();
          
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex_cat.gl_texture);
    gl.uniform1i(unif['tex0'], 0);

    gl.uniform2fv(unif['aspect_ratio'], aspect_ratio);

    gl.uniformMatrix4fv(unif['model'], false, obj.model);
    gl.uniformMatrix4fv(unif['view'], false, camera.view);
    gl.uniformMatrix4fv(unif['proj'], false, camera.projection);
    
    obj.draw();
    
    window.requestAnimationFrame(animate); // While(True) loop!
  }

  animate();
};

document.addEventListener('DOMContentLoaded', () => {main()});