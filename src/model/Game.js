class Game {

  static REST = 0;
  static FIGHTING = 1;
  static GETTING_XP = 2;

  constructor(hero_controller, opponent_controller) {
    this.round = 1;
    this.hero = new Hero(hero_controller);
    this.opponent_controller = opponent_controller;
    this.opponent = null;
    this.is_game_over = false;
    this.waiting = false;
    this.state = Game.REST;
    this.fight = null;

    this.pending_xp = 0;
  }

  update() {
    if (this.state == Game.REST) {
      this.go_to_next_round();
    } else if (this.state == Game.FIGHTING) {
      this.continue_fight();
    } else if (this.state = Game.GETTING_XP) {
      this.continue_get_xp();
    }
  }

  switch_state(new_state) {
    if (new_state == Game.REST) {
      this.state = Game.REST;
    } else if (new_state == Game.FIGHTING) {
      this.state = Game.FIGHTING;
    } else if (new_state == Game.GETTING_XP) {
      this.state = Game.GETTING_XP;
    }
  }

  continue_get_xp() {
    if (this.fight.get_winner() == this.hero && this.pending_xp > 0) {
      this.hero.gain_xp(1);
      this.pending_xp -= 1;
      if (this.hero.get_level() > 50) {
        this.game_over();
      }
      return;
    } else if (this.fight.get_winner() == this.opponent){
      this.game_over();
    }
    this.switch_state(Game.REST);
  }

  continue_fight() {
    this.fight.update();
    if (this.fight.get_winner() == null) {
      return;
    }
    this.pending_xp = this.opponent.get_xp_value();
    this.switch_state(Game.GETTING_XP);
  }

  go_to_next_round() {
    this.round += 1;
    if (this.hero.get_level() < 5) {
      this.opponent = new A(this.opponent_controller);
    } else if (this.hero.get_level() < 10) {
      this.opponent = new B(this.opponent_controller);
    } else {
      this.opponent = new C(this.opponent_controller);
    }
    this.fight = new Fight(this.hero, this.opponent, this);
    this.switch_state(Game.FIGHTING); 
  }

  game_over() {
    this.is_game_over = true;
  }


  /* Getter */

  get_round() {
    return this.round;
  }

  get_hero() {
    return this.hero;
  }

  /* Setter */

  set_round(new_round) {
    this.round = new_round;
  }

  set_hero(new_hero) {
    this.hero = new_hero;
  }

}