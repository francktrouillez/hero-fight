class WaterProgram extends BasicProgram{

  constructor(gl, number_of_lights) {
    const vertex_code = shaders["./src/view/glsl/mirror/water.vert"]
    const fragment_code = shaders["./src/view/glsl/mirror/water_light" + number_of_lights + ".frag"]
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
      //Element added to send to the shaders the ripple map
      key_ripples: {
        variable: "u_ripples",
        type: "sampler2D",
        index: 1
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
      }
    }
    super(gl, vertex_code, fragment_code, uniforms_map);
  }
}