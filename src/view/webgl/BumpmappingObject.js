class BumpmappingObject {

  constructor(gl, texture_diffuse, texture_normals, positions, textures, num_vertex, update) {
    this.gl = gl;

    this.texture_diffuse = texture_diffuse;
    this.texture_normals = texture_normals;

    this.positions = positions;
    this.textures = textures;
    this.num_vertex = num_vertex;
    this.update = update;
    this.update_data = null;

    
    // Calculate the different tangent/bitangent vectors for each triangle and associate one to each vertex

    // TODO automatically create vectors for each triangle
    // positions def
    var pos1 = new glMatrix.vec3.fromValues(-10.0, 10.0, 0.0);
    var pos2 = new glMatrix.vec3.fromValues(-10.0, -10.0, 0.0);
    var pos3 = new glMatrix.vec3.fromValues(10.0, -10.0, 0.0);
    var pos4 = new glMatrix.vec3.fromValues(10.0, 10.0, 0.0);
    
    // texture coordinates def
    var uv1 =  glMatrix.vec2.fromValues(0.0,1.0);
    var uv2 =  glMatrix.vec2.fromValues(0.0,0.0);
    var uv3 =  glMatrix.vec2.fromValues(1.0,0.0);
    var uv4 =  glMatrix.vec2.fromValues(1.0,1.0);
  
    // Triangles with 1 = 0,1,2 and 2 = 0,2,3
    let vectors_triangles_tangents = [];
    let vectors_triangles_bitangents = [];
    let vectors_first_triangle = this.generate_vectors([pos1,pos2,pos3], [uv1,uv2,uv3]);
    let vectors_second_triangle = this.generate_vectors([pos1,pos3,pos4], [uv1,uv3,uv4]);

    vectors_triangles_tangents.push(vectors_first_triangle[0]);
    vectors_triangles_tangents.push(vectors_second_triangle[0]);

    vectors_triangles_bitangents.push(vectors_first_triangle[1]);
    vectors_triangles_bitangents.push(vectors_second_triangle[1]);

    // Calculate the normal vectors
    var normal_first = glMatrix.vec3.create();
    var normal_second = glMatrix.vec3.create();
    normal_first = glMatrix.vec3.cross(normal_first, vectors_triangles_tangents[0],vectors_triangles_bitangents[0]);
    normal_second = glMatrix.vec3.cross(normal_second, vectors_triangles_tangents[1], vectors_triangles_bitangents[1]);
    let vectors_triangles_normals = [normal_first, normal_second];

    this.normals = this.float32Array_from_vec3s(vectors_triangles_normals);
    this.tangents = this.float32Array_from_vec3s(vectors_triangles_tangents);
    this.bitangents = this.float32Array_from_vec3s(vectors_triangles_bitangents);

    console.log(this.normals);
    console.log(this.tangents);
    console.log(this.bitangents);
    
    // Buffers
    this.position_buffer = null;
    this.texture_buffer = null;
    this.normal_buffer = null;
    this.tangent_buffer = null;
    this.bitangent_buffer = null;
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

    this.normal_buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normal_buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.normals, this.gl.STATIC_DRAW);

    this.tangent_buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.tangent_buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.tangents, this.gl.STATIC_DRAW);

    this.bitangent_buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bitangent_buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.bitangents, this.gl.STATIC_DRAW);

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

    // Normals
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normal_buffer);
    const att_normal = this.gl.getAttribLocation(program, 'aNormal');
    this.gl.enableVertexAttribArray(att_normal);
    this.gl.vertexAttribPointer(att_normal, 3, this.gl.FLOAT, false, 0*sizeofFloat, 0*sizeofFloat);

    // Tangents
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.tangent_buffer);
    const att_tangent = this.gl.getAttribLocation(program, 'aTangent');
    this.gl.enableVertexAttribArray(att_tangent);
    this.gl.vertexAttribPointer(att_tangent, 3, this.gl.FLOAT, false, 0*sizeofFloat, 0*sizeofFloat);

    // Bitangents
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bitangent_buffer);
    const att_bitangent = this.gl.getAttribLocation(program, 'aBitangent');
    this.gl.enableVertexAttribArray(att_bitangent);
    this.gl.vertexAttribPointer(att_bitangent, 3, this.gl.FLOAT, false, 0*sizeofFloat, 0*sizeofFloat);

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
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.num_vertex);
  }

  // Generate and return the tangent and bitangent vectors for a given triangle
  generate_vectors(positions, textures){
    var tangent = glMatrix.vec3.create();
    var bitangent = glMatrix.vec3.create();
  
    // Calculate the values that will be used to create the tangent/bitangent vectors
    var edge1 = glMatrix.vec3.create();
    edge1 = glMatrix.vec3.sub(edge1, positions[1], positions[0]);
    var edge2 = glMatrix.vec3.create();
    edge2 = glMatrix.vec3.sub(edge2, positions[2], positions[0]);

    var deltaUV1 = glMatrix.vec2.create();
    deltaUV1 = glMatrix.vec2.sub(deltaUV1, textures[1], textures[0]);
    var deltaUV2 = glMatrix.vec2.create();
    deltaUV2 = glMatrix.vec2.sub(deltaUV2, textures[2], textures[0]); 

    // Fill the triangle vectors 
    var f = (1.0 )/ (deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1]);
    tangent[0] = f * (deltaUV2[1] * edge1[0] - deltaUV1[1] * edge2[0]);
    tangent[1] = f * (deltaUV2[1] * edge1[1] - deltaUV1[1] * edge2[1]);
    tangent[2] = f * (deltaUV2[1] * edge1[2] - deltaUV1[1] * edge2[2]);

    bitangent[0] = f * (-deltaUV2[0] * edge1[0] + deltaUV1[0] * edge2[0]);
    bitangent[1] = f * (-deltaUV2[0] * edge1[1] + deltaUV1[0] * edge2[1]);
    bitangent[2] = f * (-deltaUV2[0] * edge1[2] + deltaUV1[0] * edge2[2]);
  
    return [tangent, bitangent]
  }

  float32Array_from_vec3s(vectors){
    let elements = [];

    for (var vect in vectors) {
      for(var i=0; i<3; ++i){
        elements.push( vectors[vect][0]);
        elements.push( vectors[vect][1]);
        elements.push( vectors[vect][2]);
      }
    }

    return new Float32Array(elements);
  }


}