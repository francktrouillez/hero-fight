// A wisp is a light which will have a complexe object as an attribute and use simple shader to display it

class Wisp extends Light{

    constructor(position_init, constant, linear, quadratic, ambient, diffuse, specular, light_color, object) {
        super(position_init, constant, linear, quadratic, ambient, diffuse, specular, light_color);

        //This is the complex object that will hold all values concerning the display aspect of the wisp
        this.object = object;
        this.modify_model();
    }

    modify_model(){

        this.object.scale(0.5);
        // Set the position of the light and the model
        this.set_position(this.pos);
    }

    set_position(value) {
        this.pos = value;
        this.object.setXYZ(value[0],value[1],value[2]);
    }

    move(value){
        this.pos = glMatrix.vec3.add(this.pos,this.pos,value);
        this.object.translate(value[0],value[1],value[2]);    
    }
  
}