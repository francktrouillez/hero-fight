async function load_images(values) {
  var image;
  var images = {}
  for (const value of values) {
    if (typeof value == "string") {
      image = new Image();
      image.crossOrigin = "anonymous";
      image.src = value;
      await wait_for_image(image);
      images[value] = image;
    } else if (value[1] == "cubemap") {
      const cubemap_images = [
        "/posx.png", "/posy.png", "/posz.png", 
        "/negx.png", "/negy.png", "/negz.png"
      ]
      for (const cubemap_image of cubemap_images) {
        image = new Image();
        image.crossOrigin = "anonymous";
        image.src = value[0] + cubemap_image;
        await wait_for_image(image);
        images[value[0] + cubemap_image] = image;
      }
    }
    
  }
  return images
}

function load_audios(values) {
  var audios = {}
  for (const audio of values) {
    audios[audio[0]] = new Audio(audio[0])
    audios[audio[0]].volume = audio[1]
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