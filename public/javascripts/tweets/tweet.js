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

  const divSecu = document.querySelector("#div-letter-secu");
  const liSecuYes = document.querySelector("#secu-yes");
  const liSecuNo = document.querySelector("#secu-no");
  if (tweetContainer) {
    elements.forEach((e) => {
      e.addEventListener("click", ($event) => {
        console.log("click");
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
        .then(function () {
          location.reload();
        })
        .catch(function (err) {
          console.log(err);
        });
    };
  }
}
