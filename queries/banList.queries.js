const BanList = require("../database/models/banList.model");

exports.getBanList = () => {
  return BanList.find({}).sort({ createdAt: -1 }).exec();
};

exports.Ban24H = (userToBan) => {
  const banUser = new BanList({
    username: userToBan[0],
    email: userToBan[1],
    delay: userToBan[2],
  });
  return banUser.save();
};

exports.checkUserBan = (email) => {
  return BanList.findOne({ email }).exec();
};

exports.unBanUser = (email) => {
  return BanList.findOneAndDelete(email).exec();
};
