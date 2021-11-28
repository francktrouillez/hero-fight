async function main() {
  const html_button = document.getElementById("cat_button");
  new InteractiveButton(
    html_button, 
    "./src/view/assets/buttons/sword.png",
    "./src/view/assets/buttons/sword_light.png",
    function() {
      this.setAttribute("type", "hidden");
    }
  )

};

document.addEventListener('DOMContentLoaded', () => {main()});