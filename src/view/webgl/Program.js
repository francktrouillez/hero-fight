class Program {

  constructor(gl, vertex_code, fragment_code, uniforms_map) {
    this.gl = gl;
    this.vertex_shader = this.compile_shader(vertex_code, gl.VERTEX_SHADER);
    this.fragment_shader = this.compile_shader(fragment_code, gl.FRAGMENT_SHADER);
    this.program = null;
    this.create_program();
    this.uniforms_map = uniforms_map;
  }

  compile_shader(source, type) {
    var shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(this.gl.getShaderInfoLog(shader));
      throw new Error('Failed to compile ' + type + ' shader');
    }
    
    return shader;
  }

  create_program() {
    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, this.vertex_shader);
    this.gl.attachShader(this.program, this.fragment_shader);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error(this.gl.getProgramInfoLog(this.program));
      throw new Error('Unable to compile program');
    }
  }

  use() {
    this.gl.useProgram(this.program);
  }

  map_uniform(uniform_location, type, value) {
    if (type == "vec2") {
      this.gl.uniform2fv(uniform_location, value); return;
    } else if (type=="vec3"){
      this.gl.uniform3fv(uniform_location, value); return;
    } else if(type == "float"){
      this.gl.uniform1f(uniform_location, value); return;
    } else if (type == "mat4") {
      this.gl.uniformMatrix4fv(uniform_location, false, value); return;
    } else if (type == "sampler2D") {
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, value);
      this.gl.uniform1i(uniform_location, 0);
      return;
    } else {
      throw new Error('Unable to map uniform of type '+type);
    }
  }

  // Function used to map the special type object point lights which is a struct defined in fragement shader
  map_point_light(key, point_light, index){
    //First vec3 is the position
    let loc = this.uniforms_map[key].variable + "[" + String(index) +"]" + ".position" ;
    var uniform_location = this.gl.getUniformLocation(this.program, loc);
    this.map_uniform(uniform_location, "vec3", point_light[0]);

    //The next 6 uniforms are the multiple parameters of the light, first 3 attenuation floats and final 3 vec3 the constant for each part of the light
    loc = this.uniforms_map[key].variable + "[" + String(index) +"]" + ".constant" ;
    uniform_location = this.gl.getUniformLocation(this.program, loc);
    this.map_uniform(uniform_location, "float", point_light[1]);

    loc = this.uniforms_map[key].variable + "[" + String(index) +"]" + ".linear" ;
    uniform_location = this.gl.getUniformLocation(this.program, loc);
    this.map_uniform(uniform_location, "float", point_light[2]);

    loc = this.uniforms_map[key].variable + "[" + String(index) +"]" + ".quadratic" ;
    uniform_location = this.gl.getUniformLocation(this.program, loc);
    this.map_uniform(uniform_location, "float", point_light[3]);

    loc = this.uniforms_map[key].variable + "[" + String(index) +"]" + ".ambient" ;
    uniform_location = this.gl.getUniformLocation(this.program, loc);
    this.map_uniform(uniform_location, "vec3", point_light[4]);

    loc = this.uniforms_map[key].variable + "[" + String(index) +"]" + ".diffuse" ;
    uniform_location = this.gl.getUniformLocation(this.program, loc);
    this.map_uniform(uniform_location, "vec3", point_light[5]);

    loc = this.uniforms_map[key].variable + "[" + String(index) +"]" + ".specular" ;
    uniform_location = this.gl.getUniformLocation(this.program, loc);
    this.map_uniform(uniform_location, "vec3", point_light[6]);
  }


  manage_uniforms(map) {
    for (let key in this.uniforms_map) {
      if(this.uniforms_map[key].type == "point_lights"){
        let point_lights = map[key];
        for (let i=0; i<point_lights.length; i++){
          this.map_point_light(key,point_lights[i],i);
        }
      }
      else{
        const uniform_location = this.gl.getUniformLocation(this.program, this.uniforms_map[key].variable);
        this.map_uniform(uniform_location, this.uniforms_map[key].type, map[key])
      }
    }
  }
}