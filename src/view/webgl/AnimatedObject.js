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
    this.textures_data_map = null;

    this.triangles_index_map = null;

    this.texture_object = null;

    this.obj_vertex_animation = null

    this.load_base_txt(base_obj);
    this.load_animation_obj(obj_animation_map);


    this.texture_buffer = null;
    this.normal_buffer = null;
    this.position_buffer = null;
    this.num_vertex = null;

    this.init_buffers();

    this.update = null;
    this.update_data = null;
    this.model = null;
    this.position = null;
    this.init_model();
  }

  load_base_txt(obj_content) {
    var lines = obj_content.split("\n");
    this.textures_data = [];
    this.triangles_index = [];
    for (let i = 0; i < lines.length; i++) {
      var parts = lines[i].trimRight().split(' ');
      if (parts.length > 0 ) {
       if (parts[0] == 'usemtl') {
          if (this.texture_object == null) {
            this.texture_object = new Texture(this.gl, images["./src/view/assets/textures/"+parts[1]+".png"]);
          }
        }
      }
    }
  }

  load_animation_obj(obj_animation_map) {
    this.positions_data_map = {}
    this.normals_data_map = {}
    this.textures_data_map = {}
    this.triangles_index_map = {}
    var frame_object_positions;
    var frame_object_normals;
    var frame_object_textures;
    var frame_object_triangles;
    var lines;
    var parts;
    var triangle;
    for (var animation in obj_animation_map) {
      this.positions_data_map[animation] = [];
      this.normals_data_map[animation] = [];
      this.textures_data_map[animation] = [];
      this.triangles_index_map[animation] = [];
      for (const frame_obj_content of obj_animation_map[animation]) {
        frame_object_positions = []
        frame_object_normals = []
        frame_object_textures = []
        frame_object_triangles = []

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
            } else if (parts[0] == 'vt') {
              frame_object_textures.push(
                [parseFloat(parts[1]),
                parseFloat(parts[2])]
              );
            } else if (parts[0] == 'f') {
              // f = vertex/texture/normal vertex/texture/normal vertex/texture/normal
              triangle = this.create_triangle(parts.slice(1));
              frame_object_triangles.push(triangle);
            } 
          }
        }
        this.positions_data_map[animation].push(frame_object_positions.slice());     
        this.normals_data_map[animation].push(frame_object_normals.slice());   
        this.textures_data_map[animation].push(frame_object_textures.slice()); 
        this.triangles_index_map[animation].push(frame_object_triangles.slice()); 
      }
    }
  }

  
  create_triangle(face) {
    const t1 = face[0].split('/');
    const t2 = face[1].split('/');
    const t3 = face[2].split('/');
    const triangle = [
      [parseInt(t1[0]), parseInt(t1[1]), parseInt(t1[2])],
      [parseInt(t2[0]), parseInt(t2[1]), parseInt(t2[2])],
      [parseInt(t3[0]), parseInt(t3[1]), parseInt(t3[2])]
    ]
    return triangle
  }


  create_buffer(content) {
    var buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, content, this.gl.STATIC_DRAW);
    return buffer;
  }

  init_buffers(){
    this.obj_vertex_animation = {};

    var positions_data_frame;
    var normals_data_frame;
    var textures_data_frame;
    var positions_vertex_frame;
    var normals_vertex_frame;
    var textures_vertex_frame;

    for (var animation in this.positions_data_map) {
      this.obj_vertex_animation[animation] = []
      for (let i = 0; i < this.positions_data_map[animation].length; i++) {
        console.log(animation + " "+i);
        positions_data_frame = this.positions_data_map[animation][i];
        normals_data_frame = this.normals_data_map[animation][i];
        textures_data_frame = this.textures_data_map[animation][i];
        positions_vertex_frame = []
        normals_vertex_frame = [];
        textures_vertex_frame = [];
        for (const triangle of this.triangles_index_map[animation][i]) {
          for (let j = 0; j < 3; j++) {
            positions_vertex_frame = positions_vertex_frame.concat(positions_data_frame[triangle[j][0] - 1])
            normals_vertex_frame =  normals_vertex_frame.concat(normals_data_frame[triangle[j][2] - 1]);
            textures_vertex_frame =  textures_vertex_frame.concat(textures_data_frame[triangle[j][1] - 1]);
          }
        }
        this.obj_vertex_animation[animation].push({
          "positions": this.create_buffer(new Float32Array(positions_vertex_frame.slice())),
          "normals": this.create_buffer(new Float32Array(normals_vertex_frame.slice())),
          "textures": this.create_buffer(new Float32Array(textures_vertex_frame.slice()))
        })
      }
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    this.position_buffer = this.obj_vertex_animation["idle"][0]["positions"];
    this.normal_buffer = this.obj_vertex_animation["idle"][0]["normals"];
    this.texture_buffer = this.obj_vertex_animation["idle"][0]["textures"];
    this.num_vertex = this.triangles_index_map["idle"][0].length * 3;
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

