const {
  createUser,
  findUserPerUsername,
  searchUsersPerUsername,
  findUserPerId,
  addUserIdToCurrentUserFollowing,
  removeUserIdToCurrentUserFollowing,
  findUserPerEmail,
  deleteUser,
} = require("../queries/users.queries");
const { getUserTweetsFromAuthorId } = require("../queries/tweet.queries");
const path = require("path");
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../public/images/avatars"));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});
const emailFactory = require("../emails");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const User = require("../database/models/user.model");

exports.userList = async (req, res, next) => {
  try {
    const search = req.query.search;
    const users = await searchUsersPerUsername(search);
    res.render("includes/search-menu", { users });
  } catch (e) {
    next(e);
  }
};

exports.userProfile = async (req, res, next) => {
  try {
    const username = req.params.username;
    const user = await findUserPerUsername(username);
    const tweets = await getUserTweetsFromAuthorId(user._id);
    res.render("letters/letter", {
      tweets,
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
      user,
      editable: false,
    });
  } catch (e) {
    next(e);
  }
};

exports.signupForm = (req, res, next) => {
  res.render("users/users-form", {
    errors: null,
    isAuthenticated: req.isAuthenticated(),
    currentUser: req.user,
  });
};

exports.signup = async (req, res, next) => {
  const body = req.body;
  try {
    const user = await createUser(body);
    req.login(user);
    emailFactory.sendEmailVerification({
      to: user.local.email,
      host: req.headers.host,
      username: user.username,
      userId: user._id,
      token: user.local.emailToken,
    });
    res.redirect("/");
  } catch (e) {
    res.render("users/users-form", {
      errors: [e.message],
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
    });
  }
};

exports.uploadImage = [
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      const user = req.user;
      console.log(req.user);
      console.log(`chemin de l'image :${req.file.filename}`);
      user.avatar = `/images/avatars/${req.file.filename}`;
      await user.save();
      res.redirect("/");
    } catch (e) {
      next(e);
    }
  },
];

exports.followUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const [, user] = await Promise.all([
      addUserIdToCurrentUserFollowing(req.user, userId),
      findUserPerId(userId),
    ]);
    res.redirect(`/users/${user.username}`);
  } catch (e) {
    next(e);
  }
};

exports.unfollowUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const [, user] = await Promise.all([
      removeUserIdToCurrentUserFollowing(req.user, userId),
      findUserPerId(userId),
    ]);
    res.redirect(`/users/${user.username}`);
  } catch (e) {
    next(e);
  }
};

exports.emailLinkVerification = async (req, res, next) => {
  try {
    const { userId, token } = req.params;
    const user = await findUserPerId(userId);

    if (user && token && token === user.local.emailToken) {
      user.local.emailVerified = true;
      await user.save();
      return res.redirect("/");
    } else {
      return res.status(400).json("Problem durin email verification");
    }
  } catch (e) {
    next(e);
  }
};

exports.initResetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (email) {
      const user = await findUserPerEmail(email);
      if (user) {
        user.local.passwordToken = uuidv4();
        user.local.passwordTokenExpiration = moment().add(2, "hours").toDate();
        await user.save();
        emailFactory.sendResetPasswordLink({
          to: email,
          host: req.headers.host,
          userId: user._id,
          token: user.local.passwordToken,
        });
        return res.status(200).end();
      }
    }
    return res.status(400).json("Utilisateur inconnu");
  } catch (e) {
    next(e);
  }
};

exports.resetPasswordForm = async (req, res, next) => {
  try {
    const { userId, token } = req.params;
    const user = await findUserPerId(userId);
    if (user && user.local.passwordToken === token) {
      return res.render("auth/auth-reset-password", {
        url: `https://${req.headers.host}/users/reset-password/${user._id}/${user.local.passwordToken}`,
        errors: null,
        isAuthenticated: false,
      });
    } else {
      return res.status(400).json("L'utilisateur n'existe pas !");
    }
  } catch (e) {
    next(e);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { userId, token } = req.params;
    const { password } = req.body;
    const user = await findUserPerId(userId);
    if (
      password &&
      user &&
      user.local.passwordToken === token &&
      moment() < moment(user.local.passwordTokenExpiration)
    ) {
      user.local.password = await User.hashPassword(password);
      user.local.passwordToken = null;
      user.local.passwordTokenExpiration = null;
      await user.save();
      return res.redirect("/");
    } else {
      return res.render("auth/auth-reset-password", {
        url: `https://${req.headers.host}/users/reset-password/${user._id}/${user.local.passwordToken}`,
        errors: ["Une erreur c'est produite"],
        isAuthenticated: false,
      });
    }
  } catch (e) {
    next(e);
  }
};

exports.userDelete = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (userId) {
      await deleteUser(userId);
      res.sendStatus(204);
    } else {
      return res.status(400).json("User not found");
    }
  } catch (e) {
    next(e);
  }
};

exports.profileDelete = async (req, res, next) => {
  try {
    const profileId = req.params.userId;
    if (profileId) {
      await deleteUser(profileId);
      req.logout();
      res.sendStatus(204);
    } else {
      return res.status(400).json("Profile not found");
    }
  } catch (e) {
    next(e);
  }
};
