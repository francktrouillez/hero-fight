class Hero extends Character {

  static XP_THRESHOLD = 10;

  constructor() {
    super(10, 10, 1, 0);
    this.level = 1;
    this.xp = 0;
  }

  /* Methods */

  gain_xp(xp_received) {
    if (xp_received < 0) {
      return;
    }
    if (xp_received >= Hero.XP_THRESHOLD - this.xp) {
      this.gain_level();
      let new_xp_received = xp_received - (Hero.XP_THRESHOLD - this.xp);
      this.xp = 0;
      this.gain_xp(new_xp_received);
      return;
    }
    this.xp += xp_received;
  }

  gain_level() {
    this.level += 1;
    this.attack += 1;
    this.defense += 1;
    this.max_life += 5;
    this.gain_life(7);
  }

  play(opponent) {
    /* Choose an action */
    this.attack_character(opponent);
  }

  /* Getter */

  get_level() {
    return this.level;
  }

  get_xp() {
    return this.xp;
  }

  /* Setter */

  set_level(new_level) {
    this.level = new_level;
  }

  set_xp(new_xp) {
    this.xp = new_xp
  }

}