let menuBurger;

window.addEventListener('DOMContentLoaded', () => {
  menuBurger = document.querySelector('#menu-burger');
  burgerContainer = document.querySelector('#burger-container');
  console.log(menuBurger);

  if (menuBurger && burgerContainer) {
    menuBurger.addEventListener('click', () => {
      console.log('click');
    })
  }
})