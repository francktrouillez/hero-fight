class CameraController extends Keyboard {

  static FOCUS_SCENE = 0;
  static UNDERGROUND = 1;
  static HERO = 2;
  static MONSTER = 3;
  static CLOSE_POND = 4;
  static TOP = 5;

  constructor(document, camera) {
    super(document)
    this.camera = camera;
    this.mode = CameraController.FOCUS_SCENE;
    this.switch_scene(this.mode);
  }

  switch_scene(mode) {
    this.mode = mode;
    if (mode == CameraController.FOCUS_SCENE) {
      this.switch_scene_focus_scene();
    } else if (mode == CameraController.UNDERGROUND) {
      this.switch_scene_underground();
    } else if (mode == CameraController.HERO) {
      this.switch_scene_hero();
    } else if (mode == CameraController.MONSTER) {
      this.switch_scene_monster();
    } else if (mode == CameraController.CLOSE_POND) {
      this.switch_scene_close_pond();
    } else if (mode == CameraController.TOP) {
      this.switch_scene_top();
    }
  }

  next_scene() {
    this.switch_scene((this.mode + 1) % 6);
  }

  previous_scene() {
    this.switch_scene((this.mode - 1) % 6);
  }

  press_right() {
    this.next_scene();
  }

  press_left() {
    this.previous_scene();
  }

  switch_scene_focus_scene() {
    this.camera.update_data = {
      t: 0,
      speed: 0.002,
      radius: 15,
      height: 6.0
    }
    this.camera.set_eye({
      x: 0.0,
      y: this.camera.update_data.height,
      z: this.camera.update_data.radius
    })
    this.camera.set_center({
      x: 0.0,
      y: 0.0,
      z: 0.0
    })
    this.camera.set_up({
      x: 0.0,
      y: 1.0,
      z: 0.0
    })
    this.camera.set_near(5.0);
    this.camera.set_far(100.0);
    this.camera.update = function() {
      this.update_data.t = (this.update_data.t + this.update_data.speed)%(2*Math.PI);
      const radius = this.update_data.radius
      this.set_eye({
        x: radius*Math.sin(this.update_data.t), 
        y: this.update_data.height, 
        z: radius*Math.cos(this.update_data.t)
      });
    }
  }

  switch_scene_underground() {
    this.camera.update_data = null
    this.camera.set_eye({
      x: 0.0,
      y: 0.0,
      z: 1.0
    })
    this.camera.set_center({
      x: 0.0,
      y: -3.0,
      z: 0.0
    })
    this.camera.set_up({
      x: 0.0,
      y: 1.0,
      z: 0.0
    })
    this.camera.set_near(0.2);
    this.camera.set_far(100.0);
    this.camera.update = function() {}
  }

  switch_scene_hero() {
    this.camera.update_data = null
    this.camera.set_eye({
      x: -4.5,
      y: 2.5,
      z: 0.0
    })
    this.camera.set_center({
      x: 0.0,
      y: 2.5,
      z: 0.0
    })
    this.camera.set_up({
      x: 0.0,
      y: 1.0,
      z: 0.0
    })
    this.camera.set_near(0.5);
    this.camera.set_far(100.0);
    this.camera.update = function() {}
  }

  switch_scene_monster() {
    this.camera.update_data = null
    this.camera.set_eye({
      x: 4.5,
      y: 2.6,
      z: 0.0
    })
    this.camera.set_center({
      x: 0.0,
      y: 2.6,
      z: 0.0
    })
    this.camera.set_up({
      x: 0.0,
      y: 1.0,
      z: 0.0
    })
    this.camera.set_near(1.15);
    this.camera.set_far(100.0);
    this.camera.update = function() {}
  }

  switch_scene_close_pond() {
    this.camera.update_data = {
      t: 0,
      speed: 0.002,
      radius: 3.0,
      height: 6.0
    }
    this.camera.set_eye({
      x: 0.0,
      y: this.camera.update_data.height,
      z: this.camera.update_data.radius
    })
    this.camera.set_center({
      x: 0.0,
      y: 0.0,
      z: 0.0
    })
    this.camera.set_up({
      x: 0.0,
      y: 1.0,
      z: 0.0
    })
    this.camera.set_near(2.0);
    this.camera.set_far(100.0);
    this.camera.update = function() {
      this.update_data.t = (this.update_data.t + this.update_data.speed)%(2*Math.PI);
      const radius = this.update_data.radius
      this.set_eye({
        x: radius*Math.sin(this.update_data.t), 
        y: this.update_data.height, 
        z: radius*Math.cos(this.update_data.t)
      });
    }
  }

  switch_scene_top() {
    this.camera.update_data = null
    this.camera.set_eye({
      x: 0.0,
      y: 15.0,
      z: 1.0
    })
    this.camera.set_center({
      x: 0.0,
      y: 0.0,
      z: 0.0
    })
    this.camera.set_up({
      x: 0.0,
      y: 1.0,
      z: 0.0
    })
    this.camera.set_near(2.0);
    this.camera.set_far(100.0);
    this.camera.update = function() {}
  }

  press_z() {
    if (this.camera.update_data == null) {
      this.camera.rotateRelX(0.05);
      this.camera.set_up({
        x: 0.0,
        y: 1.0,
        z: 0.0
      })
    }
  }


  press_q() {
    if (this.camera.update_data == null) {
      this.camera.rotateRelY(0.05);
      this.camera.set_up({
        x: 0.0,
        y: 1.0,
        z: 0.0
      })
    }
  }

  press_s() {
    if (this.camera.update_data == null) {
      this.camera.rotateRelX(-0.05);
      this.camera.set_up({
        x: 0.0,
        y: 1.0,
        z: 0.0
      })
    }
  }

  press_d() {
    if (this.camera.update_data == null) {
      this.camera.rotateRelY(-0.05);
      this.camera.set_up({
        x: 0.0,
        y: 1.0,
        z: 0.0
      })
    }
  }
}