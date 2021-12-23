class Material {
    constructor(ambient, diffuse, specular, shininess) {

        //Parameters for the intensity/color of each part of the light
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;

        // power of the specular light on this kind of material
        this.shininess = shininess;
    }

    /*get_values_list(){
      return [this.ambient, this.diffuse, this.specular, this.shininess];
    }*/
  }