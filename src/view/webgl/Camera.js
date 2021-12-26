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
  
  rotateY(value) {
    this.view = glMatrix.mat4.rotate(this.view, this.view, value, glMatrix.vec3.fromValues(0.0, 1.0, 0.0));
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