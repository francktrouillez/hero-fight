class Material {
    constructor(ambient, diffuse, specular, shininess) {

        //Parameters for the intensity/color of each part of the light
        this.ambient = glMatrix.vec3.fromValues(ambient[0], ambient[1], ambient[2]);
        this.diffuse = glMatrix.vec3.fromValues(diffuse[0], diffuse[1], diffuse[2]);
        this.specular = glMatrix.vec3.fromValues(specular[0], specular[1], specular[2]);

        // power of the specular light on this kind of material
        this.shininess = shininess;
    }
  }