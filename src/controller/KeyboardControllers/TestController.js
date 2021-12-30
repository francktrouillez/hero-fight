class TestController extends Keyboard {
  constructor(document, test_info = null) {
    super(document)
    this.test = test_info
  }

  press_spacebar() {
    audios["./src/view/assets/sounds/dragon_flying.mp3"].play()
  }
}