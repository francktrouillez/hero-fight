class BuffRender extends ParticlesRender {
  constructor(gl, hero_object, program, camera) {
    super(
      new ParticleGenerator(
        gl,
        hero_object,
        [0.0, 1.0, 0.0],
        0.5,
        800,
        1,
        {
          color: [1.0, 0.0, 0.0],
          fade_color: 0.2,
          scale: 0.1,
          life: 2.0,
          randomness_life: 0.2,
          acceleration: [0.0, 1.0, 0.0],
          randomness_acceleration: [0.2, 0.2, 0.2],
          velocity: [0.0, 0.0, 0.0]
        }
      ),
      program,
      camera
    )
  }
}