class RipplesGenerator {

    constructor(width, height, dampening){
      let grid = [];
      this.height = height;
      this.width = width;
      this.dampening = dampening;

      this.max_value = 400;

      for(var i=0; i<this.height; i++){
        grid.push(new Array(this.width));
        for( var j=0; j<this.width; j++){
            grid[i][j] = 0;
        }
      }
      this.current_grid = grid;
      this.buffer1 = JSON.parse(JSON.stringify(this.current_grid));
      this.buffer2 = JSON.parse(JSON.stringify(this.current_grid));
      this.buffer_mode1 = true;

      // Create the grid that will hold the values for the Perlin Nois
      this.Perlin_grid = JSON.parse(JSON.stringify(this.current_grid));
      this.nodes = 64;
      this.deformation = 4.0;
      this.gradients_grid = [];
      this.init_Perlin_noise();

      //this.update_Perlin_noise();
      for(var i=0; i<this.height; i++){
        for(var j=0; j<this.width; j++){
          this.Perlin_grid[i][j]=  this.perlin_noise(j,i);
        }
      }

      // Setup the pixels array for the texture of the ripples
      this.pixels = new Uint8Array(this.width* this.height * 4);
    }

    update_8intarray_from_grid(){
      var y=0;
      var x=0;
      var j = 0;
      for(var i=0; i <this.width*this.height*4; i= i+4)
      {
        j = (i/4);
        y = Math.floor(j/this.width);
        if(y<1 || y>this.height-2){y = 1;}
        x = j % this.width;
        if(x<1 || x>this.width-2){x = 1;}

        var offsetX = this.current_grid[y][x-1] - this.current_grid[y][x+1];
        var offsetY = this.current_grid[y-1][x] - this.current_grid[y+1][x];
        
        //this.pixels[i] = this.Perlin_grid[y][x]*255.0;
        this.pixels[i] = this.Perlin_grid[y][x]*this.deformation;

        if(offsetX<0){this.pixels[i+1]= -1.0*offsetX;}
        else{this.pixels[i+1]  = offsetX;}

        if(offsetY<0){this.pixels[i+2]= -1.0*offsetY;}
        else{this.pixels[i+2]  = offsetY;}
        
      }

    }
  
    update_grid() {

      if(this.buffer_mode1){


        for(var i=1; i<this.height-1; i++){
          for(var j=1; j<this.width-1; j++){
            this.buffer1[i][j] = parseInt(((this.buffer2[i-1][j] + this.buffer2[i+1][j] + this.buffer2[i][j-1] + this.buffer2[i][j+1])/2 - this.buffer1[i][j])*this.dampening);
          
          }
        }
      
        this.current_grid = this.buffer1;
      }
      else{
        for(var i=1; i<this.height-1; i++){
          for(var j=1; j<this.width-1; j++){
            this.buffer2[i][j] = parseInt(((this.buffer1[i-1][j] + this.buffer1[i+1][j] + this.buffer1[i][j-1] + this.buffer1[i][j+1])/2 - this.buffer2[i][j])*this.dampening);
          }
        }

        this.current_grid = this.buffer2;
      }

      this.buffer_mode1 = ! this.buffer_mode1;

    }

    update_Perlin_noise(){
      var old_grid = JSON.parse(JSON.stringify(this.gradients_grid));

      for(var i=0; i<this.nodes+1; i++){
        for(var j=1; j<this.nodes+1; j++){
          this.gradients_grid[i][j] = old_grid[i][j-1];
        }
      }

      for(var i=0; i<this.nodes+1; i++){
        this.gradients_grid[i][0] = this.random_unit_vector();
      }


      for(var i=0; i<this.height; i++){
        for(var j=0; j<this.width; j++){
          this.Perlin_grid[i][j]=  this.perlin_noise(j,i);
        }
      }


    }
  
    create_ripple(x,y){
      if( x < 0 || x >= this.width){
        console.log("Invalid ripple position " +x);
      }
      else if( y < 0 || y >= this.heigth){
        console.log("Invalid ripple position " +y);
      }
      else{
        if(this.buffer_mode1){this.buffer2[y][x] = this.max_value;}
        else{this.buffer1[y][x] = this.max_value;}
      }
    }

    init_Perlin_noise(){
      // We need to generate the table that will hold the values for therandom gradient vectors picked
      for (let i = 0; i < this.nodes+1; i++) {
        let row = [];
        for (let j = 0; j < this.nodes+1; j++) {
            row.push(this.random_unit_vector());
        }
        this.gradients_grid.push(row);
      }

      return true;
    }

    random_unit_vector(){
      let theta = Math.random() * 2 * Math.PI;
      return {
          x: Math.cos(theta),
          y: Math.sin(theta)
      };
  }

  perlin_noise(x, y) {
    var x_local = (x/this.width) * (this.nodes);
    var y_local = (y/this.height) * (this.nodes);
    var x0 = Math.floor(x_local);
    var x1 = x0 + 1;
    var y0 = Math.floor(y_local);
    var y1 = y0 + 1;

    // g1 ¦¦ g2
    // g3 ¦¦ g4
    var g1 = this.dot_prod_grid(x_local,y_local, x0,y0);
    var g2 = this.dot_prod_grid(x_local,y_local, x1,y0);
    var g3 = this.dot_prod_grid(x_local,y_local, x0,y1);
    var g4 = this.dot_prod_grid(x_local,y_local, x1,y1);

    // Then we need to interpolate this 4 values to find the one to x,y
    var inter1 = this.lerp((x_local-x0), g1,g2);
    var inter2 = this.lerp((x_local-x0), g3,g4);
    var intensity = this.lerp((y_local-y0) ,inter1,inter2);

    return (intensity+1)/2;
  }

  // Dot product between distance vect and gradients
  dot_prod_grid(x, y, vert_x, vert_y){
    var g_vect = this.gradients_grid[vert_y][vert_x];
    var d_vect = {x: x - vert_x, y: y - vert_y};
    return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
  }

  smootherstep(x){
    return 6*x**5 - 15*x**4 + 10*x**3;
  }
  lerp(x, a, b){
    return a + this.smootherstep(x) * (b-a);
  }

}