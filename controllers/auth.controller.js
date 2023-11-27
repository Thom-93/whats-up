const { checkUserBan } = require("../queries/banList.queries");
const { checkForbiddenWords } = require("../queries/forbiddenWord.queries");
const {
  findUserPerEmail,
  findUserPerIdAndUpdateLogged,
  createUser,
} = require("../queries/users.queries");
const emailFactory = require("../emails");

exports.authForm = (req, res, next) => {
  res.render("auth/auth-form-v2", {
    errors: null,
    isAuthenticated: req.isAuthenticated(),
    currentUser: req.user,
  });
};

exports.signin = async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      const { email, password } = req.body;
      if (email && password) {
        const user = await findUserPerEmail(email.toLowerCase());
        if (user) {
          const match = await user.comparePassword(password);
          if (match) {
            await findUserPerIdAndUpdateLogged(user._id, true);
            req.login(user);
            res.redirect("/letters");
            return;
          } else {
            res.render("auth/auth-form-v2", { error: "Wrong Password" });
          }
        } else {
          res.render("auth/auth-form-v2", { error: "Email not found" });
        }
      } else {
        res.render("auth/auth-form-v2", { error: "Wrong Email or Password" });
      }
    } else {
      res.redirect("/letters");
    }
  } catch (e) {
    next(e);
  }
};

exports.signup = async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      const body = req.body;
      const usernameCheck = await checkForbiddenWords(body.username);
      if (!usernameCheck) {
        const user = await createUser(body);
        await findUserPerIdAndUpdateLogged(user._id, true);
        req.login(user);
        emailFactory.sendEmailVerification({
          to: user.local.email,
          host: req.headers.host,
          username: user.username,
          userId: user._id,
          token: user.local.emailToken,
        });
        res.redirect("/letters");
      } else {
        throw new Error("Le nom d'utilisateur est interdit");
      }
    } else {
      throw new Error("Vous êtes déjà connecté");
    }
  } catch (e) {
    res.render("auth/auth-form-v2", {
      errors: [e.message],
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
    });
  }
};

exports.signout = async (req, res, next) => {
  try {
    await findUserPerIdAndUpdateLogged(req.user._id, false);
    req.logout();
    res.redirect("/auth/form");
  } catch (e) {
    next(e);
  }
};
