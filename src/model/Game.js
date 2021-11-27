class Game {
  constructor() {
    this.round = 1;
    this.hero = new Hero();
    this.opponent = null;
    this.is_game_over = false;
  }

  start() {
    while (!this.is_game_over) {
      this.go_to_next_round();
    }
  }

  go_to_next_round() {
    console.log("level "+this.hero.get_level())
    console.log("xp : " +this.hero.get_xp())
    this.round += 1;
    if (this.hero.get_level() < 5) {
      this.opponent = new A();
    } else if (this.hero.get_level() < 10) {
      this.opponent = new B();
    } else {
      this.opponent = new C();
    }
    let fight = new Fight(this.hero, this.opponent);
    fight.start();
    if (fight.get_winner() == this.hero) {
      this.hero.gain_xp(this.opponent.get_xp_value());
      if (this.hero.get_level() > 50) {
        this.game_over();
      }
    } else {
      this.game_over();
    }
  }

  game_over() {
    this.is_game_over = true;
    console.log("game over");
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