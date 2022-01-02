class Skeleton extends Monster {
  constructor(controller, mode, level) {
    var stats = {}
    if (mode == Game.DEMO_MODE) {
      stats = {
        life: 7,
        max_life: 7,
        attack: 2,
        defense: 1,
        xp_value: 6
      }
    } else {
      stats = {
        life: 7 * level,
        max_life: 7 * level,
        attack: Math.round(1.4 * level),
        defense: Math.round(1.0 * level),
        xp_value: 4
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