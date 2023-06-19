const mongoose = require("mongoose");
const schema = mongoose.Schema;

const tweetSchema = schema(
  {
    content: {
      type: String,
      maxlength: [140, "Lettre trop longue"],
      minlength: [1, "Lettre trop court"],
      required: [true, "Champs requis"],
    },
    author: { type: schema.Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

const Tweet = mongoose.model("tweet", tweetSchema);

module.exports = Tweet;
