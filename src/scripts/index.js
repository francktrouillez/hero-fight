
var make_camera = function() {

  var View = glMatrix.mat4.create();
  View = glMatrix.mat4.lookAt(View, glMatrix.vec3.fromValues(0.0,0.0,-1.0) 
                  , glMatrix.vec3.fromValues(0.0,0.0,0.0)
                  , glMatrix.vec3.fromValues(0.0,1.0,0.0))

  var Projection = glMatrix.mat4.create();
  Projection = glMatrix.mat4.perspective(Projection, 45.0, 500.0/500.0, 0.01, 100.0);
  
  document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (key === 'ArrowDown') {
    View = glMatrix.mat4.translate(View, View, glMatrix.vec3.fromValues(0.0, 0.05, 0.0));
    return;
    }
    else if (key === 'ArrowUp') {
    View = glMatrix.mat4.translate(View, View, glMatrix.vec3.fromValues(0.0, -0.05, 0.0));
    return;
    }
    else if (key === 'ArrowLeft') {
    View = glMatrix.mat4.translate(View, View, glMatrix.vec3.fromValues(-0.05, 0.0, 0.0));
    return;
    }
    else if (key === 'ArrowRight') {
    View = glMatrix.mat4.translate(View, View, glMatrix.vec3.fromValues(0.05, 0.0, 0.0));
    return;
    }
    else if (key === '+' || key === 'Add') {
    View = glMatrix.mat4.translate(View, View, glMatrix.vec3.fromValues(0.0, 0.0, -0.05));
    console.log("+")
    return;
    }
    else if (key === '-' || key === 'Subtract') {
    View = glMatrix.mat4.translate(View, View, glMatrix.vec3.fromValues(0.0, 0.0, 0.05));
    return;
    }
  }, false);
  
  return {
    View: View,
    Projection, Projection,
  }

}

document.addEventListener('DOMContentLoaded', () => {
// Boilerplate code
const canvas = document.getElementById('webgl_canvas');
const gl = canvas.getContext('webgl');

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
    return {
      "model": u_M,
      "view": u_V,
      "proj": u_P,
                "tex0": u_tex0,
    }
  }
  
  function use() {
    gl.useProgram(program);
  }
  
  const shaderV = compile_shader(sourceV, gl.VERTEX_SHADER);
  const shaderF = compile_shader(sourceF, gl.FRAGMENT_SHADER);
  
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

var make_object = function(data, num_triangles) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
  var Model = glMatrix.mat4.create();
  Model = glMatrix.mat4.translate(Model, Model, glMatrix.vec3.fromValues(0.5,-0.5,-1.0));
  
  function activate(shader) {
    // these object have all 3 positions + 2 textures, in practice you can add normals etc..!
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const sizeofFloat = Float32Array.BYTES_PER_ELEMENT;
    const att_pos = gl.getAttribLocation(shader.program, 'position');
    gl.enableVertexAttribArray(att_pos);
    gl.vertexAttribPointer(att_pos, 3, gl.FLOAT, false, 5*sizeofFloat, 0*sizeofFloat);
    
    const att_textcoord = gl.getAttribLocation(shader.program, "texcoord");
    gl.enableVertexAttribArray(att_textcoord);
    gl.vertexAttribPointer(att_textcoord, 2, gl.FLOAT, false, 5*sizeofFloat, 3*sizeofFloat);
  }
  
  function draw() {
    gl.drawArrays (gl.TRIANGLES, 0, num_triangles);
  }
  
  return {
    buffer: buffer,
    model: Model,
    activate: activate,
    draw:draw,
  }

}

const sourceV = `
  attribute vec3 position;
  attribute vec2 texcoord;
  varying vec2 v_texcoord;
  
  uniform mat4 M;
  uniform mat4 V;
  uniform mat4 P;

  void main() {
  gl_Position = P*V*M*vec4(position, 1);
  v_texcoord = texcoord;
  }
`;

const sourceF = `
  precision mediump float;
  varying vec2 v_texcoord;
  
  uniform sampler2D u_texture;

  void main() {
  gl_FragColor = texture2D(u_texture, vec2(v_texcoord.x, 1.0-v_texcoord.y));
  }
`;

var shader_triangle = make_shader(sourceV, sourceF);
var tex_cat = make_texture("cat.jpg");
var obj_triangle = make_object(new Float32Array([
    // vertices       // Texture
    -1.0, -1.0, 0.0,  0.0, 0.0,
    1.0, -1.0, 0.0,  1.0, 0.0,
    0.0,  1.0, 0.0,  0.5, 1.0,
]), 3);

var camera = make_camera();


var deltaTime = 0;
function animate (time) {
  //Draw loop
  gl.clearColor(0.2, 0.2, 0.2, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  shader_triangle.use();
  obj_triangle.activate(shader_triangle);
  
  var unif = shader_triangle.get_uniforms();
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex_cat);
        gl.uniform1i(unif['tex0'], 0);

  gl.uniformMatrix4fv(unif['model'], false, obj_triangle.model);
  gl.uniformMatrix4fv(unif['view'], false, camera.View);
  gl.uniformMatrix4fv(unif['proj'], false, camera.Projection);
  
  obj_triangle.draw();
  
  deltaTime += 0.005;
  //console.log(deltaTime);
  fps(time);
  window.requestAnimationFrame(animate); // While(True) loop!
}

var prev = 0
const fpsElem = document.querySelector("#fps");
function fps(now) {
  now *= 0.001;
  const deltaTime = now - prev;
  prev = now;
  const fps = 1 / deltaTime;
  fpsElem.textContent = 'FPS: ' + fps.toFixed(1);
  return fps;
}

animate(0);
});
