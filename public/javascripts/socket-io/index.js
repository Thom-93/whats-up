window.addEventListener("DOMContentLoaded", () => {
  const logout = document.querySelector("#btn-logout");

  if (logout) {
    logout.addEventListener("click", () => {
      ioClient.emit("close");
    });
  }
});
