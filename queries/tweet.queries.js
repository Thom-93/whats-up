const Tweet = require("../database/models/tweet.model");

exports.getTweet = (tweetId) => {
  return Tweet.findOne({ _id: tweetId }).exec();
};

exports.getTweets = () => {
  return Tweet.find({}).populate("author").sort({ createdAt: -1 }).exec();
};

exports.createTweet = (tweet) => {
  const newTweet = new Tweet(tweet);
  return newTweet.save();
};

exports.deleteTweet = (tweetId) => {
  return Tweet.findByIdAndDelete(tweetId).exec();
};

exports.updateTweet = (tweetId, tweet) => {
  return Tweet.findByIdAndUpdate(
    tweetId,
    { $set: tweet },
    { runValidators: true }
  );
};

exports.updateTweetStatus = (tweetId, statut) => {
  return Tweet.findByIdAndUpdate(
    tweetId,
    { $set: { statut: statut } },
    { runValidators: true }
  );
};

exports.getCurrentUserTweetsWithFollowing = (user) => {
  return Tweet.find({ author: { $in: [...user.following, user._id] } })
    .populate("author")
    .sort({ createdAt: -1 })
    .exec();
};

exports.getUserTweetsFromAuthorId = (authorId) => {
  return Tweet.find({ author: authorId }).populate("author").exec();
};
