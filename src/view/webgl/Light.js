class Light {
    constructor(position_init, constant, linear, quadratic, ambient, diffuse, specular, light_color) {
        this.pos = glMatrix.vec3.fromValues(position_init[0], position_init[1], position_init[2]);

        // Parameters linked to the attenuation
        this.constant = constant;
        this.linear = linear;
        this.quadratic = quadratic;  

        //Parameters for the intensity/color of each part of the light
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;

        this.color = glMatrix.vec3.fromValues(light_color[0], light_color[1], light_color[2]);
    }

    set_constant(value) {
      this.constant = value;
    }

    set_linear(value) {
      this.linear = value;
    }

    set_quadratic(value) {
      this.quadratic = value
    }

    set_ambient(value) {
      this.ambient = value;
    }

    set_diffuse(value) {
      this.diffuse = value;
    }

    set_specular(value) {
      this.specular = value
    }

    set_color(r, g, b) {
      this.color[0] = r;
      this.color[1] = g;
      this.color[2] = b;
    }
  
    set_position(x, y, z) {
      this.pos[0] = x;
      this.pos[1] = y;
      this.pos[2] = z;
    }

    get_position(){
      return this.pos;
    }
  
  }