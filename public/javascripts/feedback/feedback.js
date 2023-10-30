window.addEventListener("DOMContentLoaded", () => {
  // Afficher le nombre de caractères restants dans le champ de texte du message
  const messageInput = document.querySelector(".input-message-feedback");
  const charCount = document.querySelector(".char-count");

  messageInput.addEventListener("input", () => {
    const message = messageInput.value;
    const remainingChars = 1000;
    charCount.textContent = `${message.length}/${remainingChars}`;

    if (message.length >= 1000) {
      messageInput.value = message.substring(0, 1000 - 1);
      charCount.classList.add("no-more-chars");
    } else {
      charCount.classList.remove("no-more-chars");
    }
  });

  // Message de succès après l'envoie du feedback
  const successMessageElement = document.querySelector("#success-message");

  // Vérifiez si l'élément et l'attribut existent
  if (successMessageElement && successMessageElement.dataset.successMessage) {
    const successMessage = successMessageElement.dataset.successMessage;

    // Affichez une boîte de dialogue SweetAlert avec le message de succès
    Swal.fire({
      icon: "success",
      text: successMessage,
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirigez l'utilisateur vers une autre page après avoir cliqué sur "OK"
        window.location.href = "/letters"; // Remplacez par l'URL de redirection souhaitée
      }
    });
  }

  const submitButton = document.querySelector("button.btn-feedback");
  const progressBar = document.querySelector(".progress-bar");

  const formFeedback = document.querySelector(".form-feedback");

  formFeedback.addEventListener("submit", function () {
    submitButton.textContent = "";
    progressBar.style.height = "5px";

    let progress = 0;
    const interval = setInterval(() => {
      progress += 7;
      if (progress > 100) {
        progress = 100;
      }
      progressBar.style.width = progress + "%";

      if (progress >= 100) {
        clearInterval(interval);
        submitButton.textContent = "Send";
        progressBar.style.height = "auto";
      }
    }, 100);
  });
});
