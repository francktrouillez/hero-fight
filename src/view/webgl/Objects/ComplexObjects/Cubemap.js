class Cubemap extends ComplexObject {
  constructor(gl, texture_folder) {
    super(gl, obj_files["./src/view/assets/models/Cube/Cube.obj"])
    this.texture_object = new CubemapTexture(gl, texture_folder)
  }
}