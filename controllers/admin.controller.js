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
    res.render("admin/admin-panel", {
      tweets,
      users,
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
      user: req.user,
      editable: true,
    });
  } catch (e) {
    next(e);
  }
};

exports.adminTweetDelete = async (req, res, next) => {
  try {
    const tweetId = req.params.tweetId;
    await deleteTweet(tweetId);
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

exports.adminUserDelete = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await deleteUser(userId);
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};
