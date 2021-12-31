class Particle {

  constructor(gl, position, velocity, acceleration, color, fade_color, life) {
    this.gl = gl;
    this.position = glMatrix.vec3.fromValues(position[0], position[1], position[2]);
    this.velocity = velocity;
    // constant acceleration
    this.acceleration = acceleration;
    this.color = glMatrix.vec4.fromValues(color[0], color[1], color[2], color[3]);
    this.fade_color = fade_color;
    this.life = life;
  }

  update_position(delta_time) {
    this.velocity[0] += this.acceleration[0] * delta_time;
    this.velocity[1] += this.acceleration[1] * delta_time;
    this.velocity[2] += this.acceleration[2] * delta_time;

    this.position[0] += this.velocity[0] * delta_time;
    this.position[1] += this.velocity[1] * delta_time;
    this.position[2] += this.velocity[2] * delta_time;
  }

  update_color(delta_time) {
    this.color[3] -= delta_time * this.fade_color;
  }

  set_position(position) {
    this.position = glMatrix.vec3.fromValues(position[0], position[1], position[2]);
  }

  set_color(color) {
    this.color = glMatrix.vec4.fromValues(color[0], color[1], color[2], color[3]);
  }
}