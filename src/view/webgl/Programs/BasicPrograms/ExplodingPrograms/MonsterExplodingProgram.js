class MonsterExplodingProgram extends ExplodingProgram{

  constructor(gl, number_of_lights) {
    super(gl, number_of_lights);
    this.uniforms_value = {
      a: glMatrix.vec3.fromValues(0.0, 1.2, 0.0),
      v0: 0.4,
      fade_color: 0.4
    }
  }
}