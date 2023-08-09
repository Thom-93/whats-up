window.addEventListener("DOMContentLoaded", () => {
  logoFeedbackAnimation();
});

function logoFeedbackAnimation() {
  const logoFeedback = document.getElementById("logo-feedback");
  if (logoFeedback) {
    const images = [
      "../images/utils/logo-feedback/logo-feedback.svg",
      "../images/utils/logo-feedback/logo-feedback-1.png",
      "../images/utils/logo-feedback/logo-feedback-2.png",
      "../images/utils/logo-feedback/logo-feedback-3.png",
    ];

    let currentImage = 0;

    function changeImage() {
      logoFeedback.style.backgroundImage = `url("${images[currentImage]}")`;
      currentImage = (currentImage + 1) % images.length;
    }

    setInterval(changeImage, 1000);
  }
}
