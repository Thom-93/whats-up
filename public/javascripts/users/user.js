window.addEventListener("DOMContentLoaded", () => {
  bindUser();
});

function bindUser() {
  const elements = document.querySelectorAll(".fa-trash-can");
  const userContainer = document.querySelector("#admin-user-list-container");

  const divSecu = document.querySelector("#div-delete-secu");
  const liSecuYes = document.querySelector("#secu-yes");
  const liSecuNo = document.querySelector("#secu-no");

  const divSucess = document.querySelector("#div-delete-sucess");

  if (userContainer) {
    elements.forEach((e) => {
      e.addEventListener("click", ($event) => {
        const userId = $event.target.getAttribute("userid");
        if (userId) {
          divSecu.style.display = "block";
          liSecuYes.addEventListener("click", () => {
            deleteUser(userId);
            divSecu.style.display = "none";
          });

          liSecuNo.addEventListener("click", () => {
            divSecu.style.display = "none";
          });
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
        const userToDelete = document.querySelector(`i[userid="${userId}"]`);
        if (userToDelete) {
          const userElement = userToDelete.closest(".admin-user-item");
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
