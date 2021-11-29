class InteractiveButton extends Button{
  constructor(html_button, image, image_enter, controller, action) {
    super(html_button, image, controller, action)
    this.html_button.onmouseenter = function() {
      this.src = image_enter;
    }
    this.html_button.onmouseleave = function() {
      this.src = image;
    }
  }
}