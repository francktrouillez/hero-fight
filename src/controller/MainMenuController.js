class MainMenuController {

  constructor(document, game) {
    this.document = document;

    this.main_menu = this.document.getElementById("main_menu_screen");
    this.play_button = null;
    this.demo_button = null;

    this.game = game;

    this.init_buttons();
  }

  init_buttons() {
    this.play_button = new InteractiveButton(
      this.document.getElementById("play_button"), 
      "./src/view/assets/main_menu_screen/play.png",
      "./src/view/assets/main_menu_screen/play_on.png",
      this,
      function() {
        this.controller.action("play");
      }
    )

    this.demo_button = new InteractiveButton(
      this.document.getElementById("demo_button"), 
      "./src/view/assets/main_menu_screen/demo.png",
      "./src/view/assets/main_menu_screen/demo_on.png",
      this,
      function() {
        this.controller.action("demo");
      }
    )
  }

  action(value) {
    if (value == "play") {
      this.game.set_mode(Game.PLAY_MODE);
    } else if (value == "demo") {
      this.game.set_mode(Game.DEMO_MODE);
    }
    this.hide_menu();
    audios["./src/view/assets/sounds/background.mp3"].play();
    audios["./src/view/assets/sounds/background.mp3"].loop = true;
  }

  hide_menu() {
    this.main_menu.style.visibility = "hidden"

  }

  show_menu() {
    this.main_menu.style.visibility = "visible"
  }
}