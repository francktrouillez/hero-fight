class Program {

  constructor(gl, vertex_code, fragment_code, uniforms_map) {
    this.gl = gl;
    this.vertex_shader = this.compile_shader(vertex_code, gl.VERTEX_SHADER);
    this.fragment_shader = this.compile_shader(fragment_code, gl.FRAGMENT_SHADER);
    this.program = null;
    this.create_program();
    this.uniforms_map = uniforms_map;
  }

  compile_shader(source, type) {
    var shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(this.gl.getShaderInfoLog(shader));
      throw new Error('Failed to compile ' + type + ' shader');
    }
    
    return shader;
  }

  create_program() {
    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, this.vertex_shader);
    this.gl.attachShader(this.program, this.fragment_shader);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error(this.gl.getProgramInfoLog(this.program));
      throw new Error('Unable to compile program');
    }
  }

  use() {
    this.gl.useProgram(this.program);
  }

  map_uniform(uniform_location, type, value) {
    if (type == "vec2") {
      this.gl.uniform2fv(uniform_location, value); return;
    } else if (type == "mat4") {
      this.gl.uniformMatrix4fv(uniform_location, false, value); return;
    } else if (type == "sampler2D") {
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, value);
      this.gl.uniform1i(uniform_location, 0);
      return;
    } else {
      throw new Error('Unable to map uniform of type '+type);
    }
  }

  manage_uniforms(map) {
    for (let key in this.uniforms_map) {
      const uniform_location = this.gl.getUniformLocation(this.program, this.uniforms_map[key].variable);
      this.map_uniform(uniform_location, this.uniforms_map[key].type, map[key])
    }
  }
}