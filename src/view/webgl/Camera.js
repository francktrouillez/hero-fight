class Camera {

  constructor(info) {
    this.info = info
    // Position is useful for the lights ATTENTION needs to be updated accordingly to the movement of the cam
    this.position = glMatrix.vec3.fromValues(info.eye.x, info.eye.y, info.eye.z);
    this.view = glMatrix.mat4.create();
    this.view = glMatrix.mat4.lookAt(this.view, 
      glMatrix.vec3.fromValues(info.eye.x, info.eye.y, info.eye.z), 
      glMatrix.vec3.fromValues(info.center.x, info.center.y, info.center.z), 
      glMatrix.vec3.fromValues(info.up.x, info.up.y, info.up.z)
    )
    this.projection = glMatrix.mat4.create();
    this.projection = glMatrix.mat4.perspective(this.projection, info.fov, info.aspect, info.near, info.far);
  }
  
  zoom(value) {
    this.position = glMatrix.vec3.add(this.position, this.position, glMatrix.vec3.fromValues(0.0, 0.0, value));
    this.view = glMatrix.mat4.translate(this.view, this.view, glMatrix.vec3.fromValues(0.0, 0.0, value));
  }
  
  move(values) {
    this.position = glMatrix.vec3.add(this.position, this.position, glMatrix.vec3.fromValues(values.x, values.y, 0.0));
    this.view = glMatrix.mat4.translate(this.view, this.view, glMatrix.vec3.fromValues(values.x, values.y, 0.0));

  }

  refresh_camera() {
    console.log(this.info)
    this.view = glMatrix.mat4.create();
    this.view = glMatrix.mat4.lookAt(this.view, 
      glMatrix.vec3.fromValues(this.info.eye.x, this.info.eye.y, this.info.eye.z), 
      glMatrix.vec3.fromValues(this.info.center.x, this.info.center.y, this.info.center.z), 
      glMatrix.vec3.fromValues(this.info.up.x, this.info.up.y, this.info.up.z)
    )
  }

  _step_rotateY(value) {
    const eye = this.info.eye;
    const center = this.info.center;
    var increment_x = 1;
    var increment_z = 1
    if (center.x > eye.x) {
      increment_z = -1;
    }
    if (center.z < eye.z) {
      increment_x = -1;
    }
    this.info.center.x = this.info.center.x + value * increment_x;
    this.info.center.z = this.info.center.z + value * increment_z;
  }
  
  rotateY(value) {
    const step = 0.01;
    if (Math.abs(value) < step) {
      console.log("value too low");
      return;
    }
    var mult = 1;
    if (value < 0) {
      mult = -1;
    }
    for (let i = 0; i < Math.abs(value); i += step) {
      this._step_rotateY(mult*step);
    }
    this.refresh_camera()
    //this.view = glMatrix.mat4.rotate(this.view, this.view, value, glMatrix.vec3.fromValues(0.0, 1.0, 0.0));
  }
  
  rotateX(value) {
    this.view = glMatrix.mat4.rotate(this.view, this.view, value, glMatrix.vec3.fromValues(1.0, 0.0, 0.0));
  }
    
  set_position(pos){
    this.position = pos;
  }

  get_position(){
    return this.position;
  }

  get_view_matrix(){
    return this.view;
  }

  get_projection_matrix(){
    return this.projection;
  }

  set_aspect_ratio(width, height) {
    this.info.aspect = width/height
    this.projection = glMatrix.mat4.create();
    this.projection = glMatrix.mat4.perspective(this.projection, this.info.fov, this.info.aspect, this.info.near, this.info.far);
  }
}