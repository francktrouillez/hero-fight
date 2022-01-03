class SkeletonRender extends ExplodingRenderObject {

  constructor(gl, program, camera, lights_list) {

    var obj_animation_map = {
      "idle": [],
      "attack": []
    }
    
    for (let i = 0; i <= 80; i++) {
      obj_animation_map["idle"].push(obj_files["./src/view/assets/models/Skeleton/idle/" + i + ".obj"])
    }
    for (let i = 0; i <= 28; i++) {
      obj_animation_map["attack"].push(obj_files["./src/view/assets/models/Skeleton/attack/" + i + ".obj"])
    }

    var uniform_map = {}
    
    super(
      new AnimatedObject(gl, obj_files["./src/view/assets/models/Skeleton/Skeleton.obj"], obj_animation_map),
      program,
      camera,
      uniform_map
    );
    
    this.object.setXYZ(5.0, 0.0, 0.0);
    this.object.setAngle(270*Math.PI/180, 0.0, 1.0, 0.0);
    this.object.scale(0.5);

    this.uniform_map.key_texture = this.object.texture_object.gl_texture;
    this.uniform_map.key_model = this.object.model;
    this.uniform_map.key_ITMatrix = this.object.model;
    this.uniform_map.key_view = camera.get_view_matrix();
    this.uniform_map.key_projection = camera.get_projection_matrix();
    this.uniform_map.key_view_pos = camera.get_position();
    this.uniform_map.key_point_ligths = lights_list;
    this.uniform_map.key_material = new Material([1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], 32.0);
    this.uniform_map.key_a = program.uniforms_value.a
    this.uniform_map.key_v0 = program.uniforms_value.v0
    this.uniform_map.key_fade_color = program.uniforms_value.fade_color
    this.uniform_map.key_t = 0
  }
}