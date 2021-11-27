class Program {

  constructor(gl, vertex_code, fragment_code, uniforms_map) {
    this.gl = gl;
    this.vertex_shader = this.compile_shader(vertex_code, gl.VERTEX_SHADER);
    this.fragment_shader = this.compile_shader(fragment_code, gl.FRAGMENT_SHADER);
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

  get_uniforms() {
    let uniforms = {}
    for (let key in this.uniforms_map) {
      uniforms[key] = this.gl.getUniformLocation(this.program, this.uniforms_map[key])
    }
    return uniforms;
  }
}