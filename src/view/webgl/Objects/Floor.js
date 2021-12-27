class Floor extends SimpleObject {
  
  static VERTEX_POSITIONS = [
    // Front face
    20.0, 0.0,  20.0,
    20.0, 0.0,  -20.0,
    -20.0,  0.0,  -20.0,

    20.0, 0.0,  20.0,
    -20.0,  0.0,  -20.0,
    -20.0,  0.0,  20.0,
  ]

  //Per vertex
  static NORMALS=[
    0.0, 1.0,  0.0,
    0.0, 1.0,  0.0,
    0.0, 1.0,  0.0,
    0.0, 1.0,  0.0,
    0.0, 1.0,  0.0,
    0.0, 1.0,  0.0,
  ]
   /*
  static VERTEX_INDICES = [
    0,  1,  2,     0,  2,  3  
  ]*/


  constructor(gl, texture_object, textures, update) {
    super(gl, texture_object, new Float32Array(Floor.VERTEX_POSITIONS), textures,  new Float32Array(Floor.NORMALS), 6,update);
  }

  
}