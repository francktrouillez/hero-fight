class InteractiveButton extends Button{
  constructor(html_button, image, image_enter, action) {
    super(html_button, image, action)
    this.html_button.onmouseenter = function() {
      this.src = image_enter;
    }
    this.html_button.onmouseleave = function() {
      this.src = image;
    }
  }
}