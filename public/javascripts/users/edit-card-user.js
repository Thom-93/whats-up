document.addEventListener("DOMContentLoaded", () => {
  // Sélectionnez la zone de texte
  const messageTextarea = document.getElementById("edit-card-message");

  // Définissez le nombre maximum de lignes autorisées
  const maxRows = 2; // Par exemple, limitez à 3 lignes

  const initialRows = messageTextarea.rows;
  console.log(initialRows);

  messageTextarea.addEventListener("input", () => {
    // Séparez le contenu de la zone de texte en lignes
    const lines = messageTextarea.value.split("\n");
    console.log(lines.length);

    // Vérifiez si le nombre de lignes dépasse la limite
    if (lines.length + initialRows > maxRows) {
      // Si la limite est atteinte, supprimez les lignes supplémentaires
      messageTextarea.value = lines.slice(0, maxRows).join("\n");
    }
  });
});
