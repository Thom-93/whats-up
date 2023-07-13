let userContainer;

window.addEventListener("DOMContentLoaded", () => {
  userContainer = document.querySelectorAll(".search-menu-item");

  if (userContainer) {
    let searchInput = document.querySelector("#search-user-input");

    searchInput.addEventListener("input", (e) => {
      const value = e.target.value;
      if (value !== "") {
        userContainer.forEach((user) => {
          user.style.display = "none";
          if (user.textContent.toLowerCase().includes(value.toLowerCase())) {
            user.style.display = "flex";
          }
        });
      } else {
        userContainer.forEach((user) => {
          user.style.display = "flex";
        });
      }
    });
  }
});
