class CameraController extends Keyboard {
  constructor(document, camera) {
    super(document)
    this.camera = camera;
  }

  press_up() {
    if (this.camera.update_data == null) {
      this.camera.move({x: 0.0, y: -0.05});
    }
  }

  press_down() {
    if (this.camera.update_data == null) {
      this.camera.move({x: 0.0, y: 0.05});
    }
  }

  press_left() {
    if (this.camera.update_data == null) {
      this.camera.move({x: 0.05, y: 0.0});
    }
  }

  press_right() {
    if (this.camera.update_data == null) {
      this.camera.move({x: -0.05, y: 0.0});
    }
  }

  press_plus() {
    if (this.camera.update_data == null) {
      this.camera.zoom(0.05);
    }
  }

  press_minus() {
    if (this.camera.update_data == null) {
      this.camera.zoom(-0.05);
    }
  }

  press_z() {
    if (this.camera.update_data == null) {
      this.camera.rotateRelX(0.05);
    }
  }


  press_q() {
    if (this.camera.update_data == null) {
      this.camera.rotateRelY(0.05);
    }
  }

  press_s() {
    if (this.camera.update_data == null) {
      this.camera.rotateRelX(-0.05);
    }
  }

  press_d() {
    if (this.camera.update_data == null) {
      this.camera.rotateRelY(-0.05);
    }
  }

  press_spacebar() {
    if (this.camera.update_data == null) {
      this.camera.update_data = {
        t: 0,
        speed: 0.002,
        radius: 15,
        height: 6.0
      }
      
      this.camera.update = function() {
        this.update_data.t = (this.update_data.t + this.update_data.speed)%(2*Math.PI);
        const radius = this.update_data.radius
        this.set_eye({
          x: radius*Math.sin(this.update_data.t), 
          y: this.update_data.height, 
          z: radius*Math.cos(this.update_data.t)
        });
      }
    } else {
      this.camera.update = function() {}
      this.camera.update_data = null
    }
  }
}