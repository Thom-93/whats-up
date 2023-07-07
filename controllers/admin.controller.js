const {
  getTweets,
  deleteTweet,
  getTweet,
  getCurrentUserTweetsWithFollowing,
} = require("../queries/tweet.queries");
const { getAllUsers, deleteUser } = require("../queries/users.queries");

exports.adminPanel = async (req, res, next) => {
  try {
    const tweets = await getTweets();
    const users = await getAllUsers();
    if (tweets && users) {
      let numberOfUsers = 0;
      users.forEach((user) => {
        numberOfUsers++;
      });
      res.render("admin/admin-panel", {
        numberOfUsers,
        tweets,
        users,
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
