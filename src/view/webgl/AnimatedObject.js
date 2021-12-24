class AnimatedObject {
  constructor(gl, base_obj, obj_animation_map) {
    /* Structure of obj_animation_map
    {
      name_animation: [
        obj_content_frame_1,
        obj_content_frame_2,
        ...
      ],
      ...
    }
    */
    this.gl = gl;

    this.positions_data_map = null;
    this.normals_data_map = null;

    this.textures_data = null;
    this.triangles_index = null;

    this.texture_object = null;

    this.num_vertex = null;

    this.obj_vertex_animation = null

    this.textures_vertex = null

    this.load_base_obj(base_obj);
    this.load_animation_obj(obj_animation_map);


    this.texture_buffer = null;
    console.log("start")

    this.create_texture_buffer();
    

    this.normal_buffer = null;
    this.position_buffer = null;

    this.init_buffers();

    this.update = null;
    this.update_data = null;
    console.log("done")

    


    this.model = null;
    this.position = null;
    this.init_model();
  }

  load_base_obj(obj_content) {
    var lines = obj_content.split("\n");
    this.textures_data = [];
    this.triangles_index = [];
    for (let i = 0; i < lines.length; i++) {
      var parts = lines[i].trimRight().split(' ');
      if (parts.length > 0 ) {
        if (parts[0] == 'vt') {
          this.textures_data.push(
            [parseFloat(parts[1]),
            parseFloat(parts[2])]
          );
        } else if (parts[0] == 'f') {
          // f = vertex/texture/normal vertex/texture/normal vertex/texture/normal
          this.create_face(parts.slice(1));
        } else if (parts[0] == 'usemtl') {
          if (this.texture_object == null) {
            this.texture_object = new Texture(this.gl, images["./src/view/assets/textures/"+parts[1]+".png"]);
          }
        }
      }
    }
    this.num_vertex = this.triangles_index.length * 3;
    console.log("Loaded mesh with " + this.num_vertex + " vertices");
  }

  create_face(face) {
    const t1 = face[0].split('/');
    for (let i = 0; i <= face.length - 3; i++) {
      var t2 = face[i+1].split('/');
      var t3 = face[i+2].split('/');
      var triangle = [
        [parseInt(t1[0]), parseInt(t1[1]), parseInt(t1[2])],
        [parseInt(t2[0]), parseInt(t2[1]), parseInt(t2[2])],
        [parseInt(t3[0]), parseInt(t3[1]), parseInt(t3[2])]
      ]
      this.triangles_index.push(triangle)
    }
  }

  create_texture_buffer() {
    this.textures_vertex = []
    for (const triangle of this.triangles_index) {
      this.textures_vertex = this.textures_vertex.concat(this.textures_data[triangle[0][1] - 1]);
      this.textures_vertex = this.textures_vertex.concat(this.textures_data[triangle[1][1] - 1]);
      this.textures_vertex = this.textures_vertex.concat(this.textures_data[triangle[2][1] - 1]);
    }
    this.texture_buffer = this.create_buffer(new Float32Array(this.textures_vertex));
  }

  load_animation_obj(obj_animation_map) {
    this.positions_data_map = {}
    this.normals_data_map = {}
    var frame_object_positions;
    var frame_object_normals;
    var lines;
    var parts;
    for (var animation in obj_animation_map) {
      this.positions_data_map[animation] = [];
      this.normals_data_map[animation] = [];
      for (const frame_obj_content of obj_animation_map[animation]) {
        frame_object_positions = []
        frame_object_normals = []

        lines = frame_obj_content.split("\n");
        
        for (let i = 0; i < lines.length; i++) {
          parts = lines[i].trimRight().split(' ');
          if (parts.length > 0 ) {
            if (parts[0] == 'v') {
              frame_object_positions.push(
                [parseFloat(parts[1]),
                parseFloat(parts[2]),
                parseFloat(parts[3])]
              );
            } else if (parts[0] == 'vn') {
              frame_object_normals.push(
                [parseFloat(parts[1]),
                parseFloat(parts[2]),
                parseFloat(parts[3])]
              );
            }
          }
        }
        this.positions_data_map[animation].push(frame_object_positions.slice());     
        this.normals_data_map[animation].push(frame_object_normals.slice());     
      }
    }

  }


  create_buffer(content) {
    var buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, content, this.gl.STATIC_DRAW);
    return buffer;
  }

  init_buffers(){
    this.obj_vertex_animation = {};
    this.textures_vertex = [];

    var positions_data_frame;
    var normals_data_frame;
    var positions_vertex_frame;
    var normals_vertex_frame;
    for (var animation in this.positions_data_map) {
      this.obj_vertex_animation[animation] = []
      for (let i = 0; i < this.positions_data_map[animation].length; i++) {
        console.log(animation + " "+i);
        positions_data_frame = this.positions_data_map[animation][i];
        normals_data_frame = this.normals_data_map[animation][i];
        positions_vertex_frame = []
        normals_vertex_frame = [];
        for (const triangle of this.triangles_index) {
          for (let j = 0; j < 3; j++) {
            positions_vertex_frame = positions_vertex_frame.concat(positions_data_frame[triangle[j][0] - 1])
            normals_vertex_frame =  normals_vertex_frame.concat(normals_data_frame[triangle[j][2] - 1]);
          }
        }
        this.obj_vertex_animation[animation].push({
          "positions": this.create_buffer(new Float32Array(positions_vertex_frame.slice())),
          "normals": this.create_buffer(new Float32Array(normals_vertex_frame.slice()))
        })
      }
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    this.position_buffer = this.obj_vertex_animation["idle"][0]["positions"];
    this.normal_buffer = this.obj_vertex_animation["idle"][0]["normals"];
  }

  push_triangle(t, positions_data, normals_data, positions_vertex, normals_vertex) {
    this.push_vertex(t[0], positions_data, normals_data, positions_vertex, normals_vertex);
    this.push_vertex(t[1], positions_data, normals_data, positions_vertex, normals_vertex);
    this.push_vertex(t[2], positions_data, normals_data, positions_vertex, normals_vertex);
  }

  push_vertex(v, positions_data, normals_data, positions_vertex, normals_vertex) {
    positions_vertex = positions_vertex.concat(positions_data[v[0] - 1])
    normals_vertex =  normals_vertex.concat(normals_data[v[2] - 1]);
  }

  draw() {
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.num_vertex);
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
    console.log(this.normal_buffer)
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

