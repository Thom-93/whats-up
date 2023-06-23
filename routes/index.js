const router = require("express").Router();
const { ensureAuthenticated } = require("../config/guards.config");
const tweets = require("./letters.routes");
const users = require("./users.routes");
const auth = require("./auth.routes");
const admin = require("./admin.routes");

router.use("/letters", ensureAuthenticated, tweets);
router.use("/users", users);
router.use("/auth", auth);
router.use("/admin", admin);

router.get("/", (req, res) => {
  res.redirect("/letters");
});

router.get("*", (req, res) => {
  res.redirect("/letters");
});

module.exports = router;
