const mongoose = require("mongoose");
const schema = mongoose.Schema;

const forbiddenWordSchema = schema(
  {
    word: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

forbiddenWordSchema.index({ word: 1 });

const ForbiddenWord = mongoose.model("forbiddenWord", forbiddenWordSchema);

module.exports = ForbiddenWord;
