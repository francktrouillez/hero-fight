class Camera {

  constructor(info) {
    this.view = glMatrix.mat4.create();
    this.view = glMatrix.mat4.lookAt(this.view, 
      glMatrix.vec3.fromValues(info.eye.x, info.eye.y, info.eye.z), 
      glMatrix.vec3.fromValues(info.center.x, info.center.y, info.center.z), 
      glMatrix.vec3.fromValues(info.up.x, info.up.y, info.up.z)
    )
    this.projection = glMatrix.mat4.create();
    this.projection = glMatrix.mat4.perspective(this.projection, info.fov, info.aspect, info.near, info.far);
    //this.bind_listener(document);
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
    
  bind_listener(document) {
    document.addEventListener('keydown', (event) => {
      const key = event.key;
      if (key === 'ArrowDown') {
        this.move({x: 0.0, y: 0.05}); return;
      }
      else if (key === 'ArrowUp') {
        this.move({x: 0.0, y: -0.05}); return;
      }
      else if (key === 'ArrowLeft') {
        this.move({x: 0.05, y: 0.0}); return;
      }
      else if (key === 'ArrowRight') {
        this.move({x: -0.05, y: 0.0}); return;
      }
      else if (key === '+') {
        this.zoom(0.05); return;
      }
      else if (key === '-') {
        this.zoom(-0.05); return;
      }
      else if (key == 'z') {
        this.rotateX(0.05); return;
      }
      else if (key == 'q') {
        this.rotateY(0.05); return;
      }
      else if (key == 's') {
        this.rotateX(-0.05); return;
      }
      else if (key == 'd') {
        this.rotateY(-0.05); return;
      }
    }, false);  
  }

}