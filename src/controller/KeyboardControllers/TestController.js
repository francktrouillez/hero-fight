class TestController extends Keyboard {
  constructor(document, test_info) {
    super(document)
    this.test = test_info
  }

  press_spacebar() {
    console.log("Spacebar");
    this.test.mirror.render_mirror(this.test.render_objects)
    this.test.mirror.render(this.test.render_objects)
  }
}