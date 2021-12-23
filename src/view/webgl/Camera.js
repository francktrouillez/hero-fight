class Camera {

  constructor(info) {
    // Position is useful for the lights ATTENTION needs to be updated accordingly to the movement of the cam
    this.position = glMatrix.vec3.fromValues(info.eye.x, info.eye.y, info.eye.z);
    this.view = glMatrix.mat4.create();
    this.view = glMatrix.mat4.lookAt(this.view, 
      glMatrix.vec3.fromValues(info.eye.x, info.eye.y, info.eye.z), 
      glMatrix.vec3.fromValues(info.center.x, info.center.y, info.center.z), 
      glMatrix.vec3.fromValues(info.up.x, info.up.y, info.up.z)
    )
    console.log("Original view");
    console.log(this.view);
    this.projection = glMatrix.mat4.create();
    this.projection = glMatrix.mat4.perspective(this.projection, info.fov, info.aspect, info.near, info.far);
  }
  
  zoom(value) {
    this.view = glMatrix.mat4.translate(this.view, this.view, glMatrix.vec3.fromValues(0.0, 0.0, value));
  }
  
  move(values) {
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

}