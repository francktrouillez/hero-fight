class Hero extends Character {

  static XP_THRESHOLD = 10;

  constructor(controller) {
    super(10, 10, 1, 0);
    this.level = 1;
    this.xp = 0;
    this.controller = controller;
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
    const action = this.controller.request_action();
    if (action == null) {
      return false;
    }
    if (action == "attack") {
      console.log("attack");
      this.attack_character(opponent);
    } else if (action == "buff_attack") {
      console.log("buff attack");
      this.attack += 2;
    } else if (action == "buff_defense") {
      console.log("buff defense");
      this.defense += 2;
    } else if (action == "heal") {
      console.log("heal");
      this.gain_life(10);
    } else {
      throw new Error("Action not known by hero : " + action)
    }
    this.controller.reset_action();
    return true;
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