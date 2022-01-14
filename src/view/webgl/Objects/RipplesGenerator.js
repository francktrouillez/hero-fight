class RipplesGenerator {

    constructor(width, height, dampening){
      let grid = [];
      this.height = height;
      this.width = width;
      this.dampening = dampening;

      this.max_value = 80.0;

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
      this.nodes = 30;
      this.octaves = 3;
      this.deformation = 3.0;
      this.gradients_grid = [];
      this.amplitude_movement = Math.floor(this.width/15.0);
      this.init_Perlin_noise();

      // Fill the perlin grid with the calculated gradient vectors
      this.calculate_all_Perlin_grid();

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

    calculate_all_Perlin_grid(){
      var frequency = 1.0;
      var amplitude = 1.0;
      for(var o=0; o<this.octaves; o++){
        for(var i=0; i<this.height; i++){
          for(var j=0; j<this.width; j++){
          this.Perlin_grid[i][j] +=  amplitude * this.perlin_noise(j,i,frequency,o);
          }
        }
        // Higher frequency and lower amplitude  for next octave 
        frequency += 1;
        amplitude /= 3;
      }
    }

    // Move pixels of the precalculated perlin noise from this.amplitude_movement in the width direction (x texture)
    move_Perlin_noise(){
      
      console.log("Move");
      console.log(this.amplitude_movement);

      let first_pixels = [];
      for(var i=0; i<this.height; i++){
        var row = [];
        for(var j=(this.width-this.amplitude_movement);  j<this.width; j++){
          row.push(this.Perlin_grid[i][j]);
        }
        first_pixels.push(row.concat());
      }

      for(var i=0; i<this.height; i++){
        for(var j=this.amplitude_movement;  j<this.width; j++){
          var element = this.Perlin_grid[i][j-this.amplitude_movement];
          this.Perlin_grid[i].splice(j-this.amplitude_movement, 1,);
          this.Perlin_grid[i].splice(j, 0, element);
        }
      }

      for(var i=0; i<this.height; i++){
        for(var j=0;  j<this.amplitude_movement; j++){
          this.Perlin_grid[i][j] = first_pixels[i][j];
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
      // We need to generate the table that will hold the values for the random gradient vectors picked
      for(var o=1; o<=this.octaves;+ o++){
        let bloc = [];
        for (let i = 0; i < (this.nodes*o)+1; i++) {
          let row = [];
          for (let j = 0; j < (this.nodes*o)+1; j++) {
              row.push(this.random_unit_vector());
          }
          bloc.push(row);
        }
        this.gradients_grid.push(bloc);
      }

      return true;
    }

    random_unit_vector(){
      //let theta_list = [0, Math.PI/4 ,Math.PI/2, (3/4)*Math.PI, Math.PI, (5/4)*Math.PI, (3/2)*Math.PI, Math.PI*(7/4)];
      let theta = Math.random() * 2 * Math.PI;
      //let theta = theta_list[Math.floor(Math.random() * 4)];
      return {
          x: Math.cos(theta),
          y: Math.sin(theta)
      };
  }

  perlin_noise(x, y, freq, octave) {
    var node_nb = Math.floor(this.nodes * freq);
    var x_local = (x/this.width) * (node_nb);
    var y_local = (y/this.height) * (node_nb);
    var x0 = Math.floor(x_local);
    var x1 = x0 + 1;
    var y0 = Math.floor(y_local);
    var y1 = y0 + 1;


    // g1 ¦¦ g2
    // g3 ¦¦ g4
    var g1 = this.dot_prod_grid(x_local,y_local, x0,y0, octave);
    var g2 = this.dot_prod_grid(x_local,y_local, x1,y0, octave);
    var g3 = this.dot_prod_grid(x_local,y_local, x0,y1, octave);
    var g4 = this.dot_prod_grid(x_local,y_local, x1,y1, octave);

    // Then we need to interpolate this 4 values to find the one to x,y
    var inter1 = this.lerp((x_local-x0), g1,g2);
    var inter2 = this.lerp((x_local-x0), g3,g4);
    var intensity = this.lerp((y_local-y0) ,inter1,inter2);

    return (intensity+1)/2;
  }

  // Dot product between distance vect and gradients
  dot_prod_grid(x, y, vert_x, vert_y, octave){
    var g_vect = this.gradients_grid[octave][vert_y][vert_x];
    var d_vect = {x: x - vert_x, y: y - vert_y};
    return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
  }

  // In order to smooth the result obtained by the interpolation we use the function below
  smootherstep(x){
    return 6*x**5 - 15*x**4 + 10*x**3;
  }
  lerp(x, a, b){
    return a + this.smootherstep(x) * (b-a);
  }

}