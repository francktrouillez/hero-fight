class DynamicCubemap extends Cubemap {

  static DAY = 0;
  static EVENING = 1;
  static NIGHT = 2;

  constructor(gl, texture_folders) {
    super(gl, texture_folders[DynamicCubemap.DAY])
    this.day_texture = texture_folders[DynamicCubemap.DAY];
    this.evening_texture = texture_folders[DynamicCubemap.EVENING];
    this.night_texture = texture_folders[DynamicCubemap.NIGHT];
    this.current_texture = this.day_texture;
  }
}