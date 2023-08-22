window.addEventListener("DOMContentLoaded", () => {
  const messageInput = document.querySelector(".form-control.input-new-tweet");
  const charCount = document.querySelector(".char-count");

  messageInput.addEventListener("input", () => {
    const message = messageInput.value;
    const remainingChars = 300;
    charCount.textContent = `${message.length}/${remainingChars}`;

    if (message.length >= 300) {
      messageInput.value = message.substring(0, 300 - 1);
      charCount.classList.add("no-more-chars");
    } else {
      charCount.classList.remove("no-more-chars");
    }
  });
});
