class Game {

  static REST = 0;
  static FIGHTING = 1;

  constructor(controller) {
    this.round = 1;
    this.hero = new Hero(controller);
    this.opponent = null;
    this.is_game_over = false;
    this.waiting = false;
    this.state = Game.REST;
    this.fight = null;
  }

  update() {
    if (this.state == Game.REST) {
      this.go_to_next_round();
    } else if (this.state == Game.FIGHTING) {
      this.continue_fight();
    }
  }

  continue_fight() {
    this.fight.update();
    if (this.fight.get_winner() == null) {
      return;
    }
    if (this.fight.get_winner() == this.hero) {
      this.hero.gain_xp(this.opponent.get_xp_value());
      if (this.hero.get_level() > 50) {
        this.game_over();
      }
    } else if (this.fight.get_winner() == this.opponent){
      this.game_over();
    }
    this.state = Game.REST;
  }

  go_to_next_round() {
    this.round += 1;
    if (this.hero.get_level() < 5) {
      this.opponent = new A();
    } else if (this.hero.get_level() < 10) {
      this.opponent = new B();
    } else {
      this.opponent = new C();
    }
    this.fight = new Fight(this.hero, this.opponent, this);
    this.state = Game.REST; 
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