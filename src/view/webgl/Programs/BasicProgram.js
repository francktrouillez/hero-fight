class BasicProgram extends Program {

  constructor(gl, vertex_code, fragment_code, uniforms_map) {
    super(gl, uniforms_map)

    this.vertex_code = vertex_code;
    this.fragment_code = fragment_code;

    this.vertex_shader = null;
    this.fragment_shader = null;
    
    this.create_program();
  }

  compile_shaders() {
    this.vertex_shader = this.compile_shader(this.vertex_code, this.gl.VERTEX_SHADER);
    this.fragment_shader = this.compile_shader(this.fragment_code, this.gl.FRAGMENT_SHADER);
  }

  attach_shaders() {
    this.gl.attachShader(this.program, this.vertex_shader);
    this.gl.attachShader(this.program, this.fragment_shader);
  }
}