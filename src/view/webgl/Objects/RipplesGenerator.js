class RipplesGenerator {

    constructor(width, height, dampening){
      let grid = [];
      this.height = height;
      this.width = width;
      this.dampening = dampening;

      this.max_value = 255;

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
        this.pixels[i]  = this.current_grid[y][x];
        this.pixels[i+1] = this.current_grid[y][x-1] - this.current_grid[y][x+1], // Xoffset in the texture
        this.pixels[i+2] = this.current_grid[y-1][x] - this.current_grid[y+1][x]; // Yoffset in the texture
        
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

    

  }