const { Ban24H, getBanList } = require("../queries/banList.queries");
const {
  getTweets,
  deleteTweet,
  getTweet,
  getCurrentUserTweetsWithFollowing,
  updateTweetStatus,
} = require("../queries/tweet.queries");
const { getAllUsers, deleteUser } = require("../queries/users.queries");

exports.adminPanel = async (req, res, next) => {
  try {
    const tweets = await getTweets();
    const users = await getAllUsers();
    const userBanList = await getBanList();
    if (tweets && users) {
      let numberOfUsers = 0;
      users.forEach(() => {
        numberOfUsers++;
      });
      let numberOfLetters = 0;
      tweets.forEach(() => {
        numberOfLetters++;
      });
      res.render("admin/admin-panel", {
        numberOfUsers,
        numberOfLetters,
        tweets,
        users,
        userBanList,
        isAuthenticated: req.isAuthenticated(),
        currentUser: req.user,
        user: req.user,
        editable: true,
      });
    } else {
      return res.status(400).json("No tweets or users found");
    }
  } catch (e) {
    next(e);
  }
};

exports.adminTweetDelete = async (req, res, next) => {
  try {
    const tweetId = req.params.tweetId;
    if (tweetId) {
      await deleteTweet(tweetId);
      res.sendStatus(204);
    } else {
      return res.status(400).json("Tweet not found");
    }
  } catch (e) {
    next(e);
  }
};

exports.adminUserDelete = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (userId) {
      await deleteUser(userId);
      res.sendStatus(204);
    } else {
      return res.status(400).json("User not found");
    }
  } catch (e) {
    next(e);
  }
};

exports.adminTweetValidation = async (req, res, next) => {
  try {
    const tweetId = req.params.tweetId;
    const statut = req.body.statut;
    if (tweetId) {
      await updateTweetStatus(tweetId, statut);
      res.sendStatus(204);
    } else {
      return res.status(400).json("Tweet not found");
    }
  } catch (e) {
    next(e);
  }
};

exports.adminTweetValidationByMail = async (req, res, next) => {
  try {
    const { userId, token } = req.params;
    const user = await findUserPerId(userId);

    if (user && token && token === user.local.emailToken) {
      user.local.emailVerified = true;
      await user.save();
      return res.redirect("/");
    } else {
      return res.status(400).json("Problem durin email verification");
    }
  } catch (e) {
    next(e);
  }
};

exports.banUser24H = async (req, res, next) => {
  try {
    const username = req.params.username;
    const userEmail = req.params.userEmail;
    const delay = "24H";
    console.log(username, userEmail);
    if (username && userEmail) {
      const userToBan = [username, userEmail, delay];
      await Ban24H(userToBan);
      res.sendStatus(204);
    } else {
      return res.status(400).json("Problem durin Ban24H");
    }
  } catch (e) {
    next(e);
  }
};
