class Button {
  constructor(html_button, image, action) {
    this.html_button = html_button;
    this.html_button.src = image;
    this.html_button.onclick = action
  }

  hide() {
    this.html_button.setAttribute("type", "hidden");
  }

  show() {
    this.html_button.setAttribute("type", "image")
  }

}