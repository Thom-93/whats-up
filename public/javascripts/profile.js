window.addEventListener("DOMContentLoaded", () => {
  const inputAvatar = document.querySelector("#input-avatar");
  const formContainer = document.querySelector("#form-container");

  formContainer.addEventListener("click", () => {
    inputAvatar.click();
  });

  inputAvatar.addEventListener("change", () => {
    formContainer.submit();
  });
  const shareLink = document.querySelector(".share-link");

  if (shareLink) {
    shareLink.addEventListener("click", function (event) {
      event.preventDefault();
      const username = this.getAttribute("data");
      const currentURL = window.location.href;
      const baseURL = currentURL.replace(/letters/g, "");

      const newURL = `${baseURL}users/${username}`;

      // Créez un élément temporaire pour le copier dans le presse-papiers
      const tempInput = document.createElement("input");
      tempInput.value = newURL;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);

      alert("URL copiée dans le presse-papiers !");
    });
  }
});
