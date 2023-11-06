const mongoose = require("mongoose");
const schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    pseudo: {
      type: String,
      required: true,
      default: "Anonyme",
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
    avatar: { type: String, default: "/images/avatars/default.svg" },
    following: { type: [schema.Types.ObjectId], ref: "user" },
    bio: {
      type: String,
      maxlength: [91, "Bio trop longue"],
    },
    socialNetworks: {
      twitter: { type: String },
      facebook: { type: String },
      instagram: { type: String },
    },
  },
  { timestamps: true }
);

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hash(password, 12);
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.local.password);
};

const User = mongoose.model("user", userSchema);

module.exports = User;
