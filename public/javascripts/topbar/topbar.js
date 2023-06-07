
window.addEventListener('DOMContentLoaded', () => {
  const navbarContainer = document.querySelector("#navbar-container");
  const navbarContent = document.querySelector("#navbar-content");

  scrollFunction = () => {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
      navbarContent.style.position = "fixed";
      navbarContainer.style.paddingBottom = "3.5em";
    } else {
      navbarContent.style.position = "inherit";
      navbarContainer.style.paddingBottom = "0.5em";
    }
  };

  window.onscroll = () => {scrollFunction()};

})