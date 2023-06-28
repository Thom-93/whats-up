const mongoose = require("mongoose");
const env = require(`../environment/${process.env.NODE_ENV}`);
// const User = require("./models/user.model");

mongoose
  .connect(env.dbUrl, {
    useNewUrlParser: true,
  })
  .then(() => console.log("connexion db ok !"))
  .catch((err) => console.log(err));

// // Création de 50 utilisateurs
// async function createUsers() {
//   try {
//     for (let i = 0; i < 50; i++) {
//       const username = `user${i}`;
//       const email = `user${i}@example.com`;
//       const password = "password123";

//       // Création d'un nouvel utilisateur
//       const user = new User({
//         username: username,
//         local: {
//           email: email,
//           password: await User.hashPassword(password),
//         },
//       });

//       // Sauvegarde de l'utilisateur dans la base de données
//       await user.save();
//     }

//     console.log("50 utilisateurs créés avec succès.");
//   } catch (error) {
//     console.error("Erreur lors de la création des utilisateurs :", error);
//   } finally {
//     // Déconnexion de la base de données après la création des utilisateurs
//     mongoose.disconnect();
//   }
// }

// // Appel de la fonction de création des utilisateurs
// createUsers();
