class WaterRender extends MirrorRender {
  constructor(gl, program, camera, lights_list) {
    super(gl, program, camera, lights_list)

    // Generate the texture for ripples
    this.water = new Water(gl, obj_files["./src/view/assets/models/Disk/DiskTextured.obj"]);
    this.uniform_map.key_ripples = this.water.texture_object.gl_texture;

  }

  render(need_to_be_updated = true) {
    if (need_to_be_updated) {
      this.object.update();
    }

    this.water.update_texture();
    if(this.water.updated){
      this.uniform_map.key_ripples = this.water.texture_object.gl_texture;
      this.water.updated = false;
    }

    this.program.use();

    this.mirror.gl.bindTexture(this.mirror.gl.TEXTURE_2D, this.mirror.gl_texture);

    this.object.activate(this.program.program);
    this.water.activate(this.program.program);
    this.program.manage_uniforms(this.uniform_map);
    this.object.draw();
  }

}