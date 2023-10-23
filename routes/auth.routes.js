const router = require("express").Router();
const {
  signin,
  signout,
  authForm,
  signup,
} = require("../controllers/auth.controller");

router.get("/form", authForm);
router.post("/sign-in", signin);
router.post("/sign-up", signup);
router.get("/signout", signout);

module.exports = router;
