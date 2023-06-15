window.addEventListener("DOMContentLoaded", () => {
  bindTweet();
  tweetTime();
});

function tweetTime() {
  let timeSpan = document.querySelectorAll(".tweet-time");
  const timeZone = navigator.language;

  timeSpan.forEach((e) => {
    const tweetTime = e.getAttribute("lettertime");
    const tweetDate = new Date(tweetTime);

    // verifie si le tweet est d'aujourd'hui ou d'hier ou d'une autre année
    const time =
      tweetDate.getDate() !== new Date().getDate() &&
      tweetDate.getFullYear() !== new Date().getFullYear()
        ? tweetDate.toLocaleDateString(timeZone) +
          " " +
          tweetDate.toLocaleTimeString(
            timeZone,
            (options = { hour: "2-digit", minute: "2-digit" })
          )
        : tweetDate.getDate() !== new Date().getDate() &&
          tweetDate.getFullYear() == new Date().getFullYear()
        ? tweetDate.toLocaleDateString(
            timeZone,
            (options = { month: "long", day: "numeric" })
          ) +
          " " +
          tweetDate.toLocaleTimeString(
            timeZone,
            (options = { hour: "2-digit", minute: "2-digit" })
          )
        : tweetDate.toLocaleTimeString(timeZone);

    e.innerHTML = `${time}`;
  });
}

function bindTweet() {
  const elements = document.querySelectorAll(".fa-trash-can");
  const tweetContainer = document.querySelector("#tweet-list-container");

  const divSecu = document.querySelector("#div-letter-secu");
  const liSecuYes = document.querySelector("#secu-yes");
  const liSecuNo = document.querySelector("#secu-no");

  if (tweetContainer) {
    elements.forEach((e) => {
      e.addEventListener("click", ($event) => {
        const tweetId = $event.target.getAttribute("tweetid");
        if (tweetId) {
          divSecu.style.visibility = "visible";
          liSecuYes.addEventListener("click", () => {
            deleteLetter(tweetId);
            divSecu.style.visibility = "hidden";
          });

          liSecuNo.addEventListener("click", () => {
            divSecu.style.visibility = "hidden";
          });
        }
      });
    });

    const deleteLetter = (letterId) => {
      axios
        .delete("/letters/" + letterId)
        .then(function (response) {
          tweetContainer.innerHTML = response.data;
          bindTweet();
        })
        .catch(function (err) {
          console.log(err);
        });
    };
  }
}
