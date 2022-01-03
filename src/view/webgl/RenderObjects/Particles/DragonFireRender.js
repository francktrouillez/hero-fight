class DragonFireRender extends ParticlesRender {
  constructor(gl, dragon_object, program, camera) {
    super(
      new ParticleGenerator(
        gl,
        dragon_object,
        [-1.7, 2.6, 0.0],
        0.1,
        2500,
        5,
        {
          color: [255/255, 30/255, 0],
          fade_color: 0.2,
          scale: 0.08,
          life: 2.0,
          randomness_life: 0.2,
          acceleration: [0.0, 0.5, 0.0],
          randomness_acceleration: [0.5, 0.5, 0.5],
          velocity: [-2.0, -1.0, 0.0]
        }
      ),
      program,
      camera
    )
  }
}