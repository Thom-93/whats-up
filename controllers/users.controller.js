const {
  createUser,
  findUserPerUsername,
  searchUsersPerUsername,
  findUserPerId,
  addUserIdToCurrentUserFollowing,
  removeUserIdToCurrentUserFollowing,
  findUserPerEmail,
  deleteUser,
  findUserPerEmailAndUpdateLogged,
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
const fs = require("fs");
const { checkForbiddenWords } = require("../queries/forbiddenWord.queries");
const sharp = require("sharp");

exports.userList = async (req, res, next) => {
  try {
    const search = req.query.search;
    if (search) {
      const users = await searchUsersPerUsername(search);
      if (users) {
        res.render("includes/search-menu", { users });
      } else {
        return res.status(400).json("No users found");
      }
    } else {
      return res.status(400).json("search is empty");
    }
  } catch (e) {
    next(e);
  }
};

exports.userProfile = async (req, res, next) => {
  try {
    const username = req.params.username;
    if (username) {
      const user = await findUserPerUsername(username);
      if (user) {
        const tweets = await getUserTweetsFromAuthorId(user._id);
        if (tweets) {
          res.render("letters/letter", {
            tweets,
            isAuthenticated: req.isAuthenticated(),
            currentUser: req.user,
            user,
            editable: false,
          });
        } else {
          return res.status(400).json("No tweets found");
        }
      } else {
        return res.status(400).json("No user found");
      }
    } else {
      return res.status(400).json("username is empty");
    }
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

exports.feedbackForm = (req, res, next) => {
  res.render("users/feedback-form", {
    errors: null,
    isAuthenticated: req.isAuthenticated(),
    currentUser: req.user,
  });
};

exports.signup = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    const body = req.body;
    try {
      const usernameCheck = await checkForbiddenWords(body.username);
      if (!usernameCheck) {
        const user = await createUser(body);
        await findUserPerEmailAndUpdateLogged(user._id, true);
        req.login(user);
        emailFactory.sendEmailVerification({
          to: user.local.email,
          host: req.headers.host,
          username: user.username,
          userId: user._id,
          token: user.local.emailToken,
        });
        res.redirect("/");
      } else {
        throw new Error("Le nom d'utilisateur est interdit");
      }
    } catch (e) {
      res.render("users/users-form", {
        errors: [e.message],
        isAuthenticated: req.isAuthenticated(),
        currentUser: req.user,
      });
    }
  } else {
    res.redirect("/");
  }
};

exports.sendFeedback = async (req, res, next) => {
  if (req.isAuthenticated()) {
    const body = req.body;
    const email = req.user.local.email;
    const subject = body.subject;
    const message = body.message;
    const username = req.user.username;

    if (!email || !subject || !message) {
      return res.status(400).json("email, subject or message is empty");
    } else if (email.length > 255 || subject.length > 255) {
      return res.status(400).json("email or subject is too long");
    } else if (message.length > 1000) {
      return res.status(400).json("message is too long");
    }

    try {
      const messageCheck = await checkForbiddenWords(message);
      const subjectCheck = await checkForbiddenWords(subject);

      if (!messageCheck && !subjectCheck) {
        emailFactory.sendEmailFeedback({
          host: req.headers.host,
          username: username,
          email: email,
          subject: subject,
          message: message,
        });
        res.redirect("/");
      } else {
        throw new Error("il y a des mots interdit");
      }
    } catch (e) {
      res.render("users/feedback-form", {
        errors: [e.message],
        isAuthenticated: req.isAuthenticated(),
        currentUser: req.user,
      });
    }
  } else {
    res.redirect("/");
  }
};

exports.uploadImage = [
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      const extension = path.extname(req.file.originalname);
      if (
        (extension !== ".png" &&
          extension !== ".jpg" &&
          extension !== ".jpeg" &&
          extension !== ".gif") ||
        !extension
      ) {
        fs.unlinkSync(req.file.path);
        throw new Error(
          "Extension de l'image non valide, only (.png, .jpg, .jpeg, .gif)"
        );
      }
      const imageSize = req.file.size / 1000 / 1000;
      if (imageSize > 10) {
        fs.unlinkSync(req.file.path);
        throw new Error("Image trop grande, max 10Mo");
      }
      const user = req.user;
      if (user) {
        if (extension !== ".gif") {
          const webpBuffer = await sharp(req.file.path).webp().toBuffer();
          const webpFilename = `${req.file.filename}.webp`;
          fs.unlinkSync(path.join(__dirname, `../public/${user.avatar}`));
          fs.writeFileSync(`public/images/avatars/${webpFilename}`, webpBuffer);
          user.avatar = `/images/avatars/${webpFilename}`;
          fs.unlinkSync(req.file.path);
        } else {
          user.avatar = `/images/avatars/${req.file.filename}`;
        }
        await user.save();
        res.redirect("/");
      } else {
        throw new Error("No user found");
      }
    } catch (e) {
      next(e);
    }
  },
];

