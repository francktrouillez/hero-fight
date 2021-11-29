class AttackController {
  constructor(document, id) {
    this.attack_text = document.getElementById(id);
    this.current_attack = 0;
    this.buff_attack = 0;
  }

  set_attack(value) {
    this.current_attack = value;
    this.update();
  }

  set_buff_attack(value) {
    this.buff_attack = value;
    this.update();
  }

  update() {
    if (this.buff_attack == 0) {
      this.attack_text.innerHTML = this.current_attack;
    } else {
      this.attack_text.innerHTML = this.current_attack + " + " + this.buff_attack; 
    }
  }



}