class CubemapProgram extends BasicProgram{

  constructor(gl) {
    const vertex_code = shaders["./src/view/glsl/cubemap/cubemap.vert"];
    const fragment_code = shaders["./src/view/glsl/cubemap/cubemap.frag"];  
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
        variable: "u_cubemap",
        type: "samplerCube"
      }
    }
    super(gl, vertex_code, fragment_code, uniforms_map);
  }
}