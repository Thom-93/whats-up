const {
  getTweets,
  deleteTweet,
  getTweet,
  getCurrentUserTweetsWithFollowing,
} = require("../queries/tweet.queries");
const { getAllUsers } = require("../queries/users.queries");

exports.adminPanel = async (req, res, next) => {
  try {
    const tweets = await getCurrentUserTweetsWithFollowing(req.user);
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
    res.redirect("admin/admin-panel");
  } catch (e) {
    next(e);
  }
};

exports.adminUserDelete = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await deleteUser(userId);
    res.redirect("admin/admin-panel");
  } catch (e) {
    next(e);
  }
};
