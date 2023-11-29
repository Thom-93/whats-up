window.addEventListener("DOMContentLoaded", () => {
  bindAndDeleteProfile();
});

function bindAndDeleteProfile() {
  const elements = document.querySelector("#delete-profile-card-btn");
  const profileContainer = document.querySelector("#form-container");

  const divSecu = document.querySelector("#div-delete-secu");
  const divSucess = document.querySelector("#div-delete-sucess");
  const liSecuYes = document.querySelector("#secu-yes");
  const liSecuNo = document.querySelector("#secu-no");

  if (profileContainer) {
    elements.addEventListener("click", ($event) => {
      const profileId = $event.target.getAttribute("profileid");
      if (profileId) {
        divSecu.style.display = "flex";
        liSecuYes.addEventListener("click", () => {
          deleteProfile(profileId);
          divSecu.style.display = "none";
        });

        liSecuNo.addEventListener("click", () => {
          divSecu.style.display = "none";
        });
      }
    });

    const deleteProfile = (profileId) => {
      axios
        .delete("/users/" + profileId)
        .then(function () {
          location.reload();
        })
        .catch(function (err) {
          console.log(err);
        });
    };
  }
}
