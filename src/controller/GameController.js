class GameController {
  constructor(document, render_objects) {
    this.hero_controller = new HeroController(document);
    this.opponent_controller = new OpponentController(document);
    this.game = new Game(this.hero_controller, this.opponent_controller);
    this.animating = false;
    this.animation_steps = 0;
    this.render_objects = render_objects;
  }

  update(fps) {
    return;
    this.game.update();
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
          max_renders: 15*parseInt(fps/30),
          renders_per_frames: parseInt(fps/30)
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
        
        
        this.render_objects["slime"].object.update_data = {}
        this.render_objects["skeleton"].object.update_data = {}
        this.render_objects["dragon"].object.update_data = {}

        this.render_objects["slime"].object.update = function() {}
        this.render_objects["skeleton"].object.update = function() {}
        this.render_objects["dragon"].object.update = function() {}

        this.render_objects["slime"].object.num_vertex = 0;
        this.render_objects["skeleton"].object.num_vertex = 0;
        this.render_objects["dragon"].object.num_vertex = 0;

        if (opponent instanceof A) {
          this.render_objects["slime"].object.update_data = {
            animation: "idle",
            frame_id: 0,
            increment: 1,
            max_renders: 20*parseInt(fps/30),
            renders_per_frames: parseInt(fps/30)*2
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
        } else if (opponent instanceof B) {
          this.render_objects["skeleton"].object.update_data = {
            animation: "idle",
            frame_id: 0,
            max_renders: 80*parseInt(fps/30),
            renders_per_frames: parseInt(fps/30)
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
        } else if (opponent instanceof C) {
          this.render_objects["dragon"].object.update_data = {
            animation: "idle",
            frame_id: 0,
            max_renders: 40*parseInt(fps/30),
            renders_per_frames: parseInt(fps/30)
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
      } else if (this.game.state == Game.ANIMATION_FIGHTING_ATTACK || this.game.state == Game.ANIMATION_FIGHTING_ATTACK_WITH_MONSTER) {
        this.animation_steps = fps/30*20;
        this.render_objects["hero"].object.update_data = {
          animation: "attack",
          frame_id: 0,
          increment: 1,
          max_renders: 20*parseInt(fps/30),
          renders_per_frames: parseInt(fps/30)
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
        if (opponent instanceof A) {
          this.animation_steps = fps/30*15;
          this.render_objects["slime"].object.update_data = {
            animation: "attack",
            frame_id: 0,
            increment: 1,
            max_renders: 15*parseInt(fps/30),
            renders_per_frames: parseInt(fps/30)
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
        } else if (opponent instanceof B) {
          this.animation_steps = fps/30*28;
          this.render_objects["skeleton"].object.update_data = {
            animation: "attack",
            frame_id: 0,
            increment: 1,
            max_renders: 28*parseInt(fps/30),
            renders_per_frames: parseInt(fps/30)
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
        } else if (opponent instanceof C) {
          this.animation_steps = fps/30*40;
          this.render_objects["dragon"].object.update_data = {
            animation: "attack",
            frame_id: 0,
            increment: 1,
            max_renders: 40*parseInt(fps/30),
            renders_per_frames: parseInt(fps/30)
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
        this.animation_steps = fps/30*18;
        this.render_objects["hero"].object.update_data = {
          animation: "buff",
          frame_id: 0,
          increment: 1,
          max_renders: 18*parseInt(fps/30),
          renders_per_frames: parseInt(fps/30)
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
      } else if (this.game.state == Game.ANIMATION_GETTING_XP) {
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
      }
    }
  }
}