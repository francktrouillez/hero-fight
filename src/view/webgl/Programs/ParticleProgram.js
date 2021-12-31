class ParticleProgram extends Program{

  constructor(gl) {
    const vertex_code = shaders["./src/view/glsl/particle/particle.vert"]
    const fragment_code = shaders["./src/view/glsl/particle/particle.frag"]
    const uniforms_map = {
      key_view: {
        variable:"V",
        type: "mat4"
      },
      key_projection: {
        variable:"P",
        type: "mat4"
      },
      key_scale: {
        variable: "u_scale",
        type: "float"
      }
    }
    super(gl, vertex_code, fragment_code, uniforms_map);
  }
}