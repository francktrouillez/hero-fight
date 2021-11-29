class LifeController {
  constructor(document, id) {
    this.life_text = document.getElementById(id);
    this.current_life = "";
    this.max_life = "";
  }

  set_life(value) {
    this.current_life = value;
    this.update();
  } 

  set_max_life(value) {
    this.max_life = value;
    this.update();
  } 

  update() {
    this.life_text.innerHTML = this.current_life + "/" + this.max_life;
  }
}