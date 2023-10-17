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
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../public/images/letters-images"));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});
const emailFactory = require("../emails");
const fs = require("fs");
const sharp = require("sharp");

exports.tweetList = async (req, res, next) => {
  try {
    const tweets = await getCurrentUserTweetsWithFollowing(req.user);
    if (tweets) {
      res.render("letters/letter", {
        tweets,
        isAuthenticated: req.isAuthenticated(),
        currentUser: req.user,
        user: req.user,
        editable: true,
      });
    } else {
      return res.status(400).json("No tweets found");
    }
  } catch (e) {
    next(e);
  }
};

exports.tweetCreate = [
  upload.single("image"),
  async (req, res, next) => {
    try {
      let body = req.body;
      if (req.file) {
        const extension = path.extname(req.file.originalname);
        if (
          (extension !== ".png" &&
            extension !== ".jpg" &&
            extension !== ".jpeg" &&
            extension !== ".gif") ||
          !extension
        ) {
          fs.unlinkSync(req.file.path);
          throw new Error(
            "Extension de l'image non valide, only (.png, .jpg, .jpeg, .gif)"
          );
        }
        const imageSize = req.file.size / 1000 / 1000;
        if (imageSize > 10) {
          fs.unlinkSync(req.file.path);
          throw new Error("Image trop grande, max 10Mo");
        }
        if (extension !== ".gif") {
          const webpBuffer = await sharp(req.file.path).webp().toBuffer();
          const webpFilename = `${req.file.filename}.webp`;
          fs.writeFileSync(
            `public/images/letters-images/${webpFilename}`,
            webpBuffer
          );
          body.image = `/images/letters-images/${webpFilename}`;
          fs.unlinkSync(req.file.path);
        } else {
          body.image = `/images/letters-images/${req.file.filename}`;
        }
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
    if (tweetId) {
      const tweet = await getTweet(tweetId);
      if (!tweet) {
        return res.status(404).json({ message: "Tweet not found" });
      }
      if (
        tweet.image &&
        fs.existsSync(path.join(__dirname, `../public/${tweet.image}`))
      ) {
        fs.unlinkSync(path.join(__dirname, `../public/${tweet.image}`));
      }
      await deleteTweet(tweetId);
      const tweets = await getCurrentUserTweetsWithFollowing(req.user);
      res.render("letters/letter-list", {
        tweets,
        currentUser: req.user,
        editable: true,
      });
    } else {
      throw new Error("Une erreur est survenue veuillez réessayer plus tard");
    }
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
  upload.single("image"),
  async (req, res, next) => {
    const tweetId = req.params.tweetId;
    let statut = null;
    try {
      let body = req.body;
      if (body) {
        console.log(body.oldImage);
        if (req.file) {
          const extension = path.extname(req.file.originalname);
          if (extension !== ".gif") {
            const webpBuffer = await sharp(req.file.path).webp().toBuffer();
            const webpFilename = `${req.file.filename}.webp`;
            fs.writeFileSync(
              `public/images/letters-images/${webpFilename}`,
              webpBuffer
            );
            body.image = `/images/letters-images/${webpFilename}`;
            fs.unlinkSync(req.file.path);
          } else {
            body.image = `/images/letters-images/${req.file.filename}`;
          }
          if (
            body.oldImage &&
            fs.existsSync(path.join(__dirname, `../public/${body.oldImage}`))
          ) {
            fs.unlinkSync(path.join(__dirname, `../public/${body.oldImage}`));
          }
        }
        await updateTweet(tweetId, body);
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
