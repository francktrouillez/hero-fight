class GeometryProgram extends Program {
  /* For the concept only, because geometry shader not available in webgl*/

  constructor(gl, vertex_code, geometry_code, fragment_code, uniforms_map) {
    super(gl, uniforms_map)

    this.vertex_code = vertex_code;
    this.geometry_code = geometry_code;
    this.fragment_code = fragment_code;

    this.vertex_shader = null;
    this.geometry_shader = null;
    this.fragment_shader = null;
    
    this.create_program();
  }

  compile_shaders() {
    this.vertex_shader = this.compile_shader(this.vertex_code, gl.VERTEX_SHADER);
    this.geometry_shader = this.compile_shader(this.geometry_code, gl.GEOMETRY_SHADER);
    this.fragment_shader = this.compile_shader(this.fragment_code, gl.FRAGMENT_SHADER);
  }

  attach_shaders() {
    this.gl.attachShader(this.program, this.vertex_shader);
    this.gl.attachShader(this.program, this.geometry_shader);
    this.gl.attachShader(this.program, this.fragment_shader);
  }
}