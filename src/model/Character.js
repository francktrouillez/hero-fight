class Character {

  constructor(life, max_life, attack, defense, controller) {
    this.controller = controller;
    this.set_life(life);
    this.set_max_life(max_life);
    this.set_attack(attack);
    this.set_buff_attack(0);
    this.set_defense(defense);
    this.set_buff_defense(0);
  }

  /* Methods */

  lose_life(value) {
    if (value < 0) {
      return;
    }
    if (value > this.life) {
      this.set_life(0);
      return;
    }
    this.set_life(this.get_life() - value);
  }

  receive_attack(attack_value) {
    this.lose_life(attack_value - this.defense - this.buff_defense)
  }

  attack_character(ennemy) {
    ennemy.receive_attack(this.attack + this.buff_attack);
  }

  gain_life(value) {
    if (value < 0) {
      return;
    }
    if (value + this.life > this.max_life) {
      this.set_life(this.max_life);
      return;
    }
    this.set_life(this.get_life() + value);
  }

  play(opponent) {
    throw new Error('play() is not implemented')
  }

  reset_buffs() {
    this.set_buff_attack(0);
    this.set_buff_defense(0);
  }

  set_life(new_life) {
    this.life = new_life;
    this.controller.life_controller.set_life(new_life);
  }

  set_max_life(new_max_life) {
    this.max_life = new_max_life
    this.controller.life_controller.set_max_life(new_max_life);
  }

  set_attack(new_attack) {
    this.attack = new_attack
    this.controller.attack_controller.set_attack(new_attack);
  }

  set_buff_attack(new_buff_attack) {
    this.buff_attack = new_buff_attack;
    this.controller.attack_controller.set_buff_attack(new_buff_attack);
  }

  set_defense(new_defense) {
    this.defense = new_defense;
    this.controller.defense_controller.set_defense(new_defense);
  }

  set_buff_defense(new_buff_defense) {
    this.buff_defense = new_buff_defense;
    this.controller.defense_controller.set_buff_defense(new_buff_defense);
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

}