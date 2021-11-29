class Fight {
  constructor(hero, monster, controller) {
    this.hero = hero;
    this.monster = monster;
    this.winner = null;
    this.controller = controller;
  }

  update() {
    if(this.hero.get_life() > 0 && this.monster.get_life() > 0) {
      if (!this.hero.play(this.monster)) {
        return;
      }
      console.log(this.monster.get_life());
      if (this.monster.get_life() > 0) {
        this.monster.play(this.hero);
      }
    } else {
      if (this.hero.get_life() > 0) {
        this.winner = this.hero;
      } else {
        this.winner = this.monster;
      }
    }
  }


 
  /* Getter */

  get_hero() {
    return this.hero;
  }

  get_monster() {
    return this.monster;
  }

  get_winner() {
    return this.winner;
  }

  /* Setter */

  set_hero(new_hero) {
    this.hero = new_hero;
  }

  set_monster(new_monster) {
    this.monster = new_monster;
  }

  set_winner(new_winner) {
    this.winner = new_winner;
  }

}