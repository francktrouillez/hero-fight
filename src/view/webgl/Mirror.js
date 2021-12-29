class Mirror extends ComplexObject {

  constructor(gl, obj_content, main_camera) {
    super(gl, obj_content);
    this.main_camera = main_camera;
    this.mirror_camera = new Camera({
      eye: {
        x: 0.0, y: 0.0, z: 0.0
      },
      center: {
        x: 0.0, y: 0.0, z: 1.0
      },
      up: {
        x: 0.0, y: 1.0, z: 0.0
      },
      fov: 45.0,
      aspect: 1.0,
      near: 0.01,
      far: 100.0
    })

    this.fake_eye = {
      x: 0.0, y: 0.0, z: 0.0
    }

    this.length_object = 10*Math.sqrt(2);

    this.normal_surface = {
      x: 0.0,
      y: 1.0,
      z: 0.0
    }
  }

  init_buffers() {
    super.init_buffers();

    this.gl_texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.gl_texture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 2000, 2000, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

    this.frame_buffer = this.gl.createFramebuffer();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frame_buffer);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.gl_texture, 0);

  }

  update_mirror_reflexion() {
    const camera_eye = this.main_camera.info.eye;
    const mirror_eye = this.fake_eye;
    const normal = this.normal_surface;
    const vect_eye_to_mirror = {
      x: mirror_eye.x - camera_eye.x,
      y: mirror_eye.y - camera_eye.y,
      z: mirror_eye.z - camera_eye.z
    }
    const height_camera = dot_product(normal, {
      x: -vect_eye_to_mirror.x,
      y: -vect_eye_to_mirror.y,
      z: -vect_eye_to_mirror.z
    })
    if (height_camera < 0) {
      console.log("camera under the mirror");
    }
    const normal_resized = {
      x: normal.x * height_camera,
      y: normal.y * height_camera,
      z: normal.z * height_camera
    }
    this.mirror_camera.set_center({
      x: mirror_eye.x + vect_eye_to_mirror.x + 2 * normal_resized.x,
      y: mirror_eye.y + vect_eye_to_mirror.y + 2 * normal_resized.y,
      z: mirror_eye.z + vect_eye_to_mirror.z + 2 * normal_resized.z,
    })

    const theta = Math.PI/2 - get_theta(normal, {
      x: -vect_eye_to_mirror.x,
      y: -vect_eye_to_mirror.y,
      z: -vect_eye_to_mirror.z
    })
    const r = this.length_object/2;
    const alpha = this.mirror_camera.info.fov * Math.PI/180 / 2;

    const dist = r/Math.tan(alpha); //Math.max(dist_1, dist_2);

    const near_dist = Math.sqrt(dist * dist + r * r - 2 * dist * r * Math.cos(theta))  

    const near = near_dist

    this.mirror_camera.set_near(near);

    const optical_axis_mirror = normalize({
      x: this.mirror_camera.info.center.x - mirror_eye.x,
      y: this.mirror_camera.info.center.y - mirror_eye.y,
      z: this.mirror_camera.info.center.z - mirror_eye.z,
    })

    this.mirror_camera.set_eye({
      x: this.fake_eye.x - dist * optical_axis_mirror.x,
      y: this.fake_eye.y - dist * optical_axis_mirror.y,
      z: this.fake_eye.z - dist * optical_axis_mirror.z,
    })


    const dist_eye_to_image_plan = dist - r * Math.cos(theta);
    const center_image_plan = {
      x: this.mirror_camera.info.eye.x + optical_axis_mirror.x * dist_eye_to_image_plan,
      y: this.mirror_camera.info.eye.y + optical_axis_mirror.y * dist_eye_to_image_plan,
      z: this.mirror_camera.info.eye.z + optical_axis_mirror.z * dist_eye_to_image_plan,
    }

    var moved_positions_data = []
    for (const position of this.positions_data) {
      moved_positions_data.push(matrix_vector_product(
        this.model,
        {
          x: position[0],
          y: position[1],
          z: position[2],
        }
      ))
    }

    var projected_positions_model = []
    for (const position of moved_positions_data) {
      projected_positions_model.push(projected_point({
        x: position.x,
        y: position.y,
        z: position.z
      }, optical_axis_mirror, center_image_plan))
    }

    const up = this.mirror_camera.info.up;

    const rel_x = get_perpendicular_vector(optical_axis_mirror, up);
    const rel_y = get_perpendicular_vector(rel_x, optical_axis_mirror);

    this.mirror_camera.set_up(rel_y);
    console.log(this.mirror_camera.info.eye, this.mirror_camera.info.center, this.mirror_camera.info.up)
    
    const bottom_left = {
      x: center_image_plan.x - r * (rel_x.x + rel_y.x),
      y: center_image_plan.y - r * (rel_x.y + rel_y.y),
      z: center_image_plan.z - r * (rel_x.z + rel_y.z) 
    }
    

    var texture_new_positions = [];
    var ref_to_position;
    for (const position of projected_positions_model) {
      ref_to_position = {
        x: position.x - bottom_left.x,
        y: position.y - bottom_left.y,
        z: position.z - bottom_left.z,
      }
      texture_new_positions.push([
        dot_product(ref_to_position, rel_x)/(2*r),
        dot_product(ref_to_position, rel_y)/(2*r),
      ])
    }
    
    this.textures = []
    for (const triangle of this.triangles) {
      for (const vertex of triangle) {
        this.textures = this.textures.concat(texture_new_positions[vertex[1] - 1])
      }
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texture_buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.textures), this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

  }

  update_mirror_refraction(refraction_indice) {
    const camera_eye = this.main_camera.info.eye;
    const mirror_eye = this.fake_eye;
    const normal = this.normal_surface;
    const vect_eye_to_mirror = {
      x: mirror_eye.x - camera_eye.x,
      y: mirror_eye.y - camera_eye.y,
      z: mirror_eye.z - camera_eye.z
    }
    const theta_1 = get_theta(normal, {
      x: -vect_eye_to_mirror.x,
      y: -vect_eye_to_mirror.y,
      z: -vect_eye_to_mirror.z
    })
    const theta_2 = Math.abs(Math.asin(Math.sin(theta_1)/refraction_indice));
    
    const rel_z = get_perpendicular_vector(vect_eye_to_mirror, normal);
    const rel_y = normal;
    const rel_x = get_perpendicular_vector(rel_y, rel_z);

    const distance_eye_to_mirror = norm(vect_eye_to_mirror);

    this.mirror_camera.set_center({
      x: mirror_eye.x - distance_eye_to_mirror * (Math.cos(theta_2) * rel_y.x + Math.sin(theta_2) * rel_x.x), 
      y: mirror_eye.y - distance_eye_to_mirror * (Math.cos(theta_2) * rel_y.y + Math.sin(theta_2) * rel_x.y), 
      z: mirror_eye.z - distance_eye_to_mirror * (Math.cos(theta_2) * rel_y.z + Math.sin(theta_2) * rel_x.z), 
    })
  }

  update_mirror(type, value = null) {
    if (type == 'reflexion') {
      this.update_mirror_reflexion()
    } else if (type == 'refraction') {
      this.update_mirror_refraction(value);
    } else {
      console.log("Mirror can not be updated with type : " + type)
    }
  }

  activate_frame_buffer() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frame_buffer);
    this.gl.viewport(0, 0, 2000, 2000);
    this.gl.clearColor(0.2, 0.2, 0.2, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

  }

  disable_frame_buffer() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clearColor(0.2, 0.2, 0.2, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  translate(x, y, z) {
    super.translate(x, y, z);
    this.fake_eye = {
      x: this.position.x,
      y: this.position.y,
      z: this.position.z
    }
    //this.mirror_camera.set_eye(this.position);
  }

  rotate(value, x, y, z) {
    super.rotate(value, x, y, z);
    const rotation_axis = {
      x: x,
      y: y,
      z: z
    }
    if (
      rotation_axis.x == this.normal_surface.x && 
      rotation_axis.y == this.normal_surface.y &&
      rotation_axis.z == this.normal_surface.z) {
        return;
    }
    const rel_x = get_perpendicular_vector(rotation_axis, this.normal_surface);
    const rel_y = normalize(rotation_axis);
    const rel_z = get_perpendicular_vector(rel_x, rel_y);

    console.log(rel_x, rel_y, rel_z)

    const theta = get_theta(this.normal_surface, rel_z);

    const new_rel_y = rel_y


    const new_rel_z = {
      x: Math.cos(value) * rel_z.x + Math.sin(value) * rel_x.x,
      y: Math.cos(value) * rel_z.y + Math.sin(value) * rel_x.y,
      z: Math.cos(value) * rel_z.z + Math.sin(value) * rel_x.z,
    }



    this.normal_surface = {
      x: Math.cos(theta) * new_rel_z.x + Math.sin(theta) * new_rel_y.x,
      y: Math.cos(theta) * new_rel_z.y + Math.sin(theta) * new_rel_y.y,
      z: Math.cos(theta) * new_rel_z.z + Math.sin(theta) * new_rel_y.z,
    }



  }

  setXYZ(x, y, z) {
    super.setXYZ(x, y, z)
    this.fake_eye = {
      x: this.position.x,
      y: this.position.y,
      z: this.position.z
    }
    //this.mirror_camera.set_eye(this.position);
  }

  setAngle(value, x, y, z) {
    this.normal_surface = {
      x: 0.0,
      y: 1.0,
      z: 0.0
    }
    super.setAngle(value, x, y, z);
  }

  draw() {
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.num_vertex);
  }
}