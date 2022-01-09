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
      this.previous_grid = JSON.parse(JSON.stringify(this.current_grid));

      // Setup the pixels array for the texture of the ripples, and init the alpha
      this.pixels = new Uint8Array(this.width* this.height * 4);
      for(var i=0; i <this.width*this.height*4; i= i+4)
      {
        this.pixels[i+3]= 255;
      }
    }

    update_8intarray_from_grid(){
      var y=0;
      var x=0;
      var j = 0;
      for(var i=0; i <this.width*this.height*4; i= i+4)
      {
        j = (i/4);
        y = Math.floor(j/this.width);
        x = j % this.width;
        this.pixels[i]= parseInt(this.current_grid[y][x]);
      }

    }
  
    update_grid() {

      for(var i=1; i<this.height-1; i++){
        for(var j=1; j<this.width-1; j++){
          this.current_grid[i][j] = (this.previous_grid[i-1][j] + this.previous_grid[i+1][j] + this.previous_grid[i][j-1] + this.previous_grid[i][j+1])/2 - this.current_grid[i][j];
          this.current_grid[i][j] *= this.dampening;
        }
      }

      for(var i=1; i<this.height-1; i++){
        for(var j=1; j<this.width-1; j++){
          this.previous_grid[i][j] = this.current_grid[i][j];
        }
      }

      console.log(this.current_grid)

    }
  
    create_ripple(x,y){
      if( x < 0 || x >= this.width){
        console.log("Invalid ripple position " +x);
      }
      else if( y < 0 || y >= this.heigth){
        console.log("Invalid ripple position " +y);
      }
      else{this.current_grid[y][x] = this.max_value;}
    }

    

  }