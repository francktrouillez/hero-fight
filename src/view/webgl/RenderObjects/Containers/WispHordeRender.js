class WispHordeRender extends ContainerRender {

  constructor(gl, program, camera, lights_list) {
    super(gl,program, camera, lights_list)

    this.build_new_wisp({
      t: 0,
      speed: 0.005,
      angle: 0.0,
      speed_rotation: Math.PI/200,
      radius: 2,
      height: 1.5,
      var_height: 0.5,
      coeff_height: 5,
      direction: -1
    })
    
    this.build_new_wisp({
      t: Math.PI/2,
      speed: 0.005,
      angle: 0.0,
      speed_rotation: Math.PI/200,
      radius: 8,
      height: 1.5,
      var_height: 0.5,
      coeff_height: 5,
      direction: 1
    })

    this.build_new_wisp({
      t: 3*Math.PI/2,
      speed: 0.005,
      angle: 0.0,
      speed_rotation: Math.PI/200,
      radius: 8,
      height: 1.5,
      var_height: 0.5,
      coeff_height: 5,
      direction: 1
    })

  }

  build_new_wisp(update_data) {
    var wisp = new WispRender(this.gl, this.program, this.camera, this.lights_list);
    wisp.object.update_data = update_data
    wisp.object.update = function() {
      this.update_data.t = (this.update_data.t + this.update_data.speed)%(2*Math.PI);
      this.update_data.angle += this.update_data.speed_rotation

      const t = this.update_data.t
      const angle = this.update_data.angle
      const radius = this.update_data.radius
      const height = this.update_data.height
      const var_height = this.update_data.var_height
      const coeff_height = this.update_data.coeff_height
      const direction = this.update_data.direction

      this.setXYZ(
        radius*Math.sin(t * direction),
        var_height*Math.sin(t * coeff_height) + height,
        radius*Math.cos(t * direction)
      );
      this.setAngle(angle, 0.0, 1.0, 0.0)
    }
    this.elements.push(wisp)
  }
}