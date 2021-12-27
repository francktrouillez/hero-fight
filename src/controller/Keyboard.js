class Keyboard {

  constructor(document) {
    this.bind_listener(document);
  }

  bind_listener(document) {
    document.addEventListener('keydown', (event) => {
      const key = event.key;
      console.log(key)
      try {
        if (key === 'ArrowDown') {
          this.press_down();
        }
        else if (key === 'ArrowUp') {
          this.press_up();
        }
        else if (key === 'ArrowLeft') {
          this.press_left();
        }
        else if (key === 'ArrowRight') {
          this.press_right();
        }
        else if (key === '+') {
          this.press_plus();
        }
        else if (key === '-') {
          this.press_minus();
        }
        else if (key == 'z') {
          this.press_z();
        }
        else if (key == 'q') {
          this.press_q();
        }
        else if (key == 's') {
          this.press_s()
        }
        else if (key == 'd') {
          this.press_d()
        }
      } catch {
        console.log("This key is not bound for the current controller " + this.constructor.name);
      }
    }, false);  
  }
}