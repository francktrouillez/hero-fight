class FloorBumpmapping extends BumpmappingObject {
  
  static VERTEX_POSITIONS = [
    // Front face
    -10.0, 10.0,  0.0,
    -10.0, -10.0,  0.0,
    10.0,  -10.0,  0.0,

    -10.0, 10.0,  0.0,
    10.0,  -10.0,  0.0,
    10.0,  10.0,  0.0,
  ]

  static TEXTURES = [
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,

    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,
  ]


  constructor(gl, texture_diffuse, texture_normals, update) {
    super(gl, texture_diffuse, texture_normals, new Float32Array(FloorBumpmapping.VERTEX_POSITIONS), new Float32Array(FloorBumpmapping.TEXTURES),
           6, update);
  }
}