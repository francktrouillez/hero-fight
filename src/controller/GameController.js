class GameController {
  constructor(document, render_objects, scene) {
    this.hero_controller = new HeroController(document);
    this.opponent_controller = new OpponentController(document);
    this.game = new Game(this.hero_controller, this.opponent_controller);
    this.animating = false;
    this.animation_steps = 0;
    this.render_objects = render_objects;
    this.scene = scene;
    this.is_game_over = false;
  }

  update(fps) {
    this.game.update();
    if (this.game.is_game_over && !this.is_game_over) {
      this.is_game_over = true;
      document.getElementById('game_over_screen').style.visibility = "visible";
      audios["./src/view/assets/sounds/game_over.mp3"].play()
      audios["./src/view/assets/sounds/background.mp3"].pause();
      audios["./src/view/assets/sounds/dragon_flying.mp3"].pause();
      document.getElementById('fight_menu').style.visibility = "hidden";
      document.getElementById('bottom_ath').style.visibility = "hidden";
      document.getElementById('bottom_right_ath').style.visibility = "hidden";
      document.getElementById('top_right_ath').style.visibility = "hidden";
    }
    if (this.is_game_over) {
      return;
    }
    const opponent = this.game.opponent;
    if (this.animating) {
      this.animation_steps -= 1;
      if (this.animation_steps <= 0) {
        this.animating = false;
        this.game.animating = false;
        this.render_objects["hero"].object.update_data = {
          animation: "idle",
          frame_id: 0,
          increment: 1,
          max_renders: 15*Math.max(parseInt(fps/30),1),
          renders_per_frames: Math.max(parseInt(fps/30),1)
        }
        this.render_objects["hero"].object.update = function() {
          const id_frame = parseInt(this.update_data.frame_id/this.update_data.renders_per_frames)
          var frame_buffers = this.obj_vertex_animation[this.update_data.animation][id_frame]
          this.position_buffer = frame_buffers["positions"]
          this.normal_buffer = frame_buffers["normals"]
          this.texture_buffer = frame_buffers["textures"]
          this.num_vertex = this.triangles_index_map[this.update_data.animation][id_frame].length * 3;
          this.update_data.frame_id += this.update_data.increment
          if (this.update_data.frame_id >= this.update_data.max_renders) {
            this.update_data.increment = -1;
          } else if (this.update_data.frame_id <= 0) {
            this.update_data.increment = 1;
          }
        }

        this.render_objects["buff"].object.stop_respawn();
        this.render_objects["dragon_fire"].object.stop_respawn();
        
        this.render_objects["slime"].object.update_data = {}
        this.render_objects["skeleton"].object.update_data = {}
        this.render_objects["dragon"].object.update_data = {}

        this.render_objects["slime"].object.update = function() {}
        this.render_objects["skeleton"].object.update = function() {}
        this.render_objects["dragon"].object.update = function() {}

        this.render_objects["slime"].object.num_vertex = 0;
        this.render_objects["skeleton"].object.num_vertex = 0;
        this.render_objects["dragon"].object.num_vertex = 0;

        this.render_objects["slime"].reset();
        this.render_objects["skeleton"].reset();
        this.render_objects["dragon"].reset();

        if (opponent instanceof Slime) {
          this.render_objects["slime"].object.update_data = {
            animation: "idle",
            frame_id: 0,
            increment: 1,
            max_renders: 20*Math.max(parseInt(fps/30),1),
            renders_per_frames: Math.max(parseInt(fps/30),1)*2
          }
          this.render_objects["slime"].object.update = function() {
            const id_frame = parseInt(this.update_data.frame_id/this.update_data.renders_per_frames)
            var frame_buffers = this.obj_vertex_animation[this.update_data.animation][id_frame]
            this.position_buffer = frame_buffers["positions"]
            this.normal_buffer = frame_buffers["normals"]
            this.texture_buffer = frame_buffers["textures"]
            this.num_vertex = this.triangles_index_map[this.update_data.animation][id_frame].length * 3;
            this.update_data.frame_id = (this.update_data.frame_id + 1)%(this.update_data.max_renders*2)
          }
        } else if (opponent instanceof Skeleton) {
          this.render_objects["skeleton"].object.update_data = {
            animation: "idle",
            frame_id: 0,
            max_renders: 80*Math.max(parseInt(fps/30),1),
            renders_per_frames: Math.max(parseInt(fps/30),1)
          }
          this.render_objects["skeleton"].object.update = function() {
            const id_frame = parseInt(this.update_data.frame_id/this.update_data.renders_per_frames)
            var frame_buffers = this.obj_vertex_animation[this.update_data.animation][id_frame]
            this.position_buffer = frame_buffers["positions"]
            this.normal_buffer = frame_buffers["normals"]
            this.texture_buffer = frame_buffers["textures"]
            this.num_vertex = this.triangles_index_map[this.update_data.animation][id_frame].length * 3;
            this.update_data.frame_id = (this.update_data.frame_id + 1)%(this.update_data.max_renders)
          } 
        } else if (opponent instanceof Dragon) {
          audios["./src/view/assets/sounds/dragon_flying.mp3"].play();
          audios["./src/view/assets/sounds/dragon_flying.mp3"].loop = true
          this.render_objects["dragon"].object.update_data = {
            animation: "idle",
            frame_id: 0,
            max_renders: 40*Math.max(parseInt(fps/30),1),
            renders_per_frames: Math.max(parseInt(fps/30),1)
          }
          this.render_objects["dragon"].object.update = function() {
            const id_frame = parseInt(this.update_data.frame_id/this.update_data.renders_per_frames)
            var frame_buffers = this.obj_vertex_animation[this.update_data.animation][id_frame]
            this.position_buffer = frame_buffers["positions"]
            this.normal_buffer = frame_buffers["normals"]
            this.texture_buffer = frame_buffers["textures"]
            this.num_vertex = this.triangles_index_map[this.update_data.animation][id_frame].length * 3;
            this.update_data.frame_id = (this.update_data.frame_id + 1)%(this.update_data.max_renders)
          }
        }
      }
    } else if (this.game.animating) {
      this.animating = true;
      if (this.game.state == Game.ANIMATION_REST) {
        this.animation_steps = 30;

        this.render_objects["slime"].object.update_data = {}
        this.render_objects["skeleton"].object.update_data = {}
        this.render_objects["dragon"].object.update_data = {}

        this.render_objects["slime"].object.update = function() {}
        this.render_objects["skeleton"].object.update = function() {}
        this.render_objects["dragon"].object.update = function() {}

        this.render_objects["slime"].object.num_vertex = 0;
        this.render_objects["skeleton"].object.num_vertex = 0;
        this.render_objects["dragon"].object.num_vertex = 0;

        audios["./src/view/assets/sounds/dragon_flying.mp3"].pause();
        if (this.game.round % 3 == 0) {
          this.scene.next_time();
        }

      } else if (this.game.state == Game.ANIMATION_FIGHTING_ATTACK || this.game.state == Game.ANIMATION_FIGHTING_ATTACK_WITH_MONSTER) {
        this.animation_steps = fps/30*20 + fps/2;
        this.render_objects["hero"].object.update_data = {
          animation: "attack",
          frame_id: 0,
          increment: 1,
          max_renders: 20*Math.max(parseInt(fps/30),1),
          renders_per_frames: Math.max(parseInt(fps/30),1)
        }
        audios["./src/view/assets/sounds/sword_slash.mp3"].play();
        this.render_objects["hero"].object.update = function() {
          if (this.update_data.frame_id > this.update_data.max_renders) {
            return;
          }
          const id_frame = parseInt(this.update_data.frame_id/this.update_data.renders_per_frames)
          var frame_buffers = this.obj_vertex_animation[this.update_data.animation][id_frame]
          this.position_buffer = frame_buffers["positions"]
          this.normal_buffer = frame_buffers["normals"]
          this.texture_buffer = frame_buffers["textures"]
          this.num_vertex = this.triangles_index_map[this.update_data.animation][id_frame].length * 3;
          this.update_data.frame_id += this.update_data.increment
        }
      } else if (this.game.state == Game.ANIMATION_FIGHTING_MONSTER) {
        if (opponent instanceof Slime) {
          this.animation_steps = fps/30*15 + fps/2;
          audios["./src/view/assets/sounds/slime.mp3"].play()
          this.render_objects["slime"].object.update_data = {
            animation: "attack",
            frame_id: 0,
            increment: 1,
            max_renders: 15*Math.max(parseInt(fps/30),1),
            renders_per_frames: Math.max(parseInt(fps/30),1)
          }
          this.render_objects["slime"].object.update = function() {
            if (this.update_data.frame_id > this.update_data.max_renders) {
              return;
            }
            const id_frame = parseInt(this.update_data.frame_id/this.update_data.renders_per_frames)
            var frame_buffers = this.obj_vertex_animation[this.update_data.animation][id_frame]
            this.position_buffer = frame_buffers["positions"]
            this.normal_buffer = frame_buffers["normals"]
            this.texture_buffer = frame_buffers["textures"]
            this.num_vertex = this.triangles_index_map[this.update_data.animation][id_frame].length * 3;
            this.update_data.frame_id += this.update_data.increment
          }
        } else if (opponent instanceof Skeleton) {
          this.animation_steps = fps/30*28 + fps/2;
          audios["./src/view/assets/sounds/skeleton.mp3"].play();
          this.render_objects["skeleton"].object.update_data = {
            animation: "attack",
            frame_id: 0,
            increment: 1,
            max_renders: 28*Math.max(parseInt(fps/30),1),
            renders_per_frames: Math.max(parseInt(fps/30),1)
          }
          this.render_objects["skeleton"].object.update = function() {
            if (this.update_data.frame_id > this.update_data.max_renders) {
              return;
            }
            const id_frame = parseInt(this.update_data.frame_id/this.update_data.renders_per_frames)
            var frame_buffers = this.obj_vertex_animation[this.update_data.animation][id_frame]
            this.position_buffer = frame_buffers["positions"]
            this.normal_buffer = frame_buffers["normals"]
            this.texture_buffer = frame_buffers["textures"]
            this.num_vertex = this.triangles_index_map[this.update_data.animation][id_frame].length * 3;
            this.update_data.frame_id += this.update_data.increment
          }
        } else if (opponent instanceof Dragon) {
          this.animation_steps = fps/30*40;
          this.render_objects["dragon_fire"].object.start_respawn();
          audios["./src/view/assets/sounds/dragon_fire.mp3"].play();
          this.render_objects["dragon"].object.update_data = {
            animation: "attack",
            frame_id: 0,
            increment: 1,
            max_renders: 40*Math.max(parseInt(fps/30),1),
            renders_per_frames: Math.max(parseInt(fps/30),1)
          }
          this.render_objects["dragon"].object.update = function() {
            if (this.update_data.frame_id > this.update_data.max_renders) {
              return;
            }
            const id_frame = parseInt(this.update_data.frame_id/this.update_data.renders_per_frames)
            var frame_buffers = this.obj_vertex_animation[this.update_data.animation][id_frame]
            this.position_buffer = frame_buffers["positions"]
            this.normal_buffer = frame_buffers["normals"]
            this.texture_buffer = frame_buffers["textures"]
            this.num_vertex = this.triangles_index_map[this.update_data.animation][id_frame].length * 3;
            this.update_data.frame_id += this.update_data.increment
          }
        }
      } else if (this.game.state == Game.ANIMATION_FIGHTING_BUFF) {
        this.animation_steps = fps/30*18 + fps * 1.5;
        audios["./src/view/assets/sounds/buff.mp3"].play()

        if (this.game.hero.action == "buff_attack") {
          console.log("buff attack")
          this.render_objects["buff"].object.set_color([1.0, 0.0, 0.0]);
        } else if (this.game.hero.action == "buff_defense") {
          this.render_objects["buff"].object.set_color([0.0, 0.0, 1.0]);
        } else if (this.game.hero.action == "heal") {
          this.render_objects["buff"].object.set_color([0.0, 1.0, 0.0]);
        }
        this.render_objects["buff"].object.start_respawn();

        this.render_objects["hero"].object.update_data = {
          animation: "buff",
          frame_id: 0,
          increment: 1,
          max_renders: 18*Math.max(parseInt(fps/30),1),
          renders_per_frames: Math.max(parseInt(fps/30),1)
        }
        this.render_objects["hero"].object.update = function() {
          if (this.update_data.frame_id < 0) {
            return;
          }
          const id_frame = parseInt(this.update_data.frame_id/this.update_data.renders_per_frames)
          var frame_buffers = this.obj_vertex_animation[this.update_data.animation][id_frame]
          this.position_buffer = frame_buffers["positions"]
          this.normal_buffer = frame_buffers["normals"]
          this.texture_buffer = frame_buffers["textures"]
          this.num_vertex = this.triangles_index_map[this.update_data.animation][id_frame].length * 3;
          this.update_data.frame_id += this.update_data.increment
          if (this.update_data.frame_id >= this.update_data.max_renders) {
            this.update_data.increment = -1;
          } else if (this.update_data.frame_id < 0) {
            this.update_data.increment = 1;
          }
        }
      } else if (this.game.state == Game.ANIMATION_GETTING_XP) {
        this.animation_steps = 80 * fps/30;

        audios["./src/view/assets/sounds/kill.mp3"].play();
        this.render_objects["slime"].explodes();
        this.render_objects["skeleton"].explodes();
        this.render_objects["dragon"].explodes();
      }
    }
  }
}