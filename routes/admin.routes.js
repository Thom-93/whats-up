const router = require("express").Router();
const { ensureAuthenticated } = require("../config/guards.config");
const {
  adminPanel,
  adminTweetDelete,
  adminUserDelete,
} = require("../controllers/admin.controller");
const { tweetList } = require("../controllers/tweets.controller");

router.get("/:userId", ensureAuthenticated, tweetList);
router.get("/:userId/panel", ensureAuthenticated, adminPanel);
router.delete("/:tweetId", ensureAuthenticated, adminTweetDelete);
router.delete("/:userId", adminUserDelete);

module.exports = router;
