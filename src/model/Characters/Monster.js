class Monster extends Character {

  static ATTACK = 0;
  static BUFF_ATTACK = 1;
  static BUFF_DEFENSE = 2;
  static HEAL = 3;

  constructor(life, max_life, attack, defense, xp_value, controller) {
    super(life, max_life, attack, defense, controller);
    this.xp_value = xp_value;
  }

  /* Methods */

  play(opponent) {
    this.attack_character(opponent); return "attack";
  }

  /* Getter */

  get_xp_value() {
    return this.xp_value;
  }

  /* Setter */

  set_xp_value(new_xp_value) {
    this.xp_value = new_xp_value;
  }

}