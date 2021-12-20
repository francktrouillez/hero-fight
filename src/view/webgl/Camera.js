class Camera {

  constructor(info) {
    // Position is useful for the lights ATTENTION needs to be updated accordingly to the movement of the cam
    this.position = glMatrix.vec3.fromValues(info.eye.x, info.eye.y, info.eye.z);
    this.center = glMatrix.vec3.fromValues(info.center.x, info.center.y, info.center.z);
    this.up = glMatrix.vec3.fromValues(info.up.x, info.up.y, info.up.z);
    this.view = glMatrix.mat4.create();
    this.view = glMatrix.mat4.lookAt(this.view, 
      this.position, 
      this.center, 
      this.up
    )
    this.projection = glMatrix.mat4.create();
    this.fov = info.fov;
    this.aspect = info.aspect;
    this.near = info.near;
    this.far = info.far;
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

  set_position(pos){
    this.position = pos;
  }

  get_position(){
    return this.position;
  }

  deg2rad(deg) {
    var PI = Math.PI;
    var rad = deg * (PI / 180.0);
    return rad;
  }

  update_camera_vectors() {
    yawr = deg2rad(yaw)
    pitchr = deg2rad(pitch)

    fx = Math.cos(yawr) * Math.cos(pitchr);
    fy = Math.sin(pitchr);
    fz = Math.sin(yawr) * Math.cos(pitchr);

    front = glMatrix.vec3.fromValues(fx, fy, fz);
    front = glMatrix.vec3.normalize(front, front);

    // recompute right, up
    right = glMatrix.vec3.cross(right, front, world_up);
    right = glMatrix.vec3.normalize(right, right);

    up = glMatrix.vec3.cross(up, right, front);
    up = glMatrix.vec3.normalize(up, up);
  }

  get_view_matrix() {
    center = glMatrix.vec3.create();
    center = glMatrix.vec3.add(this.center, this.position, front);
    View = glMatrix.mat4.create();
    View = glMatrix.mat4.lookAt(View, position, center, up);
    return View;
}

get_projection() {
  var projection = glMatrix.mat4.create();
  projection = glMatrix.mat4.perspective(projection, this.fov, this.aspect, this.near, this.far);
  return projection;
}

}