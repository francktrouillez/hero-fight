class FishRender extends RenderObject {

  constructor(gl, program, camera, lights_list) {

    var uniform_map = {}

    super(
      new ComplexObject(gl, obj_files["./src/view/assets/models/Fish/Fish.obj"]),
      program,
      camera,
      uniform_map
    )

    this.object.scale(0.2)


    this.object.update_data = {
      t: 0,
      speed: 0.01,
      offset_angle: Math.PI/2
    }

    this.object.update = function() {
      this.update_data.t = (this.update_data.t + this.update_data.speed)%(2*Math.PI);
      this.setXYZ(Math.sin(this.update_data.t), -3.0, Math.cos(this.update_data.t));
      this.setAngle(this.update_data.t + this.update_data.offset_angle, 0.0, 1.0, 0.0)
    }

    this.uniform_map.key_texture = this.object.texture_object.gl_texture;
    this.uniform_map.key_model = this.object.model;
    this.uniform_map.key_ITMatrix = this.object.model;
    this.uniform_map.key_view = camera.get_view_matrix();
    this.uniform_map.key_projection = camera.get_projection_matrix();
    this.uniform_map.key_view_pos = camera.get_position();
    this.uniform_map.key_point_ligths = lights_list;
    this.uniform_map.key_material = new Material([1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [0.0, 0.0, 0.0], 32.0);
  }
}