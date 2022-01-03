class Dragon extends Monster {
  constructor(controller, mode, level) {
    var stats = {}
    if (mode == Game.DEMO_MODE) {
      stats = {
        life: 12,
        max_life: 12,
        attack: 3,
        defense: 2,
        xp_value: 9
      }
    } else {
      stats = {
        life: 10 * level,
        max_life: 10 * level,
        attack: Math.round(1.7 * level),
        defense: Math.round(1.3 * level),
        xp_value: 7
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