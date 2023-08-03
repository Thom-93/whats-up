const router = require("express").Router();
const { ensureAuthenticated } = require("../config/guards.config");
const {
  signup,
  signupForm,
  uploadImage,
  userProfile,
  userList,
  followUser,
  unfollowUser,
  emailLinkVerification,
  initResetPassword,
  resetPasswordForm,
  resetPassword,
  profileDelete,
} = require("../controllers/users.controller");

router.get("/", userList);
router.get("/follow/:userId", ensureAuthenticated, followUser);
router.get("/unfollow/:userId", ensureAuthenticated, unfollowUser);
router.get("/:username", ensureAuthenticated, userProfile);
router.get("/signup/form", signupForm);
router.post("/signup", signup);
router.post("/update/image", ensureAuthenticated, uploadImage);
router.get("/email-verification/:userId/:token", emailLinkVerification);
router.post("/forgot-password", initResetPassword);
router.get("/reset-password/:userId/:token", resetPasswordForm);
router.post("/reset-password/:userId/:token", resetPassword);
router.delete("/:userId", ensureAuthenticated, profileDelete);

module.exports = router;
