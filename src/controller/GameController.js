class GameController {
  constructor(document) {
    this.hero_controller = new HeroController(document);
    this.opponent_controller = new OpponentController(document);
    this.game = new Game(this.hero_controller, this.opponent_controller);
  }

  update() {
    this.game.update();
  }
}