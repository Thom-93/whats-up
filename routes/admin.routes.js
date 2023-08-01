const router = require("express").Router();
const {
  adminPanel,
  adminTweetDelete,
  adminUserDelete,
  adminTweetValidation,
  adminTweetValidationByMail,
} = require("../controllers/admin.controller");
const { tweetList } = require("../controllers/tweets.controller");

router.get("/:userId", tweetList);
router.get("/:userId/panel", adminPanel);
router.delete("/:tweetId", adminTweetDelete);
router.delete("/users/:userId", adminUserDelete);
router.put("/validate/:tweetId", adminTweetValidation);
router.get("/validate/:userId/:token", adminTweetValidationByMail);

module.exports = router;
