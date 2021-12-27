class HeroRender extends RenderObject {

  constructor(gl, program, camera, lights_list) {

    var obj_animation_map = {
      "idle": [],
      "attack": [],
      "buff": []
    }
    for (let i = 0; i <= 15; i++) {
      obj_animation_map["idle"].push(obj_files["./src/view/assets/models/Warrior/idle/" + i + ".obj"])
    }
    for (let i = 0; i <= 20; i++) {
      obj_animation_map["attack"].push(obj_files["./src/view/assets/models/Warrior/attack/" + i + ".obj"])
    }
    for (let i = 0; i <= 18; i++) {
      obj_animation_map["buff"].push(obj_files["./src/view/assets/models/Warrior/punch/" + i + ".obj"])
    }
    
    var uniform_map = {}

    super(
      new AnimatedObject(gl, obj_files["./src/view/assets/models/Warrior/Warrior.obj"], obj_animation_map),
      program,
      camera,
      uniform_map
    );

    this.object.setXYZ(-4.0, 0.0, 0.0);
    this.object.rotate(90*Math.PI/180, 0.0, 1.0, 0.0);


    this.uniform_map.key_texture = this.object.texture_object.gl_texture;
    this.uniform_map.key_model = this.object.model;
    this.uniform_map.key_ITMatrix = this.object.model;
    this.uniform_map.key_view = camera.get_view_matrix();
    this.uniform_map.key_projection = camera.get_projection_matrix();
    this.uniform_map.key_view_pos = camera.get_position();
    this.uniform_map.key_point_ligths = lights_list;
    this.uniform_map.key_material = new Material([1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], 32.0);
  }
}