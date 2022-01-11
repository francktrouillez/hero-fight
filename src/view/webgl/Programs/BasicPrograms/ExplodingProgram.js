class ExplodingProgram extends BasicProgram{

  constructor(gl, number_of_lights) {
    const vertex_code = shaders["./src/view/glsl/explosion/light.vert"]
    const fragment_code = shaders["./src/view/glsl/explosion/light" + number_of_lights + ".frag"]
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
        type: "sampler2D",
        index: 0
      },
      key_ITMatrix: {
        variable:"itM",
        type: "mat4"
      },
      key_view_pos:{
        variable:"u_view_pos",
        type: "vec3"
      },
      key_material:{
        variable:"u_material",
        type: "material"
      },
      key_point_ligths:{
        variable: "u_point_ligths_list",
        type: "lights"
      },
      key_t: {
        variable: "u_t",
        type: "float"
      },
      key_a: {
        variable: "u_a",
        type: "vec3"
      },
      key_v0: {
        variable: "u_v0",
        type: "float"
      },
      key_fade_color: {
        variable: "u_fade_color",
        type: "float"
      },
    }
    super(gl, vertex_code, fragment_code, uniforms_map);
  }
}