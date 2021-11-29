class Button {
  constructor(html_button, image, controller, action) {
    this.html_button = html_button;
    this.html_button.src = image;
    this.html_button.controller = this;
    this.controller = controller;
    this.html_button.onclick = function() {
      this.controller.action();
    }
    this.action = action;
  }
}