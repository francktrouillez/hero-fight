async function load_images(urls) {
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

function load_audios(urls) {
  var audios = {}
  for (const url of urls) {
    audios[url] = new Audio(url)
  }
  return audios
}

async function load_shaders(urls) {
  var shaders = {}
  for (const url of urls) {
    shaders[url] = await read_file(url);
  }
  return shaders
}

async function load_objs(urls) {
  var objs = {};
  for (const url of urls) {
    if (typeof url == "string") {
      objs[url] = await read_file(url);
    } else {
      for (let i = 0; i <= url[1]; i++) {
        objs[url[0] + i + ".obj"] = await read_file(url[0] + i + ".obj")
      }
    }
  }
  return objs
}