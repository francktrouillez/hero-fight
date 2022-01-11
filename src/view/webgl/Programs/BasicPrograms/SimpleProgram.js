class SimpleProgram extends BasicProgram{

  constructor(gl) {
    const vertex_code = shaders["./src/view/glsl/simple/simple.vert"]
    const fragment_code = shaders["./src/view/glsl/simple/simple.frag"]
    const uniforms_map = {
      key_model: {
        variable:"M",
        type: "mat4"
      },
      key_view: {
        variable:"V",
        type: "mat4"
      },
      key_projection: {
        variable:"P",
        type: "mat4"
      }
    }
    super(gl, vertex_code, fragment_code, uniforms_map);
  }
}