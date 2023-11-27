const User = require("../database/models/user.model");
const { v4: uuidv4 } = require("uuid");

exports.getAllUsers = () => {
  return User.find({}).sort({ createdAt: -1 }).exec();
};

exports.deleteUser = (userId) => {
  return User.findByIdAndDelete(userId).exec();
};

exports.createUser = async (user) => {
  try {
    const hashedPassword = await User.hashPassword(user.password);
    const newUser = new User({
      username: user.username,
      local: {
        email: user.email.toLowerCase(),
        password: hashedPassword,
        emailToken: uuidv4(),
      },
    });
    return newUser.save();
  } catch (e) {
    throw e;
  }
};

exports.findUserPerEmail = (email) => {
  return User.findOne({ "local.email": email }).exec();
};

exports.findUserPerId = (id) => {
  return User.findById(id).exec();
};

exports.findUserPerUsername = (username) => {
  return User.findOne({ username }).exec();
};

exports.searchUsersPerUsername = (search) => {
  const regExp = `^${search}`;
  const reg = new RegExp(regExp);
  return User.find({ username: { $regex: reg } }).exec();
};

exports.addUserIdToCurrentUserFollowing = (currentUser, userId) => {
  currentUser.following = [...currentUser.following, userId];
  return currentUser.save();
};

exports.removeUserIdToCurrentUserFollowing = (currentUser, userId) => {
  currentUser.following = currentUser.following.filter(
    (objId) => objId.toString() !== userId
  );
  return currentUser.save();
};

exports.countUserFollowers = (userId) => {
  return User.countDocuments({ following: userId });
};

exports.findUserPerIdAndUpdateLogged = (id, value) => {
  return User.findOneAndUpdate(id, { $set: { "local.logged": value } }).exec();
};

exports.getAllUsersLogged = () => {
  return User.find({ "local.logged": true }).exec();
};

exports.updateCardUser = (userId, updatedData) => {
  return User.findByIdAndUpdate(
    userId,
    {
      $set: {
        pseudo: updatedData.pseudo,
        bio: updatedData.bio,
        "socialNetworks.twitter": updatedData.twitter,
        "socialNetworks.facebook": updatedData.facebook,
        "socialNetworks.instagram": updatedData.instagram,
      },
    },
    { runValidators: true }
  );
};

exports.findUserIdAndUpdateLastActiveTime = (id, value) => {
  return User.findByIdAndUpdate(id, { $set: { lastActiveTime: value } }).exec();
};
