class Character {

  constructor(life, max_life, attack, defense) {
    this.life = life;
    this.max_life = max_life;
    this.attack = attack;
    this.defense = defense;
  }

  /* Methods */

  lose_life(value) {
    if (value < 0) {
      return;
    }
    if (value > this.life) {
      this.life = 0;
      return;
    }
    this.life -= value;
  }

  receive_attack(attack_value) {
    this.lose_life(attack_value - this.defense)
  }

  attack_character(ennemy) {
    ennemy.receive_attack(this.attack);
  }

  gain_life(value) {
    if (value < 0) {
      return;
    }
    if (value + this.life > this.max_life) {
      this.life = this.max_life;
      return;
    }
    this.life += value;
  }

  play(opponent) {
    throw new Error('play() is not implemented')
  }

  /* Getter */

  get_life() {
    return this.life;
  }

  get_max_life() {
    return this.max_life;
  }

  get_attack() {
    return this.attack;
  }

  get_defense() {
    return this.defense;
  }

  /* Setter */

  set_life(new_life) {
    this.life = new_life;
  }

  set_max_life(new_max_life) {
    this.max_life = new_max_life;
  }

  set_attack(new_attack) {
    this.attack = new_attack;
  }

  set_defense(new_defense) {
    this.defense = new_defense;
  }

}