class OpponentController {
  constructor(document) {
    this.life_controller = null;
    this.attack_controller = null;
    this.defense_controller = null;

    this.init_life_controller(document);
    this.init_attack_controller(document);
    this.init_defense_controller(document);
  }

  init_life_controller(document) {
    this.life_controller = new LifeController(document, "life_opponent_text");
    this.life_controller.set_life(10);
    this.life_controller.set_max_life(10);
  }

  init_attack_controller(document) {
    this.attack_controller = new AttackController(document, "attack_opponent_text");
    this.attack_controller.set_attack(1);
    this.attack_controller.set_buff_attack(0);
  }

  init_defense_controller(document) {
    this.defense_controller = new DefenseController(document, "defense_opponent_text");
    this.defense_controller.set_defense(0);
    this.defense_controller.set_buff_defense(0);
  }
}