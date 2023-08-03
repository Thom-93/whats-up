const ForbiddenWord = require("../database/models/forbiddenWord.model");

// Fonction pour vérifier si une lettre contient des mots interdits
exports.checkForbiddenWords = async (letterContent) => {
  try {
    const forbiddenWords = await ForbiddenWord.find().lean();
    const forbiddenWordList = forbiddenWords.map((word) =>
      word.word.toLowerCase()
    );

    const letterContentLowerCase = letterContent.toLowerCase();

    for (const forbiddenWord of forbiddenWordList) {
      if (letterContentLowerCase.includes(forbiddenWord)) {
        return true; // La lettre contient un mot interdit
      }
    }

    return false; // Aucun mot interdit trouvé dans la lettre
  } catch (error) {
    throw error;
  }
};
