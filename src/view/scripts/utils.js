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

async function charge_images(urls) {
  var image;
  var images = {}
  for (let i = 0; i < urls.length; i++) {
    image = new Image();
    image.crossOrigin = "anonymous";
    image.src = urls[i];
    await wait_for_image(image);
    images[urls[i]] = image;
  }
  return images
}

function charge_audios(urls) {
  var audios = {}
  for (const url of urls) {
    audios[url] = new Audio(url)
  }
  return audios
}