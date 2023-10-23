window.addEventListener("DOMContentLoaded", () => {
  // Mot de passe perdue Start
  const forgot = document.querySelector("#forgot");
  if (forgot) {
    forgot.addEventListener("click", () => {
      Swal.fire({
        title: "Renseignez votre email",
        input: "email",
        inputPlaceholder: "Enter your email address",
      }).then((result) => {
        const email = result.value.toLowerCase();
        if (email) {
          axios
            .post("/users/forgot-password", {
              email: email,
            })
            .then((response) => {
              swal.fire({
                icon: "success",
                title: "vous avez reçu un email avec les instruction",
              });
            })
            .catch((error) => {
              swal.fire({
                icon: "error",
                title: "Une erreur est survenue",
              });
            });
        }
      });
    });
  }
  // Mot de passe perdue End

  // Formulaire de connexion Start

  const inputs = document.querySelectorAll(".input-field-auth");
  const toggle_btn = document.querySelectorAll(".toggle");
  const main = document.querySelector(".main-auth");
  const bullets = document.querySelectorAll(".bullets span");
  const images = document.querySelectorAll(".image-auth");
  let currentIndex = 0; // Indice de la diapositive actuelle

  inputs.forEach((inp) => {
    inp.addEventListener("focus", () => {
      inp.classList.add("active");
    });
    inp.addEventListener("blur", () => {
      if (inp.value != "") return;
      inp.classList.remove("active");
    });
  });

  toggle_btn.forEach((btn) => {
    btn.addEventListener("click", () => {
      main.classList.toggle("sign-up-mode");
    });
  });

  // Créez une fonction pour passer à la diapositive suivante
  function nextSlide() {
    currentIndex = (currentIndex + 1) % images.length; // Boucle à la première diapositive après la dernière
    showSlide(currentIndex);
  }

  // Fonction pour afficher la diapositive spécifiée
  function showSlide(index) {
    images.forEach((img) => img.classList.remove("show"));
    images[index].classList.add("show");

    const textSlider = document.querySelector(".text-group-auth");
    textSlider.style.transform = `translateY(${-index * 2.5}rem)`;

    bullets.forEach((bull) => bull.classList.remove("active"));
    bullets[index].classList.add("active");
  }

  // Automatisez le changement de diapositive toutes les 5 secondes (5000 millisecondes)
  setInterval(nextSlide, 4000);

  // Gérez le clic sur les balles pour changer de diapositive manuellement
  bullets.forEach((bullet, index) => {
    bullet.addEventListener("click", () => {
      showSlide(index);
      currentIndex = index; // Mettez à jour l'indice actuel
    });
  });

  // Formulaire de connexion End
});
