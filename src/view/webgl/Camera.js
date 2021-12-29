class Camera {

  constructor(info) {
    this.info = info
    // Position is useful for the lights ATTENTION needs to be updated accordingly to the movement of the cam
    this.view = glMatrix.mat4.create();
    this.view = glMatrix.mat4.lookAt(this.view, 
      glMatrix.vec3.fromValues(info.eye.x, info.eye.y, info.eye.z), 
      glMatrix.vec3.fromValues(info.center.x, info.center.y, info.center.z), 
      glMatrix.vec3.fromValues(info.up.x, info.up.y, info.up.z)
    )
    this.projection = glMatrix.mat4.create();
    this.projection = glMatrix.mat4.perspective(this.projection, info.fov, info.aspect, info.near, info.far);
  }

  refresh_camera() {
    this.view = glMatrix.mat4.lookAt(this.view, 
      glMatrix.vec3.fromValues(this.info.eye.x, this.info.eye.y, this.info.eye.z), 
      glMatrix.vec3.fromValues(this.info.center.x, this.info.center.y, this.info.center.z), 
      glMatrix.vec3.fromValues(this.info.up.x, this.info.up.y, this.info.up.z)
    )
    this.projection = glMatrix.mat4.perspective(this.projection, this.info.fov, this.info.aspect, this.info.near, this.info.far);
  }

  
  
  zoom(value) {
    this.info.eye.z += value;
    this.info.center.z += value;
    
    this.refresh_camera();
  }
  
  move(values) {
    this.info.eye.x += values.x;
    this.info.center.x += values.x;

    this.info.eye.y += values.y;
    this.info.center.y += values.y;

    this.refresh_camera();

  }

  rotateRelX(value) {
    const eye = this.info.eye;
    const center = this.info.center;
    const up = this.info.up;
    const vect_eye_to_center = {
      x: center.x - eye.x,
      y: center.y - eye.y,
      z: center.z - eye.z
    }
    const radius = norm(vect_eye_to_center);
    const rel_y = up;
    const rel_z = {
      x: -vect_eye_to_center.x/radius,
      y: -vect_eye_to_center.y/radius,
      z: -vect_eye_to_center.z/radius
    }

    const new_rel_y = {
      x: Math.cos(value) * rel_y.x + Math.sin(value) * rel_z.x,
      y: Math.cos(value) * rel_y.y + Math.sin(value) * rel_z.y,
      z: Math.cos(value) * rel_y.z + Math.sin(value) * rel_z.z,
    }

    const new_rel_z = {
      x: Math.cos(value) * rel_z.x - Math.sin(value) * rel_y.x,
      y: Math.cos(value) * rel_z.y - Math.sin(value) * rel_y.y,
      z: Math.cos(value) * rel_z.z - Math.sin(value) * rel_y.z,
    }

    this.info.up = {
      x: new_rel_y.x,
      y: new_rel_y.y,
      z: new_rel_y.z
    }

    this.info.center = {
      x: this.info.eye.x - radius * new_rel_z.x,
      y: this.info.eye.y - radius * new_rel_z.y,
      z: this.info.eye.z - radius * new_rel_z.z,
    }
    
    this.refresh_camera();
  }
  
  rotateRelY(value) {
    const eye = this.info.eye;
    const center = this.info.center;
    const up = this.info.up;
    const vect_eye_to_center = {
      x: center.x - eye.x,
      y: center.y - eye.y,
      z: center.z - eye.z
    }
    const radius = norm(vect_eye_to_center);
    const rel_x = get_perpendicular_vector(vect_eye_to_center, up);
    const rel_z = {
      x: -vect_eye_to_center.x/radius,
      y: -vect_eye_to_center.y/radius,
      z: -vect_eye_to_center.z/radius
    }

    const new_rel_z = {
      x: Math.cos(value) * rel_z.x + Math.sin(value) * rel_x.x,
      y: Math.cos(value) * rel_z.y + Math.sin(value) * rel_x.y,
      z: Math.cos(value) * rel_z.z + Math.sin(value) * rel_x.z,
    }

    this.info.center = {
      x: this.info.eye.x - radius * new_rel_z.x,
      y: this.info.eye.y - radius * new_rel_z.y,
      z: this.info.eye.z - radius * new_rel_z.z,
    }
    
    this.refresh_camera();
  }

  rotateRelZ(value) {
    const eye = this.info.eye;
    const center = this.info.center;
    const up = this.info.up;
    const vect_eye_to_center = {
      x: center.x - eye.x,
      y: center.y - eye.y,
      z: center.z - eye.z
    }
    const rel_x = get_perpendicular_vector(vect_eye_to_center, up);
    const rel_y = up;

    const new_rel_y = {
      x: Math.cos(value) * rel_y.x - Math.sin(value) * rel_x.x,
      y: Math.cos(value) * rel_y.y - Math.sin(value) * rel_x.y,
      z: Math.cos(value) * rel_y.z - Math.sin(value) * rel_x.z,
    }

    this.info.up = {
      x: new_rel_y.x,
      y: new_rel_y.y,
      z: new_rel_y.z
    }
    
    this.refresh_camera();
  }

  set_eye(eye_pos) {
    this.info.eye = {
      x: eye_pos.x,
      y: eye_pos.y,
      z: eye_pos.z
    }
    this.refresh_camera();
  }

  set_center(center_pos) {
    this.info.center = {
      x: center_pos.x,
      y: center_pos.y,
      z: center_pos.z
    }
    this.refresh_camera();
  }

  set_up(up_pos) {
    this.info.up = {
      x: up_pos.x,
      y: up_pos.y,
      z: up_pos.z
    }
    this.refresh_camera();
  }

  set_near(near) {
    this.info.near = near;
    this.refresh_camera();
  }

  get_position(){
    return glMatrix.vec3.fromValues(this.info.eye.x, this.info.eye.y, this.info.eye.z);
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