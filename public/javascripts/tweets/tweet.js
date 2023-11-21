window.addEventListener("DOMContentLoaded", () => {
  bindTweet();
  tweetTime();
  seeLetterImg();
  lettersBtnValidation();
});

function tweetTime() {
  let timeSpan = document.getElementsByClassName("tweet-time");
  const timeZone = navigator.language;
  const currentDate = new Date();

  for (let i = 0; i < timeSpan.length; i++) {
    const e = timeSpan[i];
    const tweetCreateTime = e.getAttribute("lettercreatetime");
    const tweetUpTime = e.getAttribute("letteruptime");

    const tweetTime =
      tweetUpTime === tweetCreateTime ? tweetCreateTime : tweetUpTime;

    const tweetDate = new Date(tweetTime);

    const isSameDate = tweetDate.getDate() === currentDate.getDate();
    const isSameYear = tweetDate.getFullYear() === currentDate.getFullYear();

    // verifie si le tweet est d'aujourd'hui ou d'hier ou d'une autre année
    const time =
      !isSameDate && !isSameYear
        ? `${tweetDate.toLocaleDateString(timeZone)}
          ${tweetDate.toLocaleTimeString(
            timeZone,
            (options = { hour: "2-digit", minute: "2-digit" })
          )}`
        : !isSameDate && isSameYear
        ? `${tweetDate.toLocaleDateString(
            timeZone,
            (options = { month: "long", day: "numeric" })
          )}
          ${tweetDate.toLocaleTimeString(
            timeZone,
            (options = { hour: "2-digit", minute: "2-digit" })
          )}`
        : tweetDate.toLocaleTimeString(timeZone);

    e.innerHTML =
      tweetUpTime === tweetCreateTime
        ? "Publié le " + time
        : "Modifié le " + time;
  }
}

function bindTweet() {
  const elements = document.querySelectorAll(".fa-trash-can");
  const tweetContainer =
    document.querySelector("#tweet-list-container") ||
    document.querySelector("#admin-tweet-list-container");

  const divSecu = document.querySelector("#div-delete-secu");
  const divSucess = document.querySelector("#div-delete-sucess");
  const liSecuYes = document.querySelector("#secu-yes");
  const liSecuNo = document.querySelector("#secu-no");

  if (tweetContainer) {
    elements.forEach((e) => {
      e.addEventListener("click", ($event) => {
        const tweetId = $event.target.getAttribute("tweetid");
        if (tweetId) {
          divSecu.style.display = "flex";
          liSecuYes.addEventListener("click", () => {
            deleteLetter(tweetId);
            divSecu.style.display = "none";
          });

          liSecuNo.addEventListener("click", () => {
            divSecu.style.display = "none";
          });
        }
      });
    });

    const deleteLetter = (tweetId) => {
      axios
        .delete("/letters/" + tweetId)
        .then(function () {
          divSucess.classList.add("active-sucess");
          divSucess.style.display = "block";
          const tweetToDelete = document.querySelector(
            `i[tweetid="${tweetId}"]`
          );
          if (tweetToDelete) {
            const tweetElement = tweetToDelete.closest(".tweet-element");
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
}

function lettersBtnValidation() {
  const trueBtn = document.querySelectorAll(".validate-btn-true");
  const falseBtn = document.querySelectorAll(".validate-btn-false");

  const divSucess = document.querySelector("#div-delete-sucess");

  const tweetValidationContainer = document.querySelector(
    "#admin-tweet-validation-container"
  );

  let statut = null;

  const updateStatus = (tweetId, statut) => {
    axios
      .put(`/admin/validate/${tweetId}`, { statut: statut })
      .then(function () {
        divSucess.classList.add("active-sucess");
        divSucess.style.display = "block";
        const tweetToDelete = tweetValidationContainer.querySelector(
          `i[tweetid="${tweetId}"]`
        );
        if (tweetToDelete) {
          const tweetElement = tweetToDelete.closest(".tweet-element");
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

function seeLetterImg() {
  const letters = document.querySelectorAll(".letter-image");

  letters.forEach((letter) => {
    let isOutSide = false;

    letter.addEventListener("click", (e) => {
      const msg = letter.querySelector(".letter");
      isOutSide = !isOutSide;
      if (isOutSide) {
        msg.style.zIndex = "3";
        letter.style.cursor = "default";
        letter.classList.add("letter-hover");
      }
      window.addEventListener("click", (e) => {
        if (!letter.contains(e.target)) {
          msg.style.zIndex = "1";
          letter.style.cursor = "pointer";
          letter.classList.remove("letter-hover");
          isOutSide = false;
        }
      });
    });
  });
}

// letterImages.forEach((image) => {
//   let isZoomed = false;
//   image.addEventListener("click", (e) => {
//     e.preventDefault();
//     console.log("click");
//     isZoomed = !isZoomed;
//     if (isZoomed) {
//       toggleFullscreen(image);
//     } else {
//       toggleFullscreen(document);
//     }
//     image.classList.toggle("zoomed", isZoomed);
//     const container = image.parentElement;
//     container.style.position = isZoomed ? "fixed" : "static";
//     container.style.width = isZoomed ? "100%" : "auto";
//     container.style.height = isZoomed ? "100%" : "auto";
//     window.addEventListener("click", (e) => {
//       if (e.target !== image) {
//         image.classList.remove("zoomed");
//         isZoomed = false;
//       }
//     });
//   });
// });
