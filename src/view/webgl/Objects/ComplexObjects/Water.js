class Water extends ComplexObject {

  constructor(gl, obj_content, main_camera) {
    super(gl, obj_content, main_camera);

    // Create the ripple generator used by water to update the ripples
    this.ripple_gen = new RipplesGenerator(images[this.image_string].width,images[this.image_string].height, 0.99);
    this.counter_update = 0;
    this.update_limit = 200; //Used to say how many calls need to be done to update to move the ripples
    this.counter_ripples = 0;
    this.ripples_limit = 400;

    this.updated = false;

  }

  activate(program) {

    const sizeofFloat = Float32Array.BYTES_PER_ELEMENT;
    
    // Texture ripples
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texture_buffer);
    const att_textRipplescoord = this.gl.getAttribLocation(program, 'aTexcoord_ripples');
    this.gl.enableVertexAttribArray(att_textRipplescoord);
    this.gl.vertexAttribPointer(att_textRipplescoord, 2, this.gl.FLOAT, false, 0*sizeofFloat, 0*sizeofFloat);
  }

  create_tex_from_pixels(data) {
    var texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    //this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.ripple_gen.width, this.ripple_gen.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    return texture;
}

  update_texture(){
    // Update if the counter reach the correct amount the grid and the pixel array correspondant
    this.counter_update +=1;
    if(this.counter_update % this.update_limit== 0){
      this.updated = true;
      this.ripple_gen.update_grid();
      this.ripple_gen.update_8intarray_from_grid();
      this.texture_object.gl_texture = this.create_tex_from_pixels(this.ripple_gen.pixels);
      this.counter_update = 0;
    }
    
    // Generate ripples randomly, will probably be used in consert with the rain
    this.counter_ripples += 1;
    if(this.counter_ripples % this.ripples_limit== 0){
      var y = Math.floor(Math.random() * this.ripple_gen.height -1)+1;
      var x = Math.floor(Math.random() * this.ripple_gen.width -1)+1;

      this.ripple_gen.create_ripple(x,y);

      this.counter_ripples = 0;
    }
  }

}