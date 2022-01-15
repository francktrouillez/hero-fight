class InteractiveButton extends Button{
  /* Class to control an interactive button, meaning that the image changes when the cursor is on it */
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