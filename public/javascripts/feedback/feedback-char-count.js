window.addEventListener("DOMContentLoaded", () => {
  const messageInput = document.querySelector(".input-new-feedback.message");
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
});
