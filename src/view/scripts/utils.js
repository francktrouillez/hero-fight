async function read_file(file) {
  const response = await fetch(file);
  const text = await response.text();
  return text;
}

function auto_resize_window(window, canvas, gl, aspect) {
  // aspect ratio of the window -> Without that, ratio not respected

 window.addEventListener('resize', resizeCanvas, false);
         
 function resizeCanvas() {
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
   gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
   aspect_ratio = [1.0, 1.0];
   if (gl.canvas.width > gl.canvas.height) {
     aspect_ratio[0] = gl.canvas.height/gl.canvas.width;
   } else {
     aspect_ratio[1] = gl.canvas.width/gl.canvas.height;
   }
   aspect.ratio = aspect_ratio;
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