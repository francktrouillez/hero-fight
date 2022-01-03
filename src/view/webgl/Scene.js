class Scene {
  
  static DAY = 0;
  static EVENING = 1;
  static NIGHT = 2;


  constructor(render_objects, lights, programs_settings) {
    /*
    lights = {
      "light_1_id": light_1_object,
      ...
    }
    programs_settings = {
      "program_id": {
        program: program_object,
        lights: lights_list,
        mirror_program: program_object
      },
      ...
    }

    */
    this.all_objects = render_objects

    this.lights = lights;
    this.programs_settings = programs_settings;

    this.current_objects = null;

    this.day_objects = [
      "hero",
      "slime",
      "skeleton",
      "dragon",
      "cubemap",
      "floor",
      "underground",
      "fish",
      "forest",
      "lake"
    ]

    this.evening_objects = [
      "hero",
      "slime",
      "skeleton",
      "dragon",
      "cubemap",
      "floor",
      "underground",
      "fish",
      "forest",
      "lake"
    ]

    this.night_objects = [
      "hero",
      "slime",
      "skeleton",
      "dragon",
      "cubemap",
      "floor",
      "wisp_horde",
      "forest",
      "lake"
    ]
    this.time = null

    this.set_time(Scene.DAY);
  }

  next_time() {
    if (this.time == Scene.DAY) {
      this.set_time(Scene.EVENING);
    } else if (this.time == Scene.EVENING) {
      this.set_time(Scene.NIGHT)
    } else if (this.time == Scene.NIGHT) {
      this.set_time(Scene.DAY);
    }
  }

  set_time(time) {
    if (time == Scene.DAY) {
      this.set_time_day();
    } else if (time == Scene.EVENING) {
      this.set_time_evening()
    } else if (time == Scene.NIGHT) {
      this.set_time_night();
    }
    this.time = time
  }

  set_objects_program(concerned_objects, program, lights){
    for (const object of concerned_objects) {
      if (!(object in this.all_objects)) {
        continue
      }
      this.all_objects[object].set_program(program);
      this.all_objects[object].update_uniform("key_point_ligths", lights)
    }
  }

  set_time_day() {
    // Select the good objects
    this.current_objects = this.day_objects

    // Set the good texture for the cubemap
    this.all_objects["cubemap"].set_texture_time(DynamicCubemap.DAY);

    // Set the good color for the lights
    this.lights["sun"].set_color(1.0, 1.0, 1.0);
    this.lights["sun"].set_ambient(0.45);

    // Set the good program for the objects
    const program_settings = this.programs_settings["only_sun"]
    const concerned_objects = [
      "hero", "forest"
    ]

    for (const object of concerned_objects) {
      if (!(object in this.all_objects)) {
        continue
      }
      this.all_objects[object].set_program(program_settings.program);
      this.all_objects[object].update_uniform("key_point_ligths", program_settings.lights)
    }

    //Set the good program for the bumpmap
    const concerned_bumpmaps = [
      "floor"
    ]
    this.set_objects_program(concerned_bumpmaps, program_settings.bumpmap, program_settings.lights);

    // Set the good program for the potentially exploding objects
    const concerned_exploding_objects = [
      "slime", "skeleton", "dragon"
    ]

    for (const object of concerned_exploding_objects) {
      if (!(object in this.all_objects)) {
        continue
      }
      this.all_objects[object].set_program(program_settings.monsters_program);
      this.all_objects[object].update_uniform("key_point_ligths", program_settings.lights)
    }
    //Set the good program for the mirrors
    const concerned_mirrors = [
      "lake"
    ]
    for (const mirror of concerned_mirrors) {
      if (!(mirror in this.all_objects)) {
        continue
      }
      this.all_objects[mirror].set_program(program_settings.mirror_program);
      this.all_objects[mirror].update_uniform("key_point_ligths", program_settings.lights)
    }

    // Set the good mode for the mirrors
    this.all_objects["lake"].mode = "refraction"


  }

  set_time_evening() {
    // Select the good objects
    this.current_objects = this.evening_objects

    // Set the good texture for the cubemap
    this.all_objects["cubemap"].set_texture_time(DynamicCubemap.EVENING);

    // Set the good color for the lights
    this.lights["sun"].set_color(255/255, 145/255, 65/255);
    this.lights["sun"].set_ambient(0.5);

    // Set the good program for the objects
    const program_settings = this.programs_settings["only_sun"]
    const concerned_objects = [
      "hero", "forest"
    ]

    for (const object of concerned_objects) {
      if (!(object in this.all_objects)) {
        continue
      }
      this.all_objects[object].set_program(program_settings.program);
      this.all_objects[object].update_uniform("key_point_ligths", program_settings.lights)
    }

    //Set the good program for the bumpmap
    const concerned_bumpmaps = [
      "floor"
    ]
    this.set_objects_program(concerned_bumpmaps, program_settings.bumpmap, program_settings.lights);


    // Set the good program for the potentially exploding objects
    const concerned_exploding_objects = [
      "slime", "skeleton", "dragon"
    ]

    for (const object of concerned_exploding_objects) {
      if (!(object in this.all_objects)) {
        continue
      }
      this.all_objects[object].set_program(program_settings.monsters_program);
      this.all_objects[object].update_uniform("key_point_ligths", program_settings.lights)
    }
    //Set the good program for the mirrors
    const concerned_mirrors = [
      "lake"
    ]
    for (const mirror of concerned_mirrors) {
      if (!(mirror in this.all_objects)) {
        continue
      }
      this.all_objects[mirror].set_program(program_settings.mirror_program);
      this.all_objects[mirror].update_uniform("key_point_ligths", program_settings.lights)
    }
    
    // Set the good mode for the mirrors
    this.all_objects["lake"].mode = "refraction"
  }

  set_time_night() {
    // Select the good objects
    this.current_objects = this.night_objects

    // Set the good texture for the cubemap
    this.all_objects["cubemap"].set_texture_time(DynamicCubemap.NIGHT);

    // Set the good color for the lights
    this.lights["sun"].set_color(50/255, 150/255, 163/255);
    this.lights["sun"].set_ambient(0.5);
    // Wisp doesn't need to change their color because it is always the same

    // Set the good program for the objects
    const program_settings = this.programs_settings["full_lights"]
    const concerned_objects = [
      "hero", "forest"
    ]

    for (const object of concerned_objects) {
      if (!(object in this.all_objects)) {
        continue
      }
      this.all_objects[object].set_program(program_settings.program);
      this.all_objects[object].update_uniform("key_point_ligths", program_settings.lights)
    }

    //Set the good program for the bumpmap
    const concerned_bumpmaps = [
      "floor"
    ]
    this.set_objects_program(concerned_bumpmaps, program_settings.bumpmap, program_settings.lights);

    // Set the good program for the potentially exploding objects
    const concerned_exploding_objects = [
      "slime", "skeleton", "dragon"
    ]

    for (const object of concerned_exploding_objects) {
      if (!(object in this.all_objects)) {
        continue
      }
      this.all_objects[object].set_program(program_settings.monsters_program);
      this.all_objects[object].update_uniform("key_point_ligths", program_settings.lights)
    }
    //Set the good program for the mirrors
    const concerned_mirrors = [
      "lake"
    ]
    for (const mirror of concerned_mirrors) {
      if (!(mirror in this.all_objects)) {
        continue
      }
      this.all_objects[mirror].set_program(program_settings.mirror_program);
      this.all_objects[mirror].update_uniform("key_point_ligths", program_settings.lights)
    }
    
    // Set the good mode for the mirrors
    this.all_objects["lake"].mode = "reflexion"
  }

  contains(object_id) {
    return this.current_objects.includes(object_id)
  }



}