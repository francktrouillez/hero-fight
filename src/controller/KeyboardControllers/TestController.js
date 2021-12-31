class TestController extends Keyboard {
  constructor(document, info) {
    super(document)
    this.info = info;
    this.memory = {
      done: false
    }
  }

  press_enter() {
    this.memory.done = !this.memory.done
    if (this.memory.done) {
      this.info.stop_respawn()
    } else {
      this.info.start_respawn(1)
      this.info.set_color([0.0, 1.0, 0.0])
    }
  }

}