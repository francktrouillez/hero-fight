class LevelController {
  constructor(document) {
    this.level_text = document.getElementById("level_text");
    this.level = 0;
  }

  set_level(value) {
    this.level = value;
    this.update();
  }

  update() {
    this.level_text.innerHTML = "Level : " + this.level;
  }
}