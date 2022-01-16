class BumpmappingShadowObject extends BumpmappingObject{
  constructor(gl, obj_content, texture_normals) {
    super(gl, obj_content, texture_normals)
  }

  init_buffers() {
    super.init_buffers()

    const gl = this.gl;

    this.depth_texture = this.gl.createTexture();
    this.depth_texture_size = 4096;
    gl.bindTexture(gl.TEXTURE_2D, this.depth_texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, this.depth_texture_size, this.depth_texture_size, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
    this.depth_frame_buffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.depth_frame_buffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,  gl.TEXTURE_2D, this.depth_texture, 0);

    const unused_texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, unused_texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.depth_texture_size, this.depth_texture_size, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
    // attach it to the framebuffer
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, unused_texture, 0);
  }

  activate_frame_buffer() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.depth_frame_buffer);
    this.gl.viewport(0, 0, this.depth_texture_size, this.depth_texture_size);
    
    this.gl.clearColor(0.2, 0.2, 0.2, 1);
    this.gl.clearDepth(1.0); 
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);


  }

  disable_frame_buffer(save_buffer) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, save_buffer);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    
    this.gl.clearColor(0.2, 0.2, 0.2, 1);
    this.gl.clearDepth(1.0);                 // Clear everything
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
}