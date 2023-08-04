// Fonction pour détecter la hauteur de l'encoche
function detectNotchHeight() {
  console.log("----------detectNotchHeight----------");
  const notchHeight =
    window.visualViewport && window.visualViewport.height - window.innerHeight;
  console.log("notchHeight", notchHeight);
  return notchHeight || 0;
}

// Appliquer un padding en fonction de la hauteur de l'encoche
function adjustContentForNotch() {
  console.log("----------adjustContentForNotch----------");
  const notchHeight = detectNotchHeight();
  console.log("notchHeight", notchHeight);
  const body = document.querySelector("body");
  console.log("body", body);
  if (body) {
    body.style.paddingTop = `${notchHeight}px`;
  }
}

// Appeler la fonction lors du chargement de la page et lors d'un changement d'orientation
window.addEventListener("load", adjustContentForNotch);
window.addEventListener("orientationchange", adjustContentForNotch);
