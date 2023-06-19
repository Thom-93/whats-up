const { findUserPerEmail } = require("../queries/users.queries");

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
exports.signout = (req, res, next) => {
  req.logout();
  res.redirect("/auth/signin/form");
};
