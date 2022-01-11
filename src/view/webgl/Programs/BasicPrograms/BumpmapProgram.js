class BumpmapProgram extends BasicProgram{

  constructor(gl, number_of_lights) {
    const vertex_code = shaders["./src/view/glsl/bumpmap/bumpmap.vert"];
    const fragment_code = shaders["./src/view/glsl/bumpmap/bumpmap"+ number_of_lights +".frag"];  
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
      key_normal: {
        variable: "u_normalMap",
        type: "sampler2D",
        index: 1
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