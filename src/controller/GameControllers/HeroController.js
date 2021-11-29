class HeroController {
  constructor(document) {
    this.fight_controller = null;
    this.xp_controller = null;
    this.life_controller = null;
    this.attack_controller = null;
    this.defense_controller = null;
    this.level_controller = null;

    this.init_fight_controller(document);
    this.init_xp_controller(document);
    this.init_life_controller(document);
    this.init_attack_controller(document);
    this.init_defense_controller(document);
    this.init_level_controller(document);
  }

  init_fight_controller(document) {
    this.fight_controller = new FightController(document);
  }

  init_xp_controller(document) {
    this.xp_controller = new XpController(document);
    this.xp_controller.set_xp(0);
  }

  init_life_controller(document) {
    this.life_controller = new LifeController(document, "life_text");
    this.life_controller.set_life(10);
    this.life_controller.set_max_life(10);
  }

  init_attack_controller(document) {
    this.attack_controller = new AttackController(document, "attack_text");
    this.attack_controller.set_attack(1);
    this.attack_controller.set_buff_attack(0);
  }

  init_defense_controller(document) {
    this.defense_controller = new DefenseController(document, "defense_text");
    this.defense_controller.set_defense(0);
    this.defense_controller.set_buff_defense(0);
  }

  init_level_controller(document) {
    this.level_controller = new LevelController(document);
    this.level_controller.set_level(0);
  }



}