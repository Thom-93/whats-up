const router = require("express").Router();
const {
  adminPanel,
  adminTweetDelete,
  adminUserDelete,
} = require("../controllers/admin.controller");
const { tweetList } = require("../controllers/tweets.controller");

router.get("/:userId", tweetList);
router.get("/:userId/panel", adminPanel);
router.delete("/:tweetId", adminTweetDelete);
router.delete("/users/:userId", adminUserDelete);

module.exports = router;
