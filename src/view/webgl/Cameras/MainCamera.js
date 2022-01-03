class MainCamera extends Camera {
  constructor(gl, canvas, window) {
    super({
      eye: {
        x: 0.0, y: 6.0, z: 15.0
      },
      center: {
        x: 0.0, y: 0.0, z: 0.0
      },
      up: {
        x: 0.0, y: 1.0, z: 0.0
      },
      fov: 45.0,
      aspect: 1.0,
      near: 5.0,
      far: 100.0
    });
  
    this.update_data = {
      t: 0,
      speed: 0.002,
      radius: 15,
      height: 6.0
    }
    
    this.update = function() {
      this.update_data.t = (this.update_data.t + this.update_data.speed)%(2*Math.PI);
      const radius = this.update_data.radius
      this.set_eye({
        x: radius*Math.sin(this.update_data.t), 
        y: this.update_data.height, 
        z: radius*Math.cos(this.update_data.t)
      });
    }
    auto_resize_window(window, canvas, gl, this);
  }
  
}