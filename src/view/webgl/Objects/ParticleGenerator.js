class ParticleGenerator {
  constructor(
      gl, ref_object, offset_position, range_position, number_particles, respawn_rate, particle_info) {
    this.gl = gl;
    this.ref_object = ref_object;
    
    this.offset_position = offset_position;
    this.range_position = range_position;
    this.number_particles = number_particles;
    this.respawn_rate = 0;
    this.initial_respawn_rate = respawn_rate;

    this.color = particle_info.color;
    this.fade_color = particle_info.fade_color;
    this.scale = particle_info.scale;
    this.life = particle_info.life;
    this.acceleration = particle_info.acceleration
    this.velocity = particle_info.velocity
    this.randomness_acceleration = particle_info.randomness_acceleration

    this.particles = []
    this.last_live_particle_index = 0;
    this.current_time = 0;
    this.delta_time = 0;

    this.mesh_object = new Cube(gl);

    this.init_particles()
  }

  init_particles() {
    this.particles = []
    for (let i = 0; i < this.number_particles; i++) {
      this.particles.push(
        new Particle(
          this.gl,
          [
            this.ref_object.position.x + this.offset_position[0],
            this.ref_object.position.y + this.offset_position[1],
            this.ref_object.position.z + this.offset_position[2]
          ],
          [
            this.velocity[0],
            this.velocity[1],
            this.velocity[2]  
          ],
          [
            this.acceleration[0] + 2 * this.randomness_acceleration[0] * (Math.random() - 0.5),
            this.acceleration[1] + 2 * this.randomness_acceleration[1] * (Math.random() - 0.5),
            this.acceleration[2] + 2 * this.randomness_acceleration[2] * (Math.random() - 0.5),
          ],
          [
            this.color[0],
            this.color[1],
            this.color[2],
            1.0
          ],
          this.fade_color,
          0.0
        )
      )
    }
  }

  start_respawn() {
    this.respawn_rate = this.initial_respawn_rate;
  }

  stop_respawn() {
    this.respawn_rate = 0;
  }

  set_color(color) {
    this.color = color
  }

  update_time(new_time) {
    this.delta_time = (new_time - this.current_time)/1000;
    this.current_time = new_time;
  }

  update() {
    // add new particles
    var respawn_rate = this.respawn_rate;
    if (this.respawn_rate < 1) {
      if (Math.random() < this.respawn_rate) {
        respawn_rate = 1
      } else {
        respawn_rate = 0;
      }
    }
    for (let i = 0; i < respawn_rate; i++) {
      this.respawn_new_particle(this.first_dead_particle_index());
    }
    this.update_particles()
  }

  respawn_new_particle(particle_index) {
    this.particles[particle_index].set_position([
      this.ref_object.position.x + this.offset_position[0] + 2 * this.range_position * (Math.random() - 0.5),
      this.ref_object.position.y + this.offset_position[1] + 2 * this.range_position * (Math.random() - 0.5),
      this.ref_object.position.z + this.offset_position[2] + 2 * this.range_position * (Math.random() - 0.5),
    ])
    this.particles[particle_index].set_color([
      this.color[0] + (Math.random() - 0.5) / 5,
      this.color[1] + (Math.random() - 0.5) / 5,
      this.color[2] + (Math.random() - 0.5) / 5,
      1.0
    ])
    this.particles[particle_index].life = this.life;
    this.particles[particle_index].velocity = [
      this.velocity[0],
      this.velocity[1],
      this.velocity[2]  
    ]
    this.particles[particle_index].acceleration = [
      this.acceleration[0] + 2 * this.randomness_acceleration[0] * (Math.random() - 0.5),
      this.acceleration[1] + 2 * this.randomness_acceleration[1] * (Math.random() - 0.5),
      this.acceleration[2] + 2 * this.randomness_acceleration[2] * (Math.random() - 0.5),
    ]
  }

  update_particles() {
    for (const particle of this.particles) {
      particle.life -= this.delta_time;
      if (particle.life > 0.0) {
        particle.update_position(this.delta_time);
        particle.update_color(this.delta_time);
      }
      
    }
  }

  first_dead_particle_index() {
    // First from the last live one
    for (let i = this.last_live_particle_index; i < this.number_particles; i++) {
      if (this.particles[i].life <= 0.0) {
        this.last_live_particle_index = i;
        return i; 
      }
    }
    // Then, from the beginning to the last live one
    for (let i = 0; i < this.last_live_particle_index; i++) {
      if (this.particles[i].life <= 0.0) {
        this.last_live_particle_index = i;
        return i; 
      }
    }
    // Otherwise, take the first one by default
    this.last_live_particle_index = 0;
    return 0;
  }

  activate_and_draw(program) {
    for (const particle of this.particles) {
      if (particle.life > 0.0) {
        this.gl.uniform3fv(this.gl.getUniformLocation(program, "u_offset"), particle.position);
        this.gl.uniform4fv(this.gl.getUniformLocation(program, "u_color"), particle.color);
        this.mesh_object.activate(program);
        this.mesh_object.draw();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
      }
    }
  }


}