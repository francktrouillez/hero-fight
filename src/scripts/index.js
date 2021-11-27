
var make_camera = function() {

  var View = glMatrix.mat4.create();
  View = glMatrix.mat4.lookAt(View, glMatrix.vec3.fromValues(0.0,0.0,2.0) 
                  , glMatrix.vec3.fromValues(0.0,0.0,0.0)
                  , glMatrix.vec3.fromValues(0.0,1.0,0.0))

  var Projection = glMatrix.mat4.create();
  Projection = glMatrix.mat4.perspective(Projection, 45.0, 500.0/500.0, 0.01, 100.0);

  var zoom = function(value) {
    View = glMatrix.mat4.translate(View, View, glMatrix.vec3.fromValues(0.0, 0.0, value));
  }

  var move = function(values) {
    View = glMatrix.mat4.translate(View, View, glMatrix.vec3.fromValues(values.x, values.y, 0.0));
  }

  var rotateY = function(value) {
    View = glMatrix.mat4.rotate(View, View, value, glMatrix.vec3.fromValues(0.0, 1.0, 0.0));
  }

  var rotateX = function(value) {
    View = glMatrix.mat4.rotate(View, View, value, glMatrix.vec3.fromValues(1.0, 0.0, 0.0));
  }
  
  document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (key === 'ArrowDown') {
      move({x: 0.0, y: 0.05}); return;
    }
    else if (key === 'ArrowUp') {
      move({x: 0.0, y: -0.05}); return;
    }
    else if (key === 'ArrowLeft') {
      move({x: 0.05, y: 0.0}); return;
    }
    else if (key === 'ArrowRight') {
      move({x: -0.05, y: 0.0}); return;
    }
    else if (key === '+') {
      zoom(0.05); return;
    }
    else if (key === '-') {
      zoom(-0.05); return;
    }
    else if (key == 'z') {
      rotateX(0.05); return;
    }
    else if (key == 'q') {
      rotateY(0.05); return;
    }
    else if (key == 's') {
      rotateX(-0.05); return;
    }
    else if (key == 'd') {
      rotateY(-0.05); return;
    }
  }, false);
  
  return {
    View: View,
    Projection, Projection,
  }

}

async function main() {
  // Boilerplate code
  const canvas = document.getElementById('webgl_canvas');
  const gl = canvas.getContext('webgl');
  var aspect_ratio = [1.0, 1.0];

  auto_resize_window(window, canvas, gl, aspect_ratio);

  var make_shader = function (vertex_shader, fragment_shader) {
    function compile_shader(source, type) {
      var shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        throw new Error('Failed to compile ' + type + ' shader');
      }
      
      return shader;
    }
    
    function create_program(vertex_shader, fragment_shader) {
      let program = gl.createProgram();
      gl.attachShader(program, vertex_shader);
      gl.attachShader(program, fragment_shader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        throw new Error('Unable to compile program');
      }
      
      return program;
    }
    
    function get_uniforms() {
      const u_M = gl.getUniformLocation(program, 'M');
      const u_V = gl.getUniformLocation(program, 'V');
      const u_P = gl.getUniformLocation(program, 'P');
      const u_tex0 = gl.getUniformLocation(program, 'u_texture');
      const u_aspect_ratio = gl.getUniformLocation(program, 'u_aspect_ratio');
      return {
        "model": u_M,
        "view": u_V,
        "proj": u_P,
        "tex0": u_tex0,
        "aspect_ratio": u_aspect_ratio
      }
    }
    
    function use() {
      gl.useProgram(program);
    }
    
    const shaderV = compile_shader(vertex_shader, gl.VERTEX_SHADER);
    const shaderF = compile_shader(fragment_shader, gl.FRAGMENT_SHADER);
    
    const program = create_program(shaderV, shaderF);
    
    return {
      program:program,
      get_uniforms:get_uniforms,
      use:use,
    }
  }

  var make_texture = function(url) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
      
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 255, 255]));
      
    // Asynchronously load an image
    var image = new Image();
    image.crossOrigin = "anonymous";
    image.src = url;
    image.addEventListener('load', function() {
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
      // TODO add parameters for filtering and warping!
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    });

    return texture;
  }

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

  var shader = make_shader(sourceV, sourceF);
  var tex_cat = make_texture("./src/assets/textures/cat.jpg");

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
  var camera = make_camera();

  function animate () {
    //Draw loop
    gl.clearColor(0.2, 0.2, 0.2, 1);
    gl.clearDepth(1.0);                 // Clear everything

    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    shader.use();
    obj.activate(shader);
    
    var unif = shader.get_uniforms();
          
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex_cat);
    gl.uniform1i(unif['tex0'], 0);

    gl.uniform2fv(unif['aspect_ratio'], aspect_ratio);

    gl.uniformMatrix4fv(unif['model'], false, obj.model);
    gl.uniformMatrix4fv(unif['view'], false, camera.View);
    gl.uniformMatrix4fv(unif['proj'], false, camera.Projection);
    
    obj.draw();
    
    window.requestAnimationFrame(animate); // While(True) loop!
  }

  animate();
};

document.addEventListener('DOMContentLoaded', () => {main()});