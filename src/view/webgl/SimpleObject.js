class SimpleObject {

  constructor(gl, texture_object, positions, textures, indexes, num_triangles, update) {
    this.gl = gl;

    this.texture_object = texture_object;

    this.positions = positions;
    this.textures = textures;
    this.indexes = indexes;
    this.num_triangles = num_triangles;
    this.update = update;
    this.update_data = null;

    this.position_buffer = null;
    this.texture_buffer = null;
    this.index_buffer = null;
    this.init_buffers();

    this.model = null;
    this.position = null;
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
    this.position = {
      x: 0, y: 0, z: 0
    }
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

  translate(x, y, z) {
    this.position.x += x;
    this.position.y += y;
    this.position.z += z;
    this.model = glMatrix.mat4.translate(this.model, this.model, glMatrix.vec3.fromValues(x, y, z));
  }

  rotate(value, x, y, z) {
    this.model = glMatrix.mat4.rotate(this.model, this.model, value, glMatrix.vec3.fromValues(x, y, z));
  }

  setXYZ(x, y, z) {
    this.translate(
      x-this.position.x, 
      y-this.position.y,
      z-this.position.z
    );
    this.position = {
      x: x, y: y, z: z
    }
  }

  setAngle(value, x, y, z) {
    this.model = glMatrix.mat4.create();
    this.translate(this.position.x, this.position.y, this.position.z);
    this.rotate(value, x, y, z);
  }

  draw() {
    this.gl.drawElements(this.gl.TRIANGLES, this.num_triangles, this.gl.UNSIGNED_SHORT, 0);
  }
}