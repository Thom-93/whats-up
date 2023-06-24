window.addEventListener("DOMContentLoaded", () => {
  bindTweet();
  tweetTime();
});

function tweetTime() {
  let timeSpan = document.getElementsByClassName("tweet-time");
  const timeZone = navigator.language;
  const currentDate = new Date();

  for (let i = 0; i < timeSpan.length; i++) {
    const e = timeSpan[i];
    const tweetTime = e.getAttribute("lettertime");
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

    e.innerHTML = time;
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
