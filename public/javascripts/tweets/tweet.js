window.addEventListener("DOMContentLoaded", () => {
  bindTweet();
  tweetTime();
  zoomedLetterImg();
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

function zoomedLetterImg() {
  const letterImages = document.querySelectorAll(".letter-image");

  letterImages.forEach((image) => {
    let isZoomed = false;
    image.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("click");
      isZoomed = !isZoomed;
      if (isZoomed) {
        toggleFullscreen(image);
      } else {
        toggleFullscreen(document);
      }
      image.classList.toggle("zoomed", isZoomed);
      const container = image.parentElement;
      container.style.position = isZoomed ? "fixed" : "static";
      container.style.width = isZoomed ? "100%" : "auto";
      container.style.height = isZoomed ? "100%" : "auto";
      window.addEventListener("click", (e) => {
        if (e.target !== image) {
          image.classList.remove("zoomed");
          isZoomed = false;
        }
      });
    });
  });
}

function toggleFullscreen(elem) {
  if (
    !document.fullscreenElement &&
    !document.mozFullScreenElement &&
    !document.webkitFullscreenElement &&
    !document.msFullscreenElement
  ) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

function lettersBtnValidation() {
  const trueBtn = document.querySelectorAll(".validate-btn-true");
  const falseBtn = document.querySelectorAll(".validate-btn-false");

  const divSucess = document.querySelector("#div-delete-sucess");

  const tweetContainer = document.querySelector(
    "#admin-tweet-validation-container"
  );

  let statut = null;

  const updateStatus = (tweetId, statut) => {
    axios
      .put(`/admin/validate/${tweetId}`, { statut: statut })
      .then(function () {
        divSucess.classList.add("active-sucess");
        divSucess.style.display = "block";
        const tweetToDelete = document.querySelector(`i[tweetid="${tweetId}"]`);
        if (tweetToDelete) {
          const tweetElement = tweetToDelete.closest(".tweet-element");
          if (tweetElement) {
            console.log(tweetElement);
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
  if (tweetContainer) {
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
