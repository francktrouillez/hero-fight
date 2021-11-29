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
    this.attack_character(opponent); return;
    let action = Math.floor(Math.random() * 4);
    if (action == Monster.ATTACK) {
      this.attack_character(opponent);
    } else if (action == Monster.BUFF_ATTACK) {
      this.buff_attack(Math.ceil(0.2*this.attack));
    } else if (action == Monster.BUFF_DEFENSE) {
      this.buff_defense(Math.ceil(0.4*this.defense));
    } else if (action == Monster.HEAL) {
      this.gain_life(Math.ceil(0.5*this.max_life));
    }
  }

  buff_attack(bonus_attack) {
    this.attack += bonus_attack;
  }

  buff_defense(bonus_defense) {
    this.defense += bonus_defense;
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