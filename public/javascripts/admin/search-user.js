let userContainer;

window.addEventListener("DOMContentLoaded", () => {
  userContainer = document.querySelectorAll(".search-menu-item");

  if (userContainer) {
    userContainer.forEach((user) => {
      console.log(user);
    });

    let searchInput = document.querySelector("#search-user-input");

    searchInput.addEventListener("input", (e) => {
      const value = e.target.value;
      if (value !== "") {
        userContainer.forEach((user) => {
          user.style.display = "none";
          if (user.textContent.toLowerCase().includes(value.toLowerCase())) {
            user.style.display = "flex";
            console.log(user);
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
