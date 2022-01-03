class Slime extends Monster {
  constructor(controller, mode, level) {
    var stats = {}
    if (mode == Game.DEMO_MODE) {
      stats = {
        life: 3,
        max_life: 3,
        attack: 1,
        defense: 0,
        xp_value: 4
      }
    } else {
      stats = {
        life: 3 * level,
        max_life: 3 * level,
        attack: Math.round(1.4 * level),
        defense: Math.round(0.8 * level),
        xp_value: 2
      }
    }
    super(
      stats.life,
      stats.max_life,
      stats.attack,
      stats.defense,
      stats.xp_value,
      controller
    );
  }
}