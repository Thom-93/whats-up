const mongoose = require("mongoose");
const env = require(`../environment/${process.env.NODE_ENV}`);
// const User = require("./models/user.model");

mongoose
  .connect(env.dbUrl, {
    useNewUrlParser: true,
  })
  .then(() => console.log("connexion db ok !"))
  .catch((err) => console.log(err));
