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
    /*this.gl.bindTexture(this.gl.TEXTURE_2D, this.depth_texture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.depth_texture_size, this.depth_texture_size, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

    this.frame_buffer = this.gl.createFramebuffer();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frame_buffer);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.depth_texture, 0);

    this.depth_buffer = this.gl.createRenderbuffer();
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.depth_buffer);
    this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, this.depth_texture_size, this.depth_texture_size);
    this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.depth_buffer);*/
  }

  activate_frame_buffer() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.depth_frame_buffer);
    this.gl.viewport(0, 0, this.depth_texture_size, this.depth_texture_size);
    
    this.gl.clearColor(0.2, 0.2, 0.2, 1);
    this.gl.clearDepth(1.0); 
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    /*this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);   */


  }

  disable_frame_buffer(save_buffer) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, save_buffer);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    
    this.gl.clearColor(0.2, 0.2, 0.2, 1);
    this.gl.clearDepth(1.0);                 // Clear everything
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
}