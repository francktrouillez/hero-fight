class DefenseController {
  constructor(document, id) {
    this.defense_text = document.getElementById(id);
    this.current_defense = 0;
    this.buff_defense = 0;
  }

  set_defense(value) {
    this.current_defense = value;
    this.update();
  }

  set_buff_defense(value) {
    this.buff_defense = value;
    this.update();
  }

  update() {
    if (this.buff_defense == 0) {
      this.defense_text.innerHTML = this.current_defense;
    } else {
      this.defense_text.innerHTML = this.current_defense + " + " + this.buff_defense; 
    }
  }



}