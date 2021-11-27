class Texture {
  constructor(gl, url) {
    this.url = url;
    this.gl_texture = null;
    this.make_texture(gl)
  }

  make_texture(gl) {
    let gl_texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, gl_texture);
      
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
      
    // Asynchronously load an image
    var image = new Image();
    image.crossOrigin = "anonymous";
    image.src = this.url;
    image.addEventListener('load', function() {
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_2D, gl_texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      // TODO add parameters for filtering and warping!
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    });
    this.gl_texture = gl_texture;
  }
}