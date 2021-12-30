class CubemapTexture extends Texture {
  constructor(gl, folder_url) {
    super(gl, folder_url)
  }

  make_texture(gl, folder_url) {
    var gl_texture = gl.createTexture();
  
    // We need to specify the type of texture we are using
    // This is useful for the SAMPLER in the shader
    // It will allow us to sample a point in any direction!
    // and not only in (s,t) coordinates
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, gl_texture);
    
    const faceInfos = [
      {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, 
        url: folder_url + '/posx.png',
      },
      {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 
        url: folder_url + '/negx.png',
      },
      {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 
        url: folder_url + '/posy.png',
      },
      {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 
        url: folder_url + '/negy.png',
      },
      {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 
        url: folder_url + '/posz.png',
      },
      {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 
        url: folder_url + '/negz.png',
      },
    ];
    
    faceInfos.forEach((faceInfo) => {
      const {target, url} = faceInfo;
      // Upload the canvas to the cubemap face.
      // setup each face so it's immediately renderable
      const level = 0;
      const internalFormat = gl.RGBA;
      const format = gl.RGBA;
      const type = gl.UNSIGNED_BYTE;
      gl.texImage2D(target, level, internalFormat, 512, 512, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      // Now that the image has loaded upload it to the texture.
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, gl_texture);
      gl.texImage2D(target, level, internalFormat, format, type, images[url]);
    });
    // Mipmapping for anti aliasing when we are far away from the texture
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    
    this.gl_texture = gl_texture
  }
}