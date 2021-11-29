class FightController {

  constructor(document) {
    this.document = document;

    this.fight_menu = this.document.getElementById("fight_menu");
    
    this.attack = null;
    this.buff_attack = null;
    this.buff_defense = null;
    this.heal = null;

    this.next_action = null;

    this.init_buttons();
  }

  init_buttons() {
    this.attack = new InteractiveButton(
      this.document.getElementById("attack_button"), 
      "./src/view/assets/buttons/sword.png",
      "./src/view/assets/buttons/sword_light.png",
      this,
      function() {
        this.controller.action("attack");
      }
    )

    this.buff_attack = new InteractiveButton(
      this.document.getElementById("buff_attack_button"), 
      "./src/view/assets/buttons/sword_up.png",
      "./src/view/assets/buttons/sword_up_light.png",
      this,
      function() {
        this.controller.action("buff_attack");
      }
    )

    this.buff_defense = new InteractiveButton(
      this.document.getElementById("buff_shield_button"), 
      "./src/view/assets/buttons/shield_up.png",
      "./src/view/assets/buttons/shield_up_light.png",
      this,
      function() {
        this.controller.action("buff_defense");
      }
    )

    this.heal = new InteractiveButton(
      this.document.getElementById("heal_button"), 
      "./src/view/assets/buttons/heal.png",
      "./src/view/assets/buttons/heal_light.png",
      this,
      function() {
        this.controller.action("heal");
      }
    )
  }

  action(value) {
    this.next_action = value;
  }

  request_action() {
    return this.next_action;
  }

  reset_action() {
    this.next_action = null;
  }

  hide_menu() {
    this.fight_menu.style.visibility = "hidden";
  }

  show_menu() {
    this.fight_menu.style.visibility = "visible";
  }
}