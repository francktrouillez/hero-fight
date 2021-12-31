class FishWaterRender extends ParticlesRender {
  constructor(gl, fish_object, program, camera) {
    super(
      new ParticleGenerator(
        gl,
        fish_object,
        [0.0, -0.5, 0.0],
        0.1,
        500,
        0.05,
        {
          color: [0.0, 0.0, 1.0],
          fade_color: 0.2,
          scale: 0.08,
          life: 2.0,
          acceleration: [0.0, 1.0, 0.0],
          randomness_acceleration: [0.0, 0.1, 0.1],
          velocity: [0.0, 0.0, 0.0]
        }
      ),
      program,
      camera
    )
  }
}