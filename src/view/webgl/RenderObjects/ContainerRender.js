class ContainerRender {

  constructor(gl, program, camera, lights_list) {

    this.elements = []
    this.gl = gl
    this.program = program
    this.camera = camera,
    this.lights_list = lights_list
  }


  render() {
    for (const element of this.elements) {
      element.render()
    }
  }

  update_uniform(key, new_value){
    for (const element of this.elements) {
      element.update_uniform(key, new_value)
    }
  }

  set_program(program) {
    this.program = program;
    for (const element of this.elements) {
      element.set_program(program)
    }
  }
}