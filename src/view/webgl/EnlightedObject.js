class EnlightedObject extends ComplexObject {
  constructor(gl, obj_content, light_details) {
    super(gl, obj_content)
    this.light = new Light(
      [0.0, 0.0, 0.0],
      light_details.constant,
      light_details.linear,
      light_details.quadratic,
      light_details.ambient,
      light_details.diffuse,
      light_details.specular,
      light_details.light_color
    )
  }

  translate(x, y, z) {
    super.translate(x, y, z);
    this.light.set_position(this.position.x, this.position.y, this.position.z);
  }

  setXYZ(x, y, z) {
    super.setXYZ(x, y, z);
    this.light.set_position(this.position.x, this.position.y, this.position.z);
  }

}