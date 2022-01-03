class RipplesGenerator {

    constructor(width, height, dampening){
      this.current_grid = [];
      this.height = height;
      this.width = width;
      this.dampening = dampening;

      for(var i=0; i<height; i++){
        this.current_grid.push(new Array(width));
        for( var j=0; j<this.width; j++){
          this.current_grid[i][j] = 0;
        }
      }

      this.previous_grid = [];
      for(var i=0; i<height; i++){
        this.previous_grid.push(new Array(width));
        for( var j=0; j<this.width; j++){
          this.previous_grid[i][j] = 0;
        }
      }
    }
  
    update_grid() {
      for(var i=0; i<this.height; i++){
        for( var j=0; j<this.width; j++){
          this.previous_grid[i][j] = this.current_grid[i][j];
        }
      }
      
      for(var i=1; i<this.height-1; i++){
        for(var j=1; j<this.width-1; j++){
          this.current_grid[i][j] = (this.previous_grid[i-1][j] + this.previous_grid[i+1][j] + this.previous_grid[i][j-1] + this.previous_grid[i][j+1])/2 - this.current_grid[i][j];
          this.current_grid[i][j] *= this.dampening;
        }
      }
    }
  
    create_ripple(x,y,value){
      if( x < 0 || x >= this.width){
        console.log("Invalid ripple position " +x);
      }
      else if( y < 0 || y >= this.heigth){
        console.log("Invalid ripple position " +y);
      }
      else{this.current_grid[y][x] = value;}
    }
  }