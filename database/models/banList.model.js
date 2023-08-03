const mongoose = require("mongoose");
const schema = mongoose.Schema;

const banListSchema = schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: { type: String, required: true, unique: true },
    delay: { type: String, required: true, default: null },
  },
  { timestamps: true }
);
const BanList = mongoose.model("banList", banListSchema);

module.exports = BanList;
