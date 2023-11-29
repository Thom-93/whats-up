window.addEventListener("DOMContentLoaded", () => {
  categorieSelect();
  bindAndDeleteTweet();
  bindAndDeleteUser();
  bindAndBanUser();
  blurImage();
  lettersBtnValidation();
  searchUser();
});

function categorieSelect() {
  const dashboardLinks = document.querySelectorAll(".dashboard-sidebar-a");
  const dashboardCategories = document.querySelectorAll(".dashboard-category");
  const indicator = document.querySelector(".indicator-container");

  dashboardLinks.forEach((link) => {
    link.addEventListener("click", () => {
      console.log("link clicked");
      // Supprime la classe "active" de tous les liens
      dashboardLinks.forEach((otherLink) => {
        otherLink.classList.remove("active");
      });

      // Ajoute la classe "active" uniquement au lien cliqué
      link.classList.add("active");

      // Masque toutes les catégories
      dashboardCategories.forEach((category) => {
        category.style.display = "none";
      });

      indicator.style.display = "none";

      const category = link.getAttribute("data-category");
      // Affiche la catégorie correspondante
      const targetCategory = document.querySelector(`${category}`);
      if (targetCategory) {
        targetCategory.style.display = "block";
      }
    });
  });
}

function bindAndDeleteTweet() {
  const deleteButton = document.querySelectorAll(".delete-letter-button");
  const lettersContainer = document.querySelector(
    ".container-dashboard-table-letter"
  );
  const divSucess = document.querySelector("#div-delete-sucess");

  if (lettersContainer) {
    deleteButton.forEach((e) => {
      e.addEventListener("click", ($event) => {
        const tweetId = $event.target.getAttribute("data-tweetid");
        if (tweetId) {
          deleteLetter(tweetId);
        }
      });
    });
  }

  const deleteLetter = (tweetId) => {
    axios
      .delete("/letters/" + tweetId)
      .then(function () {
        divSucess.classList.add("active-sucess");
        divSucess.style.display = "block";
        const tweetToDelete = document.querySelector(
          `button[data-tweetid="${tweetId}"]`
        );
        if (tweetToDelete) {
          const tweetElement = tweetToDelete.closest(".letter-tr-container");
          if (tweetElement) {
            tweetElement.remove(); // Supprimer l'élément tweet
            setTimeout(() => {
              divSucess.classList.remove("active-sucess");
              divSucess.style.display = "none";
            }, 4000);
          }
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };
}

function bindAndDeleteUser() {
  const deleteButton = document.querySelectorAll(".delete-user-button");
  const usersContainer = document.querySelector(
    ".container-dashboard-table-user"
  );
  const divSucess = document.querySelector("#div-delete-sucess");

  if (usersContainer) {
    deleteButton.forEach((e) => {
      e.addEventListener("click", ($event) => {
        const userId = $event.target.getAttribute("data-userid");
        if (userId) {
          deleteUser(userId);
        }
      });
    });
  }

  const deleteUser = (userId) => {
    axios
      .delete("/admin/users/" + userId)
      .then(function () {
        divSucess.classList.add("active-sucess");
        divSucess.style.display = "block";
        const userToDelete = document.querySelector(
          `button[data-userid="${userId}"]`
        );
        if (userToDelete) {
          const userElement = userToDelete.closest(".user-tr-container");
          if (userElement) {
            userElement.remove(); // Supprimer l'élément utilisateur
            setTimeout(() => {
              divSucess.classList.remove("active-sucess");
              divSucess.style.display = "none";
            }, 4000);
          }
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };
}

function bindAndBanUser() {
  const banButton = document.querySelectorAll(".ban-button");
  const usersContainer = document.querySelector(
    ".container-dashboard-table-user"
  );
  const divSucess = document.querySelector("#div-delete-sucess");

  if (usersContainer) {
    banButton.forEach((e) => {
      e.addEventListener("click", ($event) => {
        const userEmail = $event.target.getAttribute("data-userEmail");
        const username = $event.target.getAttribute("data-username");
        if (username && userEmail) {
          banUser(username, userEmail);
        }
      });
    });
  }

  const banUser = (username, userEmail) => {
    axios
      .post(`/admin/users/${username}/${userEmail}/ban24H`)
      .then(function () {
        divSucess.classList.add("active-sucess");
        divSucess.style.display = "block";
        tweetElement.remove(); // Supprimer l'élément tweet
        setTimeout(() => {
          divSucess.classList.remove("active-sucess");
          divSucess.style.display = "none";
        }, 4000);
      })
      .catch(function (err) {
        console.log(err);
      });
  };
}

function blurImage() {
  const img = document.querySelector(".letter-image-validation");
  if (img) {
    const btnMoreBlur = document.querySelector(".btn-img-more-flou");
    const btnLessBlur = document.querySelector(".btn-img-less-flou");

    let blurValue = 15; // valeur initiale de flou

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

function lettersBtnValidation() {
  const trueBtn = document.querySelectorAll(".approve-button");
  const falseBtn = document.querySelectorAll(".reject-button");

  const divSucess = document.querySelector("#div-delete-sucess");

  const tweetValidationContainer = document.querySelector(
    ".container-dashboard-table-image"
  );

  let statut = null;

  const updateStatus = (tweetId, statut) => {
    axios
      .put(`/admin/validate/${tweetId}`, { statut: statut })
      .then(function () {
        divSucess.classList.add("active-sucess");
        divSucess.style.display = "block";
        const tweetToDelete = tweetValidationContainer.querySelector(
          `button[tweetid="${tweetId}"]`
        );
        if (tweetToDelete) {
          const tweetElement = tweetToDelete.closest(".img-tr-validation");
          if (tweetElement) {
            tweetElement.remove(); // Supprimer l'élément tweet
            setTimeout(() => {
              divSucess.classList.remove("active-sucess");
              divSucess.style.display = "none";
            }, 4000);
          }
        }
      })
      .catch(function (err) {
        console.log("Error while updating status:", err);
      });
  };
  if (tweetValidationContainer) {
    trueBtn.forEach((e) => {
      e.addEventListener("click", ($event) => {
        const tweetId = $event.target.getAttribute("tweetid");
        if (tweetId) {
          statut = true;
          updateStatus(tweetId, statut);
        }
      });
    });
    falseBtn.forEach((e) => {
      e.addEventListener("click", ($event) => {
        const tweetId = $event.target.getAttribute("tweetid");
        if (tweetId) {
          statut = false;
          updateStatus(tweetId, statut);
        }
      });
    });
  }
}

function searchUser() {
  const userSearchInput = document.getElementById("user-search");
  const userRows = document.querySelectorAll(".user-tr-container");

  userSearchInput.addEventListener("input", function () {
    const searchTerm = userSearchInput.value.toLowerCase();

    userRows.forEach((row) => {
      const username = row
        .querySelector("td:nth-child(1)")
        .textContent.toLowerCase();
      const pseudo = row
        .querySelector("td:nth-child(2)")
        .textContent.toLowerCase();
      const email = row
        .querySelector("td:nth-child(3)")
        .textContent.toLowerCase();

      if (
        username.includes(searchTerm) ||
        pseudo.includes(searchTerm) ||
        email.includes(searchTerm)
      ) {
        row.style.display = "table-row"; // Afficher la ligne si le terme de recherche correspond
      } else {
        row.style.display = "none"; // Masquer la ligne sinon
      }
    });
  });
}
