window.addEventListener("DOMContentLoaded", () => {
  bindUser();
});

function bindUser() {
  const elements = document.querySelectorAll(".fa-trash-can");
  const userContainer = document.querySelector("#admin-user-list-container");

  const divSecu = document.querySelector("#div-letter-secu");
  const liSecuYes = document.querySelector("#secu-yes");
  const liSecuNo = document.querySelector("#secu-no");

  if (userContainer) {
    elements.forEach((e) => {
      e.addEventListener("click", ($event) => {
        console.log("click");
        const userId = $event.target.getAttribute("userid");
        if (userId) {
          divSecu.style.visibility = "visible";
          liSecuYes.addEventListener("click", () => {
            deleteUser(userId);
            divSecu.style.visibility = "hidden";
          });

          liSecuNo.addEventListener("click", () => {
            divSecu.style.visibility = "hidden";
          });
        }
      });
    });

    const deleteUser = (userId) => {
      axios
        .delete("/users/" + userId)
        .then(function () {
          location.reload();
        })
        .catch(function (err) {
          console.log(err);
        });
    };
  }
}
