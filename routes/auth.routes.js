const router = require("express").Router();
const { checkIfIsLoged } = require("../config/guards.config");
const {
  signinForm,
  signin,
  signout,
} = require("../controllers/auth.controller");

router.get("/signin/form", checkIfIsLoged, signinForm);
router.post("/signin", checkIfIsLoged, signin);
router.get("/signout", signout);

module.exports = router;
