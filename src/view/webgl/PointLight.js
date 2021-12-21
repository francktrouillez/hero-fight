class PointLight {
    constructor(position, constant, linear, quadratic, ambient, diffuse, specular) {
        this.pos = position;

        // Paramters linked to the attenuation
        this.constant = constant;
        this.linear = linear;
        this.quadratic = quadratic;  

        //Parameters for the intensity/color of each part of the light
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
    }
  
    set_position(value) {
      this.pos = value;
    }

    get_position(){return this.pos;}

    // Method used to get all the parameters of this light at once, this is used to update the uniform of the fragment shader
    get_values_list(){
        return [this.pos, this.constant, this.linear, this.quadratic, this.ambient, this.diffuse, this.specular];
    }
  
  }