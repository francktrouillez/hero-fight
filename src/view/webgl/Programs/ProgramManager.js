class ProgramManager {

  constructor(gl, program_map) {
    this.gl = gl;
    this.program_map = program_map;
  }

  get(key) {
    return this.program_map[key];
  }

  add(key, program) {
    this.program_map[key] = program;
  }
}