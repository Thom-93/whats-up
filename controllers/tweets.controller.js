const {
  getTweets,
  createTweet,
  deleteTweet,
  getTweet,
  updateTweet,
  getCurrentUserTweetsWithFollowing,
  updateTweetStatus,
} = require("../queries/tweet.queries");
const path = require("path");
const multer = require("multer");
// const upload = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, path.join(__dirname, "../public/images/letters-images"));
//     },
//     filename: (req, file, cb) => {
//       cb(null, `${Date.now()}-${file.originalname}`);
//     },
//   }),
// });
const emailFactory = require("../emails");

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

exports.tweetCreate = [
  // upload.single("image"),
  async (req, res, next) => {
    try {
      let body = req.body;
      if (req.file) {
        body.image = `/images/letters-images/${req.file.filename}`;
      }
      const newletter = await createTweet({ ...body, author: req.user._id });
      body.image && newletter
        ? emailFactory.sendCheckImage({
            to: "thomasxfurax@gmail.com",
            host: req.headers.host,
          })
        : null;
      res.redirect("/letters/letters-last");
    } catch (e) {
      const tweets = await getCurrentUserTweetsWithFollowing(req.user);
      const errors = e.erros
        ? Object.keys(e.errors).map((key) => e.errors[key].message)
        : [e.message];
      res.status(400).render("letters/letters-last", {
        errors,
        tweets,
        tweet: {},
        currentUser: req.user,
        user: req.user,
        isAuthenticated: req.isAuthenticated(),
        currentUser: req.user,
      });
    }
  },
];

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
    const tweets = await getTweets();
    res.render("letters/letters-last", {
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

exports.tweetUpdate = [
  // upload.single("image"),
  async (req, res, next) => {
    const tweetId = req.params.tweetId;
    let statut = null;
    try {
      let body = req.body;
      if (body) {
        if (req.file) {
          console.log("body.image -> req.file.filename");
          body.image = `/images/letters-images/${req.file.filename}`;
        }
        console.log("tweetUpdate -> UpdateTweet");
        await updateTweet(tweetId, body);
        console.log("UpdateTweet -> UpdateTweetStatus");
        await updateTweetStatus(tweetId, statut);
        res.redirect("/letters/letters-last");
      } else {
        throw new Error("Une erreur est survenue veuillez réessayer plus tard");
      }
    } catch (e) {
      const errors = Object.keys(e.errors).map((key) => e.errors[key].message);
      const tweet = await getTweet(tweetId);
      const tweets = await getTweets();
      res.status(400).render("letters/letters-last", {
        errors,
        tweets,
        tweet,
        isAuthenticated: req.isAuthenticated(),
        currentUser: req.user,
        user: req.user,
      });
    }
  },
];

exports.lastLetters = async (req, res, next) => {
  try {
    const tweets = await getTweets();
    res.render("letters/letters-last", {
      tweets,
      tweet: {},
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
      editable: true,
    });
  } catch (e) {
    next(e);
  }
};
