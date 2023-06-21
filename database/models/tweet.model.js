const mongoose = require("mongoose");
const schema = mongoose.Schema;
const { checkForbiddenWords } = require("../../queries/forbiddenWord.queries");

const tweetSchema = schema(
  {
    content: {
      type: String,
      maxlength: [140, "Lettre trop longue"],
      minlength: [1, "Lettre trop court"],
      required: [true, "Champ requis"],
      validate: {
        validator: async function (words) {
          return !(await checkForbiddenWords(words));
        },
        message: "La lettre contient des mots interdits.",
      },
    },
    author: { type: schema.Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

const Tweet = mongoose.model("tweet", tweetSchema);

module.exports = Tweet;
