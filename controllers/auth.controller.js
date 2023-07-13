const {
  findUserPerEmail,
  findUserPerEmailAndUpdateLogged,
} = require("../queries/users.queries");

exports.signinForm = (req, res, next) => {
  res.render("auth/auth-form", {
    errors: null,
    isAuthenticated: req.isAuthenticated(),
    currentUser: req.user,
  });
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await findUserPerEmail(email.toLowerCase());
      if (user) {
        const match = await user.comparePassword(password);
        if (match) {
          await findUserPerEmailAndUpdateLogged(user._id, true);
          req.login(user);
          res.redirect("/");
        } else {
          res.render("auth/auth-form", { error: "Wrong Password" });
        }
      } else {
        res.render("auth/auth-form", { error: "Email not found" });
      }
    } else {
      res.render("auth/auth-form", { error: "Wrong Email or Password" });
    }
  } catch (e) {
    next(e);
  }
};
exports.signout = async (req, res, next) => {
  try {
    await findUserPerEmailAndUpdateLogged(req.user._id, false);
    req.logout();
    res.redirect("/auth/signin/form");
  } catch (e) {
    next(e);
  }
};
