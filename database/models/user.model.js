const mongoose = require("mongoose");
const schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const { checkForbiddenWords } = require("../../queries/forbiddenWord.queries");

const userSchema = schema({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async function (words) {
        return !(await checkForbiddenWords(words));
      },
      message: "La lettre contient des mots interdits.",
    },
  },
  local: {
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Boolean, default: false },
    emailToken: { type: String },
    password: { type: String, required: true },
    passwordToken: { type: String },
    passwordTokenExpiration: { type: Date },
    admin: { type: Boolean, default: false },
    logged: { type: Boolean, default: false },
  },
  avatar: { type: String, default: "/images/default-profile.svg" },
  following: { type: [schema.Types.ObjectId], ref: "user" },
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hash(password, 12);
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.local.password);
};

const User = mongoose.model("user", userSchema);

module.exports = User;
