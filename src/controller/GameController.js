class GameController {
  constructor(document, render_objects) {
    this.hero_controller = new HeroController(document);
    this.opponent_controller = new OpponentController(document);
    this.game = new Game(this.hero_controller, this.opponent_controller);
    this.animating = false;
    this.animation_steps = 0;
    this.render_objects = render_objects;
  }

  update() {
    this.game.update();
    if (this.animating) {
      this.animation_steps -= 1;
      if (this.animation_steps <= 0) {
        this.animating = false;
        this.game.animating = false;
        this.render_objects[0].object.update = function() {
          return;
        }
      }
    } else if (this.game.animating) {
      this.animating = true;
      if (this.game.state == Game.ANIMATION_REST) {
        this.animation_steps = 300;
        this.render_objects[0].object.update_data = {
          animation: "idle",
          frame_id: 0,
          max_frame: 5
        }
        this.render_objects[0].object.update = function() {
          var frame_buffers = this.obj_vertex_animation[this.update_data.animation][this.update_data.frame_id]
          this.position_buffer = frame_buffers["positions"]
          this.normal_buffer = frame_buffers["normals"]
          this.update_data.frame_id = (this.update_data.frame_id + 1)%this.update_data.max_frame
        }
      } else if (this.game.state == Game.ANIMATION_FIGHTING) {
        this.animation_steps = 30;
        this.render_objects[0].object.update_data = {
          left: 15,
          right: 15
        }
        this.render_objects[0].object.update = function() {
          this.rotate(Math.PI/30, 0.0, 1.0, 0.0);
          if (this.update_data.right > 0) {
            this.translate(0.05, 0.0, 0.0);
            this.update_data.right -= 1;
          } else if (this.update_data.left > 0){
            this.translate(-0.05, 0.0, 0.0);
            this.update_data.left -= 1;
          }
        }
      } else if (this.game.state == Game.ANIMATION_GETTING_XP) {
        this.animation_steps = 30;
        this.render_objects[0].object.update_data = {
          front: 15,
          back: 15
        }
        this.render_objects[0].object.update = function() {
          this.rotate(Math.PI/30, 1.0, 0.0, 0.0);
          if (this.update_data.front > 0) {
            this.translate(0.0, 0.05, 0.0);
            this.update_data.front -= 1;
          } else if (this.update_data.back > 0){
            this.translate(0.0, -0.05, 0.0);
            this.update_data.back -= 1;
          }
        }
      }
    }
  }
}