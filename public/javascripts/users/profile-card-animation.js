window.addEventListener("DOMContentLoaded", () => {
  const show = () => {
    hover.classList.add("active");
    modal.classList.add("show");
  };

  const hide = () => {
    hover.classList.remove("active");
    modal.classList.remove("show");
  };
  const image = document.querySelector(".image-profile-card");
  const hover = document.querySelector(".hover-profile-card");
  const modal = document.querySelector(".modal-profile-card");
  const close = document.querySelector(".close-profile-card");

  image.addEventListener("click", show);
  close.addEventListener("click", hide);
});
