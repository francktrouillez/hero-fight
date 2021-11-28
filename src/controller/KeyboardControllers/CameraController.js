class CameraController extends Keyboard {
  constructor(document, camera) {
    super(document)
    this.camera = camera;
  }

  press_up() {
    this.camera.move({x: 0.0, y: -0.05});
  }

  press_down() {
    this.camera.move({x: 0.0, y: 0.05});
  }

  press_left() {
    this.camera.move({x: 0.05, y: 0.0});
  }

  press_right() {
    this.camera.move({x: -0.05, y: 0.0});
  }

  press_plus() {
    this.camera.zoom(0.05);
  }

  press_minus() {
    this.camera.zoom(-0.05);
  }

  press_z() {
    this.camera.rotateX(0.05);
  }

  press_q() {
    this.camera.rotateY(0.05);
  }

  press_s() {
    this.camera.rotateX(-0.05);
  }

  press_d() {
    this.camera.rotateY(-0.05);
  }
}