const router = require("express").Router();
const {
  ensureAuthenticated,
  ensureIsAdmin,
  ensureIsNotBan,
} = require("../config/guards.config");
const tweets = require("./letters.routes");
const users = require("./users.routes");
const auth = require("./auth.routes");
const admin = require("./admin.routes");

router.use("/letters", ensureIsNotBan, ensureAuthenticated, tweets);
router.use("/users", users);
router.use("/auth", auth);
router.use("/admin", ensureIsNotBan, ensureIsAdmin, ensureAuthenticated, admin);

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/letters");
  } else {
    res.redirect("/auth/signin/form");
  }
  res.end();
});

router.get("*", (req, res) => {
  res.redirect("/");
});

module.exports = router;
