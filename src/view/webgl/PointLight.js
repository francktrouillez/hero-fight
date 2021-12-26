class PointLight {
    constructor(position_init, constant, linear, quadratic, ambient, diffuse, specular, light_color) {
        this.pos = position_init;

        // Paramters linked to the attenuation
        this.constant = constant;
        this.linear = linear;
        this.quadratic = quadratic;  

        //Parameters for the intensity/color of each part of the light
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;

        this.color = light_color;
    }
  
    set_position(value) {
      this.pos = value;
    }

    get_position(){return this.pos;}
  
  }