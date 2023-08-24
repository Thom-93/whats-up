window.addEventListener("DOMContentLoaded", () => {
  blurImage();
});

function blurImage() {
  const img = document.querySelector(".img-in-pending");
  console.log(img);
  if (img) {
    const btnMoreBlur = document.querySelector(".btn-img-more-flou");
    const btnLessBlur = document.querySelector(".btn-img-less-flou");
    console.log(img.style.filter);

    let blurValue = 30; // valeur initiale de flou

    btnMoreBlur.addEventListener("click", () => {
      blurValue += 1; // augmenter la valeur de flou
      img.style.filter = `blur(${blurValue}px)`;
    });

    btnLessBlur.addEventListener("click", () => {
      blurValue -= 1; // diminuer la valeur de flou (assurez-vous qu'elle ne devienne pas négative)
      if (blurValue < 0) {
        blurValue = 0;
      }
      img.style.filter = `blur(${blurValue}px)`;
    });
  }
}
