class Mirror extends ComplexObject {

  constructor(gl, main_camera) {
    super(gl, /* mirror obj*/);
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
    this.normal_surface = {
      x: 0.0,
      y: 0.0,
      z: -1.0
    }
    this.texture_buffer = null;
    this.gl_texture = gl.createTexture() 
  }

  init_buffers() {
    super.init_buffers();
    this.texture_buffer = this.gl.createFramebuffer();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.texture_buffer);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.gl_texture, 0);
  }

  update_mirror() {

  }

  generate_mirrored_image() {
    this.gl.bindFramebuffer(gl.FRAMEBUFFER, this.texture_buffer);
    super.activate(program);
  }

  translate(x, y, z) {
    super.translate(x, y, z);
    this.mirror_camera.set_eye(this.position);
  }

  rotate(value, x, y, z) {
    super.rotate(value, x, y, z);
    const rotation_axis = {
      x: x,
      y: y,
      z: z
    }
    const rel_x = get_perpendicular_vector(rotation_axis, this.normal_surface);
    const rel_y = normalize(rotation_axis);
    const rel_z = get_perpendicular_vector(rel_x, rel_y);

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
    this.mirror_camera.set_eye(this.position);
  }

  setAngle(value, x, y, z) {
    this.model = glMatrix.mat4.create();
    this.translate(this.position.x, this.position.y, this.position.z);
    this.normal_surface = {
      x: 0.0,
      y: 0.0,
      z: -1.0
    }
    this.rotate(value, x, y, z);
  }

  draw() {
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.num_vertex);
  }
}