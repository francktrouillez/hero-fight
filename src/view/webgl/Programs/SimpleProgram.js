class SimpleProgram extends Program{

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
      },
      key_texture: {
        variable: "u_texture",
        type: "sampler2D"
      }
    }
    super(gl, vertex_code, fragment_code, uniforms_map);
  }
}