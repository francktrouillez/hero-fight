class Game {

  static REST = 0;
  static ANIMATION_REST = 1;
  static FIGHTING = 2;
  static ANIMATION_FIGHTING_ATTACK = 3;
  static ANIMATION_FIGHTING_ATTACK_WITH_MONSTER = 4;
  static ANIMATION_FIGHTING_MONSTER = 5;
  static ANIMATION_FIGHTING_BUFF = 6;
  static GETTING_XP = 7;
  static ANIMATION_GETTING_XP = 8;

  static DEMO_MODE = 9;
  static PLAY_MODE = 10;

  constructor(hero_controller, opponent_controller) {
    this.round = 0;
    this.hero = new Hero(hero_controller);
    this.opponent_controller = opponent_controller;
    this.opponent = null;
    this.is_game_over = false;
    this.waiting = false;
    this.state = null;
    this.fight = null;
    this.mode = null;

    this.animating = false;

    this.pending_xp = 0;

    this.switch_state(Game.REST)
  }

  update() {
    if (this.state == Game.REST) {
      this.go_to_next_round();
    } else if (this.state == Game.ANIMATION_REST) {
      this.wait_for_rest_animation();
    } else if (this.state == Game.FIGHTING) {
      this.continue_fight();
    } else if (this.state == Game.ANIMATION_FIGHTING_ATTACK) {
      this.wait_for_fighting_animation();
    } else if (this.state == Game.ANIMATION_FIGHTING_ATTACK_WITH_MONSTER) {
      this.wait_for_attack_animation();
    } else if (this.state == Game.ANIMATION_FIGHTING_MONSTER) {
      this.wait_for_fighting_animation();
    } else if (this.state == Game.ANIMATION_FIGHTING_BUFF) {
      this.wait_for_attack_animation();
    } else if (this.state == Game.GETTING_XP) {
      this.continue_get_xp();
    } else if (this.state == Game.ANIMATION_GETTING_XP) {
      this.wait_for_getting_xp_animation();
    }
  }

  wait_for_rest_animation() {
    if (!this.animating) {
      this.switch_state(Game.FIGHTING);
    }
  }

  wait_for_fighting_animation() {
    if (!this.animating) {
      this.switch_state(Game.FIGHTING);
    }
  }

  wait_for_attack_animation() {
    if (!this.animating) {
      this.switch_state(Game.ANIMATION_FIGHTING_MONSTER);
    }
  }

  wait_for_getting_xp_animation() {
    if (!this.animating) {
      this.switch_state(Game.REST);
    }
  }

  switch_state(new_state) {
    if (new_state == Game.REST) {
      this.hero.controller.fight_controller.hide_menu();
      this.opponent_controller.hide_stats();
      this.state = Game.REST;
    } else if (new_state == Game.ANIMATION_REST) {
      this.animating = true;
      this.state = Game.ANIMATION_REST;
    } else if (new_state == Game.FIGHTING) {
      this.opponent_controller.show_stats();
      this.state = Game.FIGHTING;
    } else if (new_state == Game.ANIMATION_FIGHTING_ATTACK){
      this.animating = true;
      this.state = Game.ANIMATION_FIGHTING_ATTACK;
    } else if (new_state == Game.ANIMATION_FIGHTING_ATTACK_WITH_MONSTER){
      this.animating = true;
      this.state = Game.ANIMATION_FIGHTING_ATTACK_WITH_MONSTER;
    } else if (new_state == Game.ANIMATION_FIGHTING_MONSTER){
      this.animating = true;
      this.state = Game.ANIMATION_FIGHTING_MONSTER;
    } else if (new_state == Game.ANIMATION_FIGHTING_BUFF){
      this.animating = true;
      this.state = Game.ANIMATION_FIGHTING_BUFF;
    } else if (new_state == Game.GETTING_XP) {
      this.opponent_controller.hide_stats();
      this.state = Game.GETTING_XP;
    } else if (new_state == Game.ANIMATION_GETTING_XP) {
      this.animating = true;
      this.state = Game.ANIMATION_GETTING_XP;
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
    this.opponent = null;
    this.switch_state(Game.ANIMATION_GETTING_XP);
  }

  continue_fight() {
    const action = this.fight.update()
    if (action[0] != -1) {
      if (action[0] == "attack" && action[1] == null) {
        console.log("attack only")
        this.switch_state(Game.ANIMATION_FIGHTING_ATTACK);
      } else if (action[0] == "attack" && action[1] != null){
        console.log("attack with monster")
        this.switch_state(Game.ANIMATION_FIGHTING_ATTACK_WITH_MONSTER);
      } else {
        console.log("buff")
        this.switch_state(Game.ANIMATION_FIGHTING_BUFF);
      }
    }
    if (this.fight.get_winner() == null) {
      return;
    }
    this.hero.reset_buffs();
    this.pending_xp = this.opponent.get_xp_value();
    this.switch_state(Game.GETTING_XP);
  }

  go_to_next_round() {
    if (this.mode == null) {
      return;
    }
    this.round += 1;
    if (this.mode == Game.PLAY_MODE) {
      const opponent_index = Math.random() * 3;
      if (opponent_index < 1) {
        this.opponent = new Slime(this.opponent_controller, this.mode, this.hero.get_level());
      } else if (opponent_index < 2) {
        this.opponent = new Skeleton(this.opponent_controller, this.mode, this.hero.get_level());
      } else {
        this.opponent = new Dragon(this.opponent_controller, this.mode, this.hero.get_level());
      }
    } else {
      if ((this.hero.get_level() - 1) % 3 == 0) {
        this.opponent = new Slime(this.opponent_controller, this.mode, this.hero.get_level());
      } else if ((this.hero.get_level() - 1) % 3 == 1) {
        this.opponent = new Skeleton(this.opponent_controller, this.mode, this.hero.get_level());
      } else {
        this.opponent = new Dragon(this.opponent_controller, this.mode, this.hero.get_level());
      }
    }
    
    this.fight = new Fight(this.hero, this.opponent, this);
    this.switch_state(Game.ANIMATION_REST); 
  }

  game_over() {
    this.is_game_over = true;
  }

  set_mode(mode) {
    this.mode = mode;
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