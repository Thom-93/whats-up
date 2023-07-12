const router = require("express").Router();
const { ensureIsNotBot } = require("../config/guards.config");
const {
  tweetList,
  tweetCreate,
  tweetDelete,
  tweetEdit,
  tweetUpdate,
  lastLetters,
} = require("../controllers/tweets.controller");

router.get("/", tweetList);
router.post("/", tweetCreate);
router.get("/edit/:tweetId", tweetEdit);
router.post("/update/:tweetId", tweetUpdate);
router.delete("/:tweetId", tweetDelete);
router.get("/letters-last", lastLetters);

module.exports = router;
