window.addEventListener("DOMContentLoaded", () => {
  const navbarContainer = document.querySelector("#navbar-container");
  const navbarContent = document.querySelector("#navbar-content");

  scrollFunction = () => {
    if (
      document.body.scrollTop > 50 ||
      document.documentElement.scrollTop > 50
    ) {
      navbarContent.classList.add("fixed-navbar");
      navbarContainer.classList.add("padding-bottom");
      btnTweet.classList.add("show-btn-tweet");
      logoutBtn.classList.add("show-logout-btn");
    } else {
      navbarContent.classList.remove("fixed-navbar");
      navbarContainer.classList.remove("padding-bottom");
      btnTweet.classList.remove("show-btn-tweet");
      logoutBtn.classList.remove("show-logout-btn");
    }
  };

  window.onscroll = () => {
    scrollFunction();
  };
});
