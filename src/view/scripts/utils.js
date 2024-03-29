async function read_file(file) {
  const response = await fetch(file);
  const text = await response.text();
  return text;
}

function auto_resize_window(window, canvas, gl, camera) {

 window.addEventListener('resize', resizeCanvas, false);
         
 function resizeCanvas() {
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
   gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
   camera.set_aspect_ratio(gl.canvas.width, gl.canvas.height);
 }
 resizeCanvas();
}

function wait_for_image(image) {
  return new Promise(res => {
    if (image.complete) {
        return res();
    }
    image.onload = () => res();
    image.onerror = () => res();
  });
}

function make_texture_cubemap(gl, folder_url, width=512, height=512) {
  var texture = gl.createTexture();
  
  // We need to specify the type of texture we are using
  // This is useful for the SAMPLER in the shader
  // It will allow us to sample a point in any direction!
  // and not only in (s,t) coordinates
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
   
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
    gl.texImage2D(target, level, internalFormat, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
   
    // Asynchronously load an image
    const image = new Image();
    image.src = url;
    image.addEventListener('load', function() {
      // Now that the image has loaded upload it to the texture.
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
      gl.texImage2D(target, level, internalFormat, format, type, image);
      gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    });
  });
  // Mipmapping for anti aliasing when we are far away from the texture
  gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  
  return texture;
}