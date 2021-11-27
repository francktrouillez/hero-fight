class SimpleObject {

  constructor(gl, positions, textures, indexes, num_triangles) {
    this.gl = gl;

    this.positions = positions;
    this.textures = textures;
    this.indexes = indexes;
    this.num_triangles = num_triangles;

    this.position_buffer = null;
    this.texture_buffer = null;
    this.index_buffer = null;
    this.init_buffers();

    this.model = null;
    this.init_model();
  }

  init_buffers() {
    this.position_buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.position_buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.positions, this.gl.STATIC_DRAW);

    this.texture_buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texture_buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.textures, this.gl.STATIC_DRAW);

    this.index_buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indexes, this.gl.STATIC_DRAW);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
  }

  init_model() {
    this.model = glMatrix.mat4.create();
    this.model = glMatrix.mat4.translate(this.model, this.model, glMatrix.vec3.fromValues(0.5,-0.5,-1.0));
    
  }

  activate(program) {
    const sizeofFloat = Float32Array.BYTES_PER_ELEMENT;
      
    //Vertex positions
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.position_buffer);
    const att_pos = this.gl.getAttribLocation(program, 'aPosition');
    this.gl.enableVertexAttribArray(att_pos);
    this.gl.vertexAttribPointer(att_pos, 3, this.gl.FLOAT, false, 0*sizeofFloat, 0*sizeofFloat);

    // Texture
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texture_buffer);
    const att_textcoord = this.gl.getAttribLocation(program, 'aTexcoord');
    this.gl.enableVertexAttribArray(att_textcoord);
    this.gl.vertexAttribPointer(att_textcoord, 2, this.gl.FLOAT, false, 0*sizeofFloat, 0*sizeofFloat);

    // Indexes
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
  }

  draw() {
    this.gl.drawElements(this.gl.TRIANGLES, this.num_triangles, this.gl.UNSIGNED_SHORT, 0);
  }
}