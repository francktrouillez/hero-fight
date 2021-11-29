class XpController {
  constructor(document) {
    this.document = document;
    this.xp_bar = this.document.getElementById("xp_bar");
  }

  set_xp(value) {
    this.xp_bar.src = "./src/view/assets/xp/xp_" + value + ".png";
  } 

  set_full_xp() {
    this.xp_bar.src = "./src/view/assets/xp/xp_10.png";
  } 
}