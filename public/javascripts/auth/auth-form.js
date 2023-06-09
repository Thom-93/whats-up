window.addEventListener('DOMContentLoaded', () => {
  // Connexion Start
  const forgot = document.querySelector("#forgot");
  if (forgot) {
    forgot.addEventListener('click', () => {
      Swal.fire({
        title: 'Renseignez votre email',
        input: 'email',
        inputPlaceholder: 'Enter your email address'
      }).then( result => {
        const email = result.value.toLowerCase();
        if (email) {
          axios
          .post('/users/forgot-password', {
            email: email
          }).then( (response) => {
            swal.fire({
              icon: 'success',
              title: 'vous avez reçu un email avec les instruction'
            });
          }).catch( error => {
            swal.fire({
              icon: 'error',
              title: 'Une erreur est survenue'
            });
          });
        }
      })
    });
  }
  // Connexion End


});