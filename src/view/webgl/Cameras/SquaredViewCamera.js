class SquaredViewCamera extends Camera{

  constructor(info) {
    super(info)
  }

  refresh_camera() {
    this.view = glMatrix.mat4.lookAt(this.view, 
      glMatrix.vec3.fromValues(this.info.eye.x, this.info.eye.y, this.info.eye.z), 
      glMatrix.vec3.fromValues(this.info.center.x, this.info.center.y, this.info.center.z), 
      glMatrix.vec3.fromValues(this.info.up.x, this.info.up.y, this.info.up.z)
    )
    this.projection = glMatrix.mat4.perspectiveFromFieldOfView(this.projection, {
      upDegrees: this.info.fov/2,
      downDegrees: this.info.fov/2,
      leftDegrees: this.info.fov/2,
      rightDegrees: this.info.fov/2,
    }, this.info.near, this.info.far);
  }
  
}