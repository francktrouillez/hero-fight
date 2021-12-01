class ComplexObject {

  constructor(gl, obj_content, update) {
    this.gl = gl;

    this.positions = null;
    this.normals = null;
    this.textures = null;

    this.texture_object = null;

    this.num_vertex = null;

    this.load_obj(obj_content);

    this.position_buffer = null;
    this.normal_buffer = null
    this.texture_buffer = null;


    this.init_buffers();

    this.update = update;
    this.update_data = null;


    this.model = null;
    this.position = null;
    this.init_model();

  }

  load_obj(obj_content) {

    var lines = obj_content.split("\n");

    var temp_positions = [];
    var temp_normals = [];
    var temp_textures = [];

    this.positions = [];
    this.normals = [];
    this.textures = [];
   
    for (let i = 0; i < lines.length; i++) {
      var parts = lines[i].trimRight().split(' ');
      if (parts.length > 0 ) {
        if (parts[0] == 'v') {
          temp_positions.push(
            [parseFloat(parts[1]),
            parseFloat(parts[2]),
            parseFloat(parts[3])]
          );
        } else if (parts[0] == 'vn') {
          temp_normals.push(
            [parseFloat(parts[1]),
            parseFloat(parts[2]),
            parseFloat(parts[3])]
          );
        } else if (parts[0] == 'vt') {
          temp_textures.push(
            [parseFloat(parts[1]),
            parseFloat(parts[2])]
          );
        } else if (parts[0] == 'f') {
          // f = vertex/texture/normal vertex/texture/normal vertex/texture/normal
          this.create_face(parts.slice(1), temp_positions, temp_normals, temp_textures);
        } else if (parts[0] == 'usemtl') {
          if (this.texture_object == null) {
            this.texture_object = new Texture(this.gl, images["./src/view/assets/textures/"+parts[1]+".png"]);
          }
        }
      }
    }
    this.num_vertex = this.positions.length/3;
    console.log("Loaded mesh with " + this.num_vertex + " vertices");
  }

  create_face(face, temp_positions, temp_normals, temp_textures) {
    const t1 = face[0].split('/');
    for (let i = 0; i <= face.length - 3; i++) {
      var t2 = face[i+1].split('/');
      var t3 = face[i+2].split('/');
      this.push_triangle(t1, t2, t3, temp_positions, temp_normals, temp_textures);
    }
  }

  push_triangle(t1, t2, t3, temp_positions, temp_normals, temp_textures) {
    this.push_vertex(t1, temp_positions, temp_normals, temp_textures);
    this.push_vertex(t2, temp_positions, temp_normals, temp_textures);
    this.push_vertex(t3, temp_positions, temp_normals, temp_textures);
  }

  push_vertex(v, temp_positions, temp_normals, temp_textures) {
    this.positions = this.positions.concat(temp_positions[parseInt(v[0]) - 1]);
    this.normals = this.normals.concat(temp_normals[parseInt(v[2]) - 1]);
    this.textures = this.textures.concat(temp_textures[parseInt(v[1]) - 1]);
  }

  
  draw() {
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.num_vertex);
  }


  init_buffers() {
    this.position_buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.position_buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.positions), this.gl.STATIC_DRAW);

    this.normal_buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normal_buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.normals), this.gl.STATIC_DRAW);

    this.texture_buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texture_buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.textures), this.gl.STATIC_DRAW);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  init_model() {
    this.model = glMatrix.mat4.create();
    this.position = {
      x: 0, y: 0, z: 0
    }
  }

  activate(program) {
    const sizeofFloat = Float32Array.BYTES_PER_ELEMENT;
      
    // Positions
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.position_buffer);
    const att_pos = this.gl.getAttribLocation(program, 'aPosition');
    this.gl.enableVertexAttribArray(att_pos);
    this.gl.vertexAttribPointer(att_pos, 3, this.gl.FLOAT, false, 0*sizeofFloat, 0*sizeofFloat);

    // Normals
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normal_buffer);
    const att_normal = this.gl.getAttribLocation(program, 'aNormal');
    this.gl.enableVertexAttribArray(att_normal);
    this.gl.vertexAttribPointer(att_normal, 3, this.gl.FLOAT, false, 0*sizeofFloat, 0*sizeofFloat);
    
    // Texture
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texture_buffer);
    const att_textcoord = this.gl.getAttribLocation(program, 'aTexcoord');
    this.gl.enableVertexAttribArray(att_textcoord);
    this.gl.vertexAttribPointer(att_textcoord, 2, this.gl.FLOAT, false, 0*sizeofFloat, 0*sizeofFloat);
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

  
}