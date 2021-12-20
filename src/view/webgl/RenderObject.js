class RenderObject {
  constructor(object, program, camera, uniform_map) {
    this.object = object;
    this.program = program;
    this.camera = camera;
    this.uniform_map = uniform_map;
  }

  // Method used to calculate the inverse matrix called in render vefore updating the uniform variable
  updateITMatrix() {

    var itM = glMatrix.mat4.create();
    itM = glMatrix.mat4.invert(itM, this.object.model);
    itM = glMatrix.mat4.transpose(itM, itM);
    this.uniform_map["ITMat"] = itM;
    
  }

  update_uniform(key, new_value){
    this.uniform_map[key] = new_value;
  }

  render() {
    this.object.update();
    this.program.use();
    this.object.activate(this.program.program);
    this.updateITMatrix();
    this.program.manage_uniforms(this.uniform_map)
    this.object.draw();
  }
}