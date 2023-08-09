const cookieParser = require("cookie");
const { findUserPerId } = require("../queries/users.queries");
const jwt = require("jsonwebtoken");
const secret = "1713e54a-f93c-4f80-975e-f17130655284";
const axios = require("axios");
const { checkUserBan, unBanUser } = require("../queries/banList.queries");

const decodeJwtToken = (token) => {
  return jwt.verify(token, secret);
};

exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/auth/signin/form");
  }
};

exports.ensureIsAdmin = async (req, res, next) => {
  try {
    if (req.user.local.admin) {
      next();
    } else {
      res.redirect("/");
    }
  } catch (e) {
    next(e);
  }
};

exports.ensureAuthenticatedOnSocketHandshake = async (request, success) => {
  try {
    const cookies = cookieParser.parse(request.headers.cookie || "");
    if (cookies && cookies.jwt) {
      const decodedToken = decodeJwtToken(cookies.jwt);
      const user = await findUserPerId(decodedToken.sub);
      if (user) {
        request.user = user;
        success(null, true);
      } else {
        success(400, false);
      }
    } else {
      success(403, false);
    }
  } catch (e) {
    success(400, false);
  }
};

exports.ensureIsNotBot = async (req, res, next) => {
  const recaptchaResponse = req.body["g-recaptcha-response"];
  console.log(recaptchaResponse);
  if (!recaptchaResponse) {
    return res.status(400).json({ message: "reCAPTCHA is required" });
  }

  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: "6Lei_BknAAAAAERYIEsymIe7HwgsWzK-3oLnBWR5",
          response: recaptchaResponse,
        },
      }
    );

    if (response.data.success) {
      // Le reCAPTCHA est valide
      next();
    } else {
      // Le reCAPTCHA est invalide
      return res.status(403).json({ message: "Invalid reCAPTCHA response" });
    }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return res.status(500).json({ message: "reCAPTCHA verification error" });
  }
};

exports.ensureIsNotBan = async (req, res, next) => {
  try {
    if (!req.user) {
      res.redirect("/auth/signin/form");
    } else {
      const userVerification = await checkUserBan(req.user.local.email);
      if (userVerification) {
        const banTimestamp = userVerification.createdAt.getTime();
        const nowTimestamp = Date.now();
        if (userVerification.delay === "24H") {
          const banDuration = 24 * 60 * 60 * 1000; // 24 heures en millisecondes
          const remainingTime = banTimestamp + banDuration - nowTimestamp;
          const remainingHours = Math.ceil(remainingTime / (60 * 60 * 1000));
          if (remainingHours <= 0) {
            await unBanUser(req.user.local.email);
            next();
          } else {
            return res.status(403).json({
              message: `You are banned. You will be unbanned in ${remainingHours} hours.`,
            });
          }
        } else {
          return res.status(403).json({
            message: `You are permanently banned.`,
          });
        }
      } else {
        next();
      }
    }
  } catch (e) {
    next(e);
  }
};
