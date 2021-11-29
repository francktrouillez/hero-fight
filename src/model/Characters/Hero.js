class Hero extends Character {

  static XP_THRESHOLD = 10;

  constructor(controller) {
    super(10, 10, 1, 0, controller);
    this.set_level(0);
    this.set_xp(0);
  }

  /* Methods */

  gain_xp(xp_received) {
    if (xp_received < 0) {
      return;
    }
    if (xp_received >= Hero.XP_THRESHOLD - this.xp) {
      this.controller.xp_controller.set_full_xp();
      this.gain_level();
      let new_xp_received = xp_received - (Hero.XP_THRESHOLD - this.xp);
      this.xp = 0;
      this.gain_xp(new_xp_received);
      return;
    }
    this.xp += xp_received;
    this.controller.xp_controller.set_xp(this.xp);
  }

  gain_level() {
    this.set_level(this.level + 1);
    this.set_attack(this.attack + 1);
    this.set_defense(this.defense + 1);
    this.set_max_life(this.max_life + 5);
    this.gain_life(7);
  }

  play(opponent) {
    /* Choose an action */
    const action = this.controller.fight_controller.request_action();
    if (action == null) {
      return false;
    }
    if (action == "attack") {
      this.attack_character(opponent);
    } else if (action == "buff_attack") {
      this.set_buff_attack(this.buff_attack + 2);
    } else if (action == "buff_defense") {
      this.set_buff_defense(this.buff_defense + 2);
    } else if (action == "heal") {
      this.gain_life(10);
    } else {
      throw new Error("Action not known by hero : " + action)
    }
    this.controller.fight_controller.reset_action();
    return true;
  }

  /* Special setters (with controller)*/

  set_level(new_level) {
    this.level = new_level;
    this.controller.level_controller.set_level(new_level);
  }

  /* Getter */

  get_level() {
    return this.level;
  }

  get_xp() {
    return this.xp;
  }

  /* Setter */

  set_xp(new_xp) {
    this.xp = new_xp
  }

}