exports.followUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (userId) {
      const [, user] = await Promise.all([
        addUserIdToCurrentUserFollowing(req.user, userId),
        findUserPerId(userId),
      ]);
      res.redirect(`/users/${user.username}`);
    } else {
      return res.status(400).json("user id not found");
    }
  } catch (e) {
    next(e);
  }
};

exports.unfollowUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (userId) {
      const [, user] = await Promise.all([
        removeUserIdToCurrentUserFollowing(req.user, userId),
        findUserPerId(userId),
      ]);
      res.redirect(`/users/${user.username}`);
    } else {
      return res.status(400).json("user id not found");
    }
  } catch (e) {
    next(e);
  }
};

exports.emailLinkVerification = async (req, res, next) => {
  try {
    const { userId, token } = req.params;
    if (userId) {
      const user = await findUserPerId(userId);
      if (user && token && token === user.local.emailToken) {
        user.local.emailVerified = true;
        await user.save();
        return res.redirect("/");
      } else {
        return res.status(400).json("user not found or token invalid");
      }
    } else {
      return res.status(400).json("user id not found");
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
      } else {
        return res.status(400).json("user not found");
      }
    } else {
      return res.status(400).json("email is empty");
    }
  } catch (e) {
    next(e);
  }
};

exports.resetPasswordForm = async (req, res, next) => {
  try {
    const { userId, token } = req.params;
    if (userId) {
      const user = await findUserPerId(userId);
      if (user && user.local.passwordToken === token) {
        return res.render("auth/auth-reset-password", {
          url: `https://${req.headers.host}/users/reset-password/${user._id}/${user.local.passwordToken}`,
          errors: null,
          isAuthenticated: false,
        });
      } else {
        return res.status(400).json("user not found or token invalid");
      }
    } else {
      return res.status(400).json("user id not found");
    }
  } catch (e) {
    next(e);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { userId, token } = req.params;
    const { password } = req.body;
    if (userId) {
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
    } else {
      return res.status(400).json("user id not found");
    }
  } catch (e) {
    next(e);
  }
};

exports.userDelete = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (userId) {
      const user = await findUserPerId(userId);
      if (user) {
        if (user.avatar && user.avatar !== "/images/avatars/default.svg") {
          fs.unlinkSync(path.join(__dirname, `../public/${user.avatar}`));
        }
        await deleteUser(userId);
        res.sendStatus(204);
      } else {
        return res.status(400).json("user not found");
      }
    } else {
      return res.status(400).json("user id not found");
    }
  } catch (e) {
    next(e);
  }
};

exports.profileDelete = async (req, res, next) => {
  try {
    const profileId = req.params.userId;
    if (profileId) {
      const user = await findUserPerId(profileId);
      if (user) {
        if (user.avatar && user.avatar !== "/images/avatars/default.svg") {
          fs.unlinkSync(path.join(__dirname, `../public/${user.avatar}`));
        }
        await deleteUser(profileId);
        req.logout();
        res.sendStatus(204);
      } else {
        return res.status(400).json("user not found");
      }
    } else {
      return res.status(400).json("user id is empty");
    }
  } catch (e) {
    next(e);
  }
};
