const {
  getTweets,
  createTweet,
  deleteTweet,
  getTweet,
  updateTweet,
  getCurrentUserTweetsWithFollowing,
} = require("../queries/tweet.queries");

exports.tweetList = async (req, res, next) => {
  try {
    const tweets = await getCurrentUserTweetsWithFollowing(req.user);
    res.render("letters/letter", {
      tweets,
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
      user: req.user,
      editable: true,
    });
  } catch (e) {
    next(e);
  }
};

exports.tweetNew = async (req, res, next) => {
  try {
    const tweets = await getCurrentUserTweetsWithFollowing(req.user);
    res.render("letters/letter-form", {
      tweets,
      tweet: {},
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
      user: req.user,
    });
  } catch (e) {
    next(e);
  }
};

exports.tweetCreate = async (req, res, next) => {
  try {
    const body = req.body;
    await createTweet({ ...body, author: req.user._id });
    res.redirect("/letters");
  } catch (e) {
    const tweets = await getCurrentUserTweetsWithFollowing(req.user);
    const errors = Object.keys(e.errors).map((key) => e.errors[key].message);
    res.status(400).render("letters/letter-form", {
      errors,
      tweets,
      tweet: {},
      currentUser: req.user,
      user: req.user,
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
    });
  }
};

exports.tweetDelete = async (req, res, next) => {
  try {
    const tweetId = req.params.tweetId;
    await deleteTweet(tweetId);
    const tweets = await getCurrentUserTweetsWithFollowing(req.user);
    res.render("letters/letter-list", {
      tweets,
      currentUser: req.user,
      editable: true,
    });
  } catch (e) {
    next(e);
  }
};

exports.tweetEdit = async (req, res, next) => {
  try {
    const tweetId = req.params.tweetId;
    const tweet = await getTweet(tweetId);
    const tweets = await getCurrentUserTweetsWithFollowing(req.user);
    res.render("letters/letter-form", {
      tweet,
      tweets,
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
      user: req.user,
    });
  } catch (e) {
    next(e);
  }
};

exports.tweetUpdate = async (req, res, next) => {
  const tweetId = req.params.tweetId;
  try {
    const body = req.body;
    await updateTweet(tweetId, body);
    res.redirect("/letters");
  } catch (e) {
    const errors = Object.keys(e.errors).map((key) => e.errors[key].message);
    const tweet = await getTweet(tweetId);
    res.status(400).render("letters/letter-form", {
      errors,
      tweet,
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
      user: req.user,
    });
  }
};

exports.lastLetters = async (req, res, next) => {
  try {
    const tweets = await getTweets();
    res.render("letters/letters-last", {
      tweets,
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
      editable: true,
    });
  } catch (e) {
    next(e);
  }
};